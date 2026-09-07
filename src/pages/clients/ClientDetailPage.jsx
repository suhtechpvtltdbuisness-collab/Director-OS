import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Globe, Mail, Pencil, Phone, Trash2, MapPin } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { inr, formatDate, statusTone, healthTone, riskTone } from "../../utils";
import {
  PageHeader, Tabs, Card, InfoGrid, Timeline, ConfirmDialog,
  NotFoundView, ErrorView, EmptyView, Skeleton,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import ProgressBar from "../../components/common/ProgressBar";

/** Compact linked list used by the related-records tabs. */
function RelatedList({ items, empty, renderItem }) {
  if (!items.length) return <p className="text-sm py-2" style={{ color: C.faint }}>{empty}</p>;
  return (
    <ul className="flex flex-col">
      {items.map((it, i) => (
        <li key={it.id} className="py-2.5" style={{ borderBottom: i < items.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
          {renderItem(it)}
        </li>
      ))}
    </ul>
  );
}

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove } = useStore();
  const { record: client, status, error, notFound, reload } = useRecord("clients", id);
  const [tab, setTab] = React.useState("overview");
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={340} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="client" action={<PrimaryBtn onClick={() => navigate("/clients")}>Back to clients</PrimaryBtn>} />;
  }

  const projects = data.projects.filter((p) => p.client === client.name);
  const invoices = data.invoices.filter((i) => i.client === client.name);
  const tickets = data.tickets.filter((t) => t.client === client.name);
  const documents = data.documents.filter((d) => d.name.includes(client.name.split(" ")[0]));
  const activity = data.activity.filter((a) => a.action.includes(client.name.split(" ")[0]));

  const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("clients", client.id);
      toast(`${client.name} removed`);
      navigate("/clients");
    } catch (err) {
      toast(err.message || "Could not remove client", "red");
      setBusy(false);
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects", count: projects.length },
    { id: "invoices", label: "Invoices", count: invoices.length },
    { id: "tickets", label: "Support", count: tickets.length },
    { id: "documents", label: "Documents", count: documents.length },
    { id: "activity", label: "Activity", count: activity.length },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Clients", to: "/clients" }, { label: client.name }]}
        title={client.name}
        description={`${client.industry} · ${client.city}`}
        meta={
          <>
            <Badge text={client.status} tone={statusTone(client.status)} />
            <span className="text-xs" style={{ color: C.faint }}>Client since {formatDate(client.since)}</span>
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/clients/${client.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Contract value</div>
          <div className="text-xl font-semibold">{client.value ? inr(client.value) : "—"}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Outstanding</div>
          <div className="text-xl font-semibold" style={{ color: outstanding > 0 ? C.amber : C.text }}>
            {outstanding ? inr(outstanding) : "—"}
          </div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Open tickets</div>
          <div className="text-xl font-semibold">{tickets.filter((t) => t.status !== "Closed" && t.status !== "Resolved").length}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-2" style={{ color: C.muted }}>Account health</div>
          <div className="flex items-center gap-2">
            <ProgressBar value={client.healthScore} tone={client.healthScore >= 70 ? "green" : client.healthScore >= 50 ? "amber" : "red"} />
            <span className="text-sm font-semibold tabular-nums">{client.healthScore}</span>
          </div>
        </Card>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card title="Account details">
              <InfoGrid
                items={[
                  { label: "Engagement", value: client.product },
                  { label: "Account manager", value: client.accountManager },
                  { label: "Industry", value: client.industry },
                  { label: "Status", value: <Badge text={client.status} tone={statusTone(client.status)} /> },
                  { label: "Client since", value: formatDate(client.since) },
                  { label: "Contract value", value: client.value ? inr(client.value) : "—" },
                ]}
              />
            </Card>
            <Card title="Delivery snapshot">
              <RelatedList
                items={projects}
                empty="No projects are running for this client."
                renderItem={(p) => (
                  <Link to={`/projects/${p.id}`} className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{p.name}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{p.progress}% · due {formatDate(p.deadline)}</span>
                    </span>
                    <Badge text={p.health} tone={healthTone(p.health)} />
                  </Link>
                )}
              />
            </Card>
          </div>

          <Card title="Primary contact">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-sm font-medium">{client.contactName}</div>
                <div className="text-xs" style={{ color: C.faint }}>{client.contactRole}</div>
              </div>
              {[
                { icon: Mail, value: client.email, href: `mailto:${client.email}` },
                { icon: Phone, value: client.phone, href: `tel:${client.phone}` },
                { icon: Globe, value: client.website, href: `https://${client.website}` },
                { icon: MapPin, value: client.city },
              ].filter((r) => r.value).map((r) => (
                <div key={r.value} className="flex items-center gap-2 text-sm min-w-0">
                  <r.icon size={13} style={{ color: C.faint }} className="shrink-0" />
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noreferrer" className="truncate hover:underline" style={{ color: C.blue }}>{r.value}</a>
                  ) : (
                    <span className="truncate" style={{ color: C.muted }}>{r.value}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "projects" && (
        <Card title="Projects">
          <RelatedList
            items={projects}
            empty="No projects are linked to this client yet."
            renderItem={(p) => (
              <Link to={`/projects/${p.id}`} className="flex flex-wrap items-center justify-between gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm truncate" style={{ color: C.text }}>{p.name}</span>
                  <span className="block text-xs" style={{ color: C.faint }}>{p.owner} · due {formatDate(p.deadline)}</span>
                </span>
                <span className="w-28"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></span>
                <Badge text={p.health} tone={healthTone(p.health)} />
              </Link>
            )}
          />
        </Card>
      )}

      {tab === "invoices" && (
        <Card title="Invoices">
          <RelatedList
            items={invoices}
            empty="No invoices have been raised for this client."
            renderItem={(i) => (
              <Link to={`/finance/invoices/${i.id}`} className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-sm" style={{ color: C.text }}>{i.id}</span>
                  <span className="block text-xs" style={{ color: C.faint }}>Due {formatDate(i.dueDate)}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm tabular-nums">{inr(i.amount)}</span>
                  <Badge text={i.status} tone={statusTone(i.status)} />
                </span>
              </Link>
            )}
          />
        </Card>
      )}

      {tab === "tickets" && (
        <Card title="Support tickets">
          <RelatedList
            items={tickets}
            empty="This client has not raised any support tickets."
            renderItem={(t) => (
              <Link to={`/support/${t.id}`} className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-sm truncate" style={{ color: C.text }}>{t.subject}</span>
                  <span className="block text-xs" style={{ color: C.faint }}>{t.id} · {formatDate(t.updated)}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <Badge text={t.priority} tone={riskTone(t.priority)} />
                  <Badge text={t.status} tone={statusTone(t.status)} />
                </span>
              </Link>
            )}
          />
        </Card>
      )}

      {tab === "documents" && (
        <Card title="Documents">
          {documents.length ? (
            <RelatedList
              items={documents}
              empty=""
              renderItem={(d) => (
                <Link to={`/documents/${d.id}`} className="flex items-center justify-between gap-3">
                  <span className="text-sm truncate" style={{ color: C.text }}>{d.name}</span>
                  <span className="text-xs shrink-0" style={{ color: C.faint }}>{d.type} · {d.size}</span>
                </Link>
              )}
            />
          ) : (
            <EmptyView title="No documents" body="Contracts and statements of work filed against this client will appear here." />
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
        title="Delete client"
        body={`This will permanently remove ${client.name}. Linked projects and invoices will keep their records but lose this account link.`}
        confirmLabel="Delete client"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
