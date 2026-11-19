"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface Props {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const icons = { success: CheckCircle, error: XCircle, info: Info };
const colors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
};
const iconColors = {
  success: "text-green-600",
  error:   "text-red-600",
  info:    "text-blue-600",
};

export default function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-80"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-3 p-3 rounded-xl border shadow-lg ${colors[t.type]}`}
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${iconColors[t.type]}`} />
              <p className="text-sm flex-1 font-medium">{t.message}</p>
              <button
                onClick={() => onRemove(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/** Auto-dismiss helper */
export function useAutoDismiss(
  toasts: ToastMessage[],
  onRemove: (id: string) => void,
  delay = 4000
) {
  useEffect(() => {
    if (!toasts.length) return;
    const id = toasts[toasts.length - 1].id;
    const t = setTimeout(() => onRemove(id), delay);
    return () => clearTimeout(t);
  }, [toasts, onRemove, delay]);
}
