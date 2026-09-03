import React from "react";
import { MapPin, Coffee, CheckCircle, XCircle } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { DEVS } from "../../constants/seedData";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

export default function AttendancePanel() {
  const present = DEVS.filter((d) => d.attendance === "Present");
  const onLeave = DEVS.filter((d) => d.attendance === "Leave");
  const bengaluru = DEVS.filter((d) => d.location.includes("Bengaluru"));
  const remote = DEVS.filter((d) => d.location.includes("Remote"));

  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>
        Today's Attendance & Location
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-md p-3 flex items-center gap-2" style={{ background: `${C.green}22`, border: `1px solid ${C.green}33` }}>
          <CheckCircle size={16} style={{ color: C.green }} />
          <div>
            <div className="text-lg font-semibold" style={{ color: C.green }}>{present.length}</div>
            <div className="text-xs" style={{ color: C.muted }}>Present</div>
          </div>
        </div>
        <div className="rounded-md p-3 flex items-center gap-2" style={{ background: `${C.amber}22`, border: `1px solid ${C.amber}33` }}>
          <Coffee size={16} style={{ color: C.amber }} />
          <div>
            <div className="text-lg font-semibold" style={{ color: C.amber }}>{onLeave.length}</div>
            <div className="text-xs" style={{ color: C.muted }}>On Leave</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {DEVS.map((d) => (
          <div key={d.id} className="flex items-center justify-between text-xs py-1.5" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold"
                style={{ background: d.avatarColor + "33", color: d.avatarColor }}>
                {d.name.split(" ").map((x) => x[0]).join("")}
              </div>
              <span>{d.name.split(" ")[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1" style={{ color: C.faint }}>
                <MapPin size={10} />{d.location.split(" — ")[1] || d.location}
              </span>
              <Badge text={d.attendance} tone={d.attendance === "Present" ? "green" : "amber"} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
