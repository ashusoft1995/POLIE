"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <button
              onClick={onCancel}
              aria-label="Cancel"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-red-50">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <div>
                <h2 id="confirm-title" className="font-semibold text-[#1E293B] text-base">
                  {title}
                </h2>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{message}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
