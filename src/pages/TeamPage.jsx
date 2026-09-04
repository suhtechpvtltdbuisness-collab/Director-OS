import React from "react";
import { Users, CircleCheck, CircleAlert, Coffee } from "lucide-react";
import { C } from "../constants/theme";
import { useData } from "../context/DataContext";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import WorkloadChart from "../components/team/WorkloadChart";
import AttendancePanel from "../components/team/AttendancePanel";
import DevCard from "../components/team/DevCard";

export default function TeamPage({ tasks }) {
  const { devs } = useData();
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Developer Team" subtitle="Who's working on what, right now" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Team Size" value={devs.length} icon={Users} accent={C.blue} />
        <KpiCard label="Available" value={devs.filter((d) => d.status === "Available").length} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Blocked" value={devs.filter((d) => d.status === "Blocked").length} icon={CircleAlert} accent={C.red} />
        <KpiCard label="On Leave Today" value={devs.filter((d) => d.status === "On Leave").length} icon={Coffee} accent={C.amber} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><WorkloadChart /></div>
        <AttendancePanel />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {devs.map((d) => <DevCard key={d.id} dev={d} tasks={tasks} />)}
      </div>
    </div>
  );
}
