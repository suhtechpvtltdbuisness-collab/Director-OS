import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Clock, CircleCheck, CircleX, Lock } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { inr, formatDate, statusTone, riskTone } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog } from "../../components/ui";
import Badge from "../../components/common/Badge";
import KpiCard from "../../components/common/KpiCard";

export const APPROVAL_TYPES = ["Production Deployment", "Discount", "Payment Release", "Hiring"];

export default function ApprovalsListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("approvals");
  const { update } = useStore();
  const { toast, isDirector } = useSession();
  const [decision, setDecision] = React.useState(null); // { approval, verdict }
  const [busy, setBusy] = React.useState(false);

  const t = useTableState(rows, {
    searchKeys: ["title", "requestedBy", "type"],
    initialSort: { key: "requestedAt", dir: "desc" },
  });

  const pending = rows.filter((r) => r.status === "Pending");
  const approved = rows.filter((r) => r.status === "Approved");
  const rejected = rows.filter((r) => r.status === "Rejected");

  async function commit() {
    setBusy(true);
    try {
      await update("approvals", decision.approval.id, { status: decision.verdict });
      toast(`Request ${decision.verdict.toLowerCase()}`, decision.verdict === "Approved" ? "green" : "red");
      setDecision(null);
    } catch (err) {
      toast(err.message || "Could not record decision", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "title", label: "Request", sortable: true, primary: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: C.text }}>{r.title}</div>
          <div className="text-xs truncate" style={{ color: C.faint }}>{r.type} · {r.requestedBy}</div>
        </div>
      ),
    },
    { key: "amount", label: "Amount", sortable: true, align: "right", render: (r) => (r.amount ? inr(r.amount) : "—") },
    { key: "risk", label: "Risk", sortable: true, render: (r) => <Badge text={r.risk} tone={riskTone(r.risk)} /> },
    { key: "status", label: "Status", sortable: true, render: (r) => <Badge text={r.status} tone={statusTone(r.status)} /> },
    { key: "requestedAt", label: "Requested", sortable: true, secondary: true, render: (r) => formatDate(r.requestedAt) },
  ];

  return (
    <>
      <PageHeader
        title="Approvals"
        description="Decisions that require director sign-off before work can proceed."
        meta={!isDirector && (
          <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: C.gold }}>
            <Lock size={12} /> You can view requests but only a director can decide them.
          </span>
        )}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Awaiting decision" value={pending.length} icon={Clock} accent={C.gold} />
        <KpiCard label="Approved" value={approved.length} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Rejected" value={rejected.length} icon={CircleX} accent={C.red} />
        <KpiCard label="Value pending" value={inr(pending.reduce((s, r) => s + (r.amount || 0), 0))} icon={CheckSquare} accent={C.blue} />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by request, type or requester…"
          onClear={t.clear}
          filters={[
            { key: "status", label: "All statuses", value: t.filters.status || "All", options: ["All", "Pending", "Approved", "Rejected"], onChange: (v) => t.setFilter("status", v) },
            { key: "type", label: "All types", value: t.filters.type || "All", options: ["All", ...APPROVAL_TYPES], onChange: (v) => t.setFilter("type", v) },
            { key: "risk", label: "All risk", value: t.filters.risk || "All", options: ["All", "Low", "Medium", "High"], onChange: (v) => t.setFilter("risk", v) },
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
          onRowClick={(r) => navigate(`/approvals/${r.id}`)}
          pagination={t.pagination}
          rowActions={(r) => [
            { label: "Open request", icon: CheckSquare, onClick: () => navigate(`/approvals/${r.id}`) },
            ...(isDirector && r.status === "Pending" ? [
              { label: "Approve", icon: CircleCheck, onClick: () => setDecision({ approval: r, verdict: "Approved" }) },
              { label: "Reject", icon: CircleX, tone: "red", onClick: () => setDecision({ approval: r, verdict: "Rejected" }) },
            ] : []),
          ]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView icon={CheckSquare} title="Nothing to approve" body="Requests needing director sign-off will appear here." />
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(decision)}
        title={`${decision?.verdict === "Approved" ? "Approve" : "Reject"} request`}
        body={`"${decision?.approval.title}" will be marked as ${decision?.verdict.toLowerCase()} and the requester notified.`}
        confirmLabel={decision?.verdict === "Approved" ? "Approve" : "Reject"}
        tone={decision?.verdict === "Approved" ? "gold" : "red"}
        busy={busy}
        onConfirm={commit}
        onClose={() => setDecision(null)}
      />
    </>
  );
}
