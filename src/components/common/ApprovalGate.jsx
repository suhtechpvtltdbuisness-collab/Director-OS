import React from "react";
import { Lock } from "lucide-react";
import { C } from "../../constants/theme";

export default function ApprovalGate({ children }) {
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: C.gold }}>
      <Lock size={11} /> {children}
    </div>
  );
}
