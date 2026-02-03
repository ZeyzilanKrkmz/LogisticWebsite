import { useCallback, useMemo, useState } from "react";

const API_URL = "http://localhost:8004/chat";

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Merhaba! Rota, sipariş durumu veya canlı takip için bana yazabilirsiniz.",
      ts: Date.now(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    setError("");

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(`API Hatası (${res.status}): ${raw}`);
      }

      const data = await res.json();
      const answer = data?.answer ?? "Üzgünüm, yanıt alınamadı.";

      const botMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
        ts: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setError(e?.message || "Bilinmeyen hata");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Şu an yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya bağlantıyı kontrol edin.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const value = useMemo(
    () => ({ messages, sendMessage, isTyping, error }),
    [messages, sendMessage, isTyping, error]
  );

  return value;
}