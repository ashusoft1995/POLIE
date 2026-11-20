"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
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
  collapsed?: boolean;
  onCollapse?: (val: boolean) => void;
}

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active =
    item.href.endsWith("/police-head") ||
    item.href.endsWith("/hr") ||
    item.href.endsWith("/detective") ||
    item.href.endsWith("/preventive") ||
    item.href.endsWith("/traffic") ||
    item.href.endsWith("/system-admin") ||
    item.href.endsWith("/citizen")
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`
        relative flex items-center gap-3 rounded-xl text-sm font-medium
        transition-all duration-150 group select-none overflow-hidden
        ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}
        ${
          active
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
      {!collapsed && <span className="truncate">{item.label}</span>}

      {/* Hover underline (non-active, non-collapsed) */}
      {!active && !collapsed && (
        <span className="absolute bottom-1 left-3 right-3 h-px bg-[var(--green)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200 rounded-full" />
      )}

      {/* Tooltip on collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-lg bg-[var(--navy)] text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
          {item.label}
        </span>
      )}
    </Link>
  );
}

function SidebarInner({
  items,
  roleLabel,
  userName,
  userRole,
  collapsed,
  onToggleCollapse,
  onClose,
}: {
  items: NavItem[];
  roleLabel: string;
  userName: string;
  userRole: string;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}) {
  const router = useRouter();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] transition-colors duration-300">
      {/* ── Brand ───────────────────────────────── */}
      <div
        className={`flex items-center border-b border-white/10 transition-all duration-300
          ${collapsed ? "justify-center px-2 py-4" : "gap-3 px-4 py-4"}`}
      >
        <div className="relative shrink-0 w-10 h-10 rounded-2xl overflow-hidden shadow-lg bg-white/10">
          <img
            src="/images/hossana-logo.svg"
            alt="Hossana Police"
            className="w-full h-full object-contain p-0.5"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D4A72C] border-2 border-[#102A43]" />
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-extrabold text-white leading-tight tracking-tight truncate">
              Hossana City
            </p>
            <p className="text-[10px] text-blue-200 leading-tight font-medium uppercase tracking-widest">
              Police Station
            </p>
          </div>
        )}

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors ml-auto"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* ── Role badge ──────────────────────────── */}
      {!collapsed && (
        <div className="px-4 pt-3 pb-1">
          <span className="badge badge-green text-[10px] uppercase tracking-wider">
            {roleLabel}
          </span>
        </div>
      )}

      {/* ── Scrollable nav ──────────────────────── */}
      <nav
        aria-label="Sidebar navigation"
        className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overscroll-contain"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.15) transparent",
        }}
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* ── Collapse toggle ─────────────────────── */}
      {onToggleCollapse && (
        <div className="px-2 pb-2">
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex items-center gap-2 w-full rounded-xl px-3 py-2 text-xs font-medium text-[var(--sidebar-muted)] hover:text-white hover:bg-white/10 transition-colors
              ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ── User strip + Logout ─────────────────── */}
      <div className="px-2 pb-3 border-t border-[var(--border)] pt-3 space-y-1">
        {collapsed ? (
          <>
            <div
              title={`${userName} — ${userRole}`}
              className="flex justify-center py-1.5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xs font-bold shadow">
                {initials}
              </div>
            </div>
            <button
              onClick={() => {
                onClose?.();
                router.push("/login");
              }}
              title="Sign Out"
              className="flex justify-center w-full py-2 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {userName}
                </p>
                <p className="text-[10px] text-[var(--sidebar-muted)] truncate">
                  {userRole}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose?.();
                router.push("/login");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} className="shrink-0" />
              <span>Sign Out</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({
  items,
  roleLabel,
  userName,
  userRole,
  mobileOpen,
  onMobileClose,
  collapsed = false,
  onCollapse,
}: Props) {
  return (
    <>
      {/* Desktop — sticky, full height */}
      <aside
        className={`hidden lg:flex flex-col h-full border-r border-[var(--border)] shadow-sm transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}`}
      >
        <SidebarInner
          items={items}
          roleLabel={roleLabel}
          userName={userName}
          userRole={userRole}
          collapsed={collapsed}
          onToggleCollapse={() => onCollapse?.(!collapsed)}
        />
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
              className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl lg:hidden"
            >
              <SidebarInner
                items={items}
                roleLabel={roleLabel}
                userName={userName}
                userRole={userRole}
                collapsed={false}
                onClose={onMobileClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
