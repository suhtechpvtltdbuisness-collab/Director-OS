import * as mockDb from "../mock/db";
import { fetchBootstrap } from "../api";
import {
  leadsApi,
  campaignsApi,
  projectsApi,
  tasksApi,
  ticketsApi,
  productsApi,
  devsApi,
  clientsApi,
  documentsApi,
  invoicesApi,
  expensesApi,
  ticketCommentsApi,
  approvalsApi,
  alertsApi,
} from "../api";

/**
 * The single seam between the UI and its data.
 * Set VITE_DATA_SOURCE=api to use the live backend (default).
 */
export const SOURCE = import.meta.env.VITE_DATA_SOURCE === "mock" ? "mock" : "api";

const API_WRITERS = {
  leads: leadsApi,
  campaigns: campaignsApi,
  projects: projectsApi,
  tasks: tasksApi,
  tickets: ticketsApi,
  products: productsApi,
  devs: devsApi,
  clients: clientsApi,
  documents: documentsApi,
  invoices: invoicesApi,
  expenses: expensesApi,
  ticketComments: ticketCommentsApi,
};

function normalizeRecord(collection, record) {
  if (!record) return record;
  if (collection === "products") {
    return { ...record, clientCount: record.clientCount ?? record.clients ?? 0 };
  }
  if (collection === "clients") {
    return { ...record, contactName: record.contactName ?? record.contact ?? "" };
  }
  return record;
}

async function apiCreate(collection, body) {
  const fns = API_WRITERS[collection];
  if (!fns?.create) throw new Error(`The backend has no create endpoint for "${collection}".`);
  const res = await fns.create(body);
  return normalizeRecord(collection, res.item);
}

async function apiUpdate(collection, id, patch) {
  if (collection === "approvals" && patch.status) {
    return normalizeRecord(collection, (await approvalsApi.decide(id, patch.status)).item);
  }
  if (collection === "alerts" && patch.dismissed === true) {
    return normalizeRecord(collection, (await alertsApi.dismiss(id)).item);
  }
  const fns = API_WRITERS[collection];
  if (!fns?.update) throw new Error(`The backend has no update endpoint for "${collection}".`);
  return normalizeRecord(collection, (await fns.update(id, patch)).item);
}

async function apiRemove(collection, id) {
  const fns = API_WRITERS[collection];
  if (!fns?.remove) throw new Error(`The backend has no delete endpoint for "${collection}".`);
  await fns.remove(id);
  return { id };
}

const apiSource = {
  async listAll() {
    const boot = await fetchBootstrap();
    const products = (boot.products || []).map((p) => ({
      ...p,
      clientCount: p.clientCount ?? p.clients ?? 0,
    }));
    const clients = (boot.clients || []).map((c) => ({
      ...c,
      contactName: c.contactName ?? c.contact ?? "",
    }));
    return {
      products,
      devs: boot.devs || [],
      clients,
      projects: boot.projects || [],
      milestones: boot.milestones || [],
      leads: boot.leads || [],
      campaigns: boot.campaigns || [],
      tickets: boot.tickets || [],
      ticketComments: boot.ticketComments || [],
      invoices: boot.invoices || [],
      expenses: boot.expenses || [],
      approvals: boot.approvals || [],
      alerts: boot.alerts || [],
      activity: boot.activity || [],
      documents: boot.documents || [],
      tasks: boot.tasks || [],
      revenueTrend: boot.revenueTrend || [],
    };
  },
  create: apiCreate,
  update: apiUpdate,
  remove: apiRemove,
};

export const source = SOURCE === "api" ? apiSource : mockDb;
