import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, CircleCheck, CircleDot, CircleAlert, Circle } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { inr, formatDate, dueLabel, healthTone, riskTone, priorityTone, taskTone, statusTone } from "../../utils";
import {
  PageHeader, Tabs, Card, InfoGrid, Timeline, ConfirmDialog,
  NotFoundView, ErrorView, EmptyView, Skeleton,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import ProgressBar from "../../components/common/ProgressBar";
import Avatar from "../../components/common/Avatar";

const MILESTONE_ICON = { Done: CircleCheck, "In Progress": CircleDot, Blocked: CircleAlert, Pending: Circle };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove } = useStore();
  const { record: project, status, error, notFound, reload } = useRecord("projects", id);
  const [tab, setTab] = React.useState("overview");
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={340} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="project" action={<PrimaryBtn onClick={() => navigate("/projects")}>Back to projects</PrimaryBtn>} />;
  }

  const milestones = data.milestones.filter((m) => m.projectId === project.id);
  const tasks = data.tasks.filter((t) => t.projectId === project.id);
  const team = data.devs.filter((d) => (project.team || []).includes(d.name));
  const client = data.clients.find((c) => c.name === project.client);
  const activity = data.activity.filter((a) => a.action.includes(project.name.split(" ")[0]));
  const documents = data.documents.filter((d) => d.name.includes(project.client.split(" ")[0]));

  const burn = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;
  const doneTasks = tasks.filter((t) => t.status === "Done").length;

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("projects", project.id);
      toast(`${project.name} deleted`);
      navigate("/projects");
    } catch (err) {
      toast(err.message || "Could not delete project", "red");
      setBusy(false);
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "milestones", label: "Milestones", count: milestones.length },
    { id: "tasks", label: "Tasks", count: tasks.length },
    { id: "team", label: "Team", count: team.length },
    { id: "documents", label: "Documents", count: documents.length },
    { id: "activity", label: "Activity", count: activity.length },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Projects", to: "/projects" }, { label: project.name }]}
        title={project.name}
        description={project.description}
        meta={
          <>
            <Badge text={project.health} tone={healthTone(project.health)} />
            <Badge text={`${project.risk} risk`} tone={riskTone(project.risk)} />
            <Badge text={project.priority} tone={priorityTone(project.priority)} />
            <span className="text-xs" style={{ color: C.faint }}>{project.code}</span>
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/projects/${project.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <Card padded={false} className="p-4">
          <div className="text-xs mb-2" style={{ color: C.muted }}>Progress</div>
          <div className="flex items-center gap-2">
            <ProgressBar value={project.progress} tone={healthTone(project.health)} />
            <span className="text-sm font-semibold tabular-nums">{project.progress}%</span>
          </div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-2" style={{ color: C.muted }}>Budget burn</div>
          <div className="flex items-center gap-2">
            <ProgressBar value={Math.min(burn, 100)} tone={burn > 90 ? "red" : burn > 75 ? "amber" : "green"} />
            <span className="text-sm font-semibold tabular-nums">{burn}%</span>
          </div>
          <div className="text-xs mt-1.5" style={{ color: C.faint }}>{inr(project.spent)} of {inr(project.budget)}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Deadline</div>
          <div className="text-base font-semibold">{formatDate(project.deadline)}</div>
          <div className="text-xs mt-0.5" style={{ color: C.faint }}>{dueLabel(project.deadline)}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Tasks complete</div>
          <div className="text-xl font-semibold">{doneTasks}<span className="text-sm" style={{ color: C.faint }}> / {tasks.length}</span></div>
        </Card>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card title="Project details">
              <InfoGrid
                items={[
                  { label: "Client", value: client ? <Link to={`/clients/${client.id}`} className="hover:underline" style={{ color: C.blue }}>{project.client}</Link> : project.client },
                  { label: "Product line", value: project.product },
                  { label: "Owner", value: project.owner },
                  { label: "Start date", value: formatDate(project.startDate) },
                  { label: "Deadline", value: formatDate(project.deadline) },
                  { label: "Deployment", value: <Badge text={project.deployStatus} tone={project.deployStatus === "Production" ? "green" : project.deployStatus === "Staging" ? "blue" : "gray"} /> },
                  { label: "Engineering note", value: project.codeStatus },
                  { label: "Budget", value: inr(project.budget) },
                ]}
              />
            </Card>
          </div>
          <Card title="Upcoming milestones">
            {milestones.filter((m) => m.status !== "Done").length ? (
              <Timeline
                items={milestones.filter((m) => m.status !== "Done").map((m) => ({
                  title: m.name,
                  meta: `${m.owner} · due ${formatDate(m.due)}`,
                  tone: m.status === "Blocked" ? C.red : C.gold,
                }))}
              />
            ) : (
              <p className="text-sm" style={{ color: C.faint }}>All milestones are complete.</p>
            )}
          </Card>
        </div>
      )}

      {tab === "milestones" && (
        <Card title="Milestones">
          {milestones.length ? (
            <ul className="flex flex-col">
              {milestones.map((m, i) => {
                const Icon = MILESTONE_ICON[m.status] || Circle;
                return (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: i < milestones.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} style={{ color: m.status === "Done" ? C.green : m.status === "Blocked" ? C.red : m.status === "In Progress" ? C.gold : C.faint }} className="shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm truncate" style={{ color: C.text }}>{m.name}</div>
                        <div className="text-xs" style={{ color: C.faint }}>{m.owner} · {formatDate(m.due)}</div>
                      </div>
                    </div>
                    <Badge text={m.status} tone={taskTone(m.status)} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyView title="No milestones" body="Break this project into milestones to track delivery against dates." />
          )}
        </Card>
      )}

      {tab === "tasks" && (
        <Card title="Linked tasks">
          {tasks.length ? (
            <ul className="flex flex-col">
              {tasks.map((t, i) => (
                <li key={t.id} className="py-2.5" style={{ borderBottom: i < tasks.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/sprints/${t.id}`} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{t.title}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{t.assignee} · due {formatDate(t.due)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge text={t.priority} tone={priorityTone(t.priority)} />
                      <Badge text={t.status} tone={taskTone(t.status)} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No tasks linked" body="Tasks created on the sprint board for this project will appear here." />
          )}
        </Card>
      )}

      {tab === "team" && (
        <Card title="Project team">
          {team.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {team.map((d) => (
                <Link key={d.id} to={`/team/${d.id}`} className="flex items-center gap-3 rounded-lg p-3" style={{ background: C.panel2, border: `1px solid ${C.border}` }}>
                  <Avatar name={d.name} color={d.avatarColor} size={9} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{d.name}</div>
                    <div className="text-xs truncate" style={{ color: C.faint }}>{d.role}</div>
                  </div>
                  <Badge text={d.status} tone={statusTone(d.status === "Available" ? "Active" : d.status)} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyView title="No team assigned" body="Assign engineers to this project to see workload and availability here." />
          )}
        </Card>
      )}

      {tab === "documents" && (
        <Card title="Documents">
          {documents.length ? (
            <ul className="flex flex-col">
              {documents.map((d, i) => (
                <li key={d.id} className="py-2.5" style={{ borderBottom: i < documents.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/documents/${d.id}`} className="flex items-center justify-between gap-3">
                    <span className="text-sm truncate" style={{ color: C.text }}>{d.name}</span>
                    <span className="text-xs shrink-0" style={{ color: C.faint }}>{d.type} · {d.size}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No documents" body="Specifications and contracts filed against this project will appear here." />
          )}
        </Card>
      )}

      {tab === "activity" && (
        <Card title="Activity">
          <Timeline items={activity.map((a) => ({ title: `${a.actor} ${a.action}`, meta: `${a.area} · ${a.time}` }))} />
        </Card>
      )}

      <ConfirmDialog
        open={confirming}
        title="Delete project"
        body={`This will permanently remove ${project.name} and its milestones. This cannot be undone.`}
        confirmLabel="Delete project"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
