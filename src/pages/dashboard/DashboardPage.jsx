import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  IndianRupee, Users, FolderKanban, TriangleAlert, ArrowRight,
  CircleAlert, Clock, LifeBuoy, Rocket,
} from "lucide-react";
import { C, FONT_DISPLAY, PIE_COLORS } from "../../constants/theme";
import { useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import {
  inr, formatDate, dueLabel, daysUntil, healthTone, riskTone, stageTone, chartTooltipStyle,
} from "../../utils";
import { PageHeader, Card, EmptyView, ErrorView, Skeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import KpiCard from "../../components/common/KpiCard";
import ProgressBar from "../../components/common/ProgressBar";
import Avatar from "../../components/common/Avatar";

function SectionLink({ to, children }) {
  return (
    <Link to={to} className="text-xs flex items-center gap-1 hover:underline shrink-0" style={{ color: C.gold }}>
      {children} <ArrowRight size={12} />
    </Link>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, status, error, reload } = useStore();
  const { user, isDirector } = useSession();

  if (status === "loading") {
    return (
      <>
        <Skeleton h={64} className="mb-5" />
        <div className="grid gap-3 grid-cols-2 xl:grid-cols-4 mb-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={104} radius={10} />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton h={320} radius={10} className="lg:col-span-2" />
          <Skeleton h={320} radius={10} />
        </div>
      </>
    );
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;

  const { projects, leads, invoices, approvals, alerts, tickets, devs, activity, revenueTrend, products } = data;

  const hasData = projects.length || leads.length || invoices.length;

  const mrr = products.reduce((s, p) => s + p.mrr, 0);
  const openLeads = leads.filter((l) => !["Won", "Lost"].includes(l.stage));
  const pipeline = openLeads.reduce((s, l) => s + l.value, 0);
  const overdue = invoices.filter((i) => i.status === "Overdue");
  const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const atRiskProjects = projects.filter((p) => p.health === "Red" || p.risk === "High");
  const pendingApprovals = approvals.filter((a) => a.status === "Pending");
  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress");

  const dueSoon = [...projects]
    .filter((p) => daysUntil(p.deadline) !== null && daysUntil(p.deadline) <= 21)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const pipelineByStage = ["New", "Contacted", "Demo", "Proposal", "Negotiation"]
    .map((stage) => ({ name: stage, value: leads.filter((l) => l.stage === stage).reduce((s, l) => s + l.value, 0) }))
    .filter((s) => s.value > 0);

  const stretched = [...devs].sort((a, b) => b.workload - a.workload).slice(0, 5);

  if (!hasData) {
    return (
      <>
        <PageHeader title={`Welcome, ${user.name || "Director"}`} description="Your command centre for SUH TECH." />
        <Card>
          <EmptyView
            icon={Rocket}
            title="Your dashboard is ready"
            body="Once you add clients, projects and leads, this page becomes a live view of revenue, delivery health and risk."
            action={
              <div className="flex flex-wrap gap-2 justify-center">
                <Link to="/clients/new" className="text-sm px-3 py-1.5 rounded-md font-semibold" style={{ background: C.gold, color: C.bg }}>Add a client</Link>
                <Link to="/projects/new" className="text-sm px-3 py-1.5 rounded-md" style={{ border: `1px solid ${C.border}`, color: C.muted }}>Create a project</Link>
              </div>
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Good day, ${user.name || (isDirector ? "Director" : "Manager")}`}
        description={`${pendingApprovals.length} approval${pendingApprovals.length === 1 ? "" : "s"} waiting · ${activeAlerts.length} active alert${activeAlerts.length === 1 ? "" : "s"} · ${atRiskProjects.length} project${atRiskProjects.length === 1 ? "" : "s"} at risk`}
      />

      <div className="grid gap-3 grid-cols-2 xl:grid-cols-4 mb-5">
        <KpiCard label="Monthly recurring revenue" value={inr(mrr)} icon={IndianRupee} accent={C.gold} sub={`${products.length} revenue lines`} />
        <KpiCard label="Open pipeline" value={inr(pipeline)} icon={Users} accent={C.blue} sub={`${openLeads.length} live opportunities`} />
        <KpiCard label="Outstanding receivables" value={inr(outstanding)} icon={Clock} accent={overdue.length ? C.red : C.amber} sub={`${overdue.length} overdue`} />
        <KpiCard label="Projects at risk" value={atRiskProjects.length} icon={TriangleAlert} accent={atRiskProjects.length ? C.red : C.green} sub={`of ${projects.length} active`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Revenue vs target" className="lg:col-span-2" action={<SectionLink to="/finance">Finance</SectionLink>}>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ left: -14, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="dashRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.borderSoft} />
                <XAxis dataKey="month" stroke={C.faint} fontSize={11} />
                <YAxis stroke={C.faint} fontSize={11} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => inr(v)} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={C.gold} strokeWidth={2} fill="url(#dashRev)" />
                <Area type="monotone" dataKey="target" name="Target" stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Pipeline by stage" action={<SectionLink to="/leads">CRM</SectionLink>}>
          {pipelineByStage.length ? (
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pipelineByStage} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2}>
                    {pipelineByStage.map((s, i) => <Cell key={s.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => inr(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyView title="No open pipeline" body="Add leads to see how value is distributed across stages." />
          )}
        </Card>

        <Card title="Deadlines in the next three weeks" className="lg:col-span-2" action={<SectionLink to="/projects">Projects</SectionLink>}>
          {dueSoon.length ? (
            <ul className="flex flex-col">
              {dueSoon.map((p, i) => (
                <li key={p.id} className="py-2.5" style={{ borderBottom: i < dueSoon.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/projects/${p.id}`} className="flex flex-wrap items-center justify-between gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{p.name}</span>
                      <span className="block text-xs" style={{ color: daysUntil(p.deadline) < 0 ? C.red : C.faint }}>
                        {p.client} · {dueLabel(p.deadline)}
                      </span>
                    </span>
                    <span className="w-24 shrink-0"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></span>
                    <Badge text={p.health} tone={healthTone(p.health)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="Nothing due soon" body="No project deadlines fall within the next three weeks." />
          )}
        </Card>

        <Card title="Awaiting your approval" action={<SectionLink to="/approvals">All</SectionLink>}>
          {pendingApprovals.length ? (
            <ul className="flex flex-col">
              {pendingApprovals.slice(0, 5).map((a, i, arr) => (
                <li key={a.id} className="py-2.5" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/approvals/${a.id}`} className="flex items-start justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{a.title}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{a.requestedBy}</span>
                    </span>
                    <Badge text={a.risk} tone={riskTone(a.risk)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="All clear" body="No requests are waiting on a decision." />
          )}
        </Card>

        <Card title="Active alerts" action={<SectionLink to="/alerts">All alerts</SectionLink>}>
          {activeAlerts.length ? (
            <ul className="flex flex-col">
              {activeAlerts.slice(0, 5).map((a, i, arr) => (
                <li key={a.id} className="py-2.5 flex items-start gap-2" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <CircleAlert size={14} className="shrink-0 mt-0.5" style={{ color: a.severity === "High" ? C.red : a.severity === "Medium" ? C.amber : C.faint }} />
                  <span className="min-w-0">
                    <span className="block text-sm truncate" style={{ color: C.text }}>{a.title}</span>
                    <span className="block text-xs" style={{ color: C.faint }}>{a.area}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No active alerts" body="Nothing needs your attention right now." />
          )}
        </Card>

        <Card title="Team workload" action={<SectionLink to="/team">Dev team</SectionLink>}>
          {stretched.length ? (
            <ul className="flex flex-col gap-3">
              {stretched.map((d) => (
                <li key={d.id}>
                  <Link to={`/team/${d.id}`} className="flex items-center gap-2.5">
                    <Avatar name={d.name} color={d.avatarColor} size={7} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm truncate" style={{ color: C.text }}>{d.name}</span>
                        <span className="text-xs tabular-nums shrink-0" style={{ color: C.muted }}>{d.workload}%</span>
                      </span>
                      <ProgressBar value={d.workload} tone={d.workload >= 90 ? "red" : d.workload >= 75 ? "amber" : "green"} height={4} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No team members" body="Add engineers to track capacity." />
          )}
        </Card>

        <Card title="Support load" action={<SectionLink to="/support">Support</SectionLink>}>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg p-2.5" style={{ background: `${C.red}1A` }}>
              <LifeBuoy size={18} style={{ color: C.red }} />
            </div>
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{openTickets.length}</div>
              <div className="text-xs" style={{ color: C.faint }}>open tickets</div>
            </div>
          </div>
          {openTickets.length ? (
            <ul className="flex flex-col">
              {openTickets.slice(0, 4).map((t, i, arr) => (
                <li key={t.id} className="py-2" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/support/${t.id}`} className="flex items-center justify-between gap-2">
                    <span className="text-sm truncate min-w-0" style={{ color: C.muted }}>{t.subject}</span>
                    <Badge text={t.priority} tone={riskTone(t.priority)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: C.faint }}>No open tickets.</p>
          )}
        </Card>

        <Card title="Recent activity" className="lg:col-span-3" action={<SectionLink to="/activity">Full log</SectionLink>}>
          {activity.length ? (
            <ul className="flex flex-col">
              {activity.slice(0, 6).map((a, i, arr) => (
                <li key={a.id} className="py-2" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <p className="text-sm leading-snug" style={{ color: C.muted }}>
                    <span className="font-medium" style={{ color: C.text }}>{a.actor}</span> {a.action}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: C.faint }}>{a.area} · {a.time}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No activity yet" body="Actions across the system will appear here." />
          )}
        </Card>
      </div>
    </>
  );
}
