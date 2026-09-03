import React from "react";
import { C } from "../../constants/theme";

export default function ChatMessage({ message: m }) {
  const isUser = m.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] rounded-lg px-3 py-2 text-sm"
        style={{
          background: isUser ? C.gold : C.panel2,
          color: isUser ? "#0D1117" : C.text,
          border: isUser ? "none" : `1px solid ${C.border}`,
        }}
      >
        {m.text}
      </div>
    </div>
  );
}
