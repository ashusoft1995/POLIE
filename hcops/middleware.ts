import { NextRequest, NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/police-head":  ["POLICE_HEAD", "police-head"],
  "/detective":    ["DETECTIVE",   "detective"],
  "/preventive":   ["PREVENTIVE",  "preventive"],
  "/traffic":      ["TRAFFIC",     "traffic"],
  "/hr":           ["HR",          "hr"],
  "/system-admin": ["SYSTEM_ADMIN","system-admin"],
  "/citizen":      ["citizen",     "CITIZEN"],
};

const PUBLIC_PATHS = ["/login", "/forgot-password", "/_next", "/api", "/images", "/favicon", "/icons"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token    = req.cookies.get("hcops_token")?.value;
  const userRaw  = req.cookies.get("hcops_user")?.value;

  // No token → redirect to login (no expired banner — first visit)
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.delete("expired");
    return NextResponse.redirect(url);
  }

  let role = "";
  try {
    const user = JSON.parse(decodeURIComponent(userRaw ?? "{}"));
    role = user.role ?? "";
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("expired", "1");
    return NextResponse.redirect(url);
  }

  // Check role matches the route prefix
  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = ownDashboard(role);
        url.search = "";
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
    "police-head":"/police-head",
    DETECTIVE:    "/detective",
    detective:    "/detective",
    PREVENTIVE:   "/preventive",
    preventive:   "/preventive",
    TRAFFIC:      "/traffic",
    traffic:      "/traffic",
    HR:           "/hr",
    hr:           "/hr",
    SYSTEM_ADMIN: "/system-admin",
    "system-admin":"/system-admin",
    citizen:      "/citizen",
  };
  return map[role] ?? "/login";
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
