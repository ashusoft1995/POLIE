"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Search, LogOut, User, ChevronDown, Sun, Moon, Languages, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { languages, t } from "@/lib/i18n";

interface Props {
  pageTitle: string;
  breadcrumb?: string[];
  userName: string;
  userRole: string;
  onMenuClick: () => void;
}

export default function Topbar({ pageTitle, breadcrumb, userName, userRole, onMenuClick }: Props) {
  const router = useRouter();
  const { dark, toggleDark, lang, setLang } = useTheme();
  const tr = t[lang];
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[var(--topbar-bg)] border-b border-[var(--border)] shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2 px-4 h-14">

        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          aria-label={tr.openMenu}
          className="lg:hidden p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb + title */}
        <div className="flex-1 min-w-0">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-[11px] text-[var(--muted)] mb-0.5">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="opacity-40">/</span>}
                  <span className={i === breadcrumb.length - 1 ? "text-[var(--green)] font-semibold" : ""}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-sm font-bold text-[var(--navy)] truncate">{pageTitle}</h1>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-9 w-52">
          <Search size={14} className="text-[var(--muted)] shrink-0" />
          <input
            type="search"
            placeholder={tr.quickSearch}
            aria-label={tr.quickSearch}
            className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full"
          />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] hover:text-[var(--navy)] transition-colors"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language picker */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen((o) => !o); setProfileOpen(false); }}
            aria-label="Select language"
            aria-expanded={langOpen}
            className="flex items-center gap-1.5 p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] hover:text-[var(--navy)] transition-colors"
          >
            <Languages size={18} />
            <span className="hidden sm:inline text-xs font-semibold uppercase">{lang}</span>
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: .97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: .97 }}
                transition={{ duration: .15 }}
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

        {/* Notification bell */}
        <button
          aria-label={tr.notifications}
          className="relative p-2 rounded-xl text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--pink)]" aria-hidden />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen((p) => !p); setLangOpen(false); }}
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface2)] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--green)] flex items-center justify-center shrink-0">
              <User size={14} className="text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[var(--navy)] leading-tight max-w-[110px] truncate">{userName}</p>
              <p className="text-[11px] text-[var(--slate)] leading-tight">{userRole}</p>
            </div>
            <ChevronDown
              size={13}
              className={`text-[var(--muted)] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: .97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: .97 }}
                transition={{ duration: .15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-xl py-1 z-50"
              >
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-xs font-bold text-[var(--navy)] truncate">{userName}</p>
                  <p className="text-[11px] text-[var(--slate)]">{userRole}</p>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); router.push("/police-head/profile"); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors"
                >
                  <UserCircle size={14} />
                  My Profile
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={14} />
                  {tr.signOut}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
