import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { formatDate, dueLabel, daysUntil, priorityTone, taskTone } from "../../utils";
import {
  PageHeader, Card, InfoGrid, ConfirmDialog, SelectInput,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import ProgressBar from "../../components/common/ProgressBar";
import Avatar from "../../components/common/Avatar";
import { TASK_STATUSES } from "./SprintBoardPage";

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove, update } = useStore();
  const { record: task, status, error, notFound, reload } = useRecord("tasks", id);
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={280} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="task" action={<PrimaryBtn onClick={() => navigate("/sprints")}>Back to the board</PrimaryBtn>} />;
  }

  const project = data.projects.find((p) => p.id === task.projectId);
  const assignee = data.devs.find((d) => d.name === task.assignee);
  const effort = task.estimate ? Math.round((task.logged / task.estimate) * 100) : 0;
  const overdue = daysUntil(task.due) < 0 && task.status !== "Done";

  async function patch(field, value) {
    try {
      await update("tasks", task.id, { [field]: value });
      toast(`Task ${field} updated`);
    } catch (err) {
      toast(err.message || "Could not update task", "red");
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("tasks", task.id);
      toast("Task deleted");
      navigate("/sprints");
    } catch (err) {
      toast(err.message || "Could not delete task", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Sprint Board", to: "/sprints" }, { label: task.title }]}
        title={task.title}
        description={task.product}
        meta={
          <>
            <Badge text={task.priority} tone={priorityTone(task.priority)} />
            <Badge text={task.status} tone={taskTone(task.status)} />
            <span className="text-xs" style={{ color: overdue ? C.red : C.faint }}>
              Due {formatDate(task.due)} · {dueLabel(task.due)}
            </span>
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/sprints/${task.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card title="Description">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: task.description ? C.muted : C.faint }}>
              {task.description || "No description was provided for this task."}
            </p>
          </Card>

          <Card title="Details">
            <InfoGrid
              items={[
                { label: "Product", value: task.product },
                { label: "Project", value: project ? <Link to={`/projects/${project.id}`} className="hover:underline" style={{ color: C.blue }}>{project.name}</Link> : "Not linked" },
                { label: "Assignee", value: assignee ? <Link to={`/team/${assignee.id}`} className="hover:underline" style={{ color: C.blue }}>{task.assignee}</Link> : task.assignee },
                { label: "Due date", value: formatDate(task.due) },
                { label: "Estimate", value: `${task.estimate} hours` },
                { label: "Logged", value: `${task.logged} hours` },
              ]}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Status">
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium" style={{ color: C.muted }}>Stage</span>
                <SelectInput value={task.status} onChange={(e) => patch("status", e.target.value)} options={TASK_STATUSES} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium" style={{ color: C.muted }}>Priority</span>
                <SelectInput value={task.priority} onChange={(e) => patch("priority", e.target.value)} options={["Urgent", "High", "Medium", "Low"]} />
              </label>
            </div>
          </Card>

          <Card title="Effort">
            <div className="flex items-center gap-2 mb-2">
              <ProgressBar value={Math.min(effort, 100)} tone={effort > 100 ? "red" : effort > 85 ? "amber" : "green"} />
              <span className="text-sm font-semibold tabular-nums">{effort}%</span>
            </div>
            <p className="text-xs" style={{ color: C.faint }}>{task.logged} of {task.estimate} estimated hours logged</p>
          </Card>

          {assignee && (
            <Card title="Assignee">
              <Link to={`/team/${assignee.id}`} className="flex items-center gap-3">
                <Avatar name={assignee.name} color={assignee.avatarColor} size={9} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{assignee.name}</div>
                  <div className="text-xs truncate" style={{ color: C.faint }}>{assignee.role}</div>
                </div>
              </Link>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete task"
        body={`This will permanently remove "${task.title}".`}
        confirmLabel="Delete task"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
