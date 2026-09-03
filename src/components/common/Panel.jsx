import React from "react";
import { C } from "../../constants/theme";

export default function Panel({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{ background: C.panel, border: `1px solid ${C.border}`, ...style }}
    >
      {children}
    </div>
  );
}
