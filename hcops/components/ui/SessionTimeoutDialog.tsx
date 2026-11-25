"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogOut, RefreshCw } from "lucide-react";

interface Props {
  show:          boolean;
  secondsLeft:   number;
  onExtend:      () => void;
  onLogout:      () => void;
}

export default function SessionTimeoutDialog({ show, secondsLeft, onExtend, onLogout }: Props) {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = mins > 0
    ? `${mins}m ${String(secs).padStart(2,"0")}s`
    : `${secondsLeft}s`;

  // Progress ring — 120s max (warning window is 2min = 120s)
  const max    = 120;
  const pct    = Math.min(secondsLeft / max, 1);
  const r      = 28;
  const circ   = 2 * Math.PI * r;
  const dash   = circ * pct;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 440, damping: 34 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-[340px] p-6 z-10 text-center"
            role="alertdialog"
            aria-labelledby="timeout-title"
            aria-describedby="timeout-desc"
          >
            {/* Countdown ring */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              <svg width="64" height="64" className="-rotate-90">
                {/* Track */}
                <circle cx="32" cy="32" r={r} fill="none"
                  stroke="var(--border)" strokeWidth="4" />
                {/* Progress */}
                <circle cx="32" cy="32" r={r} fill="none"
                  stroke={secondsLeft <= 30 ? "#DC2626" : secondsLeft <= 60 ? "#D97706" : "#2563EB"}
                  strokeWidth="4"
                  strokeDasharray={`${dash} ${circ}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock size={22} className={secondsLeft <= 30 ? "text-red-500" : "text-[var(--slate)]"} />
              </div>
            </div>

            <h2 id="timeout-title" className="text-base font-bold text-[var(--navy)] mb-1">
              Session Expiring
            </h2>
            <p id="timeout-desc" className="text-sm text-[var(--slate)] mb-2">
              You will be logged out due to inactivity in
            </p>
            <p className={`text-3xl font-extrabold tabular-nums mb-5 ${
              secondsLeft <= 30 ? "text-red-500" :
              secondsLeft <= 60 ? "text-amber-500" : "text-[var(--navy)]"
            }`}>
              {display}
            </p>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={onLogout}
                className="flex-1 h-10 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--slate)] hover:bg-[var(--surface2)] flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut size={14} /> Logout
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={onExtend}
                className="flex-1 h-10 rounded-xl bg-[var(--green)] hover:bg-[var(--green-dark)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <RefreshCw size={14} /> Stay Logged In
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
