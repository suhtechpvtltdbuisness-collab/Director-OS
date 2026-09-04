import React, { useState } from "react";
import { Plus, Target, TrendingUp, Users, PercentCircle } from "lucide-react";
import { C } from "../constants/theme";
import { useData } from "../context/DataContext";
import { inr } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import Input from "../components/common/Input";
import PrimaryBtn from "../components/common/PrimaryBtn";
import FunnelChart from "../components/crm/FunnelChart";
import LeadPipeline from "../components/crm/LeadPipeline";
import LeadFormModal from "../components/crm/LeadFormModal";
import LeadDetailModal from "../components/crm/LeadDetailModal";

export default function CrmPage({ leads, pushActivity, toast, api }) {
  const { products, devs } = useData();
  const emptyForm = {
    name: "",
    product: products[0]?.name || "",
    value: "",
    source: "Website",
    owner: devs[0]?.name || "",
  };
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(emptyForm);

  async function addLead() {
    if (!form.name.trim()) return;
    try {
      const item = await api.addLead({
        name: form.name,
        product: form.product,
        value: Number(form.value) || 0,
        source: form.source,
        owner: form.owner,
      });
      await pushActivity("Director", `added new lead '${item.name}'`, "CRM");
      toast("Lead added");
      setShowAdd(false);
      setForm(emptyForm);
    } catch (err) {
      toast(err.message || "Failed to add lead", "red");
    }
  }

  async function moveStage(id, stage) {
    try {
      await api.moveLead(id, stage);
      toast(`Lead moved to ${stage}`, "blue");
    } catch (err) {
      toast(err.message || "Failed to update lead", "red");
    }
  }

  async function removeLead(id, name) {
    try {
      await api.removeLead(id);
      await pushActivity("Director", `removed lead '${name}'`, "CRM");
      toast("Lead removed", "amber");
    } catch (err) {
      toast(err.message || "Failed to remove lead", "red");
    }
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
