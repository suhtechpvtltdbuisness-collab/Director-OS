import React, { useCallback, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { DataStoreProvider, useStore } from "./data/DataStore";
import { SessionProvider } from "./context/SessionContext";
import { getStoredUser, getAccessToken, clearSession } from "./api/client";
import { logout as apiLogout, fetchMe } from "./api";
import { riskTone } from "./utils";
import AppShell from "./components/layout/AppShell";
import { ForbiddenView, NotFoundView } from "./components/ui";
import PrimaryBtn from "./components/common/PrimaryBtn";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AssistantPage from "./pages/assistant/AssistantPage";

import LeadsListPage from "./pages/leads/LeadsListPage";
import LeadFormPage from "./pages/leads/LeadFormPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";

import CampaignsListPage from "./pages/campaigns/CampaignsListPage";
import CampaignFormPage from "./pages/campaigns/CampaignFormPage";
import CampaignDetailPage from "./pages/campaigns/CampaignDetailPage";

import ClientsListPage from "./pages/clients/ClientsListPage";
import ClientFormPage from "./pages/clients/ClientFormPage";
import ClientDetailPage from "./pages/clients/ClientDetailPage";

import ProjectsListPage from "./pages/projects/ProjectsListPage";
import ProjectFormPage from "./pages/projects/ProjectFormPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";

import SprintBoardPage from "./pages/sprints/SprintBoardPage";
import TaskFormPage from "./pages/sprints/TaskFormPage";
import TaskDetailPage from "./pages/sprints/TaskDetailPage";

import ProductsListPage from "./pages/products/ProductsListPage";
import ProductFormPage from "./pages/products/ProductFormPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";

import TeamListPage from "./pages/team/TeamListPage";
import TeamFormPage from "./pages/team/TeamFormPage";
import TeamDetailPage from "./pages/team/TeamDetailPage";

import SupportListPage from "./pages/support/SupportListPage";
import SupportFormPage from "./pages/support/SupportFormPage";
import SupportDetailPage from "./pages/support/SupportDetailPage";

import FinanceOverviewPage from "./pages/finance/FinanceOverviewPage";
import InvoicesListPage from "./pages/finance/InvoicesListPage";
import InvoiceFormPage from "./pages/finance/InvoiceFormPage";
import InvoiceDetailPage from "./pages/finance/InvoiceDetailPage";
import ExpensesPage from "./pages/finance/ExpensesPage";

import ApprovalsListPage from "./pages/approvals/ApprovalsListPage";
import ApprovalDetailPage from "./pages/approvals/ApprovalDetailPage";
import AlertsPage from "./pages/alerts/AlertsPage";
import ActivityPage from "./pages/activity/ActivityPage";
import DocumentsListPage from "./pages/documents/DocumentsListPage";
import DocumentFormPage from "./pages/documents/DocumentFormPage";
import DocumentDetailPage from "./pages/documents/DocumentDetailPage";

function NotFoundRoute() {
  const navigate = useNavigate();
  return <NotFoundView what="page" action={<PrimaryBtn onClick={() => navigate("/")}>Back to dashboard</PrimaryBtn>} />;
}

/** Everything inside the authenticated shell; requires the store to be mounted. */
function AuthenticatedApp({ user, isDirector, toasts, toast, onSignOut }) {
  const { data } = useStore();

  const pendingApprovals = data.approvals.filter((a) => a.status === "Pending");

  const notifItems = useMemo(() => [
    ...data.alerts.filter((a) => !a.dismissed).map((a) => ({
      title: a.title, tone: riskTone(a.severity), meta: `${a.area} · ${a.severity}`, to: "/alerts",
    })),
    ...pendingApprovals.map((a) => ({
      title: `Approval needed: ${a.title}`, tone: "gold", meta: `Requested by ${a.requestedBy}`, to: `/approvals/${a.id}`,
    })),
  ].slice(0, 8), [data.alerts, pendingApprovals]);

  const session = useMemo(() => ({ user, isDirector, toast }), [user, isDirector, toast]);

  /** Finance holds commercial data, so it is director-only. */
  const financeGate = (element) =>
    isDirector ? element : <ForbiddenView body="Finance is restricted to directors. Ask a director if you need access." />;

  return (
    <SessionProvider value={session}>
      <Routes>
        <Route
          element={
            <AppShell
              user={user}
              isDirector={isDirector}
              onSignOut={onSignOut}
              pendingApprovalsCount={pendingApprovals.length}
              notifItems={notifItems}
              toasts={toasts}
            />
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/assistant" element={<AssistantPage />} />

          <Route path="/leads" element={<LeadsListPage />} />
          <Route path="/leads/new" element={<LeadFormPage />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          <Route path="/leads/:id/edit" element={<LeadFormPage />} />

          <Route path="/campaigns" element={<CampaignsListPage />} />
          <Route path="/campaigns/new" element={<CampaignFormPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/campaigns/:id/edit" element={<CampaignFormPage />} />

          <Route path="/clients" element={<ClientsListPage />} />
          <Route path="/clients/new" element={<ClientFormPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="/clients/:id/edit" element={<ClientFormPage />} />

          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/new" element={<ProjectFormPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:id/edit" element={<ProjectFormPage />} />

          <Route path="/sprints" element={<SprintBoardPage />} />
          <Route path="/sprints/new" element={<TaskFormPage />} />
          <Route path="/sprints/:id" element={<TaskDetailPage />} />
          <Route path="/sprints/:id/edit" element={<TaskFormPage />} />

          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />

          <Route path="/team" element={<TeamListPage />} />
          <Route path="/team/new" element={<TeamFormPage />} />
          <Route path="/team/:id" element={<TeamDetailPage />} />
          <Route path="/team/:id/edit" element={<TeamFormPage />} />

          <Route path="/support" element={<SupportListPage />} />
          <Route path="/support/new" element={<SupportFormPage />} />
          <Route path="/support/:id" element={<SupportDetailPage />} />
          <Route path="/support/:id/edit" element={<SupportFormPage />} />

          <Route path="/finance" element={financeGate(<FinanceOverviewPage />)} />
          <Route path="/finance/invoices" element={financeGate(<InvoicesListPage />)} />
          <Route path="/finance/invoices/new" element={financeGate(<InvoiceFormPage />)} />
          <Route path="/finance/invoices/:id" element={financeGate(<InvoiceDetailPage />)} />
          <Route path="/finance/invoices/:id/edit" element={financeGate(<InvoiceFormPage />)} />
          <Route path="/finance/expenses" element={financeGate(<ExpensesPage />)} />

          <Route path="/approvals" element={<ApprovalsListPage />} />
          <Route path="/approvals/:id" element={<ApprovalDetailPage />} />

          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/activity" element={<ActivityPage />} />

          <Route path="/documents" element={<DocumentsListPage />} />
          <Route path="/documents/new" element={<DocumentFormPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/documents/:id/edit" element={<DocumentFormPage />} />

          <Route path="*" element={<NotFoundRoute />} />
        </Route>
      </Routes>
    </SessionProvider>
  );
}

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [toasts, setToasts] = useState([]);
  const [booting, setBooting] = useState(() => Boolean(getStoredUser() && getAccessToken()));

  React.useEffect(() => {
    if (!getAccessToken()) {
      setBooting(false);
      return;
    }
    fetchMe()
      .then(({ user: me }) => { if (me) setUser(me); })
      .catch(() => { clearSession(); setUser(null); })
      .finally(() => setBooting(false));
  }, []);

  const toast = useCallback((msg, tone = "green") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  async function handleSignOut() {
    if (getAccessToken()) await apiLogout();
    clearSession();
    setUser(null);
  }

  if (!user) return <LoginPage onLogin={setUser} />;
  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0b", color: "#888" }}>
        Loading…
      </div>
    );
  }

  return (
    <DataStoreProvider>
      <AuthenticatedApp
        user={user}
        isDirector={user.role === "director"}
        toasts={toasts}
        toast={toast}
        onSignOut={handleSignOut}
      />
    </DataStoreProvider>
  );
}
