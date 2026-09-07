import React from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, Eye, Pencil, Plus, Trash2, CircleAlert, Wallet, CircleCheck } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { inr, formatDate, statusTone } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import KpiCard from "../../components/common/KpiCard";

export const INVOICE_STATUSES = ["Draft", "Pending", "Paid", "Overdue"];
export const PAYMENT_METHODS = ["Bank Transfer", "UPI", "Cheque", "Card"];

export default function InvoicesListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("invoices");
  const { remove } = useStore();
  const { toast } = useSession();
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const t = useTableState(rows, {
    searchKeys: ["id", "client", "project"],
    initialSort: { key: "dueDate", dir: "asc" },
  });

  const paid = rows.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
  const pending = rows.filter((r) => r.status === "Pending").reduce((s, r) => s + r.amount, 0);
  const overdue = rows.filter((r) => r.status === "Overdue");

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("invoices", pendingDelete.id);
      toast(`Invoice ${pendingDelete.id} deleted`);
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not delete invoice", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "id", label: "Invoice", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.id}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.client}</div>
        </div>
      ),
    },
    { key: "project", label: "Project", sortable: true, secondary: true },
    { key: "amount", label: "Amount", sortable: true, align: "right", render: (r) => inr(r.amount) },
    { key: "tax", label: "GST", sortable: true, align: "right", secondary: true, render: (r) => inr(r.tax) },
    {
      key: "dueDate", label: "Due", sortable: true,
      render: (r) => (
        <div>
          <div className="text-sm">{formatDate(r.dueDate)}</div>
          {r.daysOverdue > 0 && <div className="text-xs" style={{ color: C.red }}>{r.daysOverdue} days overdue</div>}
        </div>
      ),
    },
    { key: "status", label: "Status", sortable: true, render: (r) => <Badge text={r.status} tone={statusTone(r.status)} /> },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Invoices" }]}
        title="Invoices"
        description="Every invoice raised, with payment status and ageing."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/finance/invoices/new")}>New invoice</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Invoices" value={rows.length} icon={Receipt} />
        <KpiCard label="Collected" value={inr(paid)} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Pending" value={inr(pending)} icon={Wallet} accent={C.amber} />
        <KpiCard label="Overdue" value={overdue.length} icon={CircleAlert} accent={C.red} sub={inr(overdue.reduce((s, r) => s + r.amount, 0))} />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by invoice number, client or project…"
          onClear={t.clear}
          filters={[
            { key: "status", label: "All statuses", value: t.filters.status || "All", options: ["All", ...INVOICE_STATUSES], onChange: (v) => t.setFilter("status", v) },
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
          onRowClick={(r) => navigate(`/finance/invoices/${r.id}`)}
          pagination={t.pagination}
          rowActions={(r) => [
            { label: "View invoice", icon: Eye, onClick: () => navigate(`/finance/invoices/${r.id}`) },
            { label: "Edit invoice", icon: Pencil, onClick: () => navigate(`/finance/invoices/${r.id}/edit`) },
            { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
          ]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={Receipt}
              title="No invoices"
              body="Raise your first invoice to start tracking receivables."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/finance/invoices/new")}>New invoice</PrimaryBtn>}
            />
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete invoice"
        body={`This will permanently remove invoice ${pendingDelete?.id}.`}
        confirmLabel="Delete invoice"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
