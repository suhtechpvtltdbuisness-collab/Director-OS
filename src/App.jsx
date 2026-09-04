import React, { useState, useMemo, useEffect, useCallback } from "react";
import { riskTone } from "./utils";
import { AppShell } from "./components/layout";
import { DataProvider } from "./context/DataContext";
import {
  fetchBootstrap,
  fetchMe,
  logout as apiLogout,
  activityApi,
  leadsApi,
  campaignsApi,
  projectsApi,
  tasksApi,
  ticketsApi,
  approvalsApi,
  invoicesApi,
  alertsApi,
} from "./api";
import { getStoredUser, clearSession, getAccessToken } from "./api/client";
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

const emptyData = {
  products: [],
  devs: [],
  projects: [],
  clients: [],
  leads: [],
  campaigns: [],
  tickets: [],
  invoices: [],
  approvals: [],
  alerts: [],
  activity: [],
  documents: [],
  tasks: [],
  revenueTrend: [],
};

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [bootstrapping, setBootstrapping] = useState(!!getAccessToken());
  const [tab, setTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [data, setData] = useState(emptyData);
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const isDirector = user?.role === "director";
  const pendingApprovalsCount = data.approvals.filter((a) => a.status === "Pending").length;

  function toast(msg, tone = "green") {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  const loadBootstrap = useCallback(async () => {
    const boot = await fetchBootstrap();
    setData({
      products: boot.products || [],
      devs: boot.devs || [],
      projects: boot.projects || [],
      clients: boot.clients || [],
      leads: boot.leads || [],
      campaigns: boot.campaigns || [],
      tickets: boot.tickets || [],
      invoices: boot.invoices || [],
      approvals: boot.approvals || [],
      alerts: boot.alerts || [],
      activity: boot.activity || [],
      documents: boot.documents || [],
      tasks: boot.tasks || [],
      revenueTrend: boot.revenueTrend || [],
    });
    if (boot.user) setUser(boot.user);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      const token = getAccessToken();
      if (!token) {
        setBootstrapping(false);
        return;
      }
      try {
        await fetchMe();
        if (cancelled) return;
        await loadBootstrap();
      } catch {
        clearSession();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }
    restore();
    return () => { cancelled = true; };
  }, [loadBootstrap]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handleLoggedIn(sessionUser) {
    setUser(sessionUser);
    setBootstrapping(true);
    try {
      await loadBootstrap();
    } catch (err) {
      toast(err.message || "Failed to load data", "red");
    } finally {
      setBootstrapping(false);
    }
  }

  async function handleSignOut() {
    await apiLogout();
    setUser(null);
    setData(emptyData);
    setTab("dashboard");
  }

  async function pushActivity(actor, action, area) {
    try {
      const { item } = await activityApi.create({ actor, action, area });
      setData((d) => ({ ...d, activity: [item, ...d.activity] }));
    } catch {
      setData((d) => ({
        ...d,
        activity: [
          {
            id: "ac" + Date.now(),
            time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            actor, action, area,
          },
          ...d.activity,
        ],
      }));
    }
  }

  const apiActions = {
    async addLead(form) {
      const { item } = await leadsApi.create(form);
      setData((d) => ({ ...d, leads: [item, ...d.leads] }));
      return item;
    },
    async moveLead(id, stage) {
      const { item } = await leadsApi.update(id, { stage });
      setData((d) => ({ ...d, leads: d.leads.map((l) => (l.id === id ? item : l)) }));
      return item;
    },
    async removeLead(id) {
      await leadsApi.remove(id);
      setData((d) => ({ ...d, leads: d.leads.filter((l) => l.id !== id) }));
    },
    async addCampaign(form) {
      const { item } = await campaignsApi.create(form);
      setData((d) => ({ ...d, campaigns: [item, ...d.campaigns] }));
      return item;
    },
    async removeCampaign(id) {
      await campaignsApi.remove(id);
      setData((d) => ({ ...d, campaigns: d.campaigns.filter((c) => c.id !== id) }));
    },
    async addProject(form) {
      const { item } = await projectsApi.create(form);
      setData((d) => ({ ...d, projects: [item, ...d.projects] }));
      return item;
    },
    async updateProject(id, patch) {
      const { item } = await projectsApi.update(id, patch);
      setData((d) => ({ ...d, projects: d.projects.map((p) => (p.id === id ? item : p)) }));
      return item;
    },
    async addTask(form) {
      const { item } = await tasksApi.create(form);
      setData((d) => ({ ...d, tasks: [item, ...d.tasks] }));
      return item;
    },
    async moveTask(id, status) {
      const { item } = await tasksApi.update(id, { status });
      setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? item : t)) }));
      return item;
    },
    async removeTask(id) {
      await tasksApi.remove(id);
      setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
    },
    async updateTicket(id, status) {
      const { item } = await ticketsApi.update(id, { status });
      setData((d) => ({ ...d, tickets: d.tickets.map((t) => (t.id === id ? item : t)) }));
      return item;
    },
    async decideApproval(id, status) {
      const { item } = await approvalsApi.decide(id, status);
      setData((d) => ({ ...d, approvals: d.approvals.map((a) => (a.id === id ? item : a)) }));
      return item;
    },
    async escalateInvoice(id) {
      await invoicesApi.escalate(id);
    },
    async dismissAlert(id) {
      const { item } = await alertsApi.dismiss(id);
      setData((d) => ({ ...d, alerts: d.alerts.map((a) => (a.id === id ? item : a)) }));
      return item;
    },
  };

  const searchResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    const res = [];
    data.products.filter((p) => p.name.toLowerCase().includes(q)).forEach((p) => res.push({ kind: "Product", label: p.name, tab: "products" }));
    data.clients.filter((c) => c.name.toLowerCase().includes(q)).forEach((c) => res.push({ kind: "Client", label: c.name, tab: "clients" }));
    data.leads.filter((l) => l.name.toLowerCase().includes(q)).forEach((l) => res.push({ kind: "Lead", label: l.name, tab: "crm" }));
    data.tickets.filter((t) => t.subject.toLowerCase().includes(q) || t.client.toLowerCase().includes(q))
      .forEach((t) => res.push({ kind: "Ticket", label: `${t.id} — ${t.subject}`, tab: "support" }));
    data.devs.filter((d) => d.name.toLowerCase().includes(q)).forEach((d) => res.push({ kind: "Developer", label: d.name, tab: "team" }));
    return res.slice(0, 8);
  }, [searchQ, data.products, data.clients, data.leads, data.tickets, data.devs]);

  const notifItems = useMemo(() => [
    ...data.alerts.filter((a) => !a.dismissed).map((a) => ({ title: a.title, tone: riskTone(a.severity), time: "Today" })),
    ...data.approvals.filter((a) => a.status === "Pending").map((a) => ({ title: `Approval needed: ${a.title}`, tone: "gold", time: "Pending" })),
  ].slice(0, 8), [data.alerts, data.approvals]);

  if (!user) return <LoginPage onLogin={handleLoggedIn} />;

  if (bootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ background: "#0B1220", color: "#94A3B8" }}>
        Loading Director OS…
      </div>
    );
  }

  const sharedProps = { pushActivity, toast, api: apiActions, isDirector };

  return (
    <DataProvider value={data}>
      <AppShell
        tab={tab}
        setTab={setTab}
        user={user}
        isDirector={isDirector}
        onSignOut={handleSignOut}
        pendingApprovalsCount={pendingApprovalsCount}
        searchQ={searchQ}
        setSearchQ={setSearchQ}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchResults={searchResults}
        notifItems={notifItems}
        toasts={toasts}
      >
        {tab === "dashboard" && (
          <DashboardPage
            projects={data.projects}
            leads={data.leads}
            campaigns={data.campaigns}
            tickets={data.tickets}
            approvals={data.approvals}
            setTab={setTab}
          />
        )}
        {tab === "products" && <ProductsPage />}
        {tab === "marketing" && (
          <MarketingPage campaigns={data.campaigns} leads={data.leads} {...sharedProps} />
        )}
        {tab === "crm" && <CrmPage leads={data.leads} {...sharedProps} />}
        {tab === "team" && <TeamPage tasks={data.tasks} />}
        {tab === "sprints" && <SprintsPage tasks={data.tasks} {...sharedProps} />}
        {tab === "projects" && <ProjectsPage projects={data.projects} {...sharedProps} />}
        {tab === "clients" && <ClientsPage />}
        {tab === "support" && <SupportPage tickets={data.tickets} {...sharedProps} />}
        {tab === "finance" && <FinancePage {...sharedProps} />}
        {tab === "approvals" && <ApprovalsPage approvals={data.approvals} {...sharedProps} />}
        {tab === "alerts" && <AlertsPage setTab={setTab} api={apiActions} />}
        {tab === "activity" && <ActivityPage activity={data.activity} />}
        {tab === "documents" && <DocumentsPage />}
        {tab === "assistant" && (
          <AssistantPage
            leads={data.leads}
            campaigns={data.campaigns}
            projects={data.projects}
            approvals={data.approvals}
            tickets={data.tickets}
            setTab={setTab}
          />
        )}
      </AppShell>
    </DataProvider>
  );
}
