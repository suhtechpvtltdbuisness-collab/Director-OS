import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Cell } from "recharts";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { DEVS } from "../../constants/seedData";
import Panel from "../common/Panel";

export default function WorkloadChart() {
  return (
    <Panel className="p-4">
      <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Workload Distribution</div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={DEVS} margin={{ left: -20 }}>
            <CartesianGrid stroke={C.borderSoft} vertical={false} />
            <XAxis dataKey="name" stroke={C.faint} fontSize={9} tickFormatter={(v) => v.split(" ")[0]} />
            <YAxis stroke={C.faint} fontSize={11} unit="%" />
            <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
            <Bar dataKey="workload" radius={[4, 4, 0, 0]}>
              {DEVS.map((d, i) => (
                <Cell key={i} fill={d.workload > 85 ? C.red : d.workload > 65 ? C.amber : C.green} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
