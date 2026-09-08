import { api, setSession, clearSession } from "./client";

export async function login({ email, password, role }) {
  const data = await api("/api/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password, role },
  });
  if (data.accessToken) setSession(data);
  return data;
}

export async function verifyOtp({ otpToken, otp }) {
  const data = await api("/api/auth/verify-otp", {
    method: "POST",
    auth: false,
    body: { otpToken, otp },
  });
  setSession(data);
  return data;
}

export async function refreshSession(refreshToken) {
  const data = await api("/api/auth/refresh", {
    method: "POST",
    auth: false,
    body: { refreshToken },
  });
  setSession(data);
  return data;
}

export async function fetchMe() {
  return api("/api/auth/me");
}

export async function logout() {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch {
    // ignore
  }
  clearSession();
}

export async function fetchBootstrap() {
  return api("/api/bootstrap");
}

export async function searchAll(q) {
  return api(`/api/search?q=${encodeURIComponent(q)}`);
}

const crud = (base) => ({
  create: (body) => api(base, { method: "POST", body }),
  update: (id, body) => api(`${base}/${id}`, { method: "PATCH", body }),
  remove: (id) => api(`${base}/${id}`, { method: "DELETE" }),
});

export const leadsApi = crud("/api/leads");
export const campaignsApi = crud("/api/campaigns");
export const projectsApi = crud("/api/projects");
export const tasksApi = crud("/api/tasks");
export const productsApi = crud("/api/products");
export const devsApi = crud("/api/devs");
export const clientsApi = crud("/api/clients");
export const documentsApi = crud("/api/documents");
export const invoicesApi = {
  ...crud("/api/invoices"),
  escalate: (id) => api(`/api/invoices/${id}/escalate`, { method: "POST" }),
};
export const expensesApi = {
  create: (body) => api("/api/finance/expenses", { method: "POST", body }),
  remove: (id) => api(`/api/finance/expenses/${id}`, { method: "DELETE" }),
};
export const ticketsApi = crud("/api/tickets");
export const ticketCommentsApi = {
  create: (body) => api("/api/ticket-comments", { method: "POST", body }),
};

export const approvalsApi = {
  decide: (id, status) => api(`/api/approvals/${id}`, { method: "PATCH", body: { status } }),
};

export const alertsApi = {
  dismiss: (id) => api(`/api/alerts/${id}/dismiss`, { method: "PATCH" }),
};

export const activityApi = {
  create: (body) => api("/api/activity", { method: "POST", body }),
};

export const assistantApi = {
  chat: (query) => api("/api/assistant/chat", { method: "POST", body: { query } }),
};
