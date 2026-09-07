import React from "react";
import { useNavigate } from "react-router-dom";
import { LifeBuoy, Eye, Pencil, Plus, Trash2, CircleAlert, Clock, CircleCheck } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { formatDate, statusTone, riskTone } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import KpiCard from "../../components/common/KpiCard";

export const TICKET_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
export const TICKET_PRIORITIES = ["Urgent", "High", "Medium", "Low"];
export const TICKET_CATEGORIES = ["Bug", "Incident", "Access", "Feature Request", "Question"];

export const isOpen = (t) => t.status === "Open" || t.status === "In Progress";

export default function SupportListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("tickets");
  const { remove } = useStore();
  const { toast } = useSession();
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const assignees = React.useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.assignee))).sort()], [rows]);

  const t = useTableState(rows, {
    searchKeys: ["id", "subject", "client", "product", "assignee"],
    initialSort: { key: "updated", dir: "desc" },
  });

  const open = rows.filter(isOpen);
  const urgent = rows.filter((r) => r.priority === "Urgent" && isOpen(r));
  const resolved = rows.filter((r) => r.status === "Resolved" || r.status === "Closed");

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("tickets", pendingDelete.id);
      toast(`Ticket ${pendingDelete.id} deleted`);
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not delete ticket", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "subject", label: "Ticket", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.subject}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.id} · {r.client}</div>
        </div>
      ),
    },
    { key: "product", label: "Product", sortable: true, secondary: true },
    { key: "category", label: "Type", sortable: true, secondary: true },
    { key: "priority", label: "Priority", sortable: true, render: (r) => <Badge text={r.priority} tone={riskTone(r.priority)} /> },
    { key: "status", label: "Status", sortable: true, render: (r) => <Badge text={r.status} tone={statusTone(r.status)} /> },
    { key: "assignee", label: "Assignee", sortable: true },
    { key: "updated", label: "Updated", sortable: true, render: (r) => formatDate(r.updated) },
  ];

  return (
    <>
      <PageHeader
        title="Support"
        description="Client-raised tickets across every product, with priority and ownership."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/support/new")}>New ticket</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Open tickets" value={open.length} icon={LifeBuoy} sub={`${rows.length} total`} />
        <KpiCard label="Urgent & open" value={urgent.length} icon={CircleAlert} accent={C.red} />
        <KpiCard label="In progress" value={rows.filter((r) => r.status === "In Progress").length} icon={Clock} accent={C.gold} />
        <KpiCard label="Resolved" value={resolved.length} icon={CircleCheck} accent={C.green} />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by subject, ticket id or client…"
          onClear={t.clear}
          filters={[
            { key: "status", label: "All statuses", value: t.filters.status || "All", options: ["All", ...TICKET_STATUSES], onChange: (v) => t.setFilter("status", v) },
            { key: "priority", label: "All priorities", value: t.filters.priority || "All", options: ["All", ...TICKET_PRIORITIES], onChange: (v) => t.setFilter("priority", v) },
            { key: "assignee", label: "All assignees", value: t.filters.assignee || "All", options: assignees, onChange: (v) => t.setFilter("assignee", v) },
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
          onRowClick={(r) => navigate(`/support/${r.id}`)}
          pagination={t.pagination}
          rowActions={(r) => [
            { label: "View ticket", icon: Eye, onClick: () => navigate(`/support/${r.id}`) },
            { label: "Edit ticket", icon: Pencil, onClick: () => navigate(`/support/${r.id}/edit`) },
            { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
          ]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={LifeBuoy}
              title="No tickets"
              body="Support requests raised by clients will appear here."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/support/new")}>New ticket</PrimaryBtn>}
            />
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete ticket"
        body={`This will permanently remove ticket ${pendingDelete?.id} and its comment history.`}
        confirmLabel="Delete ticket"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
