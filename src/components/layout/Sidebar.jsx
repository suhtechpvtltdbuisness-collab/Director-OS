import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { NAV_GROUPS } from "../../constants/nav";

export function NavItem({ item, badgeCount, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors relative"
      style={({ isActive }) => ({
        background: isActive ? C.goldMuted : "transparent",
        color: isActive ? C.gold : C.muted,
        fontWeight: isActive ? 600 : 500,
      })}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full" style={{ background: C.gold }} />
          )}
          <Icon size={15} />
          <span className="truncate">{item.label}</span>
          {item.badge === "approvals" && badgeCount > 0 && (
            <span
              className="ml-auto text-[10px] rounded-full px-1.5 py-0.5 font-semibold"
              style={{ background: C.red, color: "#fff" }}
            >
              {badgeCount}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ user, isDirector, pendingApprovalsCount, onSignOut }) {
  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0"
      style={{ borderRight: `1px solid ${C.border}`, background: C.panel }}
    >
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="rounded-md p-1.5" style={{ background: C.goldTint }}>
          <Shield size={16} style={{ color: C.gold }} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight" style={{ fontFamily: FONT_DISPLAY }}>Director OS</div>
          <div className="text-[10px] truncate" style={{ color: C.faint }}>SUH TECH PVT LTD</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.faint }}>
              {group.label}
            </div>
            {group.items.map((item) => (
              <NavItem key={item.to} item={item} badgeCount={pendingApprovalsCount} />
            ))}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 px-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ background: C.gold, color: C.bg }}
          >
            {isDirector ? "DR" : "MG"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">{user.name || (isDirector ? "Director" : "Manager")}</div>
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
