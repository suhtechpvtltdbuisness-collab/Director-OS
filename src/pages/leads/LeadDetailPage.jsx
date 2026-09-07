import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Pencil, Phone, Trash2, ArrowRight, UserPlus } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { inr, formatDate, stageTone } from "../../utils";
import {
  PageHeader, Tabs, Card, InfoGrid, Timeline, ConfirmDialog,
  NotFoundView, ErrorView, Skeleton, SelectInput,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";

const STAGES = ["New", "Contacted", "Demo", "Proposal", "Negotiation", "Won", "Lost"];
const today = () => new Date().toISOString().slice(0, 10);

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove, update, create } = useStore();
  const { record: lead, status, error, notFound, reload } = useRecord("leads", id);
  const [tab, setTab] = React.useState("overview");
  const [confirming, setConfirming] = React.useState(false);
  const [converting, setConverting] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={300} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="lead" action={<PrimaryBtn onClick={() => navigate("/leads")}>Back to leads</PrimaryBtn>} />;
  }

  const alreadyClient = data.clients.some((c) => c.name === lead.name);
  const stageIndex = STAGES.indexOf(lead.stage);
  const activity = data.activity.filter((a) => a.action.includes(lead.name.split(" ")[0]));

  async function changeStage(stage) {
    try {
      await update("leads", lead.id, { stage, updated: today() });
      toast(`Stage set to ${stage}`);
    } catch (err) {
      toast(err.message || "Could not update stage", "red");
    }
  }

  async function convert() {
    setBusy(true);
    try {
      const client = await create("clients", {
        name: lead.name,
        industry: "—",
        city: "—",
        website: "",
        product: lead.product,
        accountManager: lead.owner,
        status: "Active",
        value: lead.value,
        since: today(),
        contactName: lead.contactName,
        contactRole: "Primary contact",
        email: lead.email,
        phone: lead.phone,
        healthScore: 70,
      });
      await update("leads", lead.id, { stage: "Won", updated: today() });
      toast(`${lead.name} converted to a client`);
      setConverting(false);
      navigate(`/clients/${client.id}`);
    } catch (err) {
      toast(err.message || "Could not convert lead", "red");
      setBusy(false);
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("leads", lead.id);
      toast(`${lead.name} removed`);
      navigate("/leads");
    } catch (err) {
      toast(err.message || "Could not remove lead", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "CRM & Leads", to: "/leads" }, { label: lead.name }]}
        title={lead.name}
        description={`Interested in ${lead.product} · sourced via ${lead.source}`}
        meta={
          <>
            <Badge text={lead.stage} tone={stageTone(lead.stage)} />
            <span className="text-sm font-semibold" style={{ color: C.gold }}>{inr(lead.value)}</span>
            <span className="text-xs" style={{ color: C.faint }}>Updated {formatDate(lead.updated)}</span>
          </>
        }
        actions={
          <>
            {!alreadyClient && lead.stage !== "Lost" && (
              <PrimaryBtn icon={UserPlus} onClick={() => setConverting(true)}>Convert to client</PrimaryBtn>
            )}
            <GhostBtn icon={Pencil} onClick={() => navigate(`/leads/${lead.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      {/* Stage progression */}
      <Card title="Pipeline stage" className="mb-5"
        action={
          <div className="w-40">
            <SelectInput value={lead.stage} onChange={(e) => changeStage(e.target.value)} options={STAGES} />
          </div>
        }
      >
        <div className="flex items-center gap-1 overflow-x-auto">
          {STAGES.filter((s) => s !== "Lost").map((s, i, arr) => {
            const done = stageIndex >= STAGES.indexOf(s) && lead.stage !== "Lost";
            return (
              <React.Fragment key={s}>
                <button
                  onClick={() => changeStage(s)}
                  className="text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors"
                  style={{
                    background: done ? C.goldMuted : "transparent",
                    color: done ? C.gold : C.faint,
                    border: `1px solid ${done ? C.goldBorder : C.border}`,
                    fontWeight: lead.stage === s ? 600 : 500,
                  }}
                >
                  {s}
                </button>
                {i < arr.length - 1 && <ArrowRight size={12} style={{ color: C.faint }} className="shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
        {lead.stage === "Lost" && (
          <p className="text-xs mt-3" style={{ color: C.red }}>This opportunity is marked as lost.</p>
        )}
      </Card>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "notes", label: "Notes" },
          { id: "activity", label: "Activity", count: activity.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card title="Opportunity">
              <InfoGrid
                items={[
                  { label: "Deal value", value: inr(lead.value) },
                  { label: "Interested in", value: lead.product },
                  { label: "Stage", value: <Badge text={lead.stage} tone={stageTone(lead.stage)} /> },
                  { label: "Source", value: lead.source },
                  { label: "Owner", value: lead.owner },
                  { label: "First contacted", value: formatDate(lead.createdAt) },
                ]}
              />
            </Card>
          </div>
          <Card title="Contact">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium">{lead.contactName}</div>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: C.blue }}>
                  <Mail size={13} style={{ color: C.faint }} /> <span className="truncate">{lead.email}</span>
                </a>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: C.blue }}>
                  <Phone size={13} style={{ color: C.faint }} /> {lead.phone}
                </a>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === "notes" && (
        <Card title="Notes">
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: lead.notes ? C.muted : C.faint }}>
            {lead.notes || "No notes recorded for this lead yet."}
          </p>
        </Card>
      )}

      {tab === "activity" && (
        <Card title="Activity">
          <Timeline items={activity.map((a) => ({ title: `${a.actor} ${a.action}`, meta: `${a.area} · ${a.time}` }))} />
        </Card>
      )}

      <ConfirmDialog
        open={converting}
        title="Convert lead to client"
        body={`This creates a client record for ${lead.name} using the contact details on this lead, and marks the opportunity as Won.`}
        confirmLabel="Convert"
        tone="gold"
        busy={busy}
        onConfirm={convert}
        onClose={() => setConverting(false)}
      />
      <ConfirmDialog
        open={confirming}
        title="Delete lead"
        body={`This will permanently remove ${lead.name} from the pipeline.`}
        confirmLabel="Delete lead"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
