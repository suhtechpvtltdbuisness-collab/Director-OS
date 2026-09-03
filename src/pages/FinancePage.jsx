import React, { useState } from "react";
import { Wallet, AlertTriangle, CircleCheck, Clock } from "lucide-react";
import { C } from "../constants/theme";
import { INVOICES } from "../constants/seedData";
import { inr } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import RevenueTrendChart from "../components/finance/RevenueTrendChart";
import InvoicesTable from "../components/finance/InvoicesTable";
import EscalateModal from "../components/finance/EscalateModal";
import InvoiceStatusChart from "../components/finance/InvoiceStatusChart";

export default function FinancePage({ isDirector, pushActivity, toast }) {
  const [gate, setGate] = useState(null);

  const overdue = INVOICES.filter((i) => i.status === "Overdue");
  const paid = INVOICES.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalOutstanding = INVOICES.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);

  function releasePayment(inv) {
    pushActivity("Director", `approved payment reminder escalation for ${inv.id}`, "Finance");
    toast(`Approval recorded for ${inv.id}`, "green");
    setGate(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Finance & Receivables" subtitle="Revenue, invoices and outstanding payments" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Outstanding" value={inr(totalOutstanding)} icon={Wallet} accent={C.amber} />
        <KpiCard label="Overdue Receivables" value={inr(overdue.reduce((s, i) => s + i.amount, 0))} icon={AlertTriangle} accent={C.red} sub={`${overdue.length} invoices`} />
        <KpiCard label="Collected (period)" value={inr(paid)} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Avg. Days to Pay" value="14 days" icon={Clock} accent={C.blue} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueTrendChart />
        <InvoiceStatusChart />
      </div>
      <InvoicesTable invoices={INVOICES} isDirector={isDirector} onEscalate={setGate} />
      <EscalateModal invoice={gate} onClose={() => setGate(null)} onApprove={() => releasePayment(gate)} />
    </div>
  );
}
