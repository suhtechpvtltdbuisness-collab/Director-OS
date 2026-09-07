import React from "react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { inr, stageTone, toneMap } from "../../utils";
import LeadCard from "./LeadCard";

/**
 * Kanban pipeline. Cards are draggable between stage columns; dropping a card
 * commits the stage change through `onMove`.
 */
export default function LeadPipeline({ leads, stages, onOpen, onMove }) {
  const [dragId, setDragId] = React.useState(null);
  const [overStage, setOverStage] = React.useState(null);

  function drop(stage) {
    const lead = leads.find((l) => l.id === dragId);
    if (lead && lead.stage !== stage) onMove(dragId, stage);
    setDragId(null);
    setOverStage(null);
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stages.map((stage) => {
        const items = leads.filter((l) => l.stage === stage);
        const total = items.reduce((s, l) => s + l.value, 0);
        const tone = toneMap[stageTone(stage)];
        const isOver = overStage === stage;

        return (
          <section
            key={stage}
            onDragOver={(e) => { e.preventDefault(); setOverStage(stage); }}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={() => drop(stage)}
            className="shrink-0 w-64 rounded-lg flex flex-col"
            style={{
              background: C.panel2,
              border: `1px solid ${isOver ? C.goldBorder : C.border}`,
              minHeight: 200,
            }}
          >
            <header className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tone.fg }} />
                <span className="text-xs font-semibold truncate" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{stage}</span>
                <span className="text-[10px] rounded px-1.5 py-0.5 shrink-0" style={{ background: C.track, color: C.muted }}>
                  {items.length}
                </span>
              </div>
            </header>

            <div className="px-3 py-2 text-[11px]" style={{ color: C.faint, borderBottom: `1px solid ${C.borderSoft}` }}>
              {total ? inr(total) : "No value"}
            </div>

            <div className="flex flex-col gap-2 p-2 flex-1">
              {items.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: C.faint }}>Drop a lead here</p>
              ) : items.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onOpen={() => onOpen(lead)}
                  onDragStart={() => setDragId(lead.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
