import React, { useState } from "react";
import { Plus, CheckSquare, Clock, AlertCircle, LayoutGrid } from "lucide-react";
import { C } from "../constants/theme";
import { PRODUCTS, DEVS } from "../constants/seedData";
import { SPRINT_COLUMNS } from "../constants/labels";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import Select from "../components/common/Select";
import IconBtn from "../components/common/IconBtn";
import PrimaryBtn from "../components/common/PrimaryBtn";
import SprintColumn from "../components/sprints/SprintColumn";
import TaskFormModal from "../components/sprints/TaskFormModal";

const emptyForm = { title: "", product: PRODUCTS[0].name, assignee: DEVS[0].name, priority: "Medium", due: "" };

export default function SprintsPage({ tasks, setTasks, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filterDev, setFilterDev] = useState("All");
  const [form, setForm] = useState(emptyForm);

  function addTask() {
    if (!form.title.trim()) return;
    const t = {
      id: "tk" + Date.now(),
      title: form.title, product: form.product, assignee: form.assignee,
      priority: form.priority, status: "Backlog", due: form.due || "2026-09-15",
    };
    setTasks((ts) => [t, ...ts]);
    pushActivity("Director", `assigned task '${t.title}' to ${t.assignee}`, "Sprint Board");
    toast("Task assigned");
    setShowAdd(false);
    setForm(emptyForm);
  }

  function moveTask(id, status) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function removeTask(id) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    toast("Task removed", "amber");
  }

  const filtered = filterDev === "All" ? tasks : tasks.filter((t) => t.assignee === filterDev);
  const cols = SPRINT_COLUMNS.map((s) => ({ status: s, items: filtered.filter((t) => t.status === s) }));

  const devList = ["All", ...DEVS.map((d) => d.name)];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Tasks" value={tasks.length} icon={LayoutGrid} accent={C.blue} />
        <KpiCard label="Done" value={tasks.filter((t) => t.status === "Done").length} icon={CheckSquare} accent={C.green} />
        <KpiCard label="In Progress" value={tasks.filter((t) => t.status === "In Progress").length} icon={Clock} accent={C.amber} />
        <KpiCard label="Blocked / Backlog" value={tasks.filter((t) => t.status === "Blocked" || t.status === "Backlog").length} icon={AlertCircle} accent={C.red} />
      </div>
      <SectionHeader
        title="Sprint Board"
        subtitle="Assign tasks, track progress and blockers across every developer"
        right={
          <>
            <Select value={filterDev} onChange={(e) => setFilterDev(e.target.value)} style={{ width: 170 }}>
              <option value="All">All developers</option>
              {DEVS.map((d) => <option key={d.id}>{d.name}</option>)}
            </Select>
            <PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>Assign Task</PrimaryBtn>
          </>
        }
      />
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-3 min-w-[1100px] lg:min-w-0">
          {cols.map((col) => (
            <SprintColumn key={col.status} col={col} onRemove={removeTask} onMove={moveTask} />
          ))}
        </div>
      </div>
      <TaskFormModal
        open={showAdd}
        form={form}
        setForm={setForm}
        onClose={() => setShowAdd(false)}
        onSubmit={addTask}
      />
    </div>
  );
}
