import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "recharts";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import { REVENUE_TREND } from "../../constants/seedData";
import Panel from "../common/Panel";

export default function RevenueTrendChart() {
  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Revenue Trend</div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={REVENUE_TREND}>
            <CartesianGrid stroke={C.borderSoft} vertical={false} />
            <XAxis dataKey="month" stroke={C.faint} fontSize={11} />
            <YAxis stroke={C.faint} fontSize={11} tickFormatter={(v) => {
              if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
              if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
              return `₹${v}`;
            }} width={55} />
            <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} formatter={(v) => inrFull(v)} />
            <Line type="monotone" dataKey="revenue" stroke={C.gold} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
