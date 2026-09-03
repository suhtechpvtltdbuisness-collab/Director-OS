import React from "react";
import { X } from "lucide-react";
import { C } from "../../constants/theme";
import { LEAD_STAGES } from "../../constants/labels";
import { inr } from "../../utils/formatCurrency";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

export default function LeadCard({ lead: l, onRemove, onMoveStage, onSelect }) {
  return (
    <Panel className="p-3 cursor-pointer hover:ring-1 hover:ring-gold" onClick={() => onSelect?.(l)}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-medium truncate">{l.name}</div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(l.id, l.name); }} style={{ color: C.faint }}><X size={12} /></button>
      </div>
      <div className="text-xs mt-1" style={{ color: C.muted }}>{l.product}</div>
      <div className="text-xs font-semibold mt-1" style={{ color: C.gold }}>{inr(l.value)}</div>
      <div className="flex items-center justify-between mt-2">
        <Badge text={l.source} tone="gray" />
        <span className="text-[10px]" style={{ color: C.faint }}>{l.owner.split(" ")[0]}</span>
      </div>
      <select
        value={l.stage}
        onChange={(e) => onMoveStage(l.id, e.target.value)}
        className="w-full mt-2 rounded px-2 py-1 text-xs"
        style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
      >
        {LEAD_STAGES.map((s) => <option key={s}>{s}</option>)}
      </select>
    </Panel>
  );
}
