import React from "react";
import { C } from "../../constants/theme";
import { toneMap } from "../../utils/tones";

export default function NotificationMenu({ items }) {
  return (
    <div
      className="absolute right-0 top-full mt-1 w-80 max-w-[85vw] rounded-md overflow-hidden z-40"
      style={{ background: C.panel2, border: `1px solid ${C.border}` }}
    >
      <div
        className="px-3 py-2 text-xs font-semibold"
        style={{ borderBottom: `1px solid ${C.border}`, color: C.muted }}
      >
        Notifications
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.map((n, i) => (
          <div
            key={i}
            className="px-3 py-2.5 flex items-start gap-2 text-sm"
            style={{ borderBottom: `1px solid ${C.borderSoft}` }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: toneMap[n.tone]?.fg || C.muted }}
            />
            <div className="min-w-0">
              <div className="truncate">{n.title}</div>
              <div className="text-[10px]" style={{ color: C.faint }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
