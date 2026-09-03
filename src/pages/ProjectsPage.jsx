import React, { useState } from "react";
import { Plus } from "lucide-react";
import { PRODUCTS, DEVS } from "../constants/seedData";
import SectionHeader from "../components/common/SectionHeader";
import PrimaryBtn from "../components/common/PrimaryBtn";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectFormModal from "../components/projects/ProjectFormModal";

const emptyForm = { name: "", product: PRODUCTS[0].name, owner: DEVS[0].name, deadline: "" };

export default function ProjectsPage({ projects, setProjects, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function addProject() {
    if (!form.name.trim()) return;
    const p = {
      id: "pr" + Date.now(),
      name: form.name, product: form.product, owner: form.owner,
      health: "Green", progress: 0,
      deadline: form.deadline || "2026-10-01",
      deployStatus: "Dev", codeStatus: "Not started", risk: "Low",
    };
    setProjects((ps) => [p, ...ps]);
    pushActivity("Director", `created project '${p.name}'`, "Projects");
    toast("Project created");
    setShowAdd(false);
    setForm(emptyForm);
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
            onUpdateProgress={(id, progress) =>
              setProjects((ps) => ps.map((x) => (x.id === id ? { ...x, progress } : x)))
            }
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
