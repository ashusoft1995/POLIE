/**
 * Next.js Edge Middleware
 * Runs on every request BEFORE the page renders.
 *
 * Session purposes covered:
 *  ✅ User authentication   — redirects unauthenticated users to /login
 *  ✅ Security              — prevents any dashboard access without a token
 *  ✅ Role management       — prevents cross-role access (e.g. detective → /police-head)
 */

import { NextRequest, NextResponse } from "next/server";

// Which role is allowed on which path prefix
const ROLE_ROUTES: Record<string, string> = {
  "/police-head":  "POLICE_HEAD",
  "/detective":    "DETECTIVE",
  "/preventive":   "PREVENTIVE",
  "/traffic":      "TRAFFIC",
  "/hr":           "HR",
  "/system-admin": "SYSTEM_ADMIN",
  "/citizen":      "citizen",
};

// Public paths — no token needed
const PUBLIC_PATHS = ["/login", "/forgot-password", "/_next", "/api", "/images", "/favicon"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths through
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Read token + user from cookies (set by the client after login)
  const token = req.cookies.get("hcops_token")?.value;
  const userRaw = req.cookies.get("hcops_user")?.value;

  // No token → send to login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Parse stored user role
  let role = "";
  try {
    const user = JSON.parse(decodeURIComponent(userRaw ?? "{}"));
    role = user.role ?? "";
  } catch {
    // Corrupted cookie → force re-login
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check role matches the route
  for (const [prefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (role !== requiredRole) {
        // Redirect to their own dashboard instead of showing 404/blank
        const own = ownDashboard(role);
        const url = req.nextUrl.clone();
        url.pathname = own;
        return NextResponse.redirect(url);
      }
      break;
    }
  }

  return NextResponse.next();
}

function ownDashboard(role: string): string {
  const map: Record<string, string> = {
    POLICE_HEAD:  "/police-head",
    DETECTIVE:    "/detective",
    PREVENTIVE:   "/preventive",
    TRAFFIC:      "/traffic",
    HR:           "/hr",
    SYSTEM_ADMIN: "/system-admin",
    citizen:      "/citizen",
  };
  return map[role] ?? "/login";
}

export const config = {
  // Run on all routes except static files and Next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
