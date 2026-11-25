const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ── Login ────────────────────────────────────────────────────────
export interface LoginPayload {
  identifier: string; // username or email
  password:   string;
}
export interface LoginData {
  accessToken:  string;
  refreshToken: string;
  tokenType:    string;
  expiresIn:    number;
  user: {
    id:       number;
    username: string;
    email:    string;
    fullName: string;
    role:     string;
    badge:    string;
    rank:     string;
  };
}

export async function loginApi(payload: LoginPayload): Promise<{ success: boolean; message: string; data?: LoginData }> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  return res.json();
}

// ── Forgot Password — Step 1: Request OTP ───────────────────────
export async function forgotPasswordApi(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email }),
  });
  return res.json();
}

// ── Forgot Password — Step 2: Verify OTP ────────────────────────
export async function verifyOtpApi(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, otp }),
  });
  return res.json();
}

// ── Forgot Password — Step 3: Reset Password ─────────────────────
export async function resetPasswordApi(
  email: string, otp: string, newPassword: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, otp, newPassword }),
  });
  return res.json();
}

// ── Role → Dashboard redirect map ───────────────────────────────
export const roleDashboardMap: Record<string, string> = {
  // Backend format (uppercase)
  POLICE_HEAD:   "/police-head",
  DETECTIVE:     "/detective",
  PREVENTIVE:    "/preventive",
  TRAFFIC:       "/traffic",
  HR:            "/hr",
  SYSTEM_ADMIN:  "/system-admin",
  // Mock / frontend format (lowercase)
  "police-head": "/police-head",
  "detective":   "/detective",
  "preventive":  "/preventive",
  "traffic":     "/traffic",
  "hr":          "/hr",
  "system-admin":"/system-admin",
};
