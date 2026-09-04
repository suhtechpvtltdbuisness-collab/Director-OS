import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
} from "recharts";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import { useData } from "../../context/DataContext";
import Panel from "../common/Panel";

export default function RevenueChart() {
  const { revenueTrend } = useData();
  return (
    <Panel className="p-4 lg:col-span-2">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>
        Revenue vs Target
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <AreaChart data={revenueTrend}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.borderSoft} vertical={false} />
            <XAxis dataKey="month" stroke={C.faint} fontSize={11} />
            <YAxis stroke={C.faint} fontSize={11} tickFormatter={(v) => {
              if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
              if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
              return `₹${v}`;
            }} width={55} />
            <RTooltip
              contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }}
              formatter={(v) => inrFull(v)}
            />
            <Area type="monotone" dataKey="revenue" stroke={C.gold} fill="url(#rev)" strokeWidth={2} />
            <Line type="monotone" dataKey="target" stroke={C.muted} strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
