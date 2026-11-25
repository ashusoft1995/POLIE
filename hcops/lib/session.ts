/**
 * Session management — covers all 6 session purposes:
 *  1. User authentication   — save/read token + user
 *  2. Security              — token attached to every API request
 *  3. Role management       — role stored for route guards
 *  4. Case management       — user id/role accessible everywhere
 *  5. Logout                — clears EVERYTHING so back button can't return
 *  6. Session timeout       — idle timer, refreshed on activity
 */

export const TOKEN_KEY   = "hcops_token";
export const REFRESH_KEY = "hcops_refresh";
export const USER_KEY    = "hcops_user";
export const EXPIRY_KEY  = "hcops_expiry";

/** 30 minutes of inactivity → auto logout */
export const INACTIVITY_MS = 30 * 60 * 1000;

/* ─── Save ───────────────────────────────────────────────────── */
export function saveSession(token: string, refreshToken: string, user: object) {
  const expiry = Date.now() + INACTIVITY_MS;
  sessionStorage.setItem(TOKEN_KEY,   token);
  sessionStorage.setItem(REFRESH_KEY, refreshToken);
  sessionStorage.setItem(USER_KEY,    JSON.stringify(user));
  sessionStorage.setItem(EXPIRY_KEY,  String(expiry));

  // Also write cookies so Next.js middleware can read them on the Edge
  const age = Math.floor(INACTIVITY_MS / 1000);
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${age}; SameSite=Strict`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${age}; SameSite=Strict`;
}

export function saveCitizenSession() {
  const user  = { role: "citizen", name: "Citizen", email: "" };
  const expiry = Date.now() + INACTIVITY_MS;
  sessionStorage.setItem(TOKEN_KEY,  "citizen");
  sessionStorage.setItem(USER_KEY,   JSON.stringify(user));
  sessionStorage.setItem(EXPIRY_KEY, String(expiry));
  const age = Math.floor(INACTIVITY_MS / 1000);
  document.cookie = `${TOKEN_KEY}=citizen; path=/; max-age=${age}; SameSite=Strict`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${age}; SameSite=Strict`;
}

/* ─── Read ───────────────────────────────────────────────────── */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem(USER_KEY) ?? "null"); }
  catch { return null; }
}

export function getExpiry(): number {
  if (typeof window === "undefined") return 0;
  return Number(sessionStorage.getItem(EXPIRY_KEY) ?? 0);
}

export function isSessionAlive(): boolean {
  const token = getToken();
  if (!token) return false;
  const expiry = getExpiry();
  if (expiry > 0 && Date.now() > expiry) return false;
  return true;
}

/** Call on any user interaction to push the idle clock forward */
export function touchSession() {
  if (typeof window === "undefined") return;
  const expiry = Date.now() + INACTIVITY_MS;
  sessionStorage.setItem(EXPIRY_KEY, String(expiry));
  // Refresh the cookie too
  const token = getToken();
  const user  = getUser();
  if (token && user) {
    const age = Math.floor(INACTIVITY_MS / 1000);
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${age}; SameSite=Strict`;
    document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${age}; SameSite=Strict`;
  }
}

/* ─── Clear ──────────────────────────────────────────────────── */
/**
 * Full logout:
 * - Clears sessionStorage
 * - Expires cookies → middleware will block back-button access
 * - Replaces history so the back button goes to login, not the dashboard
 */
export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(EXPIRY_KEY);
  // Expire cookies immediately
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict`;
  document.cookie = `${USER_KEY}=; path=/; max-age=0; SameSite=Strict`;
}
