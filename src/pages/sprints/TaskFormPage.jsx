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
import { TASK_STATUSES } from "./SprintBoardPage";

const BLANK = {
  title: "", description: "", product: "", projectId: "", assignee: "",
  priority: "Medium", status: "Backlog", due: "", estimate: 8, logged: 0,
};

const validate = (v) => ({
  title: required(v.title),
  product: required(v.product),
  assignee: required(v.assignee),
  due: required(v.due),
  estimate: Number(v.estimate) > 0 ? undefined : "Enter an estimate greater than zero",
});

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("tasks", id);
  const products = useCollection("products").rows;
  const projects = useCollection("projects").rows;
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
    return <NotFoundView what="task" action={<PrimaryBtn onClick={() => navigate("/sprints")}>Back to the board</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = { ...values, estimate: Number(values.estimate) || 0, logged: Number(values.logged) || 0 };
      const saved = isEdit ? await update("tasks", id, payload) : await create("tasks", payload);
      toast(isEdit ? "Task updated" : "Task created");
      navigate(`/sprints/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Sprint Board", to: "/sprints" }, { label: isEdit ? "Edit task" : "New task" }]}
        title={isEdit ? "Edit task" : "New task"}
        description={isEdit ? "Update scope, ownership and effort on this task." : "Add a task to the sprint and assign it to an engineer."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Task" description="What needs doing.">
          <FormField label="Title" required error={errors.title} full>
            <TextInput value={values.title} onChange={set("title")} placeholder="Payroll export module — CSV + Tally sync" error={errors.title} />
          </FormField>
          <FormField label="Description" full>
            <TextArea value={values.description} onChange={set("description")} placeholder="Acceptance criteria and technical notes." />
          </FormField>
          <FormField label="Product" required error={errors.product}>
            <SelectInput value={values.product} onChange={set("product")} placeholder="Select a product" options={products.map((p) => p.name)} error={errors.product} />
          </FormField>
          <FormField label="Project" hint="Links this task to a delivery project.">
            <SelectInput
              value={values.projectId}
              onChange={set("projectId")}
              placeholder="No linked project"
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />
          </FormField>
        </FormSection>

        <FormSection title="Assignment & effort">
          <FormField label="Assignee" required error={errors.assignee}>
            <SelectInput value={values.assignee} onChange={set("assignee")} placeholder="Assign an engineer" options={devs.map((d) => d.name)} error={errors.assignee} />
          </FormField>
          <FormField label="Priority">
            <SelectInput value={values.priority} onChange={set("priority")} options={["Urgent", "High", "Medium", "Low"]} />
          </FormField>
          <FormField label="Status">
            <SelectInput value={values.status} onChange={set("status")} options={TASK_STATUSES} />
          </FormField>
          <FormField label="Due date" required error={errors.due}>
            <TextInput type="date" value={values.due} onChange={set("due")} error={errors.due} />
          </FormField>
          <FormField label="Estimate (hours)" required error={errors.estimate}>
            <TextInput type="number" min="0" value={values.estimate} onChange={set("estimate")} error={errors.estimate} />
          </FormField>
          <FormField label="Logged (hours)">
            <TextInput type="number" min="0" value={values.logged} onChange={set("logged")} />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/sprints/${id}` : "/sprints")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create task"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
