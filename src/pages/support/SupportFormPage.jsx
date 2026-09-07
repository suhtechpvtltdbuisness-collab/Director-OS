import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { useCollection, useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useForm, { required } from "../../hooks/useForm";
import {
  PageHeader, FormSection, FormField, TextInput, TextArea, SelectInput, FormActions,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES } from "./SupportListPage";

const today = () => new Date().toISOString().slice(0, 10);

const BLANK = {
  subject: "", client: "", product: "", category: "Bug", description: "",
  priority: "Medium", status: "Open", assignee: "",
  createdAt: today(), updated: today(),
};

const validate = (v) => ({
  subject: required(v.subject),
  client: required(v.client),
  product: required(v.product),
  description: required(v.description),
  assignee: required(v.assignee),
});

export default function SupportFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("tickets", id);
  const clients = useCollection("clients").rows;
  const products = useCollection("products").rows;
  const devs = useCollection("devs").rows;

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
    return <NotFoundView what="ticket" action={<PrimaryBtn onClick={() => navigate("/support")}>Back to support</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = { ...values, updated: today() };
      const saved = isEdit ? await update("tickets", id, payload) : await create("tickets", payload);
      toast(isEdit ? "Ticket updated" : "Ticket created");
      navigate(`/support/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Support", to: "/support" }, { label: isEdit ? values.subject || "Edit" : "New ticket" }]}
        title={isEdit ? "Edit ticket" : "New ticket"}
        description={isEdit ? "Update the issue, its priority and who is handling it." : "Log a client-reported issue and assign it to an engineer."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Issue" description="What went wrong, and where.">
          <FormField label="Subject" required error={errors.subject} full>
            <TextInput value={values.subject} onChange={set("subject")} placeholder="Payroll export failing for August cycle" error={errors.subject} />
          </FormField>
          <FormField label="Client" required error={errors.client}>
            <SelectInput value={values.client} onChange={set("client")} placeholder="Select a client" options={clients.map((c) => c.name)} error={errors.client} />
          </FormField>
          <FormField label="Product" required error={errors.product}>
            <SelectInput value={values.product} onChange={set("product")} placeholder="Select a product" options={products.map((p) => p.name)} error={errors.product} />
          </FormField>
          <FormField label="Description" required error={errors.description} full hint="Steps to reproduce, affected users and business impact.">
            <TextArea value={values.description} onChange={set("description")} rows={5} placeholder="Describe the issue in enough detail for an engineer to reproduce it." error={errors.description} />
          </FormField>
        </FormSection>

        <FormSection title="Triage" description="Priority, ownership and current state.">
          <FormField label="Category">
            <SelectInput value={values.category} onChange={set("category")} options={TICKET_CATEGORIES} />
          </FormField>
          <FormField label="Priority">
            <SelectInput value={values.priority} onChange={set("priority")} options={TICKET_PRIORITIES} />
          </FormField>
          <FormField label="Assignee" required error={errors.assignee}>
            <SelectInput value={values.assignee} onChange={set("assignee")} placeholder="Assign an engineer" options={devs.map((d) => d.name)} error={errors.assignee} />
          </FormField>
          <FormField label="Status">
            <SelectInput value={values.status} onChange={set("status")} options={TICKET_STATUSES} />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/support/${id}` : "/support")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create ticket"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
