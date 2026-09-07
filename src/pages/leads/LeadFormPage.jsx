import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { useCollection, useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useForm, { required, email as isEmail } from "../../hooks/useForm";
import {
  PageHeader, FormSection, FormField, TextInput, TextArea, SelectInput, FormActions,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";

const STAGES = ["New", "Contacted", "Demo", "Proposal", "Negotiation", "Won", "Lost"];
const SOURCES = ["LinkedIn", "Website", "Referral", "Cold Outreach", "Webinar", "Google Ads", "Instagram", "Event"];

const today = () => new Date().toISOString().slice(0, 10);

const BLANK = {
  name: "", contactName: "", email: "", phone: "", product: "", value: "",
  source: "Website", stage: "New", owner: "", notes: "",
  createdAt: today(), updated: today(),
};

const validate = (v) => ({
  name: required(v.name),
  contactName: required(v.contactName),
  email: isEmail(v.email),
  product: required(v.product),
  owner: required(v.owner),
  value: Number(v.value) > 0 ? undefined : "Enter a deal value greater than zero",
});

export default function LeadFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("leads", id);
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
    return <NotFoundView what="lead" action={<PrimaryBtn onClick={() => navigate("/leads")}>Back to leads</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = { ...values, value: Number(values.value) || 0, updated: today() };
      const saved = isEdit ? await update("leads", id, payload) : await create("leads", payload);
      toast(isEdit ? "Lead updated" : "Lead created");
      navigate(`/leads/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "CRM & Leads", to: "/leads" }, { label: isEdit ? values.name || "Edit" : "New lead" }]}
        title={isEdit ? `Edit ${values.name}` : "Add a lead"}
        description={isEdit ? "Update the opportunity, its stage and who owns it." : "Capture a new opportunity and place it in the pipeline."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Company" description="The organisation behind this opportunity.">
          <FormField label="Company name" required error={errors.name}>
            <TextInput value={values.name} onChange={set("name")} placeholder="Ashoka Textiles" error={errors.name} />
          </FormField>
          <FormField label="Interested in" required error={errors.product}>
            <SelectInput value={values.product} onChange={set("product")} placeholder="Select a product" options={products.map((p) => p.name)} error={errors.product} />
          </FormField>
        </FormSection>

        <FormSection title="Contact" description="Who to speak with at the company.">
          <FormField label="Contact name" required error={errors.contactName}>
            <TextInput value={values.contactName} onChange={set("contactName")} placeholder="Manish Agarwal" error={errors.contactName} />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <TextInput type="email" value={values.email} onChange={set("email")} placeholder="manish@ashokatextiles.in" error={errors.email} />
          </FormField>
          <FormField label="Phone">
            <TextInput value={values.phone} onChange={set("phone")} placeholder="+91 90080 22101" />
          </FormField>
          <FormField label="Source">
            <SelectInput value={values.source} onChange={set("source")} options={SOURCES} />
          </FormField>
        </FormSection>

        <FormSection title="Opportunity" description="Value, stage and internal ownership.">
          <FormField label="Deal value (₹)" required error={errors.value}>
            <TextInput type="number" min="0" value={values.value} onChange={set("value")} placeholder="300000" error={errors.value} />
          </FormField>
          <FormField label="Stage">
            <SelectInput value={values.stage} onChange={set("stage")} options={STAGES} />
          </FormField>
          <FormField label="Owner" required error={errors.owner}>
            <SelectInput value={values.owner} onChange={set("owner")} placeholder="Assign an owner" options={devs.map((d) => d.name)} error={errors.owner} />
          </FormField>
          <FormField label="First contacted">
            <TextInput type="date" value={values.createdAt} onChange={set("createdAt")} />
          </FormField>
          <FormField label="Notes" full hint="Context that helps whoever picks this up next.">
            <TextArea value={values.notes} onChange={set("notes")} placeholder="Budget, competitors, timelines, blockers…" />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/leads/${id}` : "/leads")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create lead"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
