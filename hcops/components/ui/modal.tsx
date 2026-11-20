"use client";
import { ReactNode, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** xs ≈ 360px | sm ≈ 448px | md ≈ 560px | lg ≈ 720px */
  size?: "xs" | "sm" | "md" | "lg";
  /** Show a coloured top accent bar */
  accent?: "blue" | "green" | "red" | "yellow";
}

const sizeMap = {
  xs: "max-w-sm",
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const accentMap = {
  blue:   "from-[var(--green)] to-[var(--green-dark)]",
  green:  "from-emerald-500 to-green-700",
  red:    "from-red-500 to-red-700",
  yellow: "from-amber-400 to-yellow-600",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "sm",
  accent = "blue",
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className={`relative w-full ${sizeMap[size]} bg-[var(--card-bg)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Accent bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${accentMap[accent]}`} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
              <h2
                id="modal-title"
                className="text-sm font-bold text-[var(--navy)] leading-tight"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--navy)] hover:bg-[var(--surface2)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[80vh] px-5 py-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
