import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../../constants/theme";
import { toneMap } from "../../utils/tones";

export default function NotificationMenu({ items, onClose }) {
  const navigate = useNavigate();
  return (
    <div
      className="absolute right-0 top-full mt-1 w-80 max-w-[85vw] rounded-md overflow-hidden z-40 shadow-xl"
      style={{ background: C.panel2, border: `1px solid ${C.border}` }}
    >
      <div className="px-3 py-2 text-xs font-semibold" style={{ borderBottom: `1px solid ${C.border}`, color: C.muted }}>
        Notifications
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-3 py-6 text-sm text-center" style={{ color: C.faint }}>You're all caught up</div>
        ) : items.map((n, i) => (
          <button
            key={i}
            onClick={() => { navigate(n.to); onClose?.(); }}
            className="w-full text-left px-3 py-2.5 flex items-start gap-2 text-sm hover:opacity-80"
            style={{ borderBottom: `1px solid ${C.borderSoft}` }}
          >
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: toneMap[n.tone]?.fg || C.muted }} />
            <span className="min-w-0">
              <span className="block truncate" style={{ color: C.text }}>{n.title}</span>
              <span className="block text-[10px]" style={{ color: C.faint }}>{n.meta}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
