import * as seed from "./dataset";

/**
 * In-memory mock database with async CRUD.
 *
 * Writes persist to localStorage so that edits survive a page refresh while the
 * real backend database is empty. Every call is async and slightly delayed so the
 * UI exercises its real loading states rather than resolving instantly.
 */

const STORAGE_KEY = "director_os_mock_db";

const SEEDS = {
  products: seed.PRODUCTS,
  devs: seed.DEVS,
  clients: seed.CLIENTS,
  projects: seed.PROJECTS,
  milestones: seed.MILESTONES,
  leads: seed.LEADS,
  campaigns: seed.CAMPAIGNS,
  tickets: seed.TICKETS,
  ticketComments: seed.TICKET_COMMENTS,
  invoices: seed.INVOICES,
  expenses: seed.EXPENSES,
  approvals: seed.APPROVALS,
  alerts: seed.ALERTS,
  activity: seed.ACTIVITY,
  documents: seed.DOCUMENTS,
  tasks: seed.TASKS,
  revenueTrend: seed.REVENUE_TREND,
};

export const COLLECTIONS = Object.keys(SEEDS);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...structuredClone(SEEDS), ...JSON.parse(raw) };
  } catch {
    // Corrupt or unavailable storage falls back to the pristine seed.
  }
  return structuredClone(SEEDS);
}

let db = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Storage may be full or blocked; the in-memory copy stays authoritative.
  }
}

export function resetDb() {
  db = structuredClone(SEEDS);
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** `?mock=loading|error|empty` forces a state so every screen can be audited. */
export function scenario() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("mock");
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle() {
  await delay(220 + Math.random() * 260);
  const s = scenario();
  if (s === "loading") await new Promise(() => {}); // never resolves
  if (s === "error") throw new Error("Unable to reach the Director OS service.");
}

const nextId = (name) => `${name.slice(0, 2)}${Date.now().toString(36)}`;

export async function listAll() {
  await settle();
  if (scenario() === "empty") {
    return Object.fromEntries(COLLECTIONS.map((c) => [c, []]));
  }
  return structuredClone(db);
}

export async function create(name, record) {
  await settle();
  const row = { id: record.id || nextId(name), ...record };
  db[name] = [row, ...(db[name] || [])];
  persist();
  return row;
}

export async function update(name, id, patch) {
  await settle();
  const list = db[name] || [];
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Record not found");
  list[idx] = { ...list[idx], ...patch };
  persist();
  return structuredClone(list[idx]);
}

export async function remove(name, id) {
  await settle();
  db[name] = (db[name] || []).filter((r) => r.id !== id);
  persist();
  return { id };
}
