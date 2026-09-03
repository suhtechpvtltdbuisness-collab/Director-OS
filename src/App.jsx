import React, { useState, useMemo, useEffect } from "react";
import {
  PRODUCTS, DEVS, PROJECTS, CLIENTS,
  INIT_LEADS, INIT_CAMPAIGNS, INIT_TICKETS, INVOICES,
  INIT_APPROVALS, ALERTS, INIT_ACTIVITY, INIT_TASKS,
} from "./constants";
import { riskTone } from "./utils";
import { AppShell } from "./components/layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import MarketingPage from "./pages/MarketingPage";
import CrmPage from "./pages/CrmPage";
import TeamPage from "./pages/TeamPage";
import SprintsPage from "./pages/SprintsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ClientsPage from "./pages/ClientsPage";
import SupportPage from "./pages/SupportPage";
import FinancePage from "./pages/FinancePage";
import ApprovalsPage from "./pages/ApprovalsPage";
import AlertsPage from "./pages/AlertsPage";
import ActivityPage from "./pages/ActivityPage";
import DocumentsPage from "./pages/DocumentsPage";
import AssistantPage from "./pages/AssistantPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);

  // Entities
  const [leads, setLeads] = useState(INIT_LEADS);
  const [campaigns, setCampaigns] = useState(INIT_CAMPAIGNS);
  const [tickets, setTickets] = useState(INIT_TICKETS);
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [approvals, setApprovals] = useState(INIT_APPROVALS);
  const [activity, setActivity] = useState(INIT_ACTIVITY);
  const [projects, setProjects] = useState(PROJECTS);

  // Search
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const isDirector = user?.role === "director";
  const pendingApprovalsCount = approvals.filter((a) => a.status === "Pending").length;

  function pushActivity(actor, action, area) {
    setActivity((a) => [
      {
        id: "ac" + Date.now(),
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        actor, action, area,
      },
      ...a,
    ]);
  }

  function toast(msg, tone = "green") {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    const res = [];
    PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).forEach((p) => res.push({ kind: "Product", label: p.name, tab: "products" }));
    CLIENTS.filter((c) => c.name.toLowerCase().includes(q)).forEach((c) => res.push({ kind: "Client", label: c.name, tab: "clients" }));
    leads.filter((l) => l.name.toLowerCase().includes(q)).forEach((l) => res.push({ kind: "Lead", label: l.name, tab: "crm" }));
    tickets.filter((t) => t.subject.toLowerCase().includes(q) || t.client.toLowerCase().includes(q))
      .forEach((t) => res.push({ kind: "Ticket", label: `${t.id} — ${t.subject}`, tab: "support" }));
    DEVS.filter((d) => d.name.toLowerCase().includes(q)).forEach((d) => res.push({ kind: "Developer", label: d.name, tab: "team" }));
    return res.slice(0, 8);
  }, [searchQ, leads, tickets]);

  const notifItems = useMemo(() => [
    ...ALERTS.map((a) => ({ title: a.title, tone: riskTone(a.severity), time: "Today" })),
    ...approvals.filter((a) => a.status === "Pending").map((a) => ({ title: `Approval needed: ${a.title}`, tone: "gold", time: "Pending" })),
  ].slice(0, 8), [approvals]);

  if (!user) return <LoginPage onLogin={setUser} />;

  const sharedProps = { pushActivity, toast };

  return (
    <AppShell
      tab={tab}
      setTab={setTab}
      user={user}
      isDirector={isDirector}
      onSignOut={() => setUser(null)}
      pendingApprovalsCount={pendingApprovalsCount}
      searchQ={searchQ}
      setSearchQ={setSearchQ}
      searchOpen={searchOpen}
      setSearchOpen={setSearchOpen}
      searchResults={searchResults}
      notifItems={notifItems}
      toasts={toasts}
    >
      {tab === "dashboard" && <DashboardPage projects={projects} leads={leads} campaigns={campaigns} tickets={tickets} approvals={approvals} setTab={setTab} />}
      {tab === "products" && <ProductsPage />}
      {tab === "marketing" && <MarketingPage campaigns={campaigns} setCampaigns={setCampaigns} leads={leads} isDirector={isDirector} {...sharedProps} />}
      {tab === "crm" && <CrmPage leads={leads} setLeads={setLeads} {...sharedProps} />}
      {tab === "team" && <TeamPage tasks={tasks} />}
      {tab === "sprints" && <SprintsPage tasks={tasks} setTasks={setTasks} {...sharedProps} />}
      {tab === "projects" && <ProjectsPage projects={projects} setProjects={setProjects} {...sharedProps} />}
      {tab === "clients" && <ClientsPage />}
      {tab === "support" && <SupportPage tickets={tickets} setTickets={setTickets} {...sharedProps} />}
      {tab === "finance" && <FinancePage isDirector={isDirector} {...sharedProps} />}
      {tab === "approvals" && <ApprovalsPage approvals={approvals} setApprovals={setApprovals} isDirector={isDirector} {...sharedProps} />}
      {tab === "alerts" && <AlertsPage setTab={setTab} />}
      {tab === "activity" && <ActivityPage activity={activity} />}
      {tab === "documents" && <DocumentsPage />}
      {tab === "assistant" && <AssistantPage leads={leads} campaigns={campaigns} projects={projects} approvals={approvals} tickets={tickets} setTab={setTab} />}
    </AppShell>
  );
}
