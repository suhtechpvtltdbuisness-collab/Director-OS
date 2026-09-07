import React from "react";
import { NavLink } from "react-router-dom";
import { C } from "../../constants/theme";
import { MOBILE_NAV } from "../../constants/nav";

export default function MobileBottomNav({ pendingApprovalsCount }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden flex items-stretch z-30"
      style={{ background: C.panel, borderTop: `1px solid ${C.border}` }}
    >
      {MOBILE_NAV.map((n) => {
        const Icon = n.icon;
        return (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ color: isActive ? C.gold : C.faint }} />
                <span className="text-[9px]" style={{ color: isActive ? C.gold : C.faint }}>{n.label}</span>
                {n.badge === "approvals" && pendingApprovalsCount > 0 && (
                  <span className="absolute top-1.5 right-1/4 w-1.5 h-1.5 rounded-full" style={{ background: C.red }} />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
