import React from "react";
import { useNavigate } from "react-router-dom";
import { KanbanSquare, Plus, CircleAlert, CircleCheck, Table2, Columns3, Eye, Pencil, Trash2 } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { formatDate, dueLabel, daysUntil, priorityTone, taskTone } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ErrorView, ConfirmDialog, CardsSkeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import IconBtn from "../../components/common/IconBtn";
import KpiCard from "../../components/common/KpiCard";

export const TASK_STATUSES = ["Backlog", "In Progress", "Review", "Blocked", "Done"];

function TaskCard({ task, onOpen, onDragStart }) {
  const overdue = daysUntil(task.due) < 0 && task.status !== "Done";
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className="rounded-lg p-3 cursor-pointer flex flex-col gap-2 transition-colors"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.goldBorder)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <p className="text-sm leading-snug" style={{ color: C.text }}>{task.title}</p>
      <div className="text-xs" style={{ color: C.faint }}>{task.product}</div>
      <div className="flex items-center justify-between gap-2 pt-1">
        <Badge text={task.priority} tone={priorityTone(task.priority)} />
        <span className="text-[10px]" style={{ color: overdue ? C.red : C.faint }}>{formatDate(task.due)}</span>
      </div>
      <div className="text-[11px] truncate" style={{ color: C.muted }}>{task.assignee}</div>
    </article>
  );
}

export default function SprintBoardPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("tasks");
  const { update, remove } = useStore();
  const { toast } = useSession();
  const [view, setView] = React.useState("board");
  const [dragId, setDragId] = React.useState(null);
  const [overStatus, setOverStatus] = React.useState(null);
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const assignees = React.useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.assignee))).sort()], [rows]);

  const t = useTableState(rows, {
    searchKeys: ["title", "product", "assignee"],
    initialSort: { key: "due", dir: "asc" },
  });

  const done = rows.filter((r) => r.status === "Done");
  const blocked = rows.filter((r) => r.status === "Blocked");
  const overdue = rows.filter((r) => daysUntil(r.due) < 0 && r.status !== "Done");

  async function move(id, newStatus) {
    const task = rows.find((r) => r.id === id);
    if (!task || task.status === newStatus) return;
    try {
      await update("tasks", id, { status: newStatus });
      toast(`Moved to ${newStatus}`);
    } catch (err) {
      toast(err.message || "Could not move task", "red");
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("tasks", pendingDelete.id);
      toast("Task deleted");
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not delete task", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "title", label: "Task", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.title}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.product}</div>
        </div>
      ),
    },
    { key: "assignee", label: "Assignee", sortable: true },
    { key: "priority", label: "Priority", sortable: true, render: (r) => <Badge text={r.priority} tone={priorityTone(r.priority)} /> },
    { key: "status", label: "Status", sortable: true, render: (r) => <Badge text={r.status} tone={taskTone(r.status)} /> },
    {
      key: "due", label: "Due", sortable: true,
      render: (r) => {
        const d = daysUntil(r.due);
        return (
          <div>
            <div className="text-sm">{formatDate(r.due)}</div>
            <div className="text-xs" style={{ color: d < 0 && r.status !== "Done" ? C.red : C.faint }}>{dueLabel(r.due)}</div>
          </div>
        );
      },
    },
    { key: "logged", label: "Logged", sortable: true, align: "right", secondary: true, render: (r) => `${r.logged}h / ${r.estimate}h` },
  ];

  const emptyState = (
    <EmptyView
      icon={KanbanSquare}
      title="No tasks yet"
      body="Create the first task to start planning the sprint."
      action={<PrimaryBtn icon={Plus} onClick={() => navigate("/sprints/new")}>New task</PrimaryBtn>}
    />
  );

  return (
    <>
      <PageHeader
        title="Sprint Board"
        description="Engineering work in flight, grouped by delivery stage."
        actions={
          <>
            <div className="flex items-center gap-1">
              <IconBtn icon={Columns3} label="Board" active={view === "board"} onClick={() => setView("board")} />
              <IconBtn icon={Table2} label="Table" active={view === "table"} onClick={() => setView("table")} />
            </div>
            <PrimaryBtn icon={Plus} onClick={() => navigate("/sprints/new")}>New task</PrimaryBtn>
          </>
        }
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Total tasks" value={rows.length} icon={KanbanSquare} />
        <KpiCard label="Completed" value={done.length} icon={CircleCheck} accent={C.green} sub={rows.length ? `${Math.round((done.length / rows.length) * 100)}% done` : undefined} />
        <KpiCard label="Blocked" value={blocked.length} icon={CircleAlert} accent={C.red} />
        <KpiCard label="Overdue" value={overdue.length} icon={CircleAlert} accent={C.amber} />
      </div>

      {view === "board" ? (
        status === "loading" ? <CardsSkeleton count={5} height={200} /> :
        status === "error" ? <ErrorView error={error} onRetry={reload} /> :
        rows.length === 0 ? (
          <div className="rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}>{emptyState}</div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {TASK_STATUSES.map((s) => {
              const items = rows.filter((r) => r.status === s);
              const isOver = overStatus === s;
              return (
                <section
                  key={s}
                  onDragOver={(e) => { e.preventDefault(); setOverStatus(s); }}
                  onDragLeave={() => setOverStatus((x) => (x === s ? null : x))}
                  onDrop={() => { move(dragId, s); setDragId(null); setOverStatus(null); }}
                  className="shrink-0 w-56 rounded-lg flex flex-col"
                  style={{ background: C.panel2, border: `1px solid ${isOver ? C.goldBorder : C.border}`, minHeight: 220 }}
                >
                  <header className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: taskTone(s) === "gray" ? C.faint : C[taskTone(s)] }} />
                    <span className="text-xs font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{s}</span>
                    <span className="text-[10px] rounded px-1.5 py-0.5 ml-auto" style={{ background: C.track, color: C.muted }}>{items.length}</span>
                  </header>
                  <div className="flex flex-col gap-2 p-2 flex-1">
                    {items.length === 0 ? (
                      <p className="text-xs text-center py-6" style={{ color: C.faint }}>Drop a task here</p>
                    ) : items.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onOpen={() => navigate(`/sprints/${task.id}`)}
                        onDragStart={() => setDragId(task.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <Toolbar
            query={t.query}
            onQuery={t.setQuery}
            placeholder="Search by task, product or assignee…"
            onClear={t.clear}
            filters={[
              { key: "status", label: "All statuses", value: t.filters.status || "All", options: ["All", ...TASK_STATUSES], onChange: (v) => t.setFilter("status", v) },
              { key: "priority", label: "All priorities", value: t.filters.priority || "All", options: ["All", "Urgent", "High", "Medium", "Low"], onChange: (v) => t.setFilter("priority", v) },
              { key: "assignee", label: "All assignees", value: t.filters.assignee || "All", options: assignees, onChange: (v) => t.setFilter("assignee", v) },
            ]}
          />
          <DataTable
            columns={columns}
            rows={t.rows}
            loading={status === "loading"}
            error={status === "error" ? error : null}
            onRetry={reload}
            sort={t.sort}
            onSort={t.toggleSort}
            onRowClick={(r) => navigate(`/sprints/${r.id}`)}
            pagination={t.pagination}
            rowActions={(r) => [
              { label: "View task", icon: Eye, onClick: () => navigate(`/sprints/${r.id}`) },
              { label: "Edit task", icon: Pencil, onClick: () => navigate(`/sprints/${r.id}/edit`) },
              { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
            ]}
            empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : emptyState}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete task"
        body={`This will permanently remove "${pendingDelete?.title}".`}
        confirmLabel="Delete task"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
