import React from "react";
import { AlertTriangle, MapPin, CircleCheck, CircleDot, CircleAlert, Coffee } from "lucide-react";
import { C } from "../../constants/theme";
import Panel from "../common/Panel";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";

const statusTone = { Available: "green", Busy: "amber", Blocked: "red", "On Leave": "gray" };
const statusIcon = { Available: CircleCheck, Busy: CircleDot, Blocked: CircleAlert, "On Leave": Coffee };

export default function DevCard({ dev: d, tasks }) {
  const Icon = statusIcon[d.status];
  const devTasks = tasks.filter((t) => t.assignee === d.name);

  return (
    <Panel className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ background: d.avatarColor + "33", color: d.avatarColor }}
        >
          {d.name.split(" ").map((x) => x[0]).join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate">{d.name}</div>
          <div className="text-xs truncate" style={{ color: C.muted }}>{d.role}</div>
        </div>
        <Badge text={d.status} tone={statusTone[d.status]} icon={Icon} />
      </div>
      <div className="text-xs flex items-center gap-1.5" style={{ color: C.muted }}>
        <MapPin size={11} />{d.location}
      </div>
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span style={{ color: C.faint }}>Workload</span>
          <span>{d.workload}%</span>
        </div>
        <ProgressBar value={d.workload} tone={d.workload > 85 ? "red" : d.workload > 65 ? "amber" : "green"} />
      </div>
      <div className="rounded-md p-2 text-xs" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
        <div style={{ color: C.faint }}>Current focus</div>
        <div className="mt-0.5">{d.task}</div>
      </div>
      {d.blockers > 0 && (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: C.red }}>
          <AlertTriangle size={12} /> {d.blockers} active blocker{d.blockers > 1 ? "s" : ""}
        </div>
      )}
      <div
        className="flex items-center justify-between text-xs pt-2"
        style={{ borderTop: `1px solid ${C.borderSoft}` }}
      >
        <span style={{ color: C.faint }}>{devTasks.length} tasks assigned</span>
        <span style={{ color: C.faint }}>Attendance: {d.attendance}</span>
      </div>
    </Panel>
  );
}
