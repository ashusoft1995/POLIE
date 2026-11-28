"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Bell, Search, LogOut, ChevronDown,
  Sun, Moon, Languages, UserCircle,
  X, Settings, FileText, Calendar, Scale, AlertTriangle,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { languages, t } from "@/lib/i18n";
import { crimeReportApi, leaveApi, courtReferralApi, casesApi } from "@/lib/api-client";
import { clearSession } from "@/lib/session";

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  color: "green" | "yellow" | "pink" | "blue";
  icon: typeof FileText;
  href?: string;
}

const colorDot: Record<string, string> = {
  green:  "bg-[var(--green)]",
  yellow: "bg-[var(--yellow)]",
  pink:   "bg-[var(--pink)]",
  blue:   "bg-blue-500",
};

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

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
  pageTitle, breadcrumb, userName, userRole,
  onMenuClick, profileHref = "#", settingsHref,
}: Props) {
  const router = useRouter();
  const { dark, toggleDark, lang, setLang } = useTheme();
  const tr = t[lang];

  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [notifs,      setNotifs]      = useState<Notification[]>([]);
  const [searchVal,   setSearchVal]   = useState("");

  const unread = notifs.filter(n => !n.read).length;

  function closeAll() {
    setProfileOpen(false);
    setLangOpen(false);
    setNotifOpen(false);
  }

  function markAllRead() {
    setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  }

  const fetchNotifications = useCallback(async () => {
    const items: Notification[] = [];
    
    // Check if user is authenticated
    const token = typeof window !== "undefined" ? sessionStorage.getItem("hcops_token") : null;
    if (!token) {
      setNotifs(items);
      return;
    }

    try {
      const reports = await crimeReportApi.getByStatus("PENDING");
      reports.slice(0, 3).forEach((r: any) => {
        items.push({
          id:    `cr-${r.id}`,
          title: "New Crime Report",
          body:  `${(r.crimeType ?? "").replace(/_/g, " ")} at ${r.incidentLocation} by ${r.reporterName}.`,
          time:  timeAgo(r.submittedAt),
          read:  false,
          color: r.isUrgent ? "pink" : "yellow",
          icon:  FileText,
          href:  `/preventive/criminals?open=${r.id}`,
        });
      });
    } catch (err) { 
      console.debug("Crime reports unavailable:", err);
    }

    try {
      const leaves = await leaveApi.getByStatus("PENDING");
      leaves.slice(0, 2).forEach((l: any) => {
        items.push({
          id:    `lr-${l.id}`,
          title: "Leave Request",
          body:  `${l.employee?.fullName ?? "An officer"} requested ${(l.leaveType ?? "").toLowerCase()} leave (${l.numberOfDays} days).`,
          time:  timeAgo(l.requestedAt),
          read:  false,
          color: "yellow",
          icon:  Calendar,
          href:  `/hr/leave?open=${l.id}`,
        });
      });
    } catch (err) { 
      // Leave requests may not be available if user is not HR
      console.debug("Leave requests unavailable:", err);
    }

    try {
      const referrals = await courtReferralApi.getAll();
      const pending = (referrals as any[]).filter(r => r.status === "PENDING_APPROVAL");
      pending.slice(0, 2).forEach((r: any) => {
        items.push({
          id:    `ref-${r.id}`,
          title: "Court Referral Pending",
          body:  `${r.submittedByDetective?.fullName ?? "A detective"} submitted referral ${r.referralNumber} for review.`,
          time:  timeAgo(r.submittedAt),
          read:  false,
          color: "blue",
          icon:  Scale,
          href:  `/police-head/referrals?open=${r.id}`,
        });
      });
    } catch { /* skip */ }

    try {
      const closureCases = await casesApi.getByStatus("PENDING_COURT");
      closureCases.slice(0, 2).forEach((c: any) => {
        items.push({
          id:    `cs-${c.id}`,
          title: "Closure Request",
          body:  `Case ${c.caseNumber} "${c.title}" is awaiting closure approval.`,
          time:  timeAgo(c.createdAt),
          read:  false,
          color: "green",
          icon:  AlertTriangle,
          href:  `/police-head/closure-review?open=${c.id}`,
        });
      });
    } catch { /* skip */ }

    const seen = new Set<string>();
    const unique = items.filter(n => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    }).slice(0, 8);

    setNotifs(prev => {
      const readMap = new Map(prev.map(n => [n.id, n.read]));
      return unique.map(n => ({ ...n, read: readMap.get(n.id) ?? false }));
    });
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const initials = userName.split(" ").map(w => w[0]).slice(0, 2).join("");

  return (
    <>
      <div className="bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] h-1 w-full" />

      <header className="sticky top-0 z-30 bg-[var(--topbar-bg)] border-b border-[var(--border)] shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 px-4 h-16">

          {/* Hamburger */}
          <button onClick={onMenuClick} aria-label={tr.openMenu}
            className="lg:hidden p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
            <Menu size={20} />
          </button>

          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#102A43] flex items-center justify-center shadow">
              <img src="/images/hossana-logo.svg" alt="Hossana Police" className="w-full h-full object-contain p-0.5" />
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-[11px] text-[var(--muted)] mb-0.5">
                {breadcrumb.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="opacity-30">/</span>}
                    <span className={i === breadcrumb.length - 1 ? "text-[var(--green)] font-semibold" : ""}>{crumb}</span>
                  </span>
                ))}
              </nav>
            )}
            <h1 className="text-sm font-bold text-[var(--navy)] truncate">{pageTitle}</h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-9 w-56 focus-within:border-[var(--green)] focus-within:ring-2 focus-within:ring-[var(--green)]/20 transition-all">
            <Search size={14} className="text-[var(--muted)] shrink-0" />
            <input type="search" value={searchVal} onChange={e => setSearchVal(e.target.value)}
              placeholder={tr.quickSearch} suppressHydrationWarning
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full" />
            {searchVal && <button onClick={() => setSearchVal("")} className="text-[var(--muted)] hover:text-[var(--navy)]"><X size={13} /></button>}
          </div>

          {/* Dark toggle */}
          <button onClick={toggleDark} aria-label={dark ? "Light mode" : "Dark mode"}
            className="p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] hover:text-[var(--navy)] transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language picker */}
          <div className="relative">
            <button onClick={() => { closeAll(); setLangOpen(o => !o); }}
              aria-label="Language" aria-expanded={langOpen}
              className="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] hover:text-[var(--navy)] transition-colors">
              <Languages size={18} />
              <span className="text-xs font-bold uppercase">{lang}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity:0,y:6,scale:0.97 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:6,scale:0.97 }}
                  transition={{ duration:0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-xl py-1 z-50">
                  {languages.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors
                        ${lang === l.code ? "bg-[var(--green-light)] text-[var(--green-dark)] font-semibold" : "text-[var(--charcoal)] hover:bg-[var(--surface2)]"}`}>
                      <span>{l.native}</span>
                      <span className="text-[11px] text-[var(--muted)]">{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications bell */}
          <div className="relative">
            <button onClick={() => { closeAll(); setNotifOpen(o => !o); }}
              aria-label={tr.notifications} aria-expanded={notifOpen}
              className="relative p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
              <Bell size={18} />
              {unread > 0 && (
                <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--pink)] text-white text-[9px] font-black flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </motion.span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div initial={{ opacity:0,y:6,scale:0.97 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:6,scale:0.97 }}
                  transition={{ duration:0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden">

                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">Notifications</p>
                      <p className="text-[11px] text-[var(--muted)]">{unread} unread</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={fetchNotifications} className="text-[11px] text-[var(--muted)] hover:text-[var(--green)] transition-colors">Refresh</button>
                      <button onClick={markAllRead} className="text-xs font-semibold text-[var(--green)] hover:underline">Mark all read</button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
                    {notifs.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-[var(--muted)]">No notifications right now.</div>
                    ) : notifs.map(n => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id}
                          onClick={() => {
                            setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x));
                            if (n.href) { setNotifOpen(false); router.push(n.href); }
                          }}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--surface2)] ${!n.read ? "bg-[var(--surface2)]" : ""}`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            n.color === "pink"   ? "bg-red-100 text-red-500" :
                            n.color === "yellow" ? "bg-amber-100 text-amber-500" :
                            n.color === "blue"   ? "bg-blue-100 text-blue-500" :
                                                   "bg-green-100 text-green-600"}`}>
                            <Icon size={13} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-semibold ${!n.read ? "text-[var(--navy)]" : "text-[var(--charcoal)]"}`}>{n.title}</p>
                              {n.href && <span className="text-[9px] text-[var(--green)] font-bold shrink-0">View</span>}
                            </div>
                            <p className="text-[11px] text-[var(--slate)] leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                            <p className="text-[10px] text-[var(--muted)] mt-1">{n.time}</p>
                          </div>
                          {!n.read && <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${colorDot[n.color]}`} />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2.5 border-t border-[var(--border)]">
                    <p className="text-[10px] text-[var(--muted)] text-center">Live updates every 60s</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { closeAll(); setProfileOpen(o => !o); }}
              aria-label="Profile menu" aria-expanded={profileOpen}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface2)] transition-colors">
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
                <motion.div initial={{ opacity:0,y:6,scale:0.97 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:6,scale:0.97 }}
                  transition={{ duration:0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl py-1 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)] bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{userName}</p>
                        <p className="text-[11px] text-green-200 truncate">{userRole}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setProfileOpen(false); router.push(profileHref); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors">
                      <UserCircle size={15} className="text-[var(--slate)]" /> My Profile
                    </button>
                    {settingsHref && (
                      <button onClick={() => { setProfileOpen(false); router.push(settingsHref); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors">
                        <Settings size={15} className="text-[var(--slate)]" /> Settings
                      </button>
                    )}
                  </div>
                  <div className="border-t border-[var(--border)] py-1">
                    <button onClick={() => { setProfileOpen(false); clearSession(); router.replace("/login"); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut size={15} /> {tr.signOut}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Breadcrumb strip */}
        <div className="hidden md:flex items-center gap-1 px-4 pb-2 border-t border-[var(--border)]/50 pt-1.5">
          {breadcrumb && breadcrumb.map((crumb, i) => (
            <span key={i} className={`flex items-center gap-1 text-[11px] font-medium
              ${i === breadcrumb.length - 1
                ? "text-[var(--green)] bg-[var(--green-light)] dark:bg-green-900/20 px-2.5 py-0.5 rounded-full"
                : "text-[var(--muted)]"}`}>
              {i > 0 && <span className="text-[var(--border)] mr-0.5">/</span>}
              {crumb}
            </span>
          ))}
        </div>
      </header>
    </>
  );
}
