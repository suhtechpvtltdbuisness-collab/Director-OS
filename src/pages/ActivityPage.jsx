import React, { useState } from "react";
import { History, Search } from "lucide-react";
import { C } from "../constants/theme";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import IconBtn from "../components/common/IconBtn";
import Input from "../components/common/Input";
import Panel from "../components/common/Panel";
import EmptyState from "../components/common/EmptyState";
import ActivityItem from "../components/activity/ActivityItem";

export default function ActivityPage({ activity }) {
  const [area, setArea] = useState("All");
  const [q, setQ] = useState("");

  const areas = ["All", ...Array.from(new Set(activity.map((a) => a.area)))];
  const filtered = activity
    .filter((a) => area === "All" || a.area === area)
    .filter((a) => !q || a.action.toLowerCase().includes(q.toLowerCase()) || a.actor.toLowerCase().includes(q.toLowerCase()));

  const actors = Array.from(new Set(activity.map((a) => a.actor)));

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Activity & Audit Log"
        subtitle="A full trail of what happened, who did it, and when"
        right={<Input placeholder="Search activity…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Events" value={activity.length} icon={History} accent={C.blue} />
        <KpiCard label="Areas Covered" value={areas.length - 1} icon={Search} accent={C.purple} />
        <KpiCard label="Active Users" value={actors.length} icon={History} accent={C.green} />
        <KpiCard label="Today's Events" value={filtered.length} icon={History} accent={C.gold} sub={area !== "All" ? `in ${area}` : "all areas"} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {areas.map((a) => <IconBtn key={a} label={a} active={area === a} onClick={() => setArea(a)} />)}
      </div>

      <Panel className="p-0">
        {filtered.map((a, i) => (
          <ActivityItem key={a.id} item={a} showBorder={i < filtered.length - 1} />
        ))}
        {filtered.length === 0 && <EmptyState text="No activity found" icon={History} />}
      </Panel>
    </div>
  );
}
