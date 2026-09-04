import React, { useState } from "react";
import { Plus, CheckSquare, Clock, AlertCircle, LayoutGrid } from "lucide-react";
import { C } from "../constants/theme";
import { useData } from "../context/DataContext";
import { SPRINT_COLUMNS } from "../constants/labels";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import Select from "../components/common/Select";
import PrimaryBtn from "../components/common/PrimaryBtn";
import SprintColumn from "../components/sprints/SprintColumn";
import TaskFormModal from "../components/sprints/TaskFormModal";

export default function SprintsPage({ tasks, pushActivity, toast, api }) {
  const { products, devs } = useData();
  const emptyForm = {
    title: "",
    product: products[0]?.name || "",
    assignee: devs[0]?.name || "",
    priority: "Medium",
    due: "",
  };
  const [showAdd, setShowAdd] = useState(false);
  const [filterDev, setFilterDev] = useState("All");
  const [form, setForm] = useState(emptyForm);

  async function addTask() {
    if (!form.title.trim()) return;
    try {
      const item = await api.addTask(form);
      await pushActivity("Director", `assigned task '${item.title}' to ${item.assignee}`, "Sprint Board");
      toast("Task assigned");
      setShowAdd(false);
      setForm(emptyForm);
    } catch (err) {
      toast(err.message || "Failed to assign task", "red");
    }
  }

  async function moveTask(id, status) {
    try {
      await api.moveTask(id, status);
    } catch (err) {
      toast(err.message || "Failed to move task", "red");
    }
  }

  async function removeTask(id) {
    try {
      await api.removeTask(id);
      toast("Task removed", "amber");
    } catch (err) {
      toast(err.message || "Failed to remove task", "red");
    }
  }

  const filtered = filterDev === "All" ? tasks : tasks.filter((t) => t.assignee === filterDev);
  const cols = SPRINT_COLUMNS.map((s) => ({ status: s, items: filtered.filter((t) => t.status === s) }));

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
              {devs.map((d) => <option key={d.id}>{d.name}</option>)}
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
