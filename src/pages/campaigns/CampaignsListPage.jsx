import React from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Eye, Pencil, Plus, Trash2, IndianRupee, Users, Target } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { inr, formatDate, statusTone } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import KpiCard from "../../components/common/KpiCard";
import ProgressBar from "../../components/common/ProgressBar";

export const CHANNELS = ["LinkedIn", "Google Ads", "Meta Ads", "Instagram", "Content / SEO", "Webinar", "Referral", "Email"];
export const CAMPAIGN_STATUSES = ["Draft", "Active", "Paused", "Completed"];

/** Cost per acquired conversion, or null when nothing has converted yet. */
export const costPerConversion = (c) => (c.conversions ? Math.round(c.spend / c.conversions) : null);

export default function CampaignsListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("campaigns");
  const { remove } = useStore();
  const { toast } = useSession();
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const t = useTableState(rows, {
    searchKeys: ["name", "product", "channel", "owner"],
    initialSort: { key: "spend", dir: "desc" },
  });

  const active = rows.filter((r) => r.status === "Active");
  const spend = rows.reduce((s, r) => s + r.spend, 0);
  const budget = rows.reduce((s, r) => s + r.budget, 0);
  const leads = rows.reduce((s, r) => s + r.leads, 0);
  const conversions = rows.reduce((s, r) => s + r.conversions, 0);

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("campaigns", pendingDelete.id);
      toast(`${pendingDelete.name} deleted`);
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not delete campaign", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "name", label: "Campaign", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.name}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.channel} · {r.product}</div>
        </div>
      ),
    },
    {
      key: "spend", label: "Budget used", sortable: true,
      render: (r) => {
        const pct = r.budget ? Math.round((r.spend / r.budget) * 100) : 0;
        return (
          <div className="min-w-[110px]">
            <div className="flex items-center gap-2">
              <ProgressBar value={Math.min(pct, 100)} tone={pct > 90 ? "red" : pct > 75 ? "amber" : "green"} height={5} />
              <span className="text-xs tabular-nums shrink-0" style={{ color: C.muted }}>{pct}%</span>
            </div>
            <div className="text-xs mt-1" style={{ color: C.faint }}>{inr(r.spend)} of {inr(r.budget)}</div>
          </div>
        );
      },
    },
    { key: "leads", label: "Leads", sortable: true, align: "right" },
    { key: "conversions", label: "Conversions", sortable: true, align: "right" },
    {
      key: "cpc", label: "Cost / conversion", align: "right", secondary: true,
      render: (r) => {
        const cpc = costPerConversion(r);
        return cpc === null
          ? <span style={{ color: C.faint }}>—</span>
          : <span style={{ color: cpc > 15000 ? C.red : C.text }}>{inr(cpc)}</span>;
      },
    },
    { key: "status", label: "Status", sortable: true, render: (r) => <Badge text={r.status} tone={statusTone(r.status)} /> },
    { key: "end", label: "Ends", sortable: true, secondary: true, render: (r) => formatDate(r.end) },
  ];

  return (
    <>
      <PageHeader
        title="Marketing"
        description="Campaign performance across channels, with spend, leads and conversion efficiency."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/campaigns/new")}>New campaign</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Active campaigns" value={active.length} icon={Megaphone} sub={`${rows.length} total`} />
        <KpiCard label="Spend to date" value={inr(spend)} icon={IndianRupee} accent={C.gold} sub={`of ${inr(budget)} budget`} />
        <KpiCard label="Leads generated" value={leads} icon={Users} accent={C.blue} />
        <KpiCard
          label="Cost per conversion"
          value={conversions ? inr(Math.round(spend / conversions)) : "—"}
          icon={Target}
          accent={C.green}
          sub={`${conversions} conversions`}
        />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by campaign, channel or product…"
          onClear={t.clear}
          filters={[
            { key: "status", label: "All statuses", value: t.filters.status || "All", options: ["All", ...CAMPAIGN_STATUSES], onChange: (v) => t.setFilter("status", v) },
            { key: "channel", label: "All channels", value: t.filters.channel || "All", options: ["All", ...CHANNELS], onChange: (v) => t.setFilter("channel", v) },
          ]}
        />
        <DataTable
          columns={columns}
          rows={t.rows}
          loading={status === "loading"}
          error={status === "error" ? error : null}
          onRetry={reload}
          sort={t.sort}
          onSort={t.toggleSort}
          onRowClick={(r) => navigate(`/campaigns/${r.id}`)}
          pagination={t.pagination}
          rowActions={(r) => [
            { label: "View details", icon: Eye, onClick: () => navigate(`/campaigns/${r.id}`) },
            { label: "Edit campaign", icon: Pencil, onClick: () => navigate(`/campaigns/${r.id}/edit`) },
            { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
          ]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={Megaphone}
              title="No campaigns yet"
              body="Launch your first campaign to start tracking spend, leads and conversions."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/campaigns/new")}>New campaign</PrimaryBtn>}
            />
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete campaign"
        body={`This will permanently remove ${pendingDelete?.name} and its performance history.`}
        confirmLabel="Delete campaign"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
