// frontend/src/hooks/useChat.js
import { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8004/chat";

function safeExtractReply(data) {
  if (!data) return "";
  
  // 1. Backend'den gelen objenin içindeki metni al (Öncelikli)
  if (typeof data === "object") {
    // Senin Python'da return {"answer": ...} olarak gönderdiğin kısım:
    if (typeof data.answer === "string") return data.answer; 
    
    // Diğer olasılıklar
    if (typeof data.response === "string") return data.response;
    if (typeof data.reply === "string") return data.reply;
  }

  // 2. Eğer zaten düz metinse direkt dön
  if (typeof data === "string") return data;

  // 3. EN ÖNEMLİ KISIM: Buradaki JSON.stringify(data) kısmını kaldırıyoruz 
  // çünkü o tırnakları bu satır ekliyor.
  return "Yanıt işlenemedi."; 
}

function extractMeta(data) {
  if (!data || typeof data !== "object") return null;

  // Prefer explicit structured fields if backend returns them
  const meta = data.meta && typeof data.meta === "object" ? data.meta : null;

  const candidate = meta || data;

  const selectedOrderId =
    typeof candidate.selectedOrderId === "string" ? candidate.selectedOrderId : typeof candidate.orderId === "string" ? candidate.orderId : null;

  const selectedRoute =
    typeof candidate.selectedRoute === "string" ? candidate.selectedRoute : typeof candidate.route === "string" ? candidate.route : null;

  const riskLevel =
    typeof candidate.riskLevel === "string" ? candidate.riskLevel : typeof candidate.risk === "string" ? candidate.risk : null;

  const slaRemaining =
    typeof candidate.slaRemaining === "number"
      ? candidate.slaRemaining
      : typeof candidate.slaHoursRemaining === "number"
      ? candidate.slaHoursRemaining
      : null;

  const eta = typeof candidate.eta === "string" ? candidate.eta : null;

  if (!selectedOrderId && !selectedRoute && !riskLevel && slaRemaining == null && !eta) return meta || null;

  return { selectedOrderId, selectedRoute, riskLevel, slaRemaining, eta };
}

export function useChat() {
  const [messages, setMessages] = useState(() => [
    {
      id: "seed-1",
      role: "ai",
      content:
        "Merhaba. Ben operasyon karar destek asistanınızım.\n\nSipariş (ORD-xxxx), rota (RTE-xx) veya SLA/risk sorularıyla başlayın. İlgili sipariş/rota otomatik seçilir ve takip paneli güncellenir.",
      ts: Date.now(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  const sendMessage = useCallback(async (prompt, context) => {
    const trimmed = (prompt ?? "").trim();
    if (!trimmed) return { ok: false, reply: "", meta: null };

    const now = Date.now();
    const userMsg = { id: `u-${now}`, role: "user", content: trimmed, ts: now };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const rid = ++requestIdRef.current;

    try {
      const res = await axios.post(
        API_URL,
        { prompt: trimmed, context: context && typeof context === "object" ? context : undefined },
        { timeout: 60000, headers: { "Content-Type": "application/json" } }
      );

      if (rid !== requestIdRef.current) return { ok: false, reply: "", meta: null };

      const reply = safeExtractReply(res?.data) || "Yanıt alınamadı.";
      const meta = extractMeta(res?.data);

      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "ai", content: reply, ts: Date.now() }]);
      return { ok: true, reply, meta };
    } catch (err) {
      if (rid !== requestIdRef.current) return { ok: false, reply: "", meta: null };

      const status = err?.response?.status;
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null);

      const detail = serverMsg || (status ? `HTTP ${status}` : null) || err?.message || "Bilinmeyen hata";

      const reply =
        "Şu anda yanıt üretirken bir hata oluştu.\n\n• Kontrol: AI servisi çalışıyor mu? (localhost:8004)\n• Detay: " +
        detail;

      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, role: "ai", content: reply, ts: Date.now() }]);
      return { ok: false, reply, meta: null };
    } finally {
      if (rid === requestIdRef.current) setLoading(false);
    }
  }, []);

  return useMemo(() => ({ messages, sendMessage, loading }), [messages, sendMessage, loading]);
}
