// frontend/src/components/MessageBubble.jsx
import React, { useMemo } from "react";

const ORDER_RE = /\bORD-\d{4,}\b/g;
const ROUTE_RE = /\bRTE-[A-Z0-9]{2,}\b/g;

function tokenize(content) {
  const text = String(content ?? "");
  if (!text) return [{ type: "text", value: "" }];

  const matches = [];
  for (const m of text.matchAll(ORDER_RE)) matches.push({ type: "order", value: m[0], index: m.index ?? 0 });
  for (const m of text.matchAll(ROUTE_RE)) matches.push({ type: "route", value: m[0], index: m.index ?? 0 });

  if (matches.length === 0) return [{ type: "text", value: text }];

  matches.sort((a, b) => a.index - b.index);

  const out = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.index > cursor) out.push({ type: "text", value: text.slice(cursor, m.index) });
    out.push({ type: m.type, value: m.value });
    cursor = m.index + m.value.length;
  }
  if (cursor < text.length) out.push({ type: "text", value: text.slice(cursor) });
  return out;
}

export default function MessageBubble({ role, content, onEntityClick }) {
  const isUser = role === "user";

  const tokens = useMemo(() => tokenize(content), [content]);

  const shell = [
    "max-w-[85%] md:max-w-[72%]",
    "rounded-2xl px-4 py-3 shadow-sm",
    "whitespace-pre-wrap leading-relaxed",
    isUser ? "bg-[#4B3621] text-[#F5F5DC]" : "bg-[#F5F5DC] text-[#2B2B2B]",
    isUser ? "rounded-tr-md" : "rounded-tl-md",
  ].join(" ");

  const entityBtn =
    "inline-flex items-center px-2 py-0.5 rounded-lg font-semibold underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35 transition";

  const entityTone = isUser ? "bg-white/12 text-[#F5F5DC]" : "bg-[#E6E6E6]/55 text-[#2D4F1E]";

  return (
    <div className={["w-full flex", isUser ? "justify-end" : "justify-start"].join(" ")}>
      <div className={shell}>
        <div className="text-[13px] md:text-sm">
          {tokens.map((t, idx) => {
            if (t.type === "text") return <React.Fragment key={idx}>{t.value}</React.Fragment>;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onEntityClick?.({ type: t.type, value: t.value })}
                className={`${entityBtn} ${entityTone}`}
                aria-label={`${t.type === "order" ? "Sipariş" : "Rota"} ${t.value}`}
              >
                {t.value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}