import React from "react";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
} from "recharts";
import { C, FONT_DISPLAY } from "../../constants/theme";
import Panel from "../common/Panel";

export default function CampaignChart({ campaigns }) {
  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>
        Campaign Performance
      </div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={campaigns} margin={{ left: -20 }}>
            <CartesianGrid stroke={C.borderSoft} vertical={false} />
            <XAxis
              dataKey="name"
              stroke={C.faint}
              fontSize={9}
              tickFormatter={(v) => v.split(" ")[0]}
            />
            <YAxis stroke={C.faint} fontSize={11} />
            <RTooltip
              contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }}
            />
            <Bar dataKey="leads" fill={C.blue} radius={[3, 3, 0, 0]} name="Leads" />
            <Bar dataKey="conversions" fill={C.green} radius={[3, 3, 0, 0]} name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
