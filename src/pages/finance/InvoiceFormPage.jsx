import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useForm, { required } from "../../hooks/useForm";
import { inr, daysUntil } from "../../utils";
import {
  PageHeader, FormSection, FormField, TextInput, SelectInput, FormActions,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import { INVOICE_STATUSES, PAYMENT_METHODS } from "./InvoicesListPage";

const today = () => new Date().toISOString().slice(0, 10);
const GST_RATE = 0.18;

const BLANK = {
  id: "", client: "", project: "", amount: "", tax: 0,
  status: "Draft", issueDate: today(), dueDate: "", method: "Bank Transfer", daysOverdue: 0,
};

const validate = (v) => ({
  id: required(v.id),
  client: required(v.client),
  dueDate: required(v.dueDate),
  amount: Number(v.amount) > 0 ? undefined : "Enter an amount greater than zero",
  dateRange: v.dueDate && v.issueDate && v.dueDate < v.issueDate ? "Due date must fall after the issue date" : undefined,
});

export default function InvoiceFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("invoices", id);
  const clients = useCollection("clients").rows;
  const projects = useCollection("projects").rows;

  const form = useForm(BLANK, validate);
  const { setValues } = form;

  React.useEffect(() => {
    if (isEdit && record) setValues({ ...BLANK, ...record });
  }, [isEdit, record, setValues]);

  if (isEdit && status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={60} /><Skeleton h={280} radius={10} /></div>;
  }
  if (isEdit && status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (isEdit && notFound) {
    return <NotFoundView what="invoice" action={<PrimaryBtn onClick={() => navigate("/finance/invoices")}>Back to invoices</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const amount = Number(values.amount) || 0;
      const overdueBy = values.status === "Paid" ? 0 : Math.max(0, -(daysUntil(values.dueDate) ?? 0));
      const payload = {
        ...values,
        amount,
        tax: Math.round(amount * GST_RATE),
        daysOverdue: overdueBy,
        status: values.status !== "Paid" && overdueBy > 0 ? "Overdue" : values.status,
      };
      const saved = isEdit ? await update("invoices", id, payload) : await create("invoices", payload);
      toast(isEdit ? "Invoice updated" : "Invoice created");
      navigate(`/finance/invoices/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;
  const amount = Number(values.amount) || 0;
  const tax = Math.round(amount * GST_RATE);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Invoices", to: "/finance/invoices" }, { label: isEdit ? values.id : "New invoice" }]}
        title={isEdit ? `Edit ${values.id}` : "New invoice"}
        description={isEdit ? "Update amounts, dates and payment status." : "Raise an invoice against a client engagement."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Invoice" description="Who is being billed, and for what.">
          <FormField label="Invoice number" required error={errors.id} hint="Must be unique, e.g. INV-2201.">
            <TextInput value={values.id} onChange={set("id")} placeholder="INV-2220" disabled={isEdit} error={errors.id} />
          </FormField>
          <FormField label="Client" required error={errors.client}>
            <SelectInput value={values.client} onChange={set("client")} placeholder="Select a client" options={clients.map((c) => c.name)} error={errors.client} />
          </FormField>
          <FormField label="Project" full>
            <SelectInput value={values.project} onChange={set("project")} placeholder="Not linked to a project" options={projects.map((p) => p.name)} />
          </FormField>
        </FormSection>

        <FormSection title="Amount & dates">
          <FormField label="Amount before tax (₹)" required error={errors.amount}>
            <TextInput type="number" min="0" value={values.amount} onChange={set("amount")} placeholder="450000" error={errors.amount} />
          </FormField>
          <FormField label="GST (18%)" hint="Calculated automatically from the amount.">
            <div
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: C.panel2, border: `1px solid ${C.border}`, color: C.muted }}
            >
              {inr(tax)} · total {inr(amount + tax)}
            </div>
          </FormField>
          <FormField label="Issue date">
            <TextInput type="date" value={values.issueDate} onChange={set("issueDate")} />
          </FormField>
          <FormField label="Due date" required error={errors.dueDate || errors.dateRange}>
            <TextInput type="date" value={values.dueDate} onChange={set("dueDate")} error={errors.dueDate || errors.dateRange} />
          </FormField>
          <FormField label="Payment method">
            <SelectInput value={values.method} onChange={set("method")} options={PAYMENT_METHODS} />
          </FormField>
          <FormField label="Status" hint="Unpaid invoices past their due date are marked overdue on save.">
            <SelectInput value={values.status} onChange={set("status")} options={INVOICE_STATUSES} />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/finance/invoices/${id}` : "/finance/invoices")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create invoice"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
