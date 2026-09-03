import React from "react";
import { X, CalendarClock } from "lucide-react";
import { C } from "../../constants/theme";
import { SPRINT_COLUMNS } from "../../constants/labels";
import { riskTone, toneMap } from "../../utils/tones";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

export default function TaskCard({ task: t, onRemove, onMove }) {
  return (
    <Panel className="p-3" style={{ borderLeft: `3px solid ${toneMap[riskTone(t.priority)].fg}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-medium leading-snug">{t.title}</div>
        <button onClick={() => onRemove(t.id)} style={{ color: C.faint }}><X size={12} /></button>
      </div>
      <div className="text-xs mt-1" style={{ color: C.muted }}>{t.product}</div>
      <div className="flex items-center justify-between mt-2">
        <Badge text={t.priority} tone={riskTone(t.priority)} />
        <span className="text-[10px] flex items-center gap-1" style={{ color: C.faint }}>
          <CalendarClock size={11} />{t.due?.slice(5)}
        </span>
      </div>
      <div className="text-[10px] mt-1.5" style={{ color: C.faint }}>{t.assignee}</div>
      <select
        value={t.status}
        onChange={(e) => onMove(t.id, e.target.value)}
        className="w-full mt-2 rounded px-2 py-1 text-xs"
        style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
      >
        {SPRINT_COLUMNS.map((s) => <option key={s}>{s}</option>)}
      </select>
    </Panel>
  );
}
