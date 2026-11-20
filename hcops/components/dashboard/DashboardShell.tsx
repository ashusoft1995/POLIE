"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar, { NavItem } from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChatAssistant from "@/components/dashboard/ChatAssistant";

interface Meta { title: string; breadcrumb: string[] }

interface Props {
  children: React.ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  userRole: string;
  profileHref: string;
  settingsHref?: string;
  metaMap: Record<string, Meta>;
  fallbackMeta: Meta;
}

export default function DashboardShell({
  children, navItems, roleLabel, userName, userRole,
  profileHref, settingsHref, metaMap, fallbackMeta,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const meta = metaMap[pathname] ?? fallbackMeta;

  // Avoid hydration mismatch — only render sidebar state after mount
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="flex h-screen bg-[var(--page-bg)] overflow-hidden">

      {/* ── Sidebar — sticky, full height, own scroll ── */}
      <div
        className={`hidden lg:flex flex-col shrink-0 h-full overflow-y-auto sticky top-0 z-30 transition-all duration-300
          ${mounted && sidebarCollapsed ? "w-16" : "w-64"}`}
      >
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

      {/* Mobile sidebar drawer */}
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

        {/* Fixed top header */}
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

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Chat assistant — always visible */}
      <ChatAssistant />
    </div>
  );
}
