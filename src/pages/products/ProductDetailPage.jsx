import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { inr, formatDate, healthTone, statusTone, stageTone } from "../../utils";
import {
  PageHeader, Tabs, Card, InfoGrid, ConfirmDialog,
  NotFoundView, ErrorView, EmptyView, Skeleton,
} from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import ProgressBar from "../../components/common/ProgressBar";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove } = useStore();
  const { record: product, status, error, notFound, reload } = useRecord("products", id);
  const [tab, setTab] = React.useState("overview");
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={300} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="product" action={<PrimaryBtn onClick={() => navigate("/products")}>Back to products</PrimaryBtn>} />;
  }

  const clients = data.clients.filter((c) => c.product === product.name);
  const projects = data.projects.filter((p) => p.product === product.name);
  const campaigns = data.campaigns.filter((c) => c.product === product.name);
  const leads = data.leads.filter((l) => l.product === product.name);
  const tickets = data.tickets.filter((t) => t.product === product.name);

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("products", product.id);
      toast(`${product.name} removed`);
      navigate("/products");
    } catch (err) {
      toast(err.message || "Could not remove product", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Products", to: "/products" }, { label: product.name }]}
        title={product.name}
        description={product.tagline}
        meta={
          <>
            <Badge text={product.status} tone={statusTone(product.status)} />
            <Badge text={product.health} tone={healthTone(product.health)} />
            <span className="text-xs" style={{ color: C.faint }}>{product.type} · launched {formatDate(product.launched)}</span>
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/products/${product.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Monthly recurring revenue</div>
          <div className="text-xl font-semibold" style={{ color: C.gold }}>{inr(product.mrr)}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Client accounts</div>
          <div className="text-xl font-semibold">{product.clientCount}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Churn</div>
          <div className="text-xl font-semibold" style={{ color: product.churn > 5 ? C.red : C.green }}>{product.churn}%</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Net promoter score</div>
          <div className="text-xl font-semibold">{product.nps}</div>
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "clients", label: "Clients", count: clients.length },
          { id: "projects", label: "Projects", count: projects.length },
          { id: "marketing", label: "Marketing", count: campaigns.length },
          { id: "support", label: "Support", count: tickets.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card title="About">
              <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>{product.description}</p>
              <InfoGrid
                items={[
                  { label: "Type", value: product.type },
                  { label: "Owner", value: product.owner },
                  { label: "Growth stage", value: product.stage },
                  { label: "Marketing stage", value: product.marketingStage },
                  { label: "Launched", value: formatDate(product.launched) },
                  { label: "Open pipeline", value: `${leads.length} leads` },
                ]}
              />
            </Card>
            {product.techStack?.length > 0 && (
              <Card title="Technology">
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech) => (
                    <span key={tech} className="text-xs rounded-md px-2 py-1" style={{ background: C.track, color: C.muted }}>{tech}</span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <Card title="Pipeline">
            {leads.length ? (
              <ul className="flex flex-col">
                {leads.slice(0, 8).map((l, i) => (
                  <li key={l.id} className="py-2.5" style={{ borderBottom: i < Math.min(leads.length, 8) - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <Link to={`/leads/${l.id}`} className="flex items-center justify-between gap-2">
                      <span className="text-sm truncate" style={{ color: C.text }}>{l.name}</span>
                      <Badge text={l.stage} tone={stageTone(l.stage)} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: C.faint }}>No open leads for this product.</p>
            )}
          </Card>
        </div>
      )}

      {tab === "clients" && (
        <Card title="Clients on this product">
          {clients.length ? (
            <ul className="flex flex-col">
              {clients.map((c, i) => (
                <li key={c.id} className="py-2.5" style={{ borderBottom: i < clients.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/clients/${c.id}`} className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{c.name}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{c.industry} · {c.city}</span>
                    </span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span className="text-sm tabular-nums">{c.value ? inr(c.value) : "—"}</span>
                      <Badge text={c.status} tone={statusTone(c.status)} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No clients yet" body="Clients buying this product will be listed here." />
          )}
        </Card>
      )}

      {tab === "projects" && (
        <Card title="Delivery projects">
          {projects.length ? (
            <ul className="flex flex-col">
              {projects.map((p, i) => (
                <li key={p.id} className="py-2.5" style={{ borderBottom: i < projects.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/projects/${p.id}`} className="flex flex-wrap items-center justify-between gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{p.name}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{p.client} · due {formatDate(p.deadline)}</span>
                    </span>
                    <span className="w-24"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></span>
                    <Badge text={p.health} tone={healthTone(p.health)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No projects" body="Delivery projects for this product will appear here." />
          )}
        </Card>
      )}

      {tab === "marketing" && (
        <Card title="Campaigns">
          {campaigns.length ? (
            <ul className="flex flex-col">
              {campaigns.map((c, i) => (
                <li key={c.id} className="py-2.5" style={{ borderBottom: i < campaigns.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/campaigns/${c.id}`} className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{c.name}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{c.channel} · {c.leads} leads</span>
                    </span>
                    <Badge text={c.status} tone={statusTone(c.status)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No campaigns" body="Marketing campaigns promoting this product will appear here." />
          )}
        </Card>
      )}

      {tab === "support" && (
        <Card title="Support tickets">
          {tickets.length ? (
            <ul className="flex flex-col">
              {tickets.map((t, i) => (
                <li key={t.id} className="py-2.5" style={{ borderBottom: i < tickets.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <Link to={`/support/${t.id}`} className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{t.subject}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{t.client}</span>
                    </span>
                    <Badge text={t.status} tone={statusTone(t.status)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyView title="No tickets" body="Support tickets raised against this product will appear here." />
          )}
        </Card>
      )}

      <ConfirmDialog
        open={confirming}
        title="Delete product"
        body={`This will permanently remove ${product.name} from the portfolio.`}
        confirmLabel="Delete product"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
