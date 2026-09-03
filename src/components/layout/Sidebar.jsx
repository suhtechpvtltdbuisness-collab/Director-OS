import React from "react";
import { Shield, LogOut } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { NAV } from "../../constants/nav";

export default function Sidebar({ tab, setTab, user, isDirector, pendingApprovalsCount, onSignOut }) {
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0"
      style={{ borderRight: `1px solid ${C.border}`, background: C.panel }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="rounded-md p-1.5" style={{ background: `${C.gold}22` }}>
          <Shield size={16} style={{ color: C.gold }} />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight" style={{ fontFamily: FONT_DISPLAY }}>Director OS</div>
          <div className="text-[10px]" style={{ color: C.faint }}>SUH TECH PVT LTD</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left relative"
              style={{
                background: active ? `${C.gold}1A` : "transparent",
                color: active ? C.gold : C.muted,
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={15} />
              {n.label}
              {n.id === "approvals" && pendingApprovalsCount > 0 && (
                <span
                  className="ml-auto text-[10px] rounded-full px-1.5 py-0.5"
                  style={{ background: C.red, color: "#fff" }}
                >
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 px-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ background: C.gold, color: "#0D1117" }}
          >
            {isDirector ? "DR" : "MG"}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate">{isDirector ? "Director" : "Manager"}</div>
            <div className="text-[10px] truncate" style={{ color: C.faint }}>{user.email}</div>
          </div>
          <button onClick={onSignOut} title="Sign out" style={{ color: C.faint }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
