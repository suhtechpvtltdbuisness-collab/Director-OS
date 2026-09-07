import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Wallet, TrendingUp, CircleAlert, Receipt, ArrowRight } from "lucide-react";
import { C } from "../../constants/theme";
import { useStore } from "../../data/DataStore";
import { inr, formatDate, statusTone, chartTooltipStyle } from "../../utils";
import { PageHeader, Tabs, Card, ErrorView, EmptyView, Skeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import KpiCard from "../../components/common/KpiCard";
import GhostBtn from "../../components/common/GhostBtn";

const STATUS_COLOR = { Paid: C.green, Pending: C.amber, Overdue: C.red, Draft: C.faint };

export default function FinanceOverviewPage() {
  const navigate = useNavigate();
  const { data, status, error, reload } = useStore();
  const [tab, setTab] = React.useState("overview");

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={340} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;

  const { invoices, expenses, revenueTrend } = data;

  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const overdueInvoices = invoices.filter((i) => i.status === "Overdue");
  const overdue = overdueInvoices.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const byStatus = Object.entries(
    invoices.reduce((acc, i) => ({ ...acc, [i.status]: (acc[i.status] || 0) + i.amount }), {}),
  ).map(([name, value]) => ({ name, value }));

  const byCategory = Object.entries(
    expenses.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + e.amount }), {}),
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const recent = [...invoices].sort((a, b) => b.issueDate.localeCompare(a.issueDate)).slice(0, 6);

  return (
    <>
      <PageHeader
        title="Finance"
        description="Revenue, receivables and operating costs across the business."
        actions={
          <>
            <GhostBtn onClick={() => navigate("/finance/invoices")}>All invoices</GhostBtn>
            <GhostBtn onClick={() => navigate("/finance/expenses")}>Expenses</GhostBtn>
          </>
        }
      />

      <div className="grid gap-3 grid-cols-2 xl:grid-cols-4 mb-5">
        <KpiCard label="Collected" value={inr(collected)} icon={TrendingUp} accent={C.green} sub={`${invoices.filter((i) => i.status === "Paid").length} paid invoices`} />
        <KpiCard label="Outstanding" value={inr(outstanding)} icon={Wallet} accent={C.amber} sub="Awaiting payment" />
        <KpiCard label="Overdue" value={inr(overdue)} icon={CircleAlert} accent={C.red} sub={`${overdueInvoices.length} invoices past due`} />
        <KpiCard label="Operating expenses" value={inr(totalExpenses)} icon={Receipt} accent={C.blue} sub="This period" />
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "receivables", label: "Receivables", count: invoices.filter((i) => i.status !== "Paid").length },
          { id: "expenses", label: "Expenses", count: expenses.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Revenue vs target" className="lg:col-span-2">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ left: -12, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderSoft} />
                  <XAxis dataKey="month" stroke={C.faint} fontSize={11} />
                  <YAxis stroke={C.faint} fontSize={11} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => inr(v)} />
                  <Area type="monotone" dataKey="revenue" stroke={C.gold} strokeWidth={2} fill="url(#rev)" name="Revenue" />
                  <Area type="monotone" dataKey="target" stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Receivables by status">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2}>
                    {byStatus.map((s) => <Cell key={s.name} fill={STATUS_COLOR[s.name] || C.faint} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => inr(v)} />
                  <Legend wrapperStyle={{ fontSize: 11, color: C.muted }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            title="Recent invoices"
            className="lg:col-span-2"
            action={<Link to="/finance/invoices" className="text-xs flex items-center gap-1 hover:underline" style={{ color: C.gold }}>View all <ArrowRight size={12} /></Link>}
          >
            {recent.length ? (
              <ul className="flex flex-col">
                {recent.map((i, idx) => (
                  <li key={i.id} className="py-2.5" style={{ borderBottom: idx < recent.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <Link to={`/finance/invoices/${i.id}`} className="flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-sm truncate" style={{ color: C.text }}>{i.client}</span>
                        <span className="block text-xs" style={{ color: C.faint }}>{i.id} · due {formatDate(i.dueDate)}</span>
                      </span>
                      <span className="flex items-center gap-3 shrink-0">
                        <span className="text-sm tabular-nums">{inr(i.amount)}</span>
                        <Badge text={i.status} tone={statusTone(i.status)} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyView title="No invoices" body="Invoices you raise will appear here." />
            )}
          </Card>

          <Card title="Expenses by category">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderSoft} horizontal={false} />
                  <XAxis type="number" stroke={C.faint} fontSize={10} tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`} />
                  <YAxis type="category" dataKey="name" stroke={C.faint} fontSize={10} width={92} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => inr(v)} cursor={{ fill: C.borderSoft }} />
                  <Bar dataKey="value" fill={C.blue} radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {tab === "receivables" && (
        <Card title="Outstanding receivables">
          {invoices.filter((i) => i.status !== "Paid").length ? (
            <ul className="flex flex-col">
              {invoices.filter((i) => i.status !== "Paid").map((i, idx, arr) => (
                <li key={i.id} className="py-2.5" style={{ borderBottom: idx < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/finance/invoices/${i.id}`} className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{i.client}</span>
                      <span className="block text-xs" style={{ color: i.daysOverdue > 0 ? C.red : C.faint }}>
                        {i.id} · {i.daysOverdue > 0 ? `${i.daysOverdue} days overdue` : `due ${formatDate(i.dueDate)}`}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span className="text-sm tabular-nums">{inr(i.amount)}</span>
                      <Badge text={i.status} tone={statusTone(i.status)} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="Nothing outstanding" body="Every invoice has been settled." />
          )}
        </Card>
      )}

      {tab === "expenses" && (
        <Card
          title="Recorded expenses"
          action={<Link to="/finance/expenses" className="text-xs flex items-center gap-1 hover:underline" style={{ color: C.gold }}>Manage <ArrowRight size={12} /></Link>}
        >
          {expenses.length ? (
            <ul className="flex flex-col">
              {expenses.map((e, idx) => (
                <li key={e.id} className="py-2.5 flex items-center justify-between gap-3" style={{ borderBottom: idx < expenses.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <span className="min-w-0">
                    <span className="block text-sm truncate" style={{ color: C.text }}>{e.vendor}</span>
                    <span className="block text-xs" style={{ color: C.faint }}>{e.category} · {formatDate(e.date)}</span>
                  </span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="text-sm tabular-nums">{inr(e.amount)}</span>
                    <Badge text={e.status} tone={statusTone(e.status)} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No expenses" body="Operating costs you record will appear here." />
          )}
        </Card>
      )}
    </>
  );
}
