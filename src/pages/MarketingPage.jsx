import React, { useState } from "react";
import { Plus, Wallet, Activity, Users, Target } from "lucide-react";
import { C } from "../constants/theme";
import { PRODUCTS } from "../constants/seedData";
import { inr } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import PrimaryBtn from "../components/common/PrimaryBtn";
import CampaignsTable from "../components/marketing/CampaignsTable";
import CampaignFormModal from "../components/marketing/CampaignFormModal";

const emptyForm = { name: "", product: PRODUCTS[0].name, channel: "", budget: "", status: "Active" };

export default function MarketingPage({ campaigns, setCampaigns, leads, isDirector, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function addCampaign() {
    if (!form.name.trim()) return;
    const c = {
      id: "cm" + Date.now(),
      name: form.name,
      product: form.product,
      channel: form.channel || "Multi-channel",
      budget: Number(form.budget) || 0,
      spend: 0, leads: 0, conversions: 0,
      status: form.status,
      start: new Date().toISOString().slice(0, 10),
      end: "",
    };
    setCampaigns((cs) => [c, ...cs]);
    pushActivity("Director", `created campaign '${c.name}'`, "Marketing");
    toast("Campaign created");
    setShowAdd(false);
    setForm(emptyForm);
  }

  function removeCampaign(id, name) {
    setCampaigns((cs) => cs.filter((c) => c.id !== id));
    pushActivity("Director", `archived campaign '${name}'`, "Marketing");
    toast("Campaign archived", "amber");
  }

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalConv = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Marketing Campaigns"
        subtitle="Plan, track, and measure campaigns across every product"
        right={<PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>New Campaign</PrimaryBtn>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Budget" value={inr(totalBudget)} icon={Wallet} accent={C.gold} />
        <KpiCard label="Total Spend" value={inr(totalSpend)} icon={Activity} accent={C.blue} sub={`${Math.round((totalSpend / totalBudget) * 100)}% utilized`} />
        <KpiCard label="Leads Generated" value={totalLeads} icon={Users} accent={C.purple} />
        <KpiCard label="Conversions" value={totalConv} icon={Target} accent={C.green} sub={`${((totalConv / totalLeads) * 100).toFixed(1)}% rate`} />
      </div>

      <CampaignsTable
        campaigns={campaigns}
        leads={leads}
        isDirector={isDirector}
        onRemove={removeCampaign}
      />

      <CampaignFormModal
        open={showAdd}
        form={form}
        setForm={setForm}
        onClose={() => setShowAdd(false)}
        onSubmit={addCampaign}
      />
    </div>
  );
}
