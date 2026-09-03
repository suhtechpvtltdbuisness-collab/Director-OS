import React from "react";
import { ChevronRight } from "lucide-react";
import { C } from "../../constants/theme";
import { toneMap } from "../../utils/tones";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

const sevTone = { High: "red", Medium: "amber", Low: "blue" };
const areaTab = { Projects: "projects", Finance: "finance", Marketing: "marketing", Team: "team", Ops: "documents" };

export default function AlertCard({ alert: a, onNavigate, onDismiss }) {
  return (
    <Panel
      className="p-4 flex items-start justify-between gap-3"
      style={{ borderLeft: `3px solid ${toneMap[sevTone[a.severity]].fg}` }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Badge text={a.severity} tone={sevTone[a.severity]} />
          <span className="text-xs" style={{ color: C.faint }}>{a.area}</span>
        </div>
        <div className="text-sm font-medium mt-1.5">{a.title}</div>
        <div className="text-xs mt-0.5" style={{ color: C.muted }}>{a.detail}</div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={() => onNavigate(areaTab[a.area] || "dashboard")}
          className="text-xs flex items-center gap-1"
          style={{ color: C.gold }}
        >
          Review <ChevronRight size={12} />
        </button>
        {onDismiss && (
          <button onClick={onDismiss} className="text-xs" style={{ color: C.faint }}>
            Dismiss
          </button>
        )}
      </div>
    </Panel>
  );
}
