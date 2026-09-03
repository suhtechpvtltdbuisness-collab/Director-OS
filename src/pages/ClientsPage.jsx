import React, { useState } from "react";
import { Users, DollarSign, CheckCircle, Clock } from "lucide-react";
import { C } from "../constants/theme";
import { CLIENTS } from "../constants/seedData";
import { inrFull } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import Input from "../components/common/Input";
import IconBtn from "../components/common/IconBtn";
import ClientsTable from "../components/clients/ClientsTable";

const STATUS_FILTERS = ["All", "Active", "Completed", "Trial"];

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) &&
      (statusFilter === "All" || c.status === statusFilter)
  );

  const totalContractValue = CLIENTS.filter((c) => c.status === "Active").reduce((s, c) => s + c.value, 0);
  const activeCount = CLIENTS.filter((c) => c.status === "Active").length;
  const trialCount = CLIENTS.filter((c) => c.status === "Trial").length;
  const completedCount = CLIENTS.filter((c) => c.status === "Completed").length;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Client Management"
        subtitle="Every client relationship in one place"
        right={
          <>
            <Input placeholder="Search clients…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Active Clients" value={activeCount} icon={Users} accent={C.green} />
        <KpiCard label="Total Contract Value" value={inrFull(totalContractValue)} icon={DollarSign} accent={C.gold} sub="active clients only" />
        <KpiCard label="Trial Accounts" value={trialCount} icon={Clock} accent={C.amber} sub="conversion opportunity" />
        <KpiCard label="Completed Projects" value={completedCount} icon={CheckCircle} accent={C.blue} sub="past engagements" />
      </div>

      <div className="flex items-center gap-2">
        {STATUS_FILTERS.map((s) => (
          <IconBtn key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
      </div>

      <ClientsTable clients={filtered} />
    </div>
  );
}
