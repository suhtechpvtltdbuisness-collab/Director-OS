import React from "react";
import { ChevronRight } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { riskTone } from "../../utils/tones";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

export default function PendingApprovalsPreview({ approvals, onViewAll }) {
  const pending = approvals.filter((a) => a.status === "Pending").slice(0, 4);
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Pending Approvals</div>
        <button onClick={onViewAll} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>
          Review <ChevronRight size={12} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {pending.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between gap-2 text-sm py-1.5"
            style={{ borderBottom: `1px solid ${C.borderSoft}` }}
          >
            <div className="min-w-0">
              <div className="truncate">{a.title}</div>
              <div className="text-[10px]" style={{ color: C.faint }}>
                {a.type} · requested by {a.requestedBy}
              </div>
            </div>
            <Badge text={a.risk} tone={riskTone(a.risk)} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
