import React from "react";
import { Shield, X, LogOut } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { NAV } from "../../constants/nav";

export default function MobileDrawer({ open, onClose, tab, setTab, pendingApprovalsCount, onSignOut }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 md:hidden"
      style={{ background: "#00000088" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-64 h-full flex flex-col"
        style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: C.gold }} />
            <span className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Director OS</span>
          </div>
          <button onClick={onClose}><X size={18} style={{ color: C.muted }} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => { setTab(n.id); onClose(); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-left"
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

        {/* Sign out */}
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
