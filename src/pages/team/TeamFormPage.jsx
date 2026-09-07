import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useForm, { required, email as isEmail } from "../../hooks/useForm";
import {
  PageHeader, FormSection, FormField, TextInput, SelectInput, FormActions,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import { DEV_STATUSES, SENIORITIES } from "./TeamListPage";

const AVATAR_COLORS = [C.blue, C.purple, C.green, C.amber, C.red, C.gold];

const BLANK = {
  name: "", role: "", seniority: "Mid", email: "", phone: "", location: "",
  status: "Available", attendance: "Present", workload: 0, capacity: 40,
  task: "", blockers: 0, skills: [], avatarColor: C.blue,
  joined: new Date().toISOString().slice(0, 10),
};

const validate = (v) => ({
  name: required(v.name),
  role: required(v.role),
  email: isEmail(v.email),
  workload: Number(v.workload) >= 0 && Number(v.workload) <= 100 ? undefined : "Workload must be between 0 and 100",
});

export default function TeamFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("devs", id);

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
    return <NotFoundView what="team member" action={<PrimaryBtn onClick={() => navigate("/team")}>Back to team</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = {
        ...values,
        workload: Number(values.workload) || 0,
        capacity: Number(values.capacity) || 40,
        blockers: Number(values.blockers) || 0,
        skills: typeof values.skills === "string"
          ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : values.skills,
      };
      const saved = isEdit ? await update("devs", id, payload) : await create("devs", payload);
      toast(isEdit ? "Team member updated" : "Team member added");
      navigate(`/team/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;
  const skillsValue = Array.isArray(values.skills) ? values.skills.join(", ") : values.skills;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dev Team", to: "/team" }, { label: isEdit ? values.name || "Edit" : "New member" }]}
        title={isEdit ? `Edit ${values.name}` : "Add a team member"}
        description={isEdit ? "Update role, capacity and current assignment." : "Add an engineer so their workload appears in capacity planning."}
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        <FormSection title="Profile">
          <FormField label="Full name" required error={errors.name}>
            <TextInput value={values.name} onChange={set("name")} placeholder="Rahul Verma" error={errors.name} />
          </FormField>
          <FormField label="Role" required error={errors.role}>
            <TextInput value={values.role} onChange={set("role")} placeholder="Lead Full-Stack Engineer" error={errors.role} />
          </FormField>
          <FormField label="Seniority">
            <SelectInput value={values.seniority} onChange={set("seniority")} options={SENIORITIES} />
          </FormField>
          <FormField label="Joined">
            <TextInput type="date" value={values.joined} onChange={set("joined")} />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <TextInput type="email" value={values.email} onChange={set("email")} placeholder="rahul.verma@suhtech.top" error={errors.email} />
          </FormField>
          <FormField label="Phone">
            <TextInput value={values.phone} onChange={set("phone")} placeholder="+91 98450 11223" />
          </FormField>
          <FormField label="Location" full>
            <TextInput value={values.location} onChange={set("location")} placeholder="Bengaluru or Remote — Pune" />
          </FormField>
        </FormSection>

        <FormSection title="Capacity & assignment" description="Drives the workload view and capacity planning.">
          <FormField label="Status">
            <SelectInput value={values.status} onChange={set("status")} options={DEV_STATUSES} />
          </FormField>
          <FormField label="Attendance">
            <SelectInput value={values.attendance} onChange={set("attendance")} options={["Present", "Remote", "Leave"]} />
          </FormField>
          <FormField label="Workload (%)" required error={errors.workload}>
            <TextInput type="number" min="0" max="100" value={values.workload} onChange={set("workload")} error={errors.workload} />
          </FormField>
          <FormField label="Weekly capacity (hours)">
            <TextInput type="number" min="0" value={values.capacity} onChange={set("capacity")} />
          </FormField>
          <FormField label="Active blockers">
            <TextInput type="number" min="0" value={values.blockers} onChange={set("blockers")} />
          </FormField>
          <FormField label="Avatar colour">
            <SelectInput
              value={values.avatarColor}
              onChange={set("avatarColor")}
              options={AVATAR_COLORS.map((c, i) => ({ value: c, label: ["Blue", "Purple", "Green", "Amber", "Red", "Gold"][i] }))}
            />
          </FormField>
          <FormField label="Current assignment" full>
            <TextInput value={values.task} onChange={set("task")} placeholder="ORGA HRMS v3 — payroll export module" />
          </FormField>
          <FormField label="Skills" full hint="Comma separated, e.g. React, Node.js, PostgreSQL">
            <TextInput value={skillsValue} onChange={set("skills")} placeholder="React, Node.js, PostgreSQL" />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/team/${id}` : "/team")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add member"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
