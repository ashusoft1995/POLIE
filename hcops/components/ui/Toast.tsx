"use client";
import {
  createContext, useContext, useState, useCallback,
  useEffect, useRef, ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, default 4000
}

/* ─────────────────────────────────────────────────────
   Per-toast config
───────────────────────────────────────────────────── */
const config: Record<
  ToastType,
  { bg: string; border: string; text: string; bar: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
    bar: "bg-green-500",
    Icon: CheckCircle2,
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    bar: "bg-red-500",
    Icon: XCircle,
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
    bar: "bg-amber-500",
    Icon: AlertTriangle,
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    bar: "bg-blue-500",
    Icon: Info,
  },
};

/* ─────────────────────────────────────────────────────
   Single toast item
───────────────────────────────────────────────────── */
function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}) {
  const duration = toast.duration ?? 4000;
  const { bg, border, text, bar, Icon } = config[toast.type];
  const startRef = useRef(Date.now());
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct <= 0) { clearInterval(interval); onRemove(toast.id); }
    }, 50);
    return () => clearInterval(interval);
  }, [duration, toast.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden rounded-xl border shadow-xl w-80 ${bg} ${border}`}
      role="alert"
      aria-live="assertive"
    >
      {/* Content */}
      <div className={`flex items-start gap-3 p-3.5 ${text}`}>
        <Icon size={18} className="shrink-0 mt-0.5" />
        <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          aria-label="Dismiss"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`h-0.5 ${bar} transition-all duration-50`}
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   Container (renders toasts in portal-like fixed div)
───────────────────────────────────────────────────── */
export default function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   useAutoDismiss — kept for backward compatibility;
   ToastItem now self-dismisses, but this hook can still
   be used to wire up external cleanup.
───────────────────────────────────────────────────── */
export function useAutoDismiss(
  _toasts: ToastMessage[],
  _remove: (id: string) => void,
) {
  // No-op: ToastItem manages its own auto-dismiss via progress bar.
}

/* ─────────────────────────────────────────────────────
   Context API (ToastProvider + useToast)
───────────────────────────────────────────────────── */
interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration?: number) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
