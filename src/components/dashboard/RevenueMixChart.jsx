import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip } from "recharts";
import { C, FONT_DISPLAY, PIE_COLORS } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import { useData } from "../../context/DataContext";
import Panel from "../common/Panel";

export default function RevenueMixChart() {
  const { products } = useData();
  const data = products.map((p) => ({ name: p.name, value: p.mrr }));
  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>
        Revenue Mix by Product
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <RTooltip
              contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }}
              formatter={(v) => inrFull(v)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
