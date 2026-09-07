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

const BLANK = {
  name: "", code: "", product: "", client: "", owner: "", description: "",
  startDate: new Date().toISOString().slice(0, 10), deadline: "",
  budget: "", spent: 0, progress: 0,
  priority: "Medium", health: "Green", risk: "Low", deployStatus: "Dev", codeStatus: "",
};

const validate = (v) => ({
  name: required(v.name),
  code: required(v.code),
  product: required(v.product),
  client: required(v.client),
  owner: required(v.owner),
  deadline: required(v.deadline),
  budget: Number(v.budget) > 0 ? undefined : "Enter a budget greater than zero",
  dateRange: v.deadline && v.startDate && v.deadline < v.startDate ? "Deadline must fall after the start date" : undefined,
});

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("projects", id);
  const products = useCollection("products").rows;
  const clients = useCollection("clients").rows;
  const devs = useCollection("devs").rows;

  const form = useForm(BLANK, validate);
  const { setValues } = form;

  React.useEffect(() => {
    if (isEdit && record) setValues({ ...BLANK, ...record });
  }, [isEdit, record, setValues]);

  if (isEdit && status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={60} /><Skeleton h={300} radius={10} /></div>;
  }
  if (isEdit && status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (isEdit && notFound) {
    return <NotFoundView what="project" action={<PrimaryBtn onClick={() => navigate("/projects")}>Back to projects</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = {
        ...values,
        budget: Number(values.budget) || 0,
        spent: Number(values.spent) || 0,
        progress: Math.max(0, Math.min(100, Number(values.progress) || 0)),
        team: values.team || [values.owner].filter(Boolean),
      };
      const saved = isEdit ? await update("projects", id, payload) : await create("projects", payload);
      toast(isEdit ? "Project updated" : "Project created");
      navigate(`/projects/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Projects", to: "/projects" }, { label: isEdit ? values.name || "Edit" : "New project" }]}
        title={isEdit ? `Edit ${values.name}` : "New project"}
        description={isEdit ? "Update scope, ownership, timeline and delivery status." : "Set up a delivery project with its client, owner, timeline and budget."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Basic information" description="What is being delivered and under which product line.">
          <FormField label="Project name" required error={errors.name}>
            <TextInput value={values.name} onChange={set("name")} placeholder="ORGA HRMS v3 Release" error={errors.name} />
          </FormField>
          <FormField label="Project code" required error={errors.code} hint="Short identifier used in reports.">
            <TextInput value={values.code} onChange={set("code")} placeholder="HRMS-V3" error={errors.code} />
          </FormField>
          <FormField label="Product / service line" required error={errors.product}>
            <SelectInput value={values.product} onChange={set("product")} placeholder="Select a product" options={products.map((p) => p.name)} error={errors.product} />
          </FormField>
          <FormField label="Client" required error={errors.client}>
            <SelectInput value={values.client} onChange={set("client")} placeholder="Select a client" options={clients.map((c) => c.name)} error={errors.client} />
          </FormField>
          <FormField label="Description" full hint="A short summary of scope and objectives.">
            <TextArea value={values.description} onChange={set("description")} placeholder="What this project delivers, and for whom." />
          </FormField>
        </FormSection>

        <FormSection title="Ownership & timeline" description="Who is accountable and when it must land.">
          <FormField label="Project owner" required error={errors.owner}>
            <SelectInput value={values.owner} onChange={set("owner")} placeholder="Select an owner" options={devs.map((d) => d.name)} error={errors.owner} />
          </FormField>
          <FormField label="Priority">
            <SelectInput value={values.priority} onChange={set("priority")} options={["Urgent", "High", "Medium", "Low"]} />
          </FormField>
          <FormField label="Start date">
            <TextInput type="date" value={values.startDate} onChange={set("startDate")} />
          </FormField>
          <FormField label="Deadline" required error={errors.deadline || errors.dateRange}>
            <TextInput type="date" value={values.deadline} onChange={set("deadline")} error={errors.deadline || errors.dateRange} />
          </FormField>
        </FormSection>

        <FormSection title="Budget & status" description="Commercials and current delivery signal.">
          <FormField label="Budget (₹)" required error={errors.budget}>
            <TextInput type="number" min="0" value={values.budget} onChange={set("budget")} placeholder="1800000" error={errors.budget} />
          </FormField>
          <FormField label="Spent to date (₹)">
            <TextInput type="number" min="0" value={values.spent} onChange={set("spent")} />
          </FormField>
          <FormField label="Progress (%)">
            <TextInput type="number" min="0" max="100" value={values.progress} onChange={set("progress")} />
          </FormField>
          <FormField label="Health">
            <SelectInput value={values.health} onChange={set("health")} options={["Green", "Amber", "Red"]} />
          </FormField>
          <FormField label="Risk level">
            <SelectInput value={values.risk} onChange={set("risk")} options={["Low", "Medium", "High"]} />
          </FormField>
          <FormField label="Deployment stage">
            <SelectInput value={values.deployStatus} onChange={set("deployStatus")} options={["Dev", "Staging", "Production"]} />
          </FormField>
          <FormField label="Engineering note" full hint="Current blocker or code status shown on the project card.">
            <TextInput value={values.codeStatus} onChange={set("codeStatus")} placeholder="3 PRs open" />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/projects/${id}` : "/projects")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
