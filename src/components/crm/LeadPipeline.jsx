import React from "react";
import { C } from "../../constants/theme";
import { LEAD_STAGES } from "../../constants/labels";
import LeadCard from "./LeadCard";

export default function LeadPipeline({ leads, onRemove, onMoveStage, onSelectLead }) {
  const byStage = LEAD_STAGES.map((s) => ({ stage: s, items: leads.filter((l) => l.stage === s) }));
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div className="flex gap-3 min-w-[900px] lg:min-w-0">
        {byStage.map((col) => (
          <div key={col.stage} className="flex-1 min-w-[220px]">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold" style={{ color: C.muted }}>{col.stage}</span>
              <span className="text-xs" style={{ color: C.faint }}>{col.items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {col.items.map((l) => (
                <LeadCard key={l.id} lead={l} onRemove={onRemove} onMoveStage={onMoveStage} onSelect={onSelectLead} />
              ))}
              {col.items.length === 0 && (
                <div className="text-xs text-center py-4" style={{ color: C.faint }}>No leads</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
