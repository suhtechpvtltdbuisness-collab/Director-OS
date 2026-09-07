import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircleCheck, CircleX, Lock } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { inr, formatDate, statusTone, riskTone } from "../../utils";
import { PageHeader, Card, InfoGrid, ConfirmDialog, NotFoundView, ErrorView, Skeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";

export default function ApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, isDirector } = useSession();
  const { update } = useStore();
  const { record: approval, status, error, notFound, reload } = useRecord("approvals", id);
  const [verdict, setVerdict] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={240} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="request" action={<PrimaryBtn onClick={() => navigate("/approvals")}>Back to approvals</PrimaryBtn>} />;
  }

  async function commit() {
    setBusy(true);
    try {
      await update("approvals", approval.id, { status: verdict });
      toast(`Request ${verdict.toLowerCase()}`, verdict === "Approved" ? "green" : "red");
      setVerdict(null);
    } catch (err) {
      toast(err.message || "Could not record decision", "red");
    } finally {
      setBusy(false);
    }
  }

  const decidable = isDirector && approval.status === "Pending";

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Approvals", to: "/approvals" }, { label: approval.title }]}
        title={approval.title}
        description={`${approval.type} requested by ${approval.requestedBy}`}
        meta={
          <>
            <Badge text={approval.status} tone={statusTone(approval.status)} />
            <Badge text={`${approval.risk} risk`} tone={riskTone(approval.risk)} />
            <span className="text-xs" style={{ color: C.faint }}>Requested {formatDate(approval.requestedAt)}</span>
          </>
        }
        actions={decidable && (
          <>
            <PrimaryBtn icon={CircleCheck} onClick={() => setVerdict("Approved")}>Approve</PrimaryBtn>
            <GhostBtn icon={CircleX} tone="red" onClick={() => setVerdict("Rejected")}>Reject</GhostBtn>
          </>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Request detail" className="lg:col-span-2">
          <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>{approval.detail}</p>
          <InfoGrid
            items={[
              { label: "Type", value: approval.type },
              { label: "Requested by", value: approval.requestedBy },
              { label: "Risk", value: <Badge text={approval.risk} tone={riskTone(approval.risk)} /> },
              { label: "Amount", value: approval.amount ? inr(approval.amount) : "Not applicable" },
            ]}
          />
        </Card>

        <Card title="Decision">
          {approval.status === "Pending" ? (
            isDirector ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm" style={{ color: C.muted }}>
                  This request is awaiting your decision. Approving it releases the action to the requester.
                </p>
                <div className="flex gap-2">
                  <PrimaryBtn icon={CircleCheck} onClick={() => setVerdict("Approved")}>Approve</PrimaryBtn>
                  <GhostBtn icon={CircleX} tone="red" onClick={() => setVerdict("Rejected")}>Reject</GhostBtn>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm" style={{ color: C.gold }}>
                <Lock size={14} className="shrink-0 mt-0.5" />
                <span>Only a director can approve or reject this request.</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              {approval.status === "Approved"
                ? <CircleCheck size={16} style={{ color: C.green }} />
                : <CircleX size={16} style={{ color: C.red }} />}
              <span className="text-sm" style={{ color: C.muted }}>
                This request was {approval.status.toLowerCase()}.
              </span>
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(verdict)}
        title={`${verdict === "Approved" ? "Approve" : "Reject"} request`}
        body={`"${approval.title}" will be marked as ${verdict?.toLowerCase()} and the requester notified.`}
        confirmLabel={verdict === "Approved" ? "Approve" : "Reject"}
        tone={verdict === "Approved" ? "gold" : "red"}
        busy={busy}
        onConfirm={commit}
        onClose={() => setVerdict(null)}
      />
    </>
  );
}
