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
import { PRODUCT_TYPES, PRODUCT_STATUSES } from "./ProductsListPage";

const BLANK = {
  name: "", type: "SaaS Product", tagline: "", description: "", owner: "",
  status: "Live", health: "Good", stage: "", marketingStage: "",
  mrr: "", clientCount: 0, churn: 0, nps: 0,
  launched: new Date().toISOString().slice(0, 10),
};

const validate = (v) => ({
  name: required(v.name),
  tagline: required(v.tagline),
  owner: required(v.owner),
  mrr: Number(v.mrr) >= 0 ? undefined : "Enter a valid monthly recurring revenue",
});

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("products", id);
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
    return <NotFoundView what="product" action={<PrimaryBtn onClick={() => navigate("/products")}>Back to products</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = {
        ...values,
        mrr: Number(values.mrr) || 0,
        clientCount: Number(values.clientCount) || 0,
        churn: Number(values.churn) || 0,
        nps: Number(values.nps) || 0,
        techStack: values.techStack || [],
      };
      const saved = isEdit ? await update("products", id, payload) : await create("products", payload);
      toast(isEdit ? "Product updated" : "Product created");
      navigate(`/products/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Products", to: "/products" }, { label: isEdit ? values.name || "Edit" : "New product" }]}
        title={isEdit ? `Edit ${values.name}` : "Add a product"}
        description={isEdit ? "Update positioning, ownership and portfolio metrics." : "Add a SaaS product or service line to the portfolio."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Positioning" description="What this line is and who it serves.">
          <FormField label="Name" required error={errors.name}>
            <TextInput value={values.name} onChange={set("name")} placeholder="ORGA HRMS" error={errors.name} />
          </FormField>
          <FormField label="Type">
            <SelectInput value={values.type} onChange={set("type")} options={PRODUCT_TYPES} />
          </FormField>
          <FormField label="Tagline" required error={errors.tagline} full>
            <TextInput value={values.tagline} onChange={set("tagline")} placeholder="End-to-end HR & payroll platform" error={errors.tagline} />
          </FormField>
          <FormField label="Description" full>
            <TextArea value={values.description} onChange={set("description")} placeholder="What the product does and which problem it solves." />
          </FormField>
        </FormSection>

        <FormSection title="Ownership & lifecycle">
          <FormField label="Product owner" required error={errors.owner}>
            <SelectInput value={values.owner} onChange={set("owner")} placeholder="Select an owner" options={devs.map((d) => d.name)} error={errors.owner} />
          </FormField>
          <FormField label="Status">
            <SelectInput value={values.status} onChange={set("status")} options={PRODUCT_STATUSES} />
          </FormField>
          <FormField label="Health">
            <SelectInput value={values.health} onChange={set("health")} options={["Good", "Watch", "At Risk"]} />
          </FormField>
          <FormField label="Growth stage">
            <TextInput value={values.stage} onChange={set("stage")} placeholder="Scaling" />
          </FormField>
          <FormField label="Marketing stage">
            <TextInput value={values.marketingStage} onChange={set("marketingStage")} placeholder="Active ABM" />
          </FormField>
          <FormField label="Launched">
            <TextInput type="date" value={values.launched} onChange={set("launched")} />
          </FormField>
        </FormSection>

        <FormSection title="Portfolio metrics" description="Commercial performance shown across dashboards.">
          <FormField label="Monthly recurring revenue (₹)" required error={errors.mrr}>
            <TextInput type="number" min="0" value={values.mrr} onChange={set("mrr")} placeholder="420000" error={errors.mrr} />
          </FormField>
          <FormField label="Client accounts">
            <TextInput type="number" min="0" value={values.clientCount} onChange={set("clientCount")} />
          </FormField>
          <FormField label="Churn (%)">
            <TextInput type="number" min="0" step="0.1" value={values.churn} onChange={set("churn")} />
          </FormField>
          <FormField label="NPS">
            <TextInput type="number" value={values.nps} onChange={set("nps")} />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/products/${id}` : "/products")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
