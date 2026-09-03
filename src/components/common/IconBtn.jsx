import React from "react";
import { C } from "../../constants/theme";

export default function IconBtn({ icon: Icon, onClick, label, active }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
      style={{
        background: active ? `${C.gold}1F` : "transparent",
        color: active ? C.gold : C.muted,
        border: `1px solid ${active ? C.gold + "55" : C.border}`,
      }}
    >
      {Icon && <Icon size={13} />}
      {label}
    </button>
  );
}
