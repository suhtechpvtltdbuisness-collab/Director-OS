import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Plus, CircleCheck, CircleAlert, Gauge } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import useTableState from "../../hooks/useTableState";
import { PageHeader, Toolbar, EmptyView, NoResultsView, ErrorView, CardsSkeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import KpiCard from "../../components/common/KpiCard";
import ProgressBar from "../../components/common/ProgressBar";
import Avatar from "../../components/common/Avatar";

export const DEV_STATUSES = ["Available", "Busy", "Blocked", "On Leave"];
export const SENIORITIES = ["Junior", "Mid", "Senior", "Lead"];

const statusTone = (s) => ({ Available: "green", Busy: "blue", Blocked: "red", "On Leave": "gray" }[s] || "gray");
export const workloadTone = (w) => (w >= 90 ? "red" : w >= 75 ? "amber" : "green");

function DevCard({ dev, taskCount, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="text-left rounded-lg p-4 flex flex-col gap-3 h-full transition-colors"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.goldBorder)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <div className="flex items-start gap-3">
        <Avatar name={dev.name} color={dev.avatarColor} size={10} textSize="text-sm" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold truncate" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{dev.name}</h3>
          <p className="text-xs truncate" style={{ color: C.muted }}>{dev.role}</p>
        </div>
        <Badge text={dev.status} tone={statusTone(dev.status)} />
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span style={{ color: C.faint }}>Workload</span>
          <span className="tabular-nums" style={{ color: C.muted }}>{dev.workload}%</span>
        </div>
        <ProgressBar value={dev.workload} tone={workloadTone(dev.workload)} height={5} />
      </div>

      <p className="text-xs line-clamp-2" style={{ color: C.muted }}>{dev.task}</p>

      <div className="flex items-center justify-between gap-2 mt-auto pt-2 text-xs" style={{ borderTop: `1px solid ${C.borderSoft}`, color: C.faint }}>
        <span className="truncate">{dev.location}</span>
        <span className="shrink-0">
          {taskCount} task{taskCount === 1 ? "" : "s"}
          {dev.blockers > 0 && <span style={{ color: C.red }}> · {dev.blockers} blocked</span>}
        </span>
      </div>
    </button>
  );
}

export default function TeamListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("devs");
  const { data } = useStore();

  const t = useTableState(rows, { searchKeys: ["name", "role", "location", "task"], pageSize: 12 });

  const available = rows.filter((r) => r.status === "Available");
  const blocked = rows.filter((r) => r.blockers > 0);
  const avgLoad = rows.length ? Math.round(rows.reduce((s, r) => s + r.workload, 0) / rows.length) : 0;

  return (
    <>
      <PageHeader
        title="Dev Team"
        description="Engineering capacity, current assignments and blockers across the team."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/team/new")}>Add member</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Team size" value={rows.length} icon={Code2} />
        <KpiCard label="Available" value={available.length} icon={CircleCheck} accent={C.green} />
        <KpiCard label="With blockers" value={blocked.length} icon={CircleAlert} accent={C.red} />
        <KpiCard label="Average workload" value={`${avgLoad}%`} icon={Gauge} accent={avgLoad >= 85 ? C.red : C.blue} />
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by name, role or current task…"
          onClear={t.clear}
          filters={[
            { key: "status", label: "All statuses", value: t.filters.status || "All", options: ["All", ...DEV_STATUSES], onChange: (v) => t.setFilter("status", v) },
            { key: "seniority", label: "All levels", value: t.filters.seniority || "All", options: ["All", ...SENIORITIES], onChange: (v) => t.setFilter("seniority", v) },
          ]}
        />
      </div>

      {status === "loading" ? (
        <CardsSkeleton count={6} height={160} />
      ) : status === "error" ? (
        <ErrorView error={error} onRetry={reload} />
      ) : t.rows.length === 0 ? (
        <div className="rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          {t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={Code2}
              title="No team members yet"
              body="Add engineers to track workload, assignments and availability."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/team/new")}>Add member</PrimaryBtn>}
            />
          )}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {t.rows.map((d) => (
            <DevCard
              key={d.id}
              dev={d}
              taskCount={data.tasks.filter((task) => task.assignee === d.name && task.status !== "Done").length}
              onOpen={() => navigate(`/team/${d.id}`)}
            />
          ))}
        </div>
      )}
    </>
  );
}
