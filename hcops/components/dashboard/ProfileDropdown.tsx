"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown, Camera } from "lucide-react";

interface ProfileDropdownProps {
  userName: string;
  userRole: string;
  userEmail?: string;
  profileHref: string;
  settingsHref?: string;
  profileImage?: string;
  onImageUpload?: (file: File) => void;
}

export default function ProfileDropdown({
  userName,
  userRole,
  userEmail,
  profileHref,
  settingsHref,
  profileImage,
  onImageUpload,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(profileImage ?? null);
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  /* close on outside click */
  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  /* Escape key */
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    onImageUpload?.(file);
    setOpen(false);
  }, [onImageUpload]);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface2)] transition-colors"
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 shrink-0">
          {preview ? (
            <img
              src={preview}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--green-light)]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[var(--green-light)]">
              {initials}
            </div>
          )}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-[var(--navy)] leading-tight max-w-[110px] truncate">{userName}</p>
          <p className="text-[11px] text-[var(--slate)] leading-tight truncate">{userRole}</p>
        </div>

        <ChevronDown
          size={13}
          className={`text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* User block */}
            <div className="px-4 py-3 bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  {preview ? (
                    <img src={preview} alt={userName} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                      {initials}
                    </div>
                  )}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow"
                    title="Change photo"
                  >
                    <Camera size={9} className="text-[var(--green-dark)]" />
                  </button>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  {userEmail && (
                    <p className="text-[10px] text-green-200 truncate">{userEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href={profileHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors"
              >
                <User size={15} className="text-[var(--slate)]" />
                My Profile
              </Link>

              <button
                onClick={() => { fileRef.current?.click(); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors"
              >
                <Camera size={15} className="text-[var(--slate)]" />
                Upload Photo
              </button>

              {settingsHref && (
                <Link
                  href={settingsHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors"
                >
                  <Settings size={15} className="text-[var(--slate)]" />
                  Settings
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-[var(--border)] py-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
