import React from "react";
import { C, FONT_MONO } from "../../constants/theme";
import Badge from "../common/Badge";

export default function ActivityItem({ item: a, showBorder }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3"
      style={{ borderBottom: showBorder ? `1px solid ${C.borderSoft}` : "none" }}
    >
      <span className="text-xs shrink-0 w-12" style={{ color: C.faint, fontFamily: FONT_MONO }}>{a.time}</span>
      <div className="text-sm">
        <b>{a.actor}</b> <span style={{ color: C.muted }}>{a.action}</span>
      </div>
      <Badge text={a.area} tone="gray" />
    </div>
  );
}
