import React, { useState } from "react";
import { Plus, Wallet, Activity, Users, Target } from "lucide-react";
import { C } from "../constants/theme";
import { useData } from "../context/DataContext";
import { inr } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import PrimaryBtn from "../components/common/PrimaryBtn";
import CampaignsTable from "../components/marketing/CampaignsTable";
import CampaignFormModal from "../components/marketing/CampaignFormModal";

export default function MarketingPage({ campaigns, leads, isDirector, pushActivity, toast, api }) {
  const { products } = useData();
  const emptyForm = { name: "", product: products[0]?.name || "", channel: "", budget: "", status: "Active" };
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function addCampaign() {
    if (!form.name.trim()) return;
    try {
      const item = await api.addCampaign({
        name: form.name,
        product: form.product,
        channel: form.channel || "Multi-channel",
        budget: Number(form.budget) || 0,
        status: form.status,
      });
      await pushActivity("Director", `created campaign '${item.name}'`, "Marketing");
      toast("Campaign created");
      setShowAdd(false);
      setForm(emptyForm);
    } catch (err) {
      toast(err.message || "Failed to create campaign", "red");
    }
  }

  async function removeCampaign(id, name) {
    try {
      await api.removeCampaign(id);
      await pushActivity("Director", `archived campaign '${name}'`, "Marketing");
      toast("Campaign archived", "amber");
    } catch (err) {
      toast(err.message || "Failed to archive campaign", "red");
    }
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
        <KpiCard label="Total Spend" value={inr(totalSpend)} icon={Activity} accent={C.blue} sub={`${totalBudget ? Math.round((totalSpend / totalBudget) * 100) : 0}% utilized`} />
        <KpiCard label="Leads Generated" value={totalLeads} icon={Users} accent={C.purple} />
        <KpiCard label="Conversions" value={totalConv} icon={Target} accent={C.green} sub={`${totalLeads ? ((totalConv / totalLeads) * 100).toFixed(1) : 0}% rate`} />
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
