"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Bell, Search, LogOut, ChevronDown,
  Sun, Moon, Languages, UserCircle, Shield,
  X, Settings,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { languages, t } from "@/lib/i18n";

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  color: "green" | "yellow" | "pink";
}

const mockNotifications: Notification[] = [
  { id: "n1", title: "Closure Request",   body: "Det. Tigist Mekonnen requested case closure for TRK-2024-003.", time: "5 min ago",  read: false, color: "yellow" },
  { id: "n2", title: "New Case Assigned", body: "Case TRK-2024-004 has been assigned to Det. Abebe Girma.",     time: "1 hr ago",  read: false, color: "green"  },
  { id: "n3", title: "Missing Person Post", body: "New missing person post submitted by Off. Meron Tadesse.",   time: "3 hrs ago", read: true,  color: "pink"   },
  { id: "n4", title: "Report Generated",  body: "Monthly statistical report for November is now available.",    time: "Yesterday", read: true,  color: "green"  },
];

const colorDot: Record<string, string> = {
  green: "bg-[var(--green)]",
  yellow: "bg-[var(--yellow)]",
  pink: "bg-[var(--pink)]",
};

interface Props {
  pageTitle: string;
  breadcrumb?: string[];
  userName: string;
  userRole: string;
  onMenuClick: () => void;
  profileHref?: string;
  settingsHref?: string;
}

export default function DashboardHeader({
  pageTitle,
  breadcrumb,
  userName,
  userRole,
  onMenuClick,
  profileHref = "#",
  settingsHref,
}: Props) {
  const router = useRouter();
  const { dark, toggleDark, lang, setLang } = useTheme();
  const tr = t[lang];

  const [profileOpen,  setProfileOpen]  = useState(false);
  const [langOpen,     setLangOpen]     = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [notifs,       setNotifs]       = useState(mockNotifications);
  const [searchVal,    setSearchVal]    = useState("");

  const unread = notifs.filter((n) => !n.read).length;

  function closeAll() {
    setProfileOpen(false);
    setLangOpen(false);
    setNotifOpen(false);
  }

  function markAllRead() {
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  }

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      {/* ── Top accent bar ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] h-1 w-full" />

      {/* ── Main header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[var(--topbar-bg)] border-b border-[var(--border)] shadow-sm transition-colors duration-300">

        {/* Primary row */}
        <div className="flex items-center gap-2 px-4 h-16">

          {/* Hamburger */}
          <button
            onClick={onMenuClick}
            aria-label={tr.openMenu}
            className="lg:hidden p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Brand mark (desktop) */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#102A43] flex items-center justify-center shadow">
              <img src="/images/hossana-logo.svg" alt="Hossana Police" className="w-full h-full object-contain p-0.5" />
            </div>
          </div>

          {/* Breadcrumb + title */}
          <div className="flex-1 min-w-0">
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-[11px] text-[var(--muted)] mb-0.5">
                {breadcrumb.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="opacity-30">/</span>}
                    <span className={i === breadcrumb.length - 1 ? "text-[var(--green)] font-semibold" : ""}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            )}
            <h1 className="text-sm font-bold text-[var(--navy)] truncate">{pageTitle}</h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-9 w-56 focus-within:border-[var(--green)] focus-within:ring-2 focus-within:ring-[var(--green)]/20 transition-all">
            <Search size={14} className="text-[var(--muted)] shrink-0" />
            <input
              type="search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={tr.quickSearch}
              aria-label={tr.quickSearch}
              suppressHydrationWarning
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full"
            />
            {searchVal && (
              <button onClick={() => setSearchVal("")} className="text-[var(--muted)] hover:text-[var(--navy)]">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Dark toggle */}
          <button
            onClick={toggleDark}
            aria-label={dark ? "Light mode" : "Dark mode"}
            className="p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] hover:text-[var(--navy)] transition-colors"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setLangOpen((o) => !o); }}
              aria-label="Language" aria-expanded={langOpen}
              className="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] hover:text-[var(--navy)] transition-colors"
            >
              <Languages size={18} />
              <span className="text-xs font-bold uppercase">{lang}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-xl py-1 z-50"
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors
                        ${lang === l.code
                          ? "bg-[var(--green-light)] text-[var(--green-dark)] font-semibold"
                          : "text-[var(--charcoal)] hover:bg-[var(--surface2)]"
                        }`}
                    >
                      <span>{l.native}</span>
                      <span className="text-[11px] text-[var(--muted)]">{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setNotifOpen((o) => !o); }}
              aria-label={tr.notifications}
              aria-expanded={notifOpen}
              className="relative p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--pink)] text-white text-[9px] font-black flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">Notifications</p>
                      <p className="text-[11px] text-[var(--muted)]">{unread} unread</p>
                    </div>
                    <button onClick={markAllRead}
                      className="text-xs font-semibold text-[var(--green)] hover:underline">
                      Mark all read
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
                    {notifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => setNotifs((ns) => ns.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--surface2)]
                          ${!n.read ? "bg-[var(--surface2)]" : ""}`}
                      >
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colorDot[n.color]}`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold ${!n.read ? "text-[var(--navy)]" : "text-[var(--charcoal)]"}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-[var(--slate)] leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-[var(--muted)] mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-[var(--border)]">
                    <button className="text-xs font-semibold text-[var(--green)] hover:underline w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setProfileOpen((o) => !o); }}
              aria-label="Profile menu" aria-expanded={profileOpen}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface2)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-[var(--green-light)]">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[var(--navy)] leading-tight max-w-[110px] truncate">{userName}</p>
                <p className="text-[11px] text-[var(--slate)] leading-tight truncate">{userRole}</p>
              </div>
              <ChevronDown size={13} className={`text-[var(--muted)] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl py-1 z-50 overflow-hidden"
                >
                  {/* User block */}
                  <div className="px-4 py-3 border-b border-[var(--border)] bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{userName}</p>
                        <p className="text-[11px] text-green-200 truncate">{userRole}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setProfileOpen(false); router.push(profileHref); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors"
                    >
                      <UserCircle size={15} className="text-[var(--slate)]" />
                      My Profile
                    </button>
                    {settingsHref && (
                    <button
                      onClick={() => { setProfileOpen(false); router.push(settingsHref); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors"
                    >
                      <Settings size={15} className="text-[var(--slate)]" />
                      Settings
                    </button>
                    )}
                  </div>

                  <div className="border-t border-[var(--border)] py-1">
                    <button
                      onClick={() => router.push("/login")}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={15} />
                      {tr.signOut}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Secondary nav — page-level quick links */}
        <div className="hidden md:flex items-center gap-1 px-4 pb-2 border-t border-[var(--border)]/50 pt-1.5">
          {breadcrumb && breadcrumb.map((crumb, i) => (
            <span key={i} className={`flex items-center gap-1 text-[11px] font-medium
              ${i === breadcrumb.length - 1
                ? "text-[var(--green)] bg-[var(--green-light)] dark:bg-green-900/20 px-2.5 py-0.5 rounded-full"
                : "text-[var(--muted)]"
              }`}>
              {i > 0 && <span className="text-[var(--border)] mr-0.5">/</span>}
              {crumb}
            </span>
          ))}
        </div>
      </header>
    </>
  );
}

