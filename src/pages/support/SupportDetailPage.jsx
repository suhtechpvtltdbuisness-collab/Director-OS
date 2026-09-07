import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Send, Trash2 } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { formatDate, statusTone, riskTone } from "../../utils";
import {
  PageHeader, Card, InfoGrid, ConfirmDialog, SelectInput, TextArea,
  NotFoundView, ErrorView, Skeleton,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import Avatar from "../../components/common/Avatar";
import { TICKET_STATUSES, TICKET_PRIORITIES } from "./SupportListPage";

const today = () => new Date().toISOString().slice(0, 10);

export default function SupportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, user } = useSession();
  const { data, remove, update, create } = useStore();
  const { record: ticket, status, error, notFound, reload } = useRecord("tickets", id);
  const [comment, setComment] = React.useState("");
  const [posting, setPosting] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={300} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="ticket" action={<PrimaryBtn onClick={() => navigate("/support")}>Back to support</PrimaryBtn>} />;
  }

  const comments = data.ticketComments.filter((c) => c.ticketId === ticket.id);
  const client = data.clients.find((c) => c.name === ticket.client);
  const assignee = data.devs.find((d) => d.name === ticket.assignee);

  async function patch(field, value) {
    try {
      await update("tickets", ticket.id, { [field]: value, updated: today() });
      toast(`Ticket ${field} updated`);
    } catch (err) {
      toast(err.message || "Could not update ticket", "red");
    }
  }

  async function postComment() {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await create("ticketComments", {
        ticketId: ticket.id,
        author: user.name || "Director",
        at: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        body: comment.trim(),
      });
      await update("tickets", ticket.id, { updated: today() });
      setComment("");
      toast("Comment added");
    } catch (err) {
      toast(err.message || "Could not add comment", "red");
    } finally {
      setPosting(false);
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("tickets", ticket.id);
      toast(`Ticket ${ticket.id} deleted`);
      navigate("/support");
    } catch (err) {
      toast(err.message || "Could not delete ticket", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Support", to: "/support" }, { label: ticket.id }]}
        title={ticket.subject}
        description={`${ticket.id} · raised by ${ticket.client} on ${formatDate(ticket.createdAt)}`}
        meta={
          <>
            <Badge text={ticket.priority} tone={riskTone(ticket.priority)} />
            <Badge text={ticket.status} tone={statusTone(ticket.status)} />
            <Badge text={ticket.category} tone="gray" />
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/support/${ticket.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card title="Description">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: C.muted }}>{ticket.description}</p>
          </Card>

          <Card title={`Comments (${comments.length})`}>
            {comments.length ? (
              <ul className="flex flex-col gap-4 mb-4">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <Avatar name={c.author} color={C.blue} size={8} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: C.text }}>{c.author}</span>
                        <span className="text-xs" style={{ color: C.faint }}>{c.at}</span>
                      </div>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: C.muted }}>{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm mb-4" style={{ color: C.faint }}>No comments yet. Add the first update below.</p>
            )}

            <div className="flex flex-col gap-2 pt-3" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Add an update for the client or the team…"
              />
              <div className="flex justify-end">
                <PrimaryBtn icon={Send} onClick={postComment} disabled={posting || !comment.trim()}>
                  {posting ? "Posting…" : "Post comment"}
                </PrimaryBtn>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Triage">
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium" style={{ color: C.muted }}>Status</span>
                <SelectInput value={ticket.status} onChange={(e) => patch("status", e.target.value)} options={TICKET_STATUSES} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium" style={{ color: C.muted }}>Priority</span>
                <SelectInput value={ticket.priority} onChange={(e) => patch("priority", e.target.value)} options={TICKET_PRIORITIES} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium" style={{ color: C.muted }}>Assignee</span>
                <SelectInput value={ticket.assignee} onChange={(e) => patch("assignee", e.target.value)} options={data.devs.map((d) => d.name)} />
              </label>
            </div>
          </Card>

          <Card title="Details">
            <InfoGrid
              columns={2}
              items={[
                { label: "Client", value: client ? <Link to={`/clients/${client.id}`} className="hover:underline" style={{ color: C.blue }}>{ticket.client}</Link> : ticket.client },
                { label: "Product", value: ticket.product },
                { label: "Category", value: ticket.category },
                { label: "Assignee", value: assignee ? <Link to={`/team/${assignee.id}`} className="hover:underline" style={{ color: C.blue }}>{ticket.assignee}</Link> : ticket.assignee },
                { label: "Raised", value: formatDate(ticket.createdAt) },
                { label: "Last updated", value: formatDate(ticket.updated) },
              ]}
            />
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete ticket"
        body={`This will permanently remove ticket ${ticket.id} and its comment history.`}
        confirmLabel="Delete ticket"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
