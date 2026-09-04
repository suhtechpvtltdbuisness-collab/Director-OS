import React, { useState } from "react";
import { Clock, AlertTriangle, CheckSquare, ShieldCheck } from "lucide-react";
import { C } from "../constants/theme";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import ApprovalCard from "../components/approvals/ApprovalCard";
import ApprovalConfirmModal from "../components/approvals/ApprovalConfirmModal";

export default function ApprovalsPage({ approvals, isDirector, pushActivity, toast, api }) {
  const [active, setActive] = useState(null);
  const [decision, setDecision] = useState(null);

  async function decide(id, status) {
    try {
      const item = await api.decideApproval(id, status);
      await pushActivity("Director", `${status.toLowerCase()} — ${item.title}`, "Approvals");
      toast(`${status}: ${item.title}`, status === "Approved" ? "green" : "red");
      setActive(null);
      setDecision(null);
    } catch (err) {
      toast(err.message || "Failed to update approval", "red");
    }
  }

  const pending = approvals.filter((a) => a.status === "Pending");
  const resolved = approvals.filter((a) => a.status !== "Pending");

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Approval Inbox"
        subtitle="High-risk actions wait here — nothing executes without director sign-off"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Pending" value={pending.length} icon={Clock} accent={C.amber} />
        <KpiCard label="High Risk" value={approvals.filter((a) => a.risk === "High" && a.status === "Pending").length} icon={AlertTriangle} accent={C.red} />
        <KpiCard label="Decided" value={resolved.length} icon={CheckSquare} accent={C.green} />
        <KpiCard label="Approved" value={approvals.filter((a) => a.status === "Approved").length} icon={ShieldCheck} accent={C.blue} sub={`${approvals.filter((a) => a.status === "Rejected").length} rejected`} />
      </div>

      <div className="flex flex-col gap-3">
        {pending.map((a) => (
          <ApprovalCard
            key={a.id}
            approval={a}
            isDirector={isDirector}
            onApprove={(ap) => { setActive(ap); setDecision("Approved"); }}
            onReject={(ap) => { setActive(ap); setDecision("Rejected"); }}
          />
        ))}
        {pending.length === 0 && <EmptyState text="No pending approvals" icon={CheckSquare} />}
      </div>

      {resolved.length > 0 && (
        <>
          <div className="text-xs font-semibold mt-2" style={{ color: C.faint }}>Recently decided</div>
          <div className="flex flex-col gap-2">
            {resolved.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between text-sm px-3 py-2 rounded-md"
                style={{ background: C.panel, border: `1px solid ${C.borderSoft}` }}
              >
                <span style={{ color: C.muted }}>{a.title}</span>
                <Badge text={a.status} tone={a.status === "Approved" ? "green" : "red"} />
              </div>
            ))}
          </div>
        </>
      )}

      <ApprovalConfirmModal
        approval={active}
        decision={decision}
        onClose={() => { setActive(null); setDecision(null); }}
        onConfirm={() => decide(active.id, decision)}
      />
    </div>
  );
}
