import React from "react";
import { C, FONT_MONO } from "../../constants/theme";
import { riskTone } from "../../utils/tones";
import { TICKET_STATUSES } from "../../constants/labels";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

export default function TicketsTable({ tickets, onUpdateStatus, onSelectTicket }) {
  return (
    <Panel className="p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
            {["ID", "Client", "Subject", "Product", "Priority", "Status", "Updated"].map((h) => (
              <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <td className="px-3 py-2.5" style={{ fontFamily: FONT_MONO, color: C.faint }}>{t.id}</td>
              <td className="px-3 py-2.5 font-medium cursor-pointer hover:underline" style={{ color: C.text }} onClick={() => onSelectTicket?.(t)}>{t.client}</td>
              <td className="px-3 py-2.5" style={{ color: C.muted }}>{t.subject}</td>
              <td className="px-3 py-2.5" style={{ color: C.muted }}>{t.product}</td>
              <td className="px-3 py-2.5"><Badge text={t.priority} tone={riskTone(t.priority)} /></td>
              <td className="px-3 py-2.5">
                <select
                  value={t.status}
                  onChange={(e) => onUpdateStatus(t.id, e.target.value)}
                  className="rounded px-2 py-1 text-xs"
                  style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
                >
                  {TICKET_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-3 py-2.5" style={{ color: C.faint }}>{t.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
