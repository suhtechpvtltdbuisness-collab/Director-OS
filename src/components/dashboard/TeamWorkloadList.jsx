import React from "react";
import { ChevronRight } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { DEVS } from "../../constants/seedData";
import Panel from "../common/Panel";
import ProgressBar from "../common/ProgressBar";

export default function TeamWorkloadList({ onViewAll }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Team Workload</div>
        <button onClick={onViewAll} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>
          View all <ChevronRight size={12} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {DEVS.map((d) => (
          <div key={d.id} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
              style={{ background: d.avatarColor + "33", color: d.avatarColor }}
            >
              {d.name.split(" ").map((x) => x[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs truncate">{d.name}</div>
              <ProgressBar
                value={d.workload}
                tone={d.workload > 85 ? "red" : d.workload > 65 ? "amber" : "green"}
                height={4}
              />
            </div>
            <span className="text-xs w-8 text-right" style={{ color: C.muted }}>{d.workload}%</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
