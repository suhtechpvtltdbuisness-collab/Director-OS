import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "recharts";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { LEAD_STAGES } from "../../constants/labels";
import Panel from "../common/Panel";

export default function FunnelChart({ leads }) {
  const data = LEAD_STAGES.map((s) => ({ stage: s, count: leads.filter((l) => l.stage === s).length }));
  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Pipeline Funnel</div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid stroke={C.borderSoft} horizontal={false} />
            <XAxis type="number" stroke={C.faint} fontSize={11} />
            <YAxis type="category" dataKey="stage" stroke={C.faint} fontSize={11} width={80} />
            <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
            <Bar dataKey="count" fill={C.gold} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
