import React, { useState } from "react";
import { CalendarClock, Pencil, Check } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { healthTone, riskTone } from "../../utils/tones";
import Panel from "../common/Panel";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";

const deployColors = {
  Dev: C.blue, Staging: C.amber, Prod: C.green, Paused: C.faint,
};
const codeColors = {
  "Not started": C.faint, "In progress": C.blue, "Code review": C.amber,
  "Merged": C.green, "Deployed": C.purple,
};

export default function ProjectCard({ project: p, onUpdateProgress }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.progress);

  function save() {
    onUpdateProgress?.(p.id, Number(draft));
    setEditing(false);
  }

  return (
    <Panel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{p.name}</div>
          <div className="text-xs" style={{ color: C.muted }}>{p.product} · Owner: {p.owner}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge text={`Risk: ${p.risk}`} tone={riskTone(p.risk)} />
          <Badge text={p.health} tone={healthTone(p.health)} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
        <div>
          <div style={{ color: C.faint }} className="flex items-center gap-1">
            Progress
            {!editing && (
              <button onClick={() => setEditing(true)} className="ml-1 opacity-50 hover:opacity-100">
                <Pencil size={10} />
              </button>
            )}
          </div>
          {editing ? (
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number" min="0" max="100"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-14 text-xs rounded px-1 py-0.5"
                style={{ background: C.panel2, border: `1px solid ${C.border}`, color: C.text }}
              />
              <button onClick={save} style={{ color: C.green }}><Check size={12} /></button>
            </div>
          ) : (
            <>
              <div className="mt-1"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></div>
              <div className="mt-1">{p.progress}%</div>
            </>
          )}
        </div>
        <div>
          <div style={{ color: C.faint }}>Deadline</div>
          <div className="mt-1 flex items-center gap-1"><CalendarClock size={12} />{p.deadline}</div>
        </div>
        <div>
          <div style={{ color: C.faint }}>Deploy Status</div>
          <div className="mt-1 font-medium" style={{ color: deployColors[p.deployStatus] || C.muted }}>{p.deployStatus}</div>
        </div>
        <div>
          <div style={{ color: C.faint }}>Code Status</div>
          <div className="mt-1" style={{ color: codeColors[p.codeStatus] || C.muted }}>{p.codeStatus}</div>
        </div>
      </div>
    </Panel>
  );
}
