import React from "react";
import { ChevronRight } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { healthTone } from "../../utils/tones";
import Panel from "../common/Panel";
import ProgressBar from "../common/ProgressBar";
import Badge from "../common/Badge";

export default function ProjectHealthList({ projects, onViewAll }) {
  return (
    <Panel className="p-4 lg:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Project Health</div>
        <button onClick={onViewAll} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>
          View all <ChevronRight size={12} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <div className="w-40 shrink-0 text-sm truncate">{p.name}</div>
            <div className="flex-1"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></div>
            <div className="w-10 text-xs text-right shrink-0" style={{ color: C.muted }}>{p.progress}%</div>
            <Badge text={p.health} tone={healthTone(p.health)} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
