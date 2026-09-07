import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, CircleCheck, TriangleAlert } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { inr, formatDate, dueLabel, statusTone } from "../../utils";
import { PageHeader, Card, InfoGrid, ConfirmDialog, NotFoundView, ErrorView, Skeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove, update } = useStore();
  const { record: invoice, status, error, notFound, reload } = useRecord("invoices", id);
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={280} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="invoice" action={<PrimaryBtn onClick={() => navigate("/finance/invoices")}>Back to invoices</PrimaryBtn>} />;
  }

  const client = data.clients.find((c) => c.name === invoice.client);
  const project = data.projects.find((p) => p.name === invoice.project);
  const total = invoice.amount + invoice.tax;

  async function markPaid() {
    try {
      await update("invoices", invoice.id, { status: "Paid", daysOverdue: 0 });
      toast(`${invoice.id} marked as paid`);
    } catch (err) {
      toast(err.message || "Could not update invoice", "red");
    }
  }

  async function escalate() {
    try {
      await update("invoices", invoice.id, { status: "Overdue" });
      toast(`${invoice.id} escalated to the client`, "amber");
    } catch (err) {
      toast(err.message || "Could not escalate invoice", "red");
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("invoices", invoice.id);
      toast(`Invoice ${invoice.id} deleted`);
      navigate("/finance/invoices");
    } catch (err) {
      toast(err.message || "Could not delete invoice", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Finance", to: "/finance" },
          { label: "Invoices", to: "/finance/invoices" },
          { label: invoice.id },
        ]}
        title={invoice.id}
        description={`Billed to ${invoice.client}`}
        meta={
          <>
            <Badge text={invoice.status} tone={statusTone(invoice.status)} />
            <span className="text-xs" style={{ color: invoice.daysOverdue > 0 ? C.red : C.faint }}>
              {invoice.status === "Paid" ? `Issued ${formatDate(invoice.issueDate)}` : `Due ${formatDate(invoice.dueDate)} · ${dueLabel(invoice.dueDate)}`}
            </span>
          </>
        }
        actions={
          <>
            {invoice.status !== "Paid" && <PrimaryBtn icon={CircleCheck} onClick={markPaid}>Mark as paid</PrimaryBtn>}
            {invoice.daysOverdue > 0 && invoice.status !== "Paid" && (
              <GhostBtn icon={TriangleAlert} tone="red" onClick={escalate}>Escalate</GhostBtn>
            )}
            <GhostBtn icon={Pencil} onClick={() => navigate(`/finance/invoices/${invoice.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Amount" className="lg:col-span-2">
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: C.muted }}>Subtotal</span>
              <span className="tabular-nums">{inr(invoice.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: C.muted }}>GST (18%)</span>
              <span className="tabular-nums">{inr(invoice.tax)}</span>
            </div>
            <div
              className="flex items-center justify-between pt-2 mt-1"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <span className="text-sm font-semibold">Total due</span>
              <span className="text-lg font-semibold tabular-nums" style={{ color: C.gold }}>{inr(total)}</span>
            </div>
          </div>

          {invoice.daysOverdue > 0 && invoice.status !== "Paid" && (
            <div
              className="mt-4 rounded-md px-3 py-2.5 flex items-start gap-2 text-sm"
              style={{ background: C.redSoft, border: `1px solid ${C.red}55`, color: C.red }}
            >
              <TriangleAlert size={14} className="shrink-0 mt-0.5" />
              <span>This invoice is {invoice.daysOverdue} days past its due date. Consider escalating with the client.</span>
            </div>
          )}
        </Card>

        <Card title="Details">
          <InfoGrid
            columns={2}
            items={[
              { label: "Client", value: client ? <Link to={`/clients/${client.id}`} className="hover:underline" style={{ color: C.blue }}>{invoice.client}</Link> : invoice.client },
              { label: "Project", value: project ? <Link to={`/projects/${project.id}`} className="hover:underline" style={{ color: C.blue }}>{invoice.project}</Link> : invoice.project || "—" },
              { label: "Issued", value: formatDate(invoice.issueDate) },
              { label: "Due", value: formatDate(invoice.dueDate) },
              { label: "Method", value: invoice.method },
              { label: "Status", value: <Badge text={invoice.status} tone={statusTone(invoice.status)} /> },
            ]}
          />
        </Card>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete invoice"
        body={`This will permanently remove invoice ${invoice.id}.`}
        confirmLabel="Delete invoice"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
