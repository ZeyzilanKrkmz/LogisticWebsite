// frontend/src/components/ChatWindow.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Send, Sparkles, TriangleAlert, ClipboardList, Route as RouteIcon } from "lucide-react";
import { useChat } from "../hooks/useChat.js";
import MessageBubble from "./MessageBubble.jsx";

const ORDER_RE = /\bORD-\d{4,}\b/g;
const ROUTE_RE = /\bRTE-[A-Z0-9]{2,}\b/g;

function normalizeRisk(risk) {
  if (!risk) return "";
  const v = String(risk).trim();
  if (!v) return "";
  const low = v.toLowerCase();
  if (low.includes("high") || low.includes("yüksek") || low.includes("kritik")) return "High";
  if (low.includes("med") || low.includes("orta")) return "Medium";
  if (low.includes("low") || low.includes("düşük") || low.includes("ok")) return "Low";
  return v;
}

function pickFirstMatch(text, re) {
  if (!text) return "";
  const m = String(text).match(re);
  return m?.[0] || "";
}

export default function ChatWindow({ ops, onSelectOrder, onSelectRoute, onOpsPatch, orderMap, routeMap }) {
  const { messages, sendMessage, loading } = useChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const canSend = useMemo(() => draft.trim().length > 0 && !loading, [draft, loading]);

  const contextPayload = useMemo(() => {
    return {
      selectedOrderId: ops?.selectedOrderId || null,
      selectedRoute: ops?.selectedRoute || null,
      riskLevel: ops?.riskLevel || null,
      slaRemaining: typeof ops?.slaRemaining === "number" ? ops.slaRemaining : null,
    };
  }, [ops]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = `${next}px`;
  }, [draft]);

  const handleOperationalSignal = (text, meta) => {
    const replyText = text || "";
    const candidateOrder = meta?.selectedOrderId || pickFirstMatch(replyText, ORDER_RE);
    const candidateRoute = meta?.selectedRoute || pickFirstMatch(replyText, ROUTE_RE);

    if (candidateOrder && orderMap?.[candidateOrder]) {
      onSelectOrder?.(candidateOrder);
    }

    if (candidateRoute && routeMap?.[candidateRoute]) {
      onSelectRoute?.(candidateRoute);
    }

    const risk = normalizeRisk(meta?.riskLevel || "");
    const sla = meta?.slaRemaining;

    const patch = {};
    if (risk) patch.riskLevel = risk;
    if (typeof sla === "number" && Number.isFinite(sla)) patch.slaRemaining = sla;

    // If order implies SLA/risk, enrich from domain model
    if (candidateOrder && orderMap?.[candidateOrder]) {
      const o = orderMap[candidateOrder];
      if (!patch.riskLevel && o?.risk) patch.riskLevel = normalizeRisk(o.risk);
      if (patch.slaRemaining == null && typeof o?.slaHoursRemaining === "number") patch.slaRemaining = o.slaHoursRemaining;
    }

    if (Object.keys(patch).length > 0) onOpsPatch?.(patch);
  };

  const handleSend = async () => {
    const prompt = draft.trim();
    if (!prompt || loading) return;
    setDraft("");

    const { reply, meta } = await sendMessage(prompt, contextPayload);
    if (reply) handleOperationalSignal(reply, meta);
  };

  const quickPrompts = useMemo(() => {
    const order = ops?.selectedOrderId || "ORD-204918";
    const route = ops?.selectedRoute || "RTE-A12";
    return [
      `📌 ${order} için gecikme riski nedir? 3 aksiyon öner.`,
      `🧭 ${route} için kapasite sapması ve alternatif plan öner.`,
      "SLA kritik siparişleri listele ve önceliklendirme öner.",
      "Bugünkü sevkiyatlarda dar boğaz nerede? Operasyon planı çıkar.",
    ];
  }, [ops?.selectedOrderId, ops?.selectedRoute]);

  return (
    <section className="rounded-2xl bg-[#F5F5DC] shadow-md overflow-hidden flex flex-col min-h-[560px]">
      <header className="px-5 py-4 border-b border-[#4B3621]/15 bg-[#E6E6E6]/45">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">AI Chatbot</div>
            <div className="mt-1 text-lg font-semibold text-[#2B2B2B]">Operasyon Karar Destek Merkezi</div>
            <div className="mt-1 text-sm text-[#2B2B2B]/75">
              Sipariş, rota ve SLA sinyallerini analiz eder; aksiyon önerileri üretir.
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2D4F1E]/10 text-[#2D4F1E]">
              <Sparkles size={14} />
              Context-Aware
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2B2B2B]/8 text-[#2B2B2B]/75">
                <ClipboardList size={14} />
                {ops?.selectedOrderId || "—"}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2B2B2B]/8 text-[#2B2B2B]/75">
                <RouteIcon size={14} />
                {ops?.selectedRoute || "—"}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2B2B2B]/8 text-[#2B2B2B]/75">
                <TriangleAlert size={14} />
                {ops?.riskLevel || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDraft(p.replace(/^.\s*/, ""))}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[#E6E6E6]/55 text-[#2B2B2B]/85 text-xs font-semibold hover:bg-[#E6E6E6]/70 active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
            >
              <Sparkles size={14} className="text-[#2D4F1E]" />
              {p}
            </button>
          ))}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#E6E6E6]/35">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={m.content}
            onEntityClick={(entity) => {
              if (entity.type === "order" && orderMap?.[entity.value]) onSelectOrder?.(entity.value, { navigateToOrders: true });
              if (entity.type === "route" && routeMap?.[entity.value]) onSelectRoute?.(entity.value, { navigateToRoutes: true });
            }}
          />
        ))}

        {loading && (
          <div className="w-full flex justify-start">
            <div className="max-w-[85%] md:max-w-[72%] rounded-2xl px-4 py-3 shadow-sm bg-[#F5F5DC] text-[#2B2B2B]">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 size={16} className="animate-spin text-[#2D4F1E]" />
                <span className="text-[#2B2B2B]/80">
                  Analiz ediliyor… SLA, risk ve rota sapmaları değerlendiriliyor
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4 border-t border-[#4B3621]/15 bg-[#E6E6E6]/45">
        <div className="rounded-2xl bg-[#F5F5DC] shadow-sm p-3">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) handleSend();
                }
              }}
              rows={1}
              placeholder="Örn: ORD-205104 SLA kritik mi? Operasyon aksiyonu öner. (context otomatik gönderilir)"
              className="flex-1 resize-none bg-transparent text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/45 focus:outline-none"
              aria-label="Mesaj yaz"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3",
                "bg-[#2D4F1E] text-[#F5F5DC] shadow-sm transition",
                "hover:shadow-md active:scale-[0.99]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm",
                "focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/40",
              ].join(" ")}
            >
              <Send size={16} />
              <span className="text-sm font-semibold hidden sm:inline">Gönder</span>
            </button>
          </div>

          <div className="mt-2 text-[11px] text-[#2B2B2B]/55">
            Enter: Gönder • Shift+Enter: Satır • Context: sipariş/rota/risk/SLA otomatik eklenir
          </div>
        </div>
      </div>
    </section>
  );
}