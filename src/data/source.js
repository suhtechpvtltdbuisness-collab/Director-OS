import * as mockDb from "../mock/db";
import { fetchBootstrap } from "../api";
import * as apiClient from "../api";

/**
 * The single seam between the UI and its data.
 *
 * `VITE_DATA_SOURCE=api` switches the whole application onto the live backend.
 * It defaults to "mock" because the backend database is currently empty, which
 * would leave every screen blank. No component imports the mock data directly.
 */
export const SOURCE = import.meta.env.VITE_DATA_SOURCE === "api" ? "api" : "mock";

/** Live-backend write endpoints that exist today. Others are not yet built. */
const API_WRITERS = {
  leads: apiClient.leadsApi,
  campaigns: apiClient.campaignsApi,
  projects: apiClient.projectsApi,
  tasks: apiClient.tasksApi,
  tickets: apiClient.ticketsApi,
};

function writer(collection, op) {
  const fns = API_WRITERS[collection];
  if (!fns?.[op]) {
    throw new Error(`The backend has no ${op} endpoint for "${collection}" yet.`);
  }
  return fns[op];
}

const apiSource = {
  async listAll() {
    const boot = await fetchBootstrap();
    return { ...boot, devs: boot.devs || [], milestones: [], ticketComments: [], expenses: [] };
  },
  create: (c, body) => writer(c, "create")(body).then((r) => r.item),
  update: (c, id, patch) => writer(c, "update")(id, patch).then((r) => r.item),
  remove: (c, id) => writer(c, "remove")(id),
};

export const source = SOURCE === "api" ? apiSource : mockDb;
