import React from "react";
import { Lock } from "lucide-react";
import { C, FONT_MONO } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

const statusTone = { Paid: "green", Pending: "blue", Overdue: "red" };

export default function InvoicesTable({ invoices, isDirector, onEscalate }) {
  return (
    <Panel className="p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[680px]">
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
            {["Invoice", "Client", "Amount", "Due Date", "Status", ""].map((h) => (
              <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((i) => (
            <tr key={i.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <td className="px-3 py-2.5" style={{ fontFamily: FONT_MONO, color: C.faint }}>{i.id}</td>
              <td className="px-3 py-2.5 font-medium">{i.client}</td>
              <td className="px-3 py-2.5">{inrFull(i.amount)}</td>
              <td className="px-3 py-2.5" style={{ color: C.muted }}>
                {i.dueDate}
                {i.daysOverdue > 0 && <span style={{ color: C.red }}> ({i.daysOverdue}d overdue)</span>}
              </td>
              <td className="px-3 py-2.5"><Badge text={i.status} tone={statusTone[i.status]} /></td>
              <td className="px-3 py-2.5">
                {i.status === "Overdue" && (
                  isDirector
                    ? <button onClick={() => onEscalate(i)} className="text-xs" style={{ color: C.gold }}>Escalate</button>
                    : <Lock size={13} style={{ color: C.faint }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
