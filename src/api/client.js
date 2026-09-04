function normalizeApiUrl(raw) {
  const value = String(raw || "").trim().replace(/\/+$/, "");
  if (!value) return "http://localhost:5010";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL || "http://localhost:5010");

const TOKEN_KEY = "director_os_access";
const REFRESH_KEY = "director_os_refresh";
const USER_KEY = "director_os_user";

export function getApiUrl() {
  return API_URL;
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession({ user, accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function api(path, { method = "GET", body, token, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const access = token ?? (auth ? getAccessToken() : null);
  if (access) headers.Authorization = `Bearer ${access}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }
  return data;
}
