import React from "react";
import { C } from "../../constants/theme";

export default function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs" style={{ color: C.muted }}>
      {label}
      {children}
    </label>
  );
}
