import React from "react";
import { DollarSign, Target, AlertTriangle, CheckSquare, Megaphone, LifeBuoy, Code2, TrendingUp } from "lucide-react";
import { C } from "../constants/theme";
import { PRODUCTS, DEVS } from "../constants/seedData";
import { inr } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import RevenueMixChart from "../components/dashboard/RevenueMixChart";
import ProjectHealthList from "../components/dashboard/ProjectHealthList";
import TeamWorkloadList from "../components/dashboard/TeamWorkloadList";
import CampaignChart from "../components/dashboard/CampaignChart";
import PendingApprovalsPreview from "../components/dashboard/PendingApprovalsPreview";

export default function DashboardPage({ projects, leads, campaigns, tickets, approvals, setTab }) {
  const totalMRR = PRODUCTS.reduce((s, p) => s + p.mrr, 0);
  const totalPipeline = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const wonThisPeriod = leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0);
  const atRiskProjects = projects.filter((p) => p.health === "Red" || p.health === "Amber").length;
  const totalLeadsGen = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const openTickets = tickets.filter((t) => t.status !== "Resolved").length;
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;
  const avgWorkload = Math.round(DEVS.reduce((s, d) => s + d.workload, 0) / DEVS.length);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Executive Overview"
        subtitle="SUH TECH PRIVATE LIMITED — live company snapshot"
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Monthly Recurring + Service Revenue" value={inr(totalMRR)} delta="+8.4% MoM" icon={DollarSign} accent={C.gold} />
        <KpiCard label="Active Pipeline Value" value={inr(totalPipeline)} delta={`${leads.filter((l) => !["Won", "Lost"].includes(l.stage)).length} open leads`} deltaGood icon={Target} accent={C.blue} />
        <KpiCard label="Projects At Risk" value={atRiskProjects} delta={atRiskProjects > 1 ? "Needs attention" : "Stable"} deltaGood={atRiskProjects <= 1} icon={AlertTriangle} accent={C.red} />
        <KpiCard label="Pending Director Approvals" value={pendingApprovals} icon={CheckSquare} accent={C.amber} sub="awaiting sign-off" />
        <KpiCard label="Marketing Leads Generated" value={totalLeadsGen} delta={`${totalConversions} conversions`} deltaGood icon={Megaphone} accent={C.purple} />
        <KpiCard label="Open Support Tickets" value={openTickets} icon={LifeBuoy} accent={C.blue} sub={`${tickets.filter((t) => t.priority === "Urgent").length} urgent`} />
        <KpiCard label="Avg. Developer Workload" value={`${avgWorkload}%`} icon={Code2} accent={C.green} sub={`${DEVS.filter((d) => d.status === "Blocked").length} blocked`} />
        <KpiCard label="Won Deals (Period)" value={inr(wonThisPeriod)} icon={TrendingUp} accent={C.green} />
      </div>

      {/* Revenue charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChart />
        <RevenueMixChart />
      </div>

      {/* Projects + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ProjectHealthList projects={projects} onViewAll={() => setTab("projects")} />
        <TeamWorkloadList onViewAll={() => setTab("team")} />
      </div>

      {/* Campaigns + Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CampaignChart campaigns={campaigns} />
        <PendingApprovalsPreview approvals={approvals} onViewAll={() => setTab("approvals")} />
      </div>
    </div>
  );
}
