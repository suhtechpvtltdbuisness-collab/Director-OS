import React from "react";
import { C } from "../../constants/theme";

export default function QuickPrompts({ prompts, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q.label)}
          className="text-xs px-3 py-1.5 rounded-full"
          style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.muted }}
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}
