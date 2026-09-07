import React from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, Plus, Trash2, Wallet, Clock } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import useForm, { required } from "../../hooks/useForm";
import { inr, formatDate, statusTone } from "../../utils";
import {
  PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog,
  FormField, TextInput, SelectInput,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import KpiCard from "../../components/common/KpiCard";
import Modal from "../../components/common/Modal";

const CATEGORIES = ["Cloud & Infrastructure", "Salaries", "Marketing", "Software Licences", "Office & Admin", "Contractors", "Travel"];

const BLANK = { category: CATEGORIES[0], vendor: "", amount: "", date: new Date().toISOString().slice(0, 10), status: "Pending" };

const validate = (v) => ({
  vendor: required(v.vendor),
  amount: Number(v.amount) > 0 ? undefined : "Enter an amount greater than zero",
});

/**
 * Expenses are simple, single-purpose records, so they are captured in a modal
 * rather than a dedicated page.
 */
export default function ExpensesPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("expenses");
  const { create, remove } = useStore();
  const { toast } = useSession();
  const [adding, setAdding] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const form = useForm(BLANK, validate);
  const t = useTableState(rows, { searchKeys: ["vendor", "category"], initialSort: { key: "date", dir: "desc" } });

  const total = rows.reduce((s, r) => s + r.amount, 0);
  const pending = rows.filter((r) => r.status === "Pending");

  async function addExpense() {
    const ok = await form.submit(async (values) => {
      await create("expenses", { ...values, amount: Number(values.amount) });
      toast("Expense recorded");
      form.setValues(BLANK);
      setAdding(false);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("expenses", pendingDelete.id);
      toast("Expense removed");
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not remove expense", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "vendor", label: "Vendor", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.vendor}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.category}</div>
        </div>
      ),
    },
    { key: "amount", label: "Amount", sortable: true, align: "right", render: (r) => inr(r.amount) },
    { key: "date", label: "Date", sortable: true, render: (r) => formatDate(r.date) },
    { key: "status", label: "Status", sortable: true, render: (r) => <Badge text={r.status} tone={statusTone(r.status)} /> },
  ];

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Expenses" }]}
        title="Expenses"
        description="Operating costs recorded against the business."
        actions={<PrimaryBtn icon={Plus} onClick={() => setAdding(true)}>Record expense</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-3 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Total expenses" value={inr(total)} icon={Receipt} accent={C.blue} />
        <KpiCard label="Awaiting payment" value={pending.length} icon={Clock} accent={C.amber} sub={inr(pending.reduce((s, r) => s + r.amount, 0))} />
        <KpiCard label="Categories" value={new Set(rows.map((r) => r.category)).size} icon={Wallet} />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by vendor or category…"
          onClear={t.clear}
          filters={[
            { key: "status", label: "All statuses", value: t.filters.status || "All", options: ["All", "Paid", "Pending"], onChange: (v) => t.setFilter("status", v) },
            { key: "category", label: "All categories", value: t.filters.category || "All", options: ["All", ...CATEGORIES], onChange: (v) => t.setFilter("category", v) },
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
          pagination={t.pagination}
          rowActions={(r) => [{ label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) }]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={Receipt}
              title="No expenses recorded"
              body="Record operating costs to see them against revenue in the finance overview."
              action={<PrimaryBtn icon={Plus} onClick={() => setAdding(true)}>Record expense</PrimaryBtn>}
            />
          )}
        />
      </div>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Record an expense"
        footer={
          <>
            <GhostBtn onClick={() => setAdding(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={addExpense} disabled={saving}>{saving ? "Saving…" : "Record expense"}</PrimaryBtn>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Vendor" required error={errors.vendor} full>
            <TextInput value={values.vendor} onChange={set("vendor")} placeholder="Amazon Web Services" error={errors.vendor} />
          </FormField>
          <FormField label="Category" full>
            <SelectInput value={values.category} onChange={set("category")} options={CATEGORIES} />
          </FormField>
          <FormField label="Amount (₹)" required error={errors.amount} full>
            <TextInput type="number" min="0" value={values.amount} onChange={set("amount")} placeholder="145000" error={errors.amount} />
          </FormField>
          <FormField label="Date" full>
            <TextInput type="date" value={values.date} onChange={set("date")} />
          </FormField>
          <FormField label="Status" full>
            <SelectInput value={values.status} onChange={set("status")} options={["Pending", "Paid"]} />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove expense"
        body={`This will permanently remove the ${pendingDelete?.vendor} expense.`}
        confirmLabel="Remove expense"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
