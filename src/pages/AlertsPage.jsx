import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, Info, CheckCheck } from "lucide-react";
import { C } from "../constants/theme";
import { useData } from "../context/DataContext";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import IconBtn from "../components/common/IconBtn";
import AlertCard from "../components/alerts/AlertCard";
import EmptyState from "../components/common/EmptyState";

const SEV_FILTERS = ["All", "High", "Medium", "Low"];

export default function AlertsPage({ setTab, api }) {
  const { alerts } = useData();
  const [sevFilter, setSevFilter] = useState("All");

  const sorted = [...alerts].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
  });

  const dismissedCount = alerts.filter((a) => a.dismissed).length;
  const visible = sorted
    .filter((a) => !a.dismissed)
    .filter((a) => sevFilter === "All" || a.severity === sevFilter);

  async function dismiss(id) {
    try {
      await api.dismissAlert(id);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Alerts & Risks"
        subtitle="Everything that needs director attention, ranked by severity"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="High Severity" value={alerts.filter((a) => a.severity === "High" && !a.dismissed).length} icon={AlertTriangle} accent={C.red} />
        <KpiCard label="Medium Severity" value={alerts.filter((a) => a.severity === "Medium" && !a.dismissed).length} icon={ShieldAlert} accent={C.amber} />
        <KpiCard label="Low Severity" value={alerts.filter((a) => a.severity === "Low" && !a.dismissed).length} icon={Info} accent={C.blue} />
        <KpiCard label="Dismissed" value={dismissedCount} icon={CheckCheck} accent={C.green} sub="acknowledged" />
      </div>

      <div className="flex items-center gap-2">
        {SEV_FILTERS.map((s) => (
          <IconBtn key={s} label={s} active={sevFilter === s} onClick={() => setSevFilter(s)} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((a) => (
          <AlertCard key={a.id} alert={a} onNavigate={setTab} onDismiss={() => dismiss(a.id)} />
        ))}
        {visible.length === 0 && <EmptyState text="No alerts in this category" icon={CheckCheck} />}
      </div>
    </div>
  );
}
