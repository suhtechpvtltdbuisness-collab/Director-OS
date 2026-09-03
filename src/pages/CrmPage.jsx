import React, { useState } from "react";
import { Plus, Target, TrendingUp, Users, PercentCircle } from "lucide-react";
import { C } from "../constants/theme";
import { PRODUCTS, DEVS } from "../constants/seedData";
import { inr } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import Input from "../components/common/Input";
import PrimaryBtn from "../components/common/PrimaryBtn";
import FunnelChart from "../components/crm/FunnelChart";
import LeadPipeline from "../components/crm/LeadPipeline";
import LeadFormModal from "../components/crm/LeadFormModal";
import LeadDetailModal from "../components/crm/LeadDetailModal";

const emptyForm = { name: "", product: PRODUCTS[0].name, value: "", source: "Website", owner: DEVS[0].name };

export default function CrmPage({ leads, setLeads, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(emptyForm);

  function addLead() {
    if (!form.name.trim()) return;
    const l = {
      id: "l" + Date.now(),
      name: form.name,
      product: form.product,
      value: Number(form.value) || 0,
      source: form.source,
      stage: "New",
      owner: form.owner,
      updated: new Date().toISOString().slice(0, 10),
    };
    setLeads((ls) => [l, ...ls]);
    pushActivity("Director", `added new lead '${l.name}'`, "CRM");
    toast("Lead added");
    setShowAdd(false);
    setForm(emptyForm);
  }

  function moveStage(id, stage) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage, updated: new Date().toISOString().slice(0, 10) } : l)));
    toast(`Lead moved to ${stage}`, "blue");
  }

  function removeLead(id, name) {
    setLeads((ls) => ls.filter((l) => l.id !== id));
    pushActivity("Director", `removed lead '${name}'`, "CRM");
    toast("Lead removed", "amber");
  }

  const filtered = leads.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()));
  const pipelineValue = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const wonValue = leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0);
  const wonCount = leads.filter((l) => l.stage === "Won").length;
  const decidedCount = leads.filter((l) => ["Won", "Lost"].includes(l.stage)).length;
  const winRate = decidedCount > 0 ? Math.round((wonCount / decidedCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="CRM & Lead Pipeline"
        subtitle="Every lead across every product, one funnel"
        right={
          <>
            <Input placeholder="Search leads…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 180 }} />
            <PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>Add Lead</PrimaryBtn>
          </>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Open Pipeline Value" value={inr(pipelineValue)} icon={Target} accent={C.blue} />
        <KpiCard label="Won This Period" value={inr(wonValue)} icon={TrendingUp} accent={C.green} />
        <KpiCard label="Total Leads" value={leads.length} icon={Users} accent={C.purple} />
        <KpiCard label="Win Rate" value={`${winRate}%`} icon={PercentCircle} accent={C.gold} />
      </div>

      <FunnelChart leads={leads} />
      <LeadPipeline leads={filtered} onRemove={removeLead} onMoveStage={moveStage} onSelectLead={setSelectedLead} />

      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onMoveStage={moveStage}
        onRemove={removeLead}
      />
      <LeadFormModal
        open={showAdd}
        form={form}
        setForm={setForm}
        onClose={() => setShowAdd(false)}
        onSubmit={addLead}
      />
    </div>
  );
}
