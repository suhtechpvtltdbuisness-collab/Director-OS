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
import { CHANNELS, CAMPAIGN_STATUSES } from "./CampaignsListPage";

const BLANK = {
  name: "", product: "", channel: "LinkedIn", owner: "", objective: "",
  budget: "", spend: 0, leads: 0, conversions: 0,
  status: "Draft", start: new Date().toISOString().slice(0, 10), end: "",
};

const validate = (v) => ({
  name: required(v.name),
  product: required(v.product),
  owner: required(v.owner),
  end: required(v.end),
  budget: Number(v.budget) > 0 ? undefined : "Enter a budget greater than zero",
  dateRange: v.end && v.start && v.end < v.start ? "End date must fall after the start date" : undefined,
  spend: Number(v.spend) > Number(v.budget) ? "Spend cannot exceed the budget" : undefined,
});

export default function CampaignFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("campaigns", id);
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
    return <NotFoundView what="campaign" action={<PrimaryBtn onClick={() => navigate("/campaigns")}>Back to marketing</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = {
        ...values,
        budget: Number(values.budget) || 0,
        spend: Number(values.spend) || 0,
        leads: Number(values.leads) || 0,
        conversions: Number(values.conversions) || 0,
      };
      const saved = isEdit ? await update("campaigns", id, payload) : await create("campaigns", payload);
      toast(isEdit ? "Campaign updated" : "Campaign created");
      navigate(`/campaigns/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Marketing", to: "/campaigns" }, { label: isEdit ? values.name || "Edit" : "New campaign" }]}
        title={isEdit ? `Edit ${values.name}` : "New campaign"}
        description={isEdit ? "Update targeting, budget and recorded performance." : "Set up a campaign with its channel, budget and run dates."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Campaign" description="What is being promoted, and where.">
          <FormField label="Campaign name" required error={errors.name}>
            <TextInput value={values.name} onChange={set("name")} placeholder="ORGA HRMS — Q3 LinkedIn ABM" error={errors.name} />
          </FormField>
          <FormField label="Product / service line" required error={errors.product}>
            <SelectInput value={values.product} onChange={set("product")} placeholder="Select a product" options={products.map((p) => p.name)} error={errors.product} />
          </FormField>
          <FormField label="Channel">
            <SelectInput value={values.channel} onChange={set("channel")} options={CHANNELS} />
          </FormField>
          <FormField label="Owner" required error={errors.owner}>
            <SelectInput value={values.owner} onChange={set("owner")} placeholder="Assign an owner" options={devs.map((d) => d.name)} error={errors.owner} />
          </FormField>
          <FormField label="Objective" full hint="What this campaign is meant to achieve.">
            <TextArea value={values.objective} onChange={set("objective")} rows={3} placeholder="Pipeline generation with HR leaders at mid-market firms." />
          </FormField>
        </FormSection>

        <FormSection title="Schedule & budget">
          <FormField label="Start date">
            <TextInput type="date" value={values.start} onChange={set("start")} />
          </FormField>
          <FormField label="End date" required error={errors.end || errors.dateRange}>
            <TextInput type="date" value={values.end} onChange={set("end")} error={errors.end || errors.dateRange} />
          </FormField>
          <FormField label="Budget (₹)" required error={errors.budget}>
            <TextInput type="number" min="0" value={values.budget} onChange={set("budget")} placeholder="80000" error={errors.budget} />
          </FormField>
          <FormField label="Spend to date (₹)" error={errors.spend}>
            <TextInput type="number" min="0" value={values.spend} onChange={set("spend")} error={errors.spend} />
          </FormField>
          <FormField label="Status">
            <SelectInput value={values.status} onChange={set("status")} options={CAMPAIGN_STATUSES} />
          </FormField>
        </FormSection>

        <FormSection title="Performance" description="Recorded results so far.">
          <FormField label="Leads generated">
            <TextInput type="number" min="0" value={values.leads} onChange={set("leads")} />
          </FormField>
          <FormField label="Conversions">
            <TextInput type="number" min="0" value={values.conversions} onChange={set("conversions")} />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/campaigns/${id}` : "/campaigns")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create campaign"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
