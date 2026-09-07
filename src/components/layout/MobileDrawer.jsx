import React from "react";
import { Shield, X, LogOut } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { NAV_GROUPS } from "../../constants/nav";
import { NavItem } from "./Sidebar";

export default function MobileDrawer({ open, onClose, pendingApprovalsCount, onSignOut }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 md:hidden" style={{ background: C.overlay }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-64 h-full flex flex-col"
        style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: C.gold }} />
            <span className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Director OS</span>
          </div>
          <button onClick={onClose}><X size={18} style={{ color: C.muted }} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.faint }}>
                {group.label}
              </div>
              {group.items.map((item) => (
                <NavItem key={item.to} item={item} badgeCount={pendingApprovalsCount} onNavigate={onClose} />
              ))}
            </div>
          ))}
        </nav>

        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-3 text-sm"
          style={{ borderTop: `1px solid ${C.border}`, color: C.muted }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}
