"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar, { NavItem } from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChatAssistant from "@/components/dashboard/ChatAssistant";
import SessionTimeoutDialog from "@/components/ui/SessionTimeoutDialog";
import { useSessionTimeout } from "@/lib/useSessionTimeout";
import { isSessionAlive } from "@/lib/session";

interface Meta { title: string; breadcrumb: string[] }

interface Props {
  children:     React.ReactNode;
  navItems:     NavItem[];
  roleLabel:    string;
  userName:     string;
  userRole:     string;
  profileHref:  string;
  settingsHref?: string;
  metaMap:      Record<string, Meta>;
  fallbackMeta: Meta;
}

export default function DashboardShell({
  children, navItems, roleLabel, userName, userRole,
  profileHref, settingsHref, metaMap, fallbackMeta,
}: Props) {
  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted,          setMounted]          = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const meta     = metaMap[pathname] ?? fallbackMeta;

  // ── Session timeout ────────────────────────────────────────────
  const { showWarning, secondsLeft, extendSession, logoutNow } = useSessionTimeout();

  // ── Hydration guard ────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Back-button prevention after logout ───────────────────────
  // Push a dummy state so the first "back" just reloads the current
  // page; the middleware then checks the (now-cleared) cookie and
  // redirects to /login instead of showing the cached dashboard.
  useEffect(() => {
    if (!mounted) return;
    // If session is gone (e.g. user got here via back button), kick them out
    if (!isSessionAlive()) {
      router.replace("/login");
      return;
    }
    // Push current URL as an extra history entry so back = this page
    // The middleware handles the rest
    window.history.pushState(null, "", window.location.href);
    const onPop = () => {
      if (!isSessionAlive()) {
        router.replace("/login");
      } else {
        // User pressed back while logged in — push again to keep them here
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [mounted, router]);

  return (
    <div className="flex h-screen bg-[var(--page-bg)] overflow-hidden">

      {/* ── Sidebar ── */}
      <div className={`hidden lg:flex flex-col shrink-0 h-full overflow-y-auto sticky top-0 z-30 transition-all duration-300
        ${mounted && sidebarCollapsed ? "w-16" : "w-64"}`}>
        <Sidebar
          items={navItems}
          roleLabel={roleLabel}
          userName={userName}
          userRole={userRole}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          collapsed={mounted ? sidebarCollapsed : false}
          onCollapse={setSidebarCollapsed}
        />
      </div>

      {/* Mobile drawer */}
      <div className="lg:hidden">
        <Sidebar
          items={navItems}
          roleLabel={roleLabel}
          userName={userName}
          userRole={userRole}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          collapsed={false}
        />
      </div>

      {/* ── Right column ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <div className="shrink-0 sticky top-0 z-40 bg-[var(--topbar-bg)] border-b border-[var(--border)] shadow-sm">
          <DashboardHeader
            pageTitle={meta.title}
            breadcrumb={meta.breadcrumb}
            userName={userName}
            userRole={userRole}
            onMenuClick={() => setMobileOpen(true)}
            profileHref={profileHref}
            settingsHref={settingsHref}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      <ChatAssistant />

      {/* ── Session timeout warning dialog ── */}
      <SessionTimeoutDialog
        show={showWarning}
        secondsLeft={secondsLeft}
        onExtend={extendSession}
        onLogout={logoutNow}
      />
    </div>
  );
}
