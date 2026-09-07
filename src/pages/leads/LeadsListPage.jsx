import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Eye, Pencil, Plus, Trash2, Target, TrendingUp, Table2, Columns3 } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { inr, formatDate, stageTone } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog, CardsSkeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import IconBtn from "../../components/common/IconBtn";
import KpiCard from "../../components/common/KpiCard";
import LeadPipeline from "../../components/crm/LeadPipeline";

const STAGES = ["New", "Contacted", "Demo", "Proposal", "Negotiation", "Won", "Lost"];
const OPEN_STAGES = STAGES.filter((s) => s !== "Won" && s !== "Lost");

export default function LeadsListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("leads");
  const { remove, update } = useStore();
  const { toast } = useSession();
  const [view, setView] = React.useState("pipeline");
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const owners = React.useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.owner))).sort()], [rows]);

  const t = useTableState(rows, {
    searchKeys: ["name", "contactName", "product", "owner", "source"],
    initialSort: { key: "value", dir: "desc" },
  });

  const open = rows.filter((r) => OPEN_STAGES.includes(r.stage));
  const won = rows.filter((r) => r.stage === "Won");
  const pipelineValue = open.reduce((s, r) => s + r.value, 0);
  const closed = rows.filter((r) => r.stage === "Won" || r.stage === "Lost");
  const winRate = closed.length ? Math.round((won.length / closed.length) * 100) : 0;

  async function moveStage(id, stage) {
    try {
      await update("leads", id, { stage, updated: new Date().toISOString().slice(0, 10) });
      toast(`Lead moved to ${stage}`);
    } catch (err) {
      toast(err.message || "Could not move lead", "red");
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("leads", pendingDelete.id);
      toast(`${pendingDelete.name} removed`);
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not remove lead", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "name", label: "Lead", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.name}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.contactName}</div>
        </div>
      ),
    },
    { key: "product", label: "Interested in", sortable: true },
    { key: "value", label: "Deal value", sortable: true, align: "right", render: (r) => inr(r.value) },
    { key: "stage", label: "Stage", sortable: true, render: (r) => <Badge text={r.stage} tone={stageTone(r.stage)} /> },
    { key: "source", label: "Source", sortable: true, secondary: true },
    { key: "owner", label: "Owner", sortable: true, secondary: true },
    { key: "updated", label: "Last activity", sortable: true, render: (r) => formatDate(r.updated) },
  ];

  const emptyState = (
    <EmptyView
      icon={Users}
      title="No leads yet"
      body="Add your first lead to start building the sales pipeline."
      action={<PrimaryBtn icon={Plus} onClick={() => navigate("/leads/new")}>Add lead</PrimaryBtn>}
    />
  );

  return (
    <>
      <PageHeader
        title="CRM & Leads"
        description="Sales pipeline from first contact through to a signed client."
        actions={
          <>
            <div className="flex items-center gap-1">
              <IconBtn icon={Columns3} label="Pipeline" active={view === "pipeline"} onClick={() => setView("pipeline")} />
              <IconBtn icon={Table2} label="Table" active={view === "table"} onClick={() => setView("table")} />
            </div>
            <PrimaryBtn icon={Plus} onClick={() => navigate("/leads/new")}>Add lead</PrimaryBtn>
          </>
        }
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Open leads" value={open.length} icon={Users} sub={`${rows.length} total`} />
        <KpiCard label="Pipeline value" value={inr(pipelineValue)} icon={Target} accent={C.gold} sub="Open opportunities" />
        <KpiCard label="Won this period" value={won.length} icon={TrendingUp} accent={C.green} />
        <KpiCard label="Win rate" value={`${winRate}%`} icon={TrendingUp} accent={C.blue} sub={`${closed.length} closed`} />
      </div>

      {view === "pipeline" ? (
        status === "loading" ? <CardsSkeleton count={6} height={180} /> : rows.length === 0 ? (
          <div className="rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}>{emptyState}</div>
        ) : (
          <LeadPipeline
            leads={rows}
            stages={STAGES}
            onOpen={(lead) => navigate(`/leads/${lead.id}`)}
            onMove={moveStage}
          />
        )
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <Toolbar
            query={t.query}
            onQuery={t.setQuery}
            placeholder="Search by lead, contact or source…"
            onClear={t.clear}
            filters={[
              { key: "stage", label: "All stages", value: t.filters.stage || "All", options: ["All", ...STAGES], onChange: (v) => t.setFilter("stage", v) },
              { key: "owner", label: "All owners", value: t.filters.owner || "All", options: owners, onChange: (v) => t.setFilter("owner", v) },
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
            onRowClick={(r) => navigate(`/leads/${r.id}`)}
            pagination={t.pagination}
            rowActions={(r) => [
              { label: "View details", icon: Eye, onClick: () => navigate(`/leads/${r.id}`) },
              { label: "Edit lead", icon: Pencil, onClick: () => navigate(`/leads/${r.id}/edit`) },
              { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
            ]}
            empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : emptyState}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete lead"
        body={`This will permanently remove ${pendingDelete?.name} from the pipeline.`}
        confirmLabel="Delete lead"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
