import React from "react";
import { C } from "../../constants/theme";
import { inr, formatDate } from "../../utils";

export default function LeadCard({ lead, onOpen, onDragStart }) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className="rounded-lg p-3 cursor-pointer flex flex-col gap-2 transition-colors"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.goldBorder)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <div className="text-sm font-medium leading-snug" style={{ color: C.text }}>{lead.name}</div>
      <div className="text-xs" style={{ color: C.faint }}>{lead.product}</div>
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-sm font-semibold tabular-nums" style={{ color: C.gold }}>{inr(lead.value)}</span>
        <span className="text-[10px]" style={{ color: C.faint }}>{formatDate(lead.updated)}</span>
      </div>
      <div className="text-[11px] truncate" style={{ color: C.muted }}>{lead.owner}</div>
    </article>
  );
}
