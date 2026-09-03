import React from "react";
import { C } from "../../constants/theme";
import { MOBILE_NAV } from "../../constants/nav";

export default function MobileBottomNav({ tab, setTab, pendingApprovalsCount }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden flex items-stretch z-30"
      style={{ background: C.panel, borderTop: `1px solid ${C.border}` }}
    >
      {MOBILE_NAV.map((n) => {
        const Icon = n.icon;
        const active = tab === n.id;
        return (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
          >
            <Icon size={18} style={{ color: active ? C.gold : C.faint }} />
            <span className="text-[9px]" style={{ color: active ? C.gold : C.faint }}>
              {n.label.split(" ")[0]}
            </span>
            {n.id === "approvals" && pendingApprovalsCount > 0 && (
              <span
                className="absolute top-1 right-6 w-1.5 h-1.5 rounded-full"
                style={{ background: C.red }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
