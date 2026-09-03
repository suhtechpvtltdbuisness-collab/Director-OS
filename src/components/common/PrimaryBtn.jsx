import React from "react";
import { C, FONT_BODY } from "../../constants/theme";

export default function PrimaryBtn({ children, onClick, icon: Icon, disabled, tone = "gold" }) {
  const bg = tone === "gold" ? C.gold : tone === "red" ? C.red : C.blue;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-opacity"
      style={{
        background: disabled ? "#3A3F4B" : bg,
        color: disabled ? C.faint : "#0D1117",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: FONT_BODY,
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
