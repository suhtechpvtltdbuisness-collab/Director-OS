import React from "react";
import { useNavigate } from "react-router-dom";
import { TriangleAlert, BellOff, ShieldCheck, Filter } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { formatDate, riskTone, toneMap } from "../../utils";
import { PageHeader, Toolbar, Card, EmptyView, NoResultsView, ErrorView, CardsSkeleton } from "../../components/ui";
import useTableState from "../../hooks/useTableState";
import Badge from "../../components/common/Badge";
import GhostBtn from "../../components/common/GhostBtn";
import KpiCard from "../../components/common/KpiCard";

/** Where each alert area links to, so an alert is actionable rather than informational. */
const AREA_ROUTE = {
  Projects: "/projects", Finance: "/finance", Marketing: "/campaigns",
  Team: "/team", Support: "/support", Clients: "/clients", Ops: "/activity",
};

function AlertRow({ alert, onDismiss, onOpen }) {
  const tone = toneMap[riskTone(alert.severity)];
  return (
    <article
      className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-3"
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${tone.fg}`,
        opacity: alert.dismissed ? 0.55 : 1,
      }}
    >
      <div className="rounded-md p-2 shrink-0 self-start" style={{ background: `${tone.fg}1A` }}>
        <TriangleAlert size={16} style={{ color: tone.fg }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{alert.title}</h3>
          <Badge text={alert.severity} tone={riskTone(alert.severity)} />
          <Badge text={alert.area} tone="gray" />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{alert.detail}</p>
        <p className="text-xs mt-1.5" style={{ color: C.faint }}>
          Raised {formatDate(alert.createdAt)} · owned by {alert.owner}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <GhostBtn onClick={onOpen}>Investigate</GhostBtn>
        {!alert.dismissed && <GhostBtn icon={BellOff} onClick={onDismiss}>Dismiss</GhostBtn>}
      </div>
    </article>
  );
}

export default function AlertsPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("alerts");
  const { update } = useStore();
  const { toast } = useSession();
  const [showDismissed, setShowDismissed] = React.useState(false);

  const visible = React.useMemo(
    () => rows.filter((a) => showDismissed || !a.dismissed),
    [rows, showDismissed],
  );

  const t = useTableState(visible, { searchKeys: ["title", "detail", "area", "owner"], pageSize: 20 });

  const active = rows.filter((a) => !a.dismissed);
  const high = active.filter((a) => a.severity === "High");

  async function dismiss(alert) {
    try {
      await update("alerts", alert.id, { dismissed: true });
      toast("Alert dismissed");
    } catch (err) {
      toast(err.message || "Could not dismiss alert", "red");
    }
  }

  return (
    <>
      <PageHeader
        title="Alerts & Risks"
        description="Automated signals that need a decision, ordered by how much they threaten delivery or cash."
        actions={
          <GhostBtn icon={Filter} onClick={() => setShowDismissed((s) => !s)}>
            {showDismissed ? "Hide dismissed" : "Show dismissed"}
          </GhostBtn>
        }
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-3 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Active alerts" value={active.length} icon={TriangleAlert} accent={C.amber} />
        <KpiCard label="High severity" value={high.length} icon={TriangleAlert} accent={C.red} />
        <KpiCard label="Dismissed" value={rows.filter((a) => a.dismissed).length} icon={ShieldCheck} accent={C.green} />
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search alerts by title, area or owner…"
          onClear={t.clear}
          filters={[
            { key: "severity", label: "All severities", value: t.filters.severity || "All", options: ["All", "High", "Medium", "Low"], onChange: (v) => t.setFilter("severity", v) },
            { key: "area", label: "All areas", value: t.filters.area || "All", options: ["All", ...Object.keys(AREA_ROUTE)], onChange: (v) => t.setFilter("area", v) },
          ]}
        />
      </div>

      {status === "loading" ? (
        <CardsSkeleton count={4} height={110} />
      ) : status === "error" ? (
        <ErrorView error={error} onRetry={reload} />
      ) : t.rows.length === 0 ? (
        <Card>
          {t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={ShieldCheck}
              title="No active alerts"
              body="Nothing needs your attention right now. New risks will surface here automatically."
            />
          )}
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {t.rows.map((a) => (
            <AlertRow
              key={a.id}
              alert={a}
              onDismiss={() => dismiss(a)}
              onOpen={() => navigate(AREA_ROUTE[a.area] || "/")}
            />
          ))}
        </div>
      )}
    </>
  );
}
