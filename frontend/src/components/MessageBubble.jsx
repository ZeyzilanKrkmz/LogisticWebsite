import React from "react";
import { Bot, User } from "lucide-react";

export default function MessageBubble({ role = "assistant", content }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 h-9 w-9 shrink-0 rounded-xl bg-forest/10 grid place-items-center border border-forest/20">
          <Bot className="h-5 w-5 text-forest" />
        </div>
      )}

      <div
        className={[
          "max-w-[82%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-forest text-sand rounded-br-md"
            : "bg-white text-earth border border-earth/10 rounded-bl-md",
        ].join(" ")}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>

      {isUser && (
        <div className="mt-1 h-9 w-9 shrink-0 rounded-xl bg-earth/10 grid place-items-center border border-earth/20">
          <User className="h-5 w-5 text-earth" />
        </div>
      )}
    </div>
  );
}