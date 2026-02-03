// frontend/src/components/OrderTrackingCard.jsx
import React, { useMemo } from "react";
import { Package, MapPin, Clock, ShieldCheck, AlertTriangle, ChevronRight, Bot, Route as RouteIcon } from "lucide-react";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function toneByStatus(status) {
  if (status === "Delivered") return "bg-[#2D4F1E]/12 text-[#2D4F1E]";
  if (status === "On Route") return "bg-[#4B3621]/12 text-[#4B3621]";
  return "bg-[#2D4F1E]/10 text-[#2D4F1E]";
}

function labelByStatus(status) {
  if (status === "Delivered") return "Teslim Edildi";
  if (status === "On Route") return "Yolda";
  return "Hazırlanıyor";
}

function riskTone(risk) {
  const v = String(risk || "").toLowerCase();
  if (v.includes("high") || v.includes("yüksek") || v.includes("kritik")) return "bg-[#4B3621]/15 text-[#4B3621]";
  if (v.includes("med") || v.includes("orta")) return "bg-[#4B3621]/10 text-[#4B3621]";
  if (v.includes("low") || v.includes("düşük") || v.includes("ok")) return "bg-[#2D4F1E]/12 text-[#2D4F1E]";
  return "bg-[#2B2B2B]/8 text-[#2B2B2B]/75";
}

export default function OrderTrackingCard({
  ops,
  order,
  route,
  onNavigateOrder,
  onNavigateRoute,
  onAskAI,
  onSetFilter,
}) {
  const derived = useMemo(() => {
    const o = order;
    const r = route;

    if (!o && !r) {
      return {
        title: "Operasyon Takip Paneli",
        subtitle: "Sipariş veya rota seçerek canlı görünüm alın.",
        risk: ops?.riskLevel || "",
        sla: typeof ops?.slaRemaining === "number" ? ops.slaRemaining : null,
        progress: 0,
        status: "Preparing",
        actions: [
          { label: "Siparişler", hint: "SLA kritik siparişleri filtreleyin", action: () => onSetFilter?.("Risk") },
          { label: "AI Chatbot", hint: "Operasyon planı isteyin", action: () => onAskAI?.() },
        ],
      };
    }

    const status = o?.status || "Preparing";
    const progress = typeof o?.progress === "number" ? clamp(o.progress, 0, 100) : 0;
    const risk = o?.risk || ops?.riskLevel || "";
    const sla = typeof o?.slaHoursRemaining === "number" ? o.slaHoursRemaining : typeof ops?.slaRemaining === "number" ? ops.slaRemaining : null;

    const actions = [];
    if (o?.id) actions.push({ label: "Sipariş Detayı", hint: "Detay görünüm ve filtre", action: () => onNavigateOrder?.(o.id) });
    if (o?.route) actions.push({ label: "Rota Görünümü", hint: "Rota performans/öneri", action: () => onNavigateRoute?.(o.route) });
    actions.push({ label: "AI ile Karar", hint: "SLA/risk aksiyonları üret", action: () => onAskAI?.() });

    return {
      title: o?.id ? `Sipariş ${o.id}` : `Rota ${r?.code || ""}`,
      subtitle: o?.customer ? `${o.customer} • ${o.origin} → ${o.destination}` : r?.name || "Rota detayları",
      risk,
      sla,
      progress,
      status,
      actions,
    };
  }, [order, route, ops, onAskAI, onNavigateOrder, onNavigateRoute, onSetFilter]);

  const statusTone = toneByStatus(order?.status || derived.status);
  const statusLabel = labelByStatus(order?.status || derived.status);

  return (
    <section className="rounded-2xl bg-[#F5F5DC] shadow-md p-5 md:p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Takip Paneli</div>
          <div className="mt-1">
            <h3 className="text-lg font-semibold text-[#2B2B2B] truncate">{derived.title}</h3>
            <div className="mt-2 text-sm text-[#2B2B2B]/75 leading-relaxed">{derived.subtitle}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Durum</div>
          <div className="mt-2 flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusTone}`}>
              <Package size={14} />
              {statusLabel}
            </span>

            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${riskTone(derived.risk)}`}>
              <AlertTriangle size={14} />
              {derived.risk ? `Risk: ${derived.risk}` : "Risk: —"}
            </span>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2B2B2B]/8 text-[#2B2B2B]/75">
              <Clock size={14} />
              SLA: {typeof derived.sla === "number" ? `${derived.sla} saat` : "—"}
            </span>
          </div>
        </div>
      </header>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-[#2B2B2B]/70">
          <span>İlerleme</span>
          <span className="font-semibold text-[#2B2B2B]">{derived.progress}%</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-[#E6E6E6] overflow-hidden">
          <div className="h-full rounded-full bg-[#2D4F1E] transition-all" style={{ width: `${derived.progress}%` }} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="rounded-2xl bg-[#E6E6E6]/60 p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Konum / Son Okuma</div>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-[2px] text-[#2D4F1E]" />
                <div>
                  <div className="font-semibold text-[#2B2B2B]">Rota</div>
                  <button
                    type="button"
                    onClick={() => (order?.route ? onNavigateRoute?.(order.route) : route?.code ? onNavigateRoute?.(route.code) : null)}
                    className="text-[#4B3621] font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35 rounded"
                  >
                    {order?.route || route?.code || "—"}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-[2px] text-[#4B3621]" />
                <div>
                  <div className="font-semibold text-[#2B2B2B]">Son okuma</div>
                  <div className="text-[#2B2B2B]/75">{order?.lastScan || "—"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="mt-[2px] text-[#2D4F1E]" />
                <div>
                  <div className="font-semibold text-[#2B2B2B]">ETA</div>
                  <div className="text-[#2B2B2B]/75">{order?.eta || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {(order?.notes?.length || route?.recommendation) ? (
            <div className="rounded-2xl border border-[#4B3621]/20 bg-[#4B3621]/6 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4B3621]">
                <AlertTriangle size={16} />
                Operasyon Notları / Öneri
              </div>
              <div className="mt-2 space-y-2 text-sm text-[#2B2B2B]/80">
                {order?.notes?.slice(0, 2).map((n, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="font-semibold text-[#2B2B2B]">•</span> {n}
                  </div>
                ))}
                {route?.recommendation ? (
                  <div className="leading-relaxed">
                    <span className="font-semibold text-[#2B2B2B]">Öneri:</span> {route.recommendation}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl bg-[#F5F5DC] border border-[#2B2B2B]/8 p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Hızlı Aksiyonlar</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {derived.actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.action}
                  className="rounded-2xl px-4 py-3 bg-[#E6E6E6]/55 hover:bg-[#E6E6E6]/70 transition shadow-sm hover:shadow-md active:scale-[0.99] text-left focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#2B2B2B]">{a.label}</div>
                      <div className="text-[11px] text-[#2B2B2B]/60 mt-1">{a.hint}</div>
                    </div>
                    <ChevronRight size={16} className="text-[#2B2B2B]/55" />
                  </div>
                </button>
              ))}

              <button
                type="button"
                onClick={() => onAskAI?.()}
                className="rounded-2xl px-4 py-3 bg-[#2D4F1E] text-[#F5F5DC] transition shadow-sm hover:shadow-md active:scale-[0.99] text-left focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">AI Karar Desteği</div>
                    <div className="text-[11px] text-[#F5F5DC]/75 mt-1">SLA / risk aksiyon planı üret</div>
                  </div>
                  <Bot size={18} />
                </div>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSetFilter?.("Risk")}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#4B3621]/10 text-[#4B3621] hover:bg-[#4B3621]/14 transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
              >
                <AlertTriangle size={14} />
                Riskli siparişleri filtrele
              </button>
              <button
                type="button"
                onClick={() => onNavigateRoute?.(order?.route || route?.code || "")}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2D4F1E]/10 text-[#2D4F1E] hover:bg-[#2D4F1E]/14 transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
              >
                <RouteIcon size={14} />
                Rota görünümü
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}