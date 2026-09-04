import React, { useState } from "react";
import { CircleAlert, CircleDot, CircleCheck, AlertTriangle } from "lucide-react";
import { C } from "../constants/theme";
import { TICKET_FILTERS } from "../constants/labels";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import IconBtn from "../components/common/IconBtn";
import Select from "../components/common/Select";
import TicketsTable from "../components/support/TicketsTable";
import TicketDetailModal from "../components/support/TicketDetailModal";

export default function SupportPage({ tickets, pushActivity, toast, api }) {
  const [filter, setFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  async function updateStatus(id, status) {
    try {
      await api.updateTicket(id, status);
      await pushActivity("Director", `updated ticket ${id} to ${status}`, "Support");
      toast("Ticket updated");
    } catch (err) {
      toast(err.message || "Failed to update ticket", "red");
    }
  }

  const products = ["All", ...Array.from(new Set(tickets.map((t) => t.product)))];

  const filtered = tickets
    .filter((t) => filter === "All" || t.status === filter)
    .filter((t) => productFilter === "All" || t.product === productFilter);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Support & Tickets"
        subtitle="Client-reported issues across all products"
        right={
          <Select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} style={{ width: 180 }}>
            {products.map((p) => <option key={p}>{p}</option>)}
          </Select>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Open" value={tickets.filter((t) => t.status === "Open").length} icon={CircleAlert} accent={C.red} />
        <KpiCard label="In Progress" value={tickets.filter((t) => t.status === "In Progress").length} icon={CircleDot} accent={C.amber} />
        <KpiCard label="Resolved" value={tickets.filter((t) => t.status === "Resolved").length} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Urgent" value={tickets.filter((t) => t.priority === "Urgent").length} icon={AlertTriangle} accent={C.red} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {TICKET_FILTERS.map((s) => (
          <IconBtn key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />
        ))}
      </div>

      <TicketsTable tickets={filtered} onUpdateStatus={updateStatus} onSelectTicket={setSelected} />

      <TicketDetailModal
        ticket={selected}
        onClose={() => setSelected(null)}
        onUpdateStatus={(id, status) => { updateStatus(id, status); setSelected(null); }}
      />
    </div>
  );
}
