import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useData } from "../context/DataContext";
import SectionHeader from "../components/common/SectionHeader";
import PrimaryBtn from "../components/common/PrimaryBtn";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectFormModal from "../components/projects/ProjectFormModal";

export default function ProjectsPage({ projects, pushActivity, toast, api }) {
  const { products, devs } = useData();
  const emptyForm = {
    name: "",
    product: products[0]?.name || "",
    owner: devs[0]?.name || "",
    deadline: "",
  };
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function addProject() {
    if (!form.name.trim()) return;
    try {
      const item = await api.addProject(form);
      await pushActivity("Director", `created project '${item.name}'`, "Projects");
      toast("Project created");
      setShowAdd(false);
      setForm(emptyForm);
    } catch (err) {
      toast(err.message || "Failed to create project", "red");
    }
  }

  async function updateProgress(id, progress) {
    try {
      await api.updateProject(id, { progress });
    } catch (err) {
      toast(err.message || "Failed to update progress", "red");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Project Management"
        subtitle="Health, progress, deployment and code status for every active project"
        right={<PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>New Project</PrimaryBtn>}
      />
      <div className="grid grid-cols-1 gap-3">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onUpdateProgress={updateProgress}
          />
        ))}
      </div>
      <ProjectFormModal
        open={showAdd}
        form={form}
        setForm={setForm}
        onClose={() => setShowAdd(false)}
        onSubmit={addProject}
      />
    </div>
  );
}
