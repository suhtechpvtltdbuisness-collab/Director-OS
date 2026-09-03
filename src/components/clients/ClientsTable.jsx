import React from "react";
import { C } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

const statusTone = { Active: "green", Completed: "blue", Trial: "amber" };

export default function ClientsTable({ clients }) {
  return (
    <Panel className="p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
            {["Client", "Product", "Contract Value", "Status", "Contact", "Since"].map((h) => (
              <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <td className="px-3 py-2.5 font-medium">{c.name}</td>
              <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.product}</td>
              <td className="px-3 py-2.5">{c.value > 0 ? inrFull(c.value) : "—"}</td>
              <td className="px-3 py-2.5"><Badge text={c.status} tone={statusTone[c.status]} /></td>
              <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.contact}</td>
              <td className="px-3 py-2.5" style={{ color: C.faint }}>{c.since}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
