import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { useRecord, useStore, useCollection } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useForm, { required, email as isEmail } from "../../hooks/useForm";
import {
  PageHeader, FormSection, FormField, TextInput, SelectInput, FormActions,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";

const BLANK = {
  name: "", industry: "", city: "", website: "", product: "", accountManager: "",
  status: "Active", value: "", since: new Date().toISOString().slice(0, 10),
  contactName: "", contactRole: "", email: "", phone: "", healthScore: 70,
};

const validate = (v) => ({
  name: required(v.name),
  industry: required(v.industry),
  product: required(v.product),
  contactName: required(v.contactName),
  email: isEmail(v.email),
  value: Number(v.value) >= 0 ? undefined : "Enter a valid contract value",
});

export default function ClientFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("clients", id);
  const products = useCollection("products").rows;
  const devs = useCollection("devs").rows;

  const form = useForm(BLANK, validate);
  const { setValues } = form;

  // Populate the form once the record being edited has loaded.
  React.useEffect(() => {
    if (isEdit && record) setValues({ ...BLANK, ...record });
  }, [isEdit, record, setValues]);

  if (isEdit && status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={60} /><Skeleton h={280} radius={10} /></div>;
  }
  if (isEdit && status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (isEdit && notFound) {
    return <NotFoundView what="client" action={<PrimaryBtn onClick={() => navigate("/clients")}>Back to clients</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = { ...values, value: Number(values.value) || 0, healthScore: Number(values.healthScore) || 0 };
      const saved = isEdit ? await update("clients", id, payload) : await create("clients", payload);
      toast(isEdit ? "Client updated" : "Client created");
      navigate(`/clients/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Clients", to: "/clients" }, { label: isEdit ? values.name || "Edit" : "New client" }]}
        title={isEdit ? `Edit ${values.name}` : "Add a client"}
        description={isEdit ? "Update account details, ownership and commercial terms." : "Create a client record to link projects, invoices and support tickets to."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Company" description="Who the client is and where they operate.">
          <FormField label="Client name" required error={errors.name}>
            <TextInput value={values.name} onChange={set("name")} placeholder="Meridian Retail" error={errors.name} />
          </FormField>
          <FormField label="Industry" required error={errors.industry}>
            <TextInput value={values.industry} onChange={set("industry")} placeholder="Retail" error={errors.industry} />
          </FormField>
          <FormField label="City">
            <TextInput value={values.city} onChange={set("city")} placeholder="Mumbai" />
          </FormField>
          <FormField label="Website">
            <TextInput value={values.website} onChange={set("website")} placeholder="meridianretail.in" />
          </FormField>
        </FormSection>

        <FormSection title="Primary contact" description="The main point of contact for this account.">
          <FormField label="Contact name" required error={errors.contactName}>
            <TextInput value={values.contactName} onChange={set("contactName")} placeholder="Ritu Malhotra" error={errors.contactName} />
          </FormField>
          <FormField label="Role">
            <TextInput value={values.contactRole} onChange={set("contactRole")} placeholder="Head of Digital" />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <TextInput type="email" value={values.email} onChange={set("email")} placeholder="ritu@meridianretail.in" error={errors.email} />
          </FormField>
          <FormField label="Phone">
            <TextInput value={values.phone} onChange={set("phone")} placeholder="+91 99010 44551" />
          </FormField>
        </FormSection>

        <FormSection title="Commercial" description="Engagement, ownership and account standing.">
          <FormField label="Engagement" required error={errors.product} hint="The product or service line this client buys.">
            <SelectInput
              value={values.product}
              onChange={set("product")}
              placeholder="Select an engagement"
              options={products.map((p) => p.name)}
              error={errors.product}
            />
          </FormField>
          <FormField label="Account manager">
            <SelectInput value={values.accountManager} onChange={set("accountManager")} placeholder="Unassigned" options={devs.map((d) => d.name)} />
          </FormField>
          <FormField label="Contract value (₹)" required error={errors.value}>
            <TextInput type="number" min="0" value={values.value} onChange={set("value")} placeholder="600000" error={errors.value} />
          </FormField>
          <FormField label="Status">
            <SelectInput value={values.status} onChange={set("status")} options={["Active", "Trial", "Completed", "Churned"]} />
          </FormField>
          <FormField label="Client since">
            <TextInput type="date" value={values.since} onChange={set("since")} />
          </FormField>
          <FormField label="Health score" hint="0–100. Below 50 flags the account as at risk.">
            <TextInput type="number" min="0" max="100" value={values.healthScore} onChange={set("healthScore")} />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/clients/${id}` : "/clients")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create client"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
