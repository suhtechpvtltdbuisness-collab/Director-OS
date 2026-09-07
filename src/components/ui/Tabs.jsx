import React from "react";
import { C } from "../../constants/theme";

/** Underlined tab strip. Scrolls horizontally on narrow screens. */
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto mb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="px-3 py-2.5 text-sm whitespace-nowrap relative transition-colors"
            style={{ color: on ? C.gold : C.muted, fontWeight: on ? 600 : 500 }}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1.5 text-[10px] rounded px-1.5 py-0.5" style={{ background: C.track, color: C.muted }}>
                {t.count}
              </span>
            )}
            {on && <span className="absolute left-0 right-0 -bottom-px h-0.5" style={{ background: C.gold }} />}
          </button>
        );
      })}
    </div>
  );
}
