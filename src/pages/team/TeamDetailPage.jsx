import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Mail, MapPin, Pencil, Phone, Trash2 } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { formatDate, priorityTone, taskTone, healthTone } from "../../utils";
import {
  PageHeader, Tabs, Card, InfoGrid, ConfirmDialog,
  NotFoundView, ErrorView, EmptyView, Skeleton,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import ProgressBar from "../../components/common/ProgressBar";
import Avatar from "../../components/common/Avatar";
import { workloadTone } from "./TeamListPage";

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove } = useStore();
  const { record: dev, status, error, notFound, reload } = useRecord("devs", id);
  const [tab, setTab] = React.useState("overview");
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={300} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="team member" action={<PrimaryBtn onClick={() => navigate("/team")}>Back to team</PrimaryBtn>} />;
  }

  const tasks = data.tasks.filter((t) => t.assignee === dev.name);
  const openTasks = tasks.filter((t) => t.status !== "Done");
  const projects = data.projects.filter((p) => (p.team || []).includes(dev.name) || p.owner === dev.name);
  const activity = data.activity.filter((a) => a.actor === dev.name);
  const loggedHours = tasks.reduce((s, t) => s + (t.logged || 0), 0);

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("devs", dev.id);
      toast(`${dev.name} removed from the team`);
      navigate("/team");
    } catch (err) {
      toast(err.message || "Could not remove team member", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dev Team", to: "/team" }, { label: dev.name }]}
        title={dev.name}
        description={`${dev.role} · ${dev.seniority}`}
        meta={
          <>
            <Badge text={dev.status} tone={dev.status === "Available" ? "green" : dev.status === "Blocked" ? "red" : dev.status === "Busy" ? "blue" : "gray"} />
            <Badge text={dev.attendance} tone={dev.attendance === "Leave" ? "amber" : "gray"} />
            <span className="text-xs" style={{ color: C.faint }}>Joined {formatDate(dev.joined)}</span>
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/team/${dev.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Remove</GhostBtn>
          </>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <Card padded={false} className="p-4">
          <div className="text-xs mb-2" style={{ color: C.muted }}>Workload</div>
          <div className="flex items-center gap-2">
            <ProgressBar value={dev.workload} tone={workloadTone(dev.workload)} />
            <span className="text-sm font-semibold tabular-nums">{dev.workload}%</span>
          </div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Open tasks</div>
          <div className="text-xl font-semibold">{openTasks.length}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Blockers</div>
          <div className="text-xl font-semibold" style={{ color: dev.blockers > 0 ? C.red : C.text }}>{dev.blockers}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Hours logged</div>
          <div className="text-xl font-semibold">{loggedHours}<span className="text-sm" style={{ color: C.faint }}>h</span></div>
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "tasks", label: "Tasks", count: tasks.length },
          { id: "projects", label: "Projects", count: projects.length },
          { id: "activity", label: "Activity", count: activity.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card title="Current assignment">
              <p className="text-sm mb-4" style={{ color: C.muted }}>{dev.task || "No active assignment."}</p>
              <InfoGrid
                items={[
                  { label: "Role", value: dev.role },
                  { label: "Seniority", value: dev.seniority },
                  { label: "Weekly capacity", value: `${dev.capacity} hours` },
                  { label: "Attendance", value: dev.attendance },
                ]}
              />
            </Card>
            {dev.skills?.length > 0 && (
              <Card title="Skills">
                <div className="flex flex-wrap gap-2">
                  {dev.skills.map((s) => (
                    <span key={s} className="text-xs rounded-md px-2 py-1" style={{ background: C.track, color: C.muted }}>{s}</span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <Card title="Contact">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={dev.name} color={dev.avatarColor} size={11} textSize="text-sm" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{dev.name}</div>
                  <div className="text-xs truncate" style={{ color: C.faint }}>{dev.role}</div>
                </div>
              </div>
              <a href={`mailto:${dev.email}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: C.blue }}>
                <Mail size={13} style={{ color: C.faint }} /> <span className="truncate">{dev.email}</span>
              </a>
              {dev.phone && (
                <a href={`tel:${dev.phone}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: C.blue }}>
                  <Phone size={13} style={{ color: C.faint }} /> {dev.phone}
                </a>
              )}
              <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                <MapPin size={13} style={{ color: C.faint }} /> {dev.location}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === "tasks" && (
        <Card title="Assigned tasks">
          {tasks.length ? (
            <ul className="flex flex-col">
              {tasks.map((t, i) => (
                <li key={t.id} className="py-2.5" style={{ borderBottom: i < tasks.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/sprints/${t.id}`} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{t.title}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{t.product} · due {formatDate(t.due)}</span>
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
            <EmptyView title="No tasks assigned" body="Tasks assigned to this engineer will appear here." />
          )}
        </Card>
      )}

      {tab === "projects" && (
        <Card title="Projects">
          {projects.length ? (
            <ul className="flex flex-col">
              {projects.map((p, i) => (
                <li key={p.id} className="py-2.5" style={{ borderBottom: i < projects.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/projects/${p.id}`} className="flex flex-wrap items-center justify-between gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{p.name}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>
                        {p.owner === dev.name ? "Owner" : "Contributor"} · {p.client}
                      </span>
                    </span>
                    <span className="w-24"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></span>
                    <Badge text={p.health} tone={healthTone(p.health)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No projects" body="Projects this engineer contributes to will appear here." />
          )}
        </Card>
      )}

      {tab === "activity" && (
        <Card title="Recent activity">
          {activity.length ? (
            <ul className="flex flex-col">
              {activity.map((a, i) => (
                <li key={a.id} className="py-2.5 flex items-start justify-between gap-3" style={{ borderBottom: i < activity.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <span className="text-sm" style={{ color: C.muted }}>{a.action}</span>
                  <span className="text-xs shrink-0" style={{ color: C.faint }}>{a.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No recorded activity" body="Actions taken by this engineer will appear here." />
          )}
        </Card>
      )}

      <ConfirmDialog
        open={confirming}
        title="Remove team member"
        body={`This removes ${dev.name} from the team. Their assigned tasks will keep their records but lose this assignee.`}
        confirmLabel="Remove member"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
