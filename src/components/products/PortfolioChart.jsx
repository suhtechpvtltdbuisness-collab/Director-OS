import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, Cell,
} from "recharts";
import { C, FONT_DISPLAY, PIE_COLORS } from "../../constants/theme";
import { PRODUCTS } from "../../constants/seedData";
import { inr, inrFull } from "../../utils/formatCurrency";
import Panel from "../common/Panel";

export default function PortfolioChart() {
  const data = PRODUCTS.map((p, i) => ({
    name: p.name.split(" ")[0],
    mrr: p.mrr,
    clients: p.clients,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>
        Revenue by Product / Service Line
      </div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: -10 }}>
            <CartesianGrid stroke={C.borderSoft} vertical={false} />
            <XAxis dataKey="name" stroke={C.faint} fontSize={10} />
            <YAxis stroke={C.faint} fontSize={11} tickFormatter={(v) => inr(v)} width={60} />
            <RTooltip
              contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }}
              formatter={(v) => inrFull(v)}
            />
            <Bar dataKey="mrr" radius={[4, 4, 0, 0]} name="MRR">
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
