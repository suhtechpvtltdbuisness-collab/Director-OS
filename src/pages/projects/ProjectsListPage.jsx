import React from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Eye, Pencil, Plus, Trash2, TriangleAlert, CalendarClock, IndianRupee } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { inr, formatDate, dueLabel, daysUntil, healthTone, riskTone } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import KpiCard from "../../components/common/KpiCard";
import ProgressBar from "../../components/common/ProgressBar";

export default function ProjectsListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("projects");
  const { remove } = useStore();
  const { toast } = useSession();
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const owners = React.useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.owner))).sort()], [rows]);

  const t = useTableState(rows, {
    searchKeys: ["name", "code", "client", "owner", "product"],
    initialSort: { key: "deadline", dir: "asc" },
  });

  const atRisk = rows.filter((r) => r.health === "Red" || r.risk === "High");
  const dueSoon = rows.filter((r) => { const d = daysUntil(r.deadline); return d !== null && d >= 0 && d <= 14; });
  const budget = rows.reduce((s, r) => s + r.budget, 0);
  const spent = rows.reduce((s, r) => s + r.spent, 0);

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("projects", pendingDelete.id);
      toast(`${pendingDelete.name} deleted`);
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not delete project", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "name", label: "Project", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.name}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.code} · {r.product}</div>
        </div>
      ),
    },
    { key: "client", label: "Client", sortable: true },
    { key: "owner", label: "Owner", sortable: true, secondary: true },
    {
      key: "progress", label: "Progress", sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <ProgressBar value={r.progress} tone={healthTone(r.health)} height={5} />
          <span className="text-xs tabular-nums shrink-0" style={{ color: C.muted }}>{r.progress}%</span>
        </div>
      ),
    },
    { key: "health", label: "Health", sortable: true, render: (r) => <Badge text={r.health} tone={healthTone(r.health)} /> },
    {
      key: "deadline", label: "Deadline", sortable: true,
      render: (r) => {
        const d = daysUntil(r.deadline);
        return (
          <div className="min-w-0">
            <div className="text-sm">{formatDate(r.deadline)}</div>
            <div className="text-xs" style={{ color: d !== null && d < 0 ? C.red : d !== null && d <= 7 ? C.amber : C.faint }}>
              {dueLabel(r.deadline)}
            </div>
          </div>
        );
      },
    },
    { key: "risk", label: "Risk", sortable: true, secondary: true, render: (r) => <Badge text={r.risk} tone={riskTone(r.risk)} /> },
  ];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Delivery pipeline across every product and service line, with health and budget burn."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/projects/new")}>New project</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Active projects" value={rows.length} icon={FolderKanban} />
        <KpiCard label="At risk" value={atRisk.length} icon={TriangleAlert} accent={C.red} sub="Red health or high risk" />
        <KpiCard label="Due in 14 days" value={dueSoon.length} icon={CalendarClock} accent={C.amber} />
        <KpiCard
          label="Budget used"
          value={budget ? `${Math.round((spent / budget) * 100)}%` : "—"}
          icon={IndianRupee}
          accent={C.blue}
          sub={`${inr(spent)} of ${inr(budget)}`}
        />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by project, code, client or owner…"
          onClear={t.clear}
          filters={[
            { key: "health", label: "All health", value: t.filters.health || "All", options: ["All", "Green", "Amber", "Red"], onChange: (v) => t.setFilter("health", v) },
            { key: "priority", label: "All priorities", value: t.filters.priority || "All", options: ["All", "Urgent", "High", "Medium", "Low"], onChange: (v) => t.setFilter("priority", v) },
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
          onRowClick={(r) => navigate(`/projects/${r.id}`)}
          pagination={t.pagination}
          rowActions={(r) => [
            { label: "View details", icon: Eye, onClick: () => navigate(`/projects/${r.id}`) },
            { label: "Edit project", icon: Pencil, onClick: () => navigate(`/projects/${r.id}/edit`) },
            { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
          ]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={FolderKanban}
              title="No projects yet"
              body="Create your first project to track milestones, budget and delivery health."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/projects/new")}>New project</PrimaryBtn>}
            />
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete project"
        body={`This will permanently remove ${pendingDelete?.name} along with its milestones. This cannot be undone.`}
        confirmLabel="Delete project"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
