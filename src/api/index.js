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

export const leadsApi = {
  create: (body) => api("/api/leads", { method: "POST", body }),
  update: (id, body) => api(`/api/leads/${id}`, { method: "PATCH", body }),
  remove: (id) => api(`/api/leads/${id}`, { method: "DELETE" }),
};

export const campaignsApi = {
  create: (body) => api("/api/campaigns", { method: "POST", body }),
  remove: (id) => api(`/api/campaigns/${id}`, { method: "DELETE" }),
};

export const projectsApi = {
  create: (body) => api("/api/projects", { method: "POST", body }),
  update: (id, body) => api(`/api/projects/${id}`, { method: "PATCH", body }),
};

export const tasksApi = {
  create: (body) => api("/api/tasks", { method: "POST", body }),
  update: (id, body) => api(`/api/tasks/${id}`, { method: "PATCH", body }),
  remove: (id) => api(`/api/tasks/${id}`, { method: "DELETE" }),
};

export const ticketsApi = {
  update: (id, body) => api(`/api/tickets/${id}`, { method: "PATCH", body }),
};

export const approvalsApi = {
  decide: (id, status) => api(`/api/approvals/${id}`, { method: "PATCH", body: { status } }),
};

export const invoicesApi = {
  escalate: (id) => api(`/api/invoices/${id}/escalate`, { method: "POST" }),
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
