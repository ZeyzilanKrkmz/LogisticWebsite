import React, { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal, Menu, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-earth/60 text-sm">
      <span className="font-semibold">Gemini</span>
      <span>yazıyor</span>
      <span className="inline-flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-earth/40 animate-dots-1" />
        <span className="h-1.5 w-1.5 rounded-full bg-earth/40 animate-dots-2" />
        <span className="h-1.5 w-1.5 rounded-full bg-earth/40 animate-dots-3" />
      </span>
    </div>
  );
}

export default function ChatWindow({
  messages,
  onSend,
  isTyping,
  error,
  onOpenSidebar,
}) {
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    // Mesaj geldikçe en alta kaydır
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const canSend = useMemo(() => text.trim().length > 0 && !isTyping, [text, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(text);
    setText("");
  };

  return (
    <section className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 rounded-3xl bg-white border border-earth/10 shadow-soft px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-earth/15 hover:border-forest/30"
            onClick={onOpenSidebar}
            aria-label="Menü"
          >
            <Menu className="h-5 w-5 text-earth" />
          </button>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-forest grid place-items-center">
              <Sparkles className="h-5 w-5 text-sand" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-earth leading-tight">
                AI Destekli Operasyon Asistanı
              </h1>
              <p className="text-xs text-earth/60">
                Rota, sipariş ve teslimat sorularını yanıtlar
              </p>
            </div>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-earth border border-earth/10">
          Güvenli • Kurumsal
        </span>
      </div>

      {/* Messages */}
      <div className="mt-4 flex-1 rounded-3xl bg-white border border-earth/10 shadow-soft overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4 md:p-5 space-y-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-sand border border-earth/10 px-4 py-3">
                <TypingIndicator />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
              <span className="font-semibold">Uyarı:</span> {error}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-3xl bg-white border border-earth/10 shadow-soft p-3"
      >
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Mesajınızı yazın… (örn: TRK-20491 canlı konum?)"
            className="flex-1 rounded-2xl border border-earth/10 bg-sand/40 px-4 py-3 text-sm outline-none focus:border-forest/40 focus:ring-4 focus:ring-forest/10"
          />
          <button
            type="submit"
            disabled={!canSend}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
              canSend
                ? "bg-forest text-sand hover:bg-forest/95"
                : "bg-earth/10 text-earth/40 cursor-not-allowed",
            ].join(" ")}
          >
            <SendHorizonal className="h-4 w-4" />
            Gönder
          </button>
        </div>
      </form>
    </section>
  );
}