import React from "react";
import { C } from "../../constants/theme";

export default function GhostBtn({ children, onClick, icon: Icon, tone }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium"
      style={{
        background: "transparent",
        color: tone === "red" ? C.red : C.muted,
        border: `1px solid ${tone === "red" ? C.red + "55" : C.border}`,
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
