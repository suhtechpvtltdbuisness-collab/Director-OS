import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, Legend } from "recharts";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import { useData } from "../../context/DataContext";
import Panel from "../common/Panel";

export default function InvoiceStatusChart() {
  const { invoices } = useData();
  const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  const data = [
    { name: "Paid", value: paid, color: C.green },
    { name: "Pending", value: pending, color: C.blue },
    { name: "Overdue", value: overdue, color: C.red },
  ];

  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>
        Invoice Status Breakdown
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <RTooltip
              contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }}
              formatter={(v) => inrFull(v)}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ color: C.muted, fontSize: 11 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
        {data.map((d) => (
          <div key={d.name} className="rounded-md p-2 text-center" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
            <div className="font-semibold" style={{ color: d.color }}>{inrFull(d.value)}</div>
            <div style={{ color: C.faint }}>{d.name}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
