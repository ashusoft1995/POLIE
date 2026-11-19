"use client";
import { useState } from "react";
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
  metaMap: Record<string, Meta>;
  fallbackMeta: Meta;
}

export default function DashboardShell({
  children, navItems, roleLabel, userName, userRole,
  profileHref, metaMap, fallbackMeta,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const meta = metaMap[pathname] ?? fallbackMeta;

  return (
    /*
     * Outer wrapper: full viewport height, no overflow on the outer box.
     * Column layout: [sidebar | right-column]
     * Right column: [fixed-header | scrollable-content]
     * Footer: full-width at the very bottom, spanning BOTH sidebar and content.
     */
    <div className="flex flex-col h-screen bg-[var(--page-bg)]">

      {/* ── Top layer: sidebar + main ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar — sticky, full height, own scroll ── */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 h-full overflow-y-auto sticky top-0 z-30">
          <Sidebar
            items={navItems}
            roleLabel={roleLabel}
            userName={userName}
            userRole={userRole}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
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
          />
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

          {/* Fixed top header — does NOT scroll */}
          <div className="shrink-0 sticky top-0 z-40 bg-[var(--topbar-bg)] border-b border-[var(--border)] shadow-sm">
            <DashboardHeader
              pageTitle={meta.title}
              breadcrumb={meta.breadcrumb}
              userName={userName}
              userRole={userRole}
              onMenuClick={() => setMobileOpen(true)}
              profileHref={profileHref}
            />
          </div>

          {/* Scrollable content area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>

      {/* ── Footer Removed ───────────────────────────────────── */}

      {/* Chat assistant — always visible */}
      <ChatAssistant />
    </div>
  );
}
