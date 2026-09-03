import React from "react";
import { C, FONT_BODY } from "../../constants/theme";

export default function Select({ children, style = {}, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-md px-3 py-2 text-sm outline-none"
      style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT_BODY, ...style }}
    >
      {children}
    </select>
  );
}
