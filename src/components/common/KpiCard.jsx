import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY } from "../../constants/theme";

export default function KpiCard({ label, value, delta, deltaGood = true, icon: Icon, sub, accent = C.gold }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2 min-w-0"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: C.muted, fontFamily: FONT_BODY }}>{label}</span>
        {Icon && (
          <div className="rounded-md p-1.5" style={{ background: `${accent}22` }}>
            <Icon size={14} style={{ color: accent }} />
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{value}</div>
      <div className="flex items-center gap-2">
        {delta && (
          <span className="inline-flex items-center gap-0.5 text-xs font-medium" style={{ color: deltaGood ? C.green : C.red }}>
            {deltaGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta}
          </span>
        )}
        {sub && <span className="text-xs" style={{ color: C.faint }}>{sub}</span>}
      </div>
    </div>
  );
}
