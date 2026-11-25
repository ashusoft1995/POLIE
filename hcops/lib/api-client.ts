/**
 * Central API client — all backend calls go through here.
 * Automatically attaches the JWT token from sessionStorage.
 * Throws on network error so callers can handle fallback.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const TIMEOUT = 5000;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  // Read from sessionStorage (source of truth for JS)
  return sessionStorage.getItem("hcops_token");
}

function headers(extra?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token && token !== "citizen") h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  const json = await res.json();
  // Backend wraps in { success, message, data }
  if (json && typeof json === "object" && "data" in json) return json.data as T;
  return json as T;
}

export const api = {
  get:    <T>(path: string)                    => request<T>("GET",    path),
  post:   <T>(path: string, body?: unknown)    => request<T>("POST",   path, body),
  put:    <T>(path: string, body?: unknown)    => request<T>("PUT",    path, body),
  del:    <T>(path: string)                    => request<T>("DELETE", path),
  patch:  <T>(path: string, body?: unknown)    => request<T>("PATCH",  path, body),
};

// ── Typed helpers ──────────────────────────────────────────────

// Cases
export const casesApi = {
  getAll:          ()                              => api.get<any[]>("/api/cases"),
  getByDetective:  (id: number)                    => api.get<any[]>(`/api/cases/detective/${id}`),
  getByStatus:     (s: string)                     => api.get<any[]>(`/api/cases/status/${s}`),
  create:          (body: any)                     => api.post<any>("/api/cases", body),
  updateStatus:    (id: number, status: string)    => api.put<any>(`/api/cases/${id}/status?status=${status}`),
  updateNotes:     (id: number, notes: string)     => api.put<any>(`/api/cases/${id}/notes`, notes),
  close:           (id: number, status: string, notes: string) => api.post<any>(`/api/cases/${id}/close?status=${status}`, notes),
  countByStatus:   (s: string)                     => api.get<number>(`/api/cases/stats/count/${s}`),
  getById:         (id: number)                    => api.get<any>(`/api/cases/${id}`),
};

// Crime reports
export const crimeReportApi = {
  getAll:        ()             => api.get<any[]>("/api/crime-reports"),
  getByStatus:   (s: string)   => api.get<any[]>(`/api/crime-reports/status/${s}`),
  submit:        (body: any)   => api.post<any>("/api/crime-reports", body),
  updateStatus:  (id: number, s: string, notes?: string) =>
    api.put<any>(`/api/crime-reports/${id}/status?status=${s}${notes ? `&notes=${encodeURIComponent(notes)}` : ""}`),
  approve:       (id: number, notes?: string) =>
    api.post<any>(`/api/crime-reports/${id}/approve${notes ? `?notes=${encodeURIComponent(notes)}` : ""}`),
  reject:        (id: number, notes?: string) =>
    api.post<any>(`/api/crime-reports/${id}/reject${notes ? `?notes=${encodeURIComponent(notes)}` : ""}`),
  assign:        (id: number, officerId: number) =>
    api.post<any>(`/api/crime-reports/${id}/assign/${officerId}`),
};

// Employees / Users
export const employeeApi = {
  getAll:          ()               => api.get<any[]>("/api/employees"),
  getByRole:       (role: string)   => api.get<any[]>(`/api/employees/role/${role}`),
  register:        (body: any)      => api.post<any>("/api/employees", body),
  update:          (id: number, body: any) => api.put<any>(`/api/employees/${id}`, body),
  toggleStatus:    (id: number)     => api.post<any>(`/api/employees/${id}/toggle-status`),
  delete:          (id: number)     => api.del<any>(`/api/employees/${id}`),
};

// Leave requests
export const leaveApi = {
  getAll:     ()                    => api.get<any[]>("/api/leave-requests"),
  getByStatus:(s: string)           => api.get<any[]>(`/api/leave-requests/status/${s}`),
  submit:     (body: any)           => api.post<any>("/api/leave-requests", body),
  approve:    (id: number, notes?: string) => api.post<any>(`/api/leave-requests/${id}/approve${notes ? `?notes=${encodeURIComponent(notes)}` : ""}`),
  reject:     (id: number, notes?: string) => api.post<any>(`/api/leave-requests/${id}/reject${notes ? `?notes=${encodeURIComponent(notes)}` : ""}`),
};

// Payroll
export const payrollApi = {
  getAll:       ()                     => api.get<any[]>("/api/payroll"),
  getByPeriod:  (m: number, y: number) => api.get<any[]>(`/api/payroll/period/${m}/${y}`),
  updateStatus: (id: number, status: string, ref?: string) =>
    api.put<any>(`/api/payroll/${id}/status?status=${status}${ref ? `&paymentReference=${encodeURIComponent(ref)}` : ""}`),
};

// Evidence
export const evidenceApi = {
  getByCase: (caseId: number) => api.get<any[]>(`/api/evidence/case/${caseId}`),
  add:       (body: any)      => api.post<any>("/api/evidence", body),
};

// Missing persons
export const missingPersonApi = {
  getAll:      ()            => api.get<any[]>("/api/missing-persons"),
  getByStatus: (s: string)   => api.get<any[]>(`/api/missing-persons/status/${s}`),
  submit:      (body: any)   => api.post<any>("/api/missing-persons", body),
  updateStatus:(id: number, s: string) => api.put<any>(`/api/missing-persons/${id}/status?status=${s}`),
};

// Nominations
export const nominationApi = {
  getAll:       ()                             => api.get<any[]>("/api/nominations"),
  getByStatus:  (s: string)                   => api.get<any[]>(`/api/nominations/status/${s}`),
  submit:       (body: any)                   => api.post<any>("/api/nominations", body),
  updateStatus: (id: number, s: string, notes?: string) =>
    api.put<any>(`/api/nominations/${id}/status?status=${s}${notes ? `&notes=${encodeURIComponent(notes)}` : ""}`),
};

// Traffic reports
export const trafficApi = {
  getAll:      ()           => api.get<any[]>("/api/traffic-reports"),
  getByStatus: (s: string)  => api.get<any[]>(`/api/traffic-reports/status/${s}`),
  submit:      (body: any)  => api.post<any>("/api/traffic-reports", body),
};

// Court referrals
export const courtReferralApi = {
  getAll:   ()                            => api.get<any[]>("/api/court-referrals"),
  submit:   (body: any, detectiveId: number) => api.post<any>(`/api/court-referrals?detectiveId=${detectiveId}`, body),
  approve:  (id: number, headId: number, body: any) =>
    api.put<any>(`/api/court-referrals/${id}/approve?headId=${headId}`, body),
};

// Auth
export const authApi = {
  login:         (body: any) => api.post<any>("/api/auth/login", body),
  forgotPw:      (email: string) => api.post<any>("/api/auth/forgot-password", { email }),
  verifyOtp:     (email: string, otp: string) => api.post<any>("/api/auth/verify-otp", { email, otp }),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post<any>("/api/auth/reset-password", { email, otp, newPassword }),
};
