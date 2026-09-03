import React from "react";
import { Lock, Trash2 } from "lucide-react";
import { C, FONT_MONO } from "../../constants/theme";
import { inr } from "../../utils/formatCurrency";
import Panel from "../common/Panel";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";

export default function CampaignsTable({ campaigns, leads, isDirector, onRemove }) {
  return (
    <Panel className="p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[760px]">
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
            {["Campaign", "Product", "Channel", "Budget / Spend", "Leads", "Conv.", "ROI", "Status", ""].map((h) => (
              <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => {
            const leadVal = leads.find((l) => l.product === c.product)?.value || 200000;
            const roi = c.spend > 0 ? (((c.conversions * leadVal) - c.spend) / c.spend) : 0;
            const utilization = Math.min(100, Math.round((c.spend / c.budget) * 100));
            return (
              <tr key={c.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                <td className="px-3 py-2.5 font-medium">{c.name}</td>
                <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.product}</td>
                <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.channel}</td>
                <td className="px-3 py-2.5 w-32">
                  <div className="text-xs mb-1">{inr(c.spend)} / {inr(c.budget)}</div>
                  <ProgressBar value={utilization} tone={utilization > 90 ? "red" : "blue"} height={4} />
                </td>
                <td className="px-3 py-2.5">{c.leads}</td>
                <td className="px-3 py-2.5">{c.conversions}</td>
                <td className="px-3 py-2.5">
                  <Badge
                    text={roi > 2 ? "Strong" : roi > 0 ? "Positive" : "Low"}
                    tone={roi > 2 ? "green" : roi > 0 ? "amber" : "red"}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <Badge text={c.status} tone={c.status === "Active" ? "blue" : "gray"} />
                </td>
                <td className="px-3 py-2.5">
                  {isDirector
                    ? <button onClick={() => onRemove(c.id, c.name)} style={{ color: C.faint }}><Trash2 size={14} /></button>
                    : <Lock size={13} style={{ color: C.faint }} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}
