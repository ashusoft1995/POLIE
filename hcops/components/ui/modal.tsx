"use client";
import { ReactNode, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** xs ≈ 340px | sm ≈ 420px | md ≈ 520px | lg ≈ 680px */
  size?: "xs" | "sm" | "md" | "lg";
  /** Show a coloured top accent bar */
  accent?: "blue" | "green" | "red" | "yellow";
  subtitle?: string;
}

const sizeMap = {
  xs: "max-w-[340px]",
  sm: "max-w-[420px]",
  md: "max-w-[520px]",
  lg: "max-w-[680px]",
};

const accentMap: Record<string, { bar: string; icon: string }> = {
  blue:   { bar: "from-[#2563EB] to-[#1D4ED8]",   icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300" },
  green:  { bar: "from-emerald-500 to-green-600",   icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300" },
  red:    { bar: "from-red-500 to-red-700",          icon: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300" },
  yellow: { bar: "from-amber-400 to-yellow-600",     icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300" },
};

export default function Modal({
  isOpen, onClose, title, children,
  size = "sm", accent = "blue", subtitle,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const a = accentMap[accent] ?? accentMap.blue;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center sm:px-4 pb-0 sm:pb-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
            onClick={onClose}
          />

          {/* Panel — slides up on mobile, scales in on desktop */}
          <motion.div
            ref={panelRef}
            key="panel"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 440, damping: 34, mass: 0.8 }}
            className={`
              relative w-full ${sizeMap[size]}
              bg-[var(--card-bg)] shadow-2xl overflow-hidden
              border border-[var(--border)]
              rounded-t-2xl sm:rounded-2xl
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{ maxHeight: "92dvh" }}
          >
            {/* Top accent gradient bar */}
            <div className={`h-[3px] w-full bg-gradient-to-r ${a.bar}`} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface2)]/40">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${a.icon}`}>
                  {title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 id="modal-title" className="text-sm font-bold text-[var(--navy)] leading-tight truncate">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-[11px] text-[var(--muted)] mt-0.5 truncate">{subtitle}</p>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                aria-label="Close"
                className="ml-3 w-7 h-7 rounded-lg text-[var(--muted)] hover:text-[var(--navy)] hover:bg-[var(--border)] flex items-center justify-center transition-colors shrink-0"
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Scrollable content — custom thin scrollbar */}
            <div
              className="overflow-y-auto px-5 py-4"
              style={{
                maxHeight: "calc(92dvh - 90px)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--border) transparent",
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
