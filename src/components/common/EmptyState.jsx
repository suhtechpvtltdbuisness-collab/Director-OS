import React from "react";
import { C } from "../../constants/theme";

export default function EmptyState({ text, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10" style={{ color: C.faint }}>
      {Icon && <Icon size={22} />}
      <span className="text-sm">{text}</span>
    </div>
  );
}
