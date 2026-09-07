import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, Pencil, Plus, Trash2, Users, Wallet, ShieldAlert } from "lucide-react";
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

const STATUSES = ["All", "Active", "Trial", "Completed", "Churned"];

export default function ClientsListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("clients");
  const { remove } = useStore();
  const { toast } = useSession();
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const industries = React.useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.industry))).sort()],
    [rows],
  );

  const t = useTableState(rows, {
    searchKeys: ["name", "contactName", "city", "product"],
    initialSort: { key: "value", dir: "desc" },
  });

  const active = rows.filter((r) => r.status === "Active");
  const atRisk = rows.filter((r) => r.healthScore < 50);
  const totalValue = rows.reduce((s, r) => s + r.value, 0);

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("clients", pendingDelete.id);
      toast(`${pendingDelete.name} removed`);
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not remove client", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "name", label: "Client", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.name}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.industry} · {r.city}</div>
        </div>
      ),
    },
    {
      key: "contactName", label: "Primary contact",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate" style={{ color: C.text }}>{r.contactName}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.contactRole}</div>
        </div>
      ),
    },
    { key: "product", label: "Engagement", sortable: true, secondary: true },
    { key: "value", label: "Contract value", sortable: true, align: "right", render: (r) => (r.value ? inr(r.value) : "—") },
    {
      key: "healthScore", label: "Health", sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2 min-w-[90px]">
          <ProgressBar value={r.healthScore} tone={r.healthScore >= 70 ? "green" : r.healthScore >= 50 ? "amber" : "red"} height={5} />
          <span className="text-xs tabular-nums" style={{ color: C.muted }}>{r.healthScore}</span>
        </div>
      ),
    },
    { key: "status", label: "Status", sortable: true, render: (r) => <Badge text={r.status} tone={statusTone(r.status)} /> },
    { key: "since", label: "Client since", sortable: true, secondary: true, render: (r) => formatDate(r.since) },
  ];

  return (
    <>
      <PageHeader
        title="Clients"
        description="Every organisation SUH TECH delivers to, with contract value and account health."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/clients/new")}>Add client</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Total clients" value={rows.length} icon={Building2} sub={`${active.length} active`} />
        <KpiCard label="Active accounts" value={active.length} icon={Users} accent={C.green} />
        <KpiCard label="Contract value" value={inr(totalValue)} icon={Wallet} accent={C.blue} sub="Across all accounts" />
        <KpiCard label="At-risk accounts" value={atRisk.length} icon={ShieldAlert} accent={C.red} sub="Health below 50" />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by client, contact or city…"
          onClear={t.clear}
          filters={[
            { key: "status", label: "All statuses", value: t.filters.status || "All", options: STATUSES, onChange: (v) => t.setFilter("status", v) },
            { key: "industry", label: "All industries", value: t.filters.industry || "All", options: industries, onChange: (v) => t.setFilter("industry", v) },
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
          onRowClick={(r) => navigate(`/clients/${r.id}`)}
          pagination={t.pagination}
          rowActions={(r) => [
            { label: "View details", icon: Eye, onClick: () => navigate(`/clients/${r.id}`) },
            { label: "Edit client", icon: Pencil, onClick: () => navigate(`/clients/${r.id}/edit`) },
            { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
          ]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={Building2}
              title="No clients yet"
              body="Add your first client to start tracking contracts, projects and account health."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/clients/new")}>Add client</PrimaryBtn>}
            />
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete client"
        body={`This will permanently remove ${pendingDelete?.name} and unlink it from related records. This cannot be undone.`}
        confirmLabel="Delete client"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
