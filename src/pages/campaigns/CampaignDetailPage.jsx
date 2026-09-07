import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { inr, formatDate, statusTone, chartTooltipStyle } from "../../utils";
import { PageHeader, Card, InfoGrid, ConfirmDialog, NotFoundView, ErrorView, Skeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";
import ProgressBar from "../../components/common/ProgressBar";
import { costPerConversion } from "./CampaignsListPage";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove } = useStore();
  const { record: campaign, status, error, notFound, reload } = useRecord("campaigns", id);
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={300} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="campaign" action={<PrimaryBtn onClick={() => navigate("/campaigns")}>Back to marketing</PrimaryBtn>} />;
  }

  const sourcedLeads = data.leads.filter((l) => l.product === campaign.product);
  const burn = campaign.budget ? Math.round((campaign.spend / campaign.budget) * 100) : 0;
  const conversionRate = campaign.leads ? ((campaign.conversions / campaign.leads) * 100).toFixed(1) : "0.0";
  const cpc = costPerConversion(campaign);

  const funnel = [
    { stage: "Spend reach", value: campaign.leads + campaign.conversions * 4, fill: C.blue },
    { stage: "Leads", value: campaign.leads, fill: C.gold },
    { stage: "Conversions", value: campaign.conversions, fill: C.green },
  ];

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("campaigns", campaign.id);
      toast(`${campaign.name} deleted`);
      navigate("/campaigns");
    } catch (err) {
      toast(err.message || "Could not delete campaign", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Marketing", to: "/campaigns" }, { label: campaign.name }]}
        title={campaign.name}
        description={campaign.objective}
        meta={
          <>
            <Badge text={campaign.status} tone={statusTone(campaign.status)} />
            <span className="text-xs" style={{ color: C.faint }}>{campaign.channel} · {campaign.product}</span>
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <Card padded={false} className="p-4">
          <div className="text-xs mb-2" style={{ color: C.muted }}>Budget used</div>
          <div className="flex items-center gap-2">
            <ProgressBar value={Math.min(burn, 100)} tone={burn > 90 ? "red" : burn > 75 ? "amber" : "green"} />
            <span className="text-sm font-semibold tabular-nums">{burn}%</span>
          </div>
          <div className="text-xs mt-1.5" style={{ color: C.faint }}>{inr(campaign.spend)} of {inr(campaign.budget)}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Leads</div>
          <div className="text-xl font-semibold">{campaign.leads}</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Conversion rate</div>
          <div className="text-xl font-semibold">{conversionRate}%</div>
          <div className="text-xs mt-0.5" style={{ color: C.faint }}>{campaign.conversions} converted</div>
        </Card>
        <Card padded={false} className="p-4">
          <div className="text-xs mb-1" style={{ color: C.muted }}>Cost per conversion</div>
          <div className="text-xl font-semibold" style={{ color: cpc && cpc > 15000 ? C.red : C.text }}>
            {cpc === null ? "—" : inr(cpc)}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card title="Funnel">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderSoft} horizontal={false} />
                  <XAxis type="number" stroke={C.faint} fontSize={11} />
                  <YAxis type="category" dataKey="stage" stroke={C.faint} fontSize={11} width={96} />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: C.borderSoft }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={26}>
                    {funnel.map((f) => <Cell key={f.stage} fill={f.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Campaign details">
            <InfoGrid
              items={[
                { label: "Channel", value: campaign.channel },
                { label: "Product", value: campaign.product },
                { label: "Owner", value: campaign.owner },
                { label: "Status", value: <Badge text={campaign.status} tone={statusTone(campaign.status)} /> },
                { label: "Start date", value: formatDate(campaign.start) },
                { label: "End date", value: formatDate(campaign.end) },
              ]}
            />
          </Card>
        </div>

        <Card title={`Related leads (${sourcedLeads.length})`}>
          {sourcedLeads.length ? (
            <ul className="flex flex-col">
              {sourcedLeads.slice(0, 8).map((l, i) => (
                <li key={l.id} className="py-2.5" style={{ borderBottom: i < Math.min(sourcedLeads.length, 8) - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <button onClick={() => navigate(`/leads/${l.id}`)} className="w-full text-left flex items-center justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block text-sm truncate" style={{ color: C.text }}>{l.name}</span>
                      <span className="block text-xs" style={{ color: C.faint }}>{l.stage}</span>
                    </span>
                    <span className="text-sm tabular-nums shrink-0" style={{ color: C.gold }}>{inr(l.value)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: C.faint }}>No leads are attributed to this product yet.</p>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete campaign"
        body={`This will permanently remove ${campaign.name} and its performance history.`}
        confirmLabel="Delete campaign"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
