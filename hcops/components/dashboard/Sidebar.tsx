"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  labelKey: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

interface Props {
  items: NavItem[];
  roleLabel: string;
  userName: string;
  userRole: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  /* exact match for root dashboard, prefix match for sub-pages */
  const active =
    item.href === "/police-head"
      ? pathname === "/police-head"
      : pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150 group select-none overflow-hidden
        ${active
          ? "text-white shadow-md"
          : "text-[var(--sidebar-text)] hover:shadow-md hover:shadow-black/20"
        }
      `}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-[var(--green)]"
          style={{ zIndex: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      <Icon
        size={18}
        className={
          active
            ? "text-white shrink-0"
            : "text-[var(--sidebar-muted)] shrink-0"
        }
      />
      <span className="truncate">{item.label}</span>

      {/* underline indicator on hover (non-active) */}
      {!active && (
        <span className="absolute bottom-1 left-3 right-3 h-px bg-[var(--green)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200 rounded-full" />
      )}
    </Link>
  );
}

function SidebarInner({
  items,
  roleLabel,
  userName,
  userRole,
  onClose,
}: {
  items: NavItem[];
  roleLabel: string;
  userName: string;
  userRole: string;
  onClose?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] transition-colors duration-300">

      {/* ── Brand ───────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        {/* Real logo image */}
        <div className="relative shrink-0 w-11 h-11 rounded-2xl overflow-hidden shadow-lg bg-white/10">
          <img
            src="/images/hossana-logo.svg"
            alt="Hossana Police"
            className="w-full h-full object-contain p-0.5"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#D4A72C] border-2 border-[#102A43]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-extrabold text-white leading-tight tracking-tight truncate">
            Hossana City
          </p>
          <p className="text-[10px] text-blue-200 leading-tight font-medium uppercase tracking-widest">
            Police Station
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* ── Role badge ──────────────────────────── */}
      <div className="px-4 pt-3 pb-1">
        <span className="badge badge-green text-[10px] uppercase tracking-wider">{roleLabel}</span>
      </div>

      {/* ── Scrollable nav ──────────────────────── */}
      <nav
        aria-label="Sidebar navigation"
        className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto overscroll-contain"
      >
        {items.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* ── Logout + user strip ─────────────────── */}
      <div className="px-3 pb-3 border-t border-[var(--border)] pt-3 space-y-2">
        {/* User mini-card */}
        <Link
          href="/police-head/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--surface2)] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
            {userName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--navy)] truncate">{userName}</p>
            <p className="text-[10px] text-[var(--muted)] truncate">{userRole}</p>
          </div>
        </Link>

        {/* Logout button */}
        <button
          onClick={() => { onClose?.(); router.push("/login"); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
        >
          <LogOut size={16} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ items, roleLabel, userName, userRole, mobileOpen, onMobileClose }: Props) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-r border-[var(--border)] shadow-sm">
        <SidebarInner items={items} roleLabel={roleLabel} userName={userName} userRole={userRole} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
              aria-hidden
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 shadow-2xl lg:hidden"
            >
              <SidebarInner items={items} roleLabel={roleLabel} userName={userName} userRole={userRole} onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

