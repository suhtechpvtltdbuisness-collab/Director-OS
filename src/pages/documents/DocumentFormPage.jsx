import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { useCollection, useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useForm, { required } from "../../hooks/useForm";
import {
  PageHeader, FormSection, FormField, TextInput, SelectInput, FormActions,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import { FOLDERS, FILE_TYPES } from "./DocumentsListPage";

const BLANK = {
  name: "", folder: FOLDERS[0], type: "PDF", owner: "", size: "",
  version: "v1.0", updated: new Date().toISOString().slice(0, 10),
};

const validate = (v) => ({
  name: required(v.name),
  owner: required(v.owner),
  version: required(v.version),
});

export default function DocumentFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useSession();
  const { create, update } = useStore();
  const { record, status, error, notFound, reload } = useRecord("documents", id);
  const devs = useCollection("devs").rows;

  const form = useForm(BLANK, validate);
  const { setValues } = form;

  React.useEffect(() => {
    if (isEdit && record) setValues({ ...BLANK, ...record });
  }, [isEdit, record, setValues]);

  if (isEdit && status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={60} /><Skeleton h={240} radius={10} /></div>;
  }
  if (isEdit && status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (isEdit && notFound) {
    return <NotFoundView what="document" action={<PrimaryBtn onClick={() => navigate("/documents")}>Back to documents</PrimaryBtn>} />;
  }

  async function save() {
    const ok = await form.submit(async (values) => {
      const payload = { ...values, size: values.size || "—", updated: new Date().toISOString().slice(0, 10) };
      const saved = isEdit ? await update("documents", id, payload) : await create("documents", payload);
      toast(isEdit ? "Document updated" : "Document added");
      navigate(`/documents/${saved.id}`);
    });
    if (!ok) toast("Please fix the highlighted fields", "red");
  }

  const { values, errors, saving, set } = form;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Documents", to: "/documents" }, { label: isEdit ? values.name || "Edit" : "New document" }]}
        title={isEdit ? "Edit document" : "Add a document"}
        description={isEdit ? "Update where this document lives and who owns it." : "Register a document so the team can find it in one place."}
      />

      <div className="flex flex-col gap-4 max-w-3xl">
        <FormSection title="Document">
          <FormField label="File name" required error={errors.name} full hint="Include the extension, e.g. Nimbus Logistics — MSA.pdf">
            <TextInput value={values.name} onChange={set("name")} placeholder="ORGA HRMS v3 — Functional Spec.pdf" error={errors.name} />
          </FormField>
          <FormField label="Folder">
            <SelectInput value={values.folder} onChange={set("folder")} options={FOLDERS} />
          </FormField>
          <FormField label="File type">
            <SelectInput value={values.type} onChange={set("type")} options={FILE_TYPES} />
          </FormField>
          <FormField label="Owner" required error={errors.owner}>
            <SelectInput value={values.owner} onChange={set("owner")} placeholder="Select an owner" options={["Director", ...devs.map((d) => d.name)]} error={errors.owner} />
          </FormField>
          <FormField label="Version" required error={errors.version}>
            <TextInput value={values.version} onChange={set("version")} placeholder="v1.0" error={errors.version} />
          </FormField>
          <FormField label="Size" hint="Optional, e.g. 2.4 MB">
            <TextInput value={values.size} onChange={set("size")} placeholder="2.4 MB" />
          </FormField>
        </FormSection>

        <FormActions>
          <GhostBtn onClick={() => navigate(isEdit ? `/documents/${id}` : "/documents")}>Cancel</GhostBtn>
          <PrimaryBtn icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add document"}
          </PrimaryBtn>
        </FormActions>
      </div>
    </>
  );
}
