import React from "react";
import { LogOut } from "lucide-react";
import { C } from "../../constants/theme";

export default function ProfileMenu({ user, isDirector, onSignOut }) {
  return (
    <div
      className="absolute right-0 top-full mt-1 w-48 rounded-md overflow-hidden z-40"
      style={{ background: C.panel2, border: `1px solid ${C.border}` }}
    >
      <div className="px-3 py-2.5 text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="font-medium">{isDirector ? "Director" : "Manager"}</div>
        <div className="text-xs" style={{ color: C.faint }}>{user.email}</div>
      </div>
      <button
        onClick={onSignOut}
        className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-2"
        style={{ color: C.red }}
      >
        <LogOut size={13} /> Sign out
      </button>
    </div>
  );
}
