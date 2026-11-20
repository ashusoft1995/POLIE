"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Shield, CheckCircle2, Clock, AlertTriangle,
  FileText, Calendar, Hash, KeyRound, Info,
} from "lucide-react";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";

/* ── Mock tracker DB (hashed PINs are not shown; only status is returned) */
const MOCK_REPORTS: Record<
  string,
  { pin: string; date: string; type: string; status: string; message: string }
> = {
  "RPT-2024-001": {
    pin: "4821",
    date: "2024-11-10",
    type: "Crime Report",
    status: "Under Review",
    message: "Your report has been received and is currently being reviewed by an officer.",
  },
  "RPT-2024-007": {
    pin: "9134",
    date: "2024-11-18",
    type: "Missing Person",
    status: "Investigation Active",
    message: "An investigation has been opened. Officers are actively working on your case.",
  },
  "RPT-2024-012": {
    pin: "3357",
    date: "2024-11-22",
    type: "Traffic Incident",
    status: "Resolved",
    message: "Your reported incident has been resolved and filed.",
  },
};

const STATUS_CFG: Record<string, { badge: string; icon: typeof CheckCircle2; label: string }> = {
  "Under Review": {
    badge: "badge-yellow",
    icon: Clock,
    label: "Under Review",
  },
  "Investigation Active": {
    badge: "badge-blue",
    icon: Shield,
    label: "Active Investigation",
  },
  Resolved: {
    badge: "badge-green",
    icon: CheckCircle2,
    label: "Resolved",
  },
};

export default function TrackReportPage() {
  const [ref, setRef]       = useState("");
  const [pin, setPin]       = useState("");
  const [result, setResult] = useState<null | "found" | "not-found" | "wrong-pin">(null);
  const [data, setData]     = useState<(typeof MOCK_REPORTS)[string] | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage["type"], message: string) =>
      setToasts((t) => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]),
    [],
  );
  const removeToast = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (attempts >= 5) {
      addToast("error", "Too many attempts. Please try again later.");
      return;
    }

    const trimRef = ref.trim().toUpperCase();
    const trimPin = pin.trim();

    if (!trimRef || !trimPin) {
      addToast("warning", "Please enter both your Tracking Reference and PIN.");
      return;
    }
    if (trimPin.length !== 4 || !/^\d{4}$/.test(trimPin)) {
      addToast("error", "PIN must be exactly 4 digits.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    const record = MOCK_REPORTS[trimRef];
    if (!record) {
      setAttempts((a) => a + 1);
      setResult("not-found");
      setData(null);
      return;
    }
    if (record.pin !== trimPin) {
      setAttempts((a) => a + 1);
      setResult("wrong-pin");
      setData(null);
      return;
    }

    setAttempts(0);
    setResult("found");
    setData(record);
  }

  function handleReset() {
    setRef(""); setPin("");
    setResult(null); setData(null);
  }

  const statusCfg = data ? STATUS_CFG[data.status] : null;

  return (
    <>
      <div className="max-w-lg mx-auto space-y-5 pb-8">
        {/* Header */}
        <div className="text-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[var(--green-light)] flex items-center justify-center mx-auto mb-3">
            <Search size={26} className="text-[var(--green)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--navy)]">Track Your Report</h2>
          <p className="text-sm text-[var(--slate)] mt-1">
            Enter your Tracking Reference and PIN to view the status of your submission.
          </p>
        </div>

        {/* Search form */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <form onSubmit={handleSearch} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="trackRef"
                className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1"
              >
                <Hash size={11} /> Tracking Reference <span className="text-red-500">*</span>
              </label>
              <input
                id="trackRef"
                type="text"
                placeholder="e.g. RPT-2024-001"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                className="input text-sm uppercase"
                maxLength={20}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="trackPin"
                className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1"
              >
                <KeyRound size={11} /> 4-Digit PIN <span className="text-red-500">*</span>
              </label>
              <input
                id="trackPin"
                type="password"
                inputMode="numeric"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="input text-sm tracking-[0.4em]"
                maxLength={4}
                autoComplete="off"
              />
              <p className="text-[11px] text-[var(--muted)] mt-1">
                Your PIN was provided when the report was submitted.
              </p>
            </div>

            {attempts >= 3 && attempts < 5 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                Warning: {5 - attempts} attempt{5 - attempts !== 1 ? "s" : ""} remaining before temporary lock.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || attempts >= 5}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Searching…
                </span>
              ) : (
                <><Search size={15} /> Track Report</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result === "found" && data && statusCfg && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-5 border-[var(--green)] border-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0">
                  <statusCfg.icon size={20} className="text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--navy)]">Report Found</p>
                  <span className={`badge ${statusCfg.badge} text-[11px]`}>{statusCfg.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-[10px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">
                    <Hash size={10} /> Reference
                  </p>
                  <p className="font-mono font-bold text-[var(--navy)]">{ref.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">
                    <FileText size={10} /> Type
                  </p>
                  <p className="font-medium text-[var(--charcoal)]">{data.type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">
                    <Calendar size={10} /> Submitted
                  </p>
                  <p className="font-medium text-[var(--charcoal)]">{data.date}</p>
                </div>
              </div>

              <div className="p-3 bg-[var(--surface2)] rounded-xl text-sm text-[var(--charcoal)] leading-relaxed">
                <p className="font-semibold text-[var(--navy)] mb-1 flex items-center gap-1.5">
                  <Info size={13} /> Status Update
                </p>
                {data.message}
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                For your privacy, investigation details, evidence, and officer information are not displayed here.
                If you need further assistance, please visit the Hossana City Police Station in person with a valid ID.
              </div>

              <button onClick={handleReset} className="mt-4 w-full btn-secondary text-sm">
                Search Another Report
              </button>
            </motion.div>
          )}

          {result === "not-found" && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-5 border-red-200 border"
            >
              <div className="flex items-start gap-3 text-red-700">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Report Not Found</p>
                  <p className="text-xs mt-1 text-red-600">
                    The tracking reference you entered could not be found. Please check for typos and try again.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {result === "wrong-pin" && (
            <motion.div
              key="wrongpin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-5 border-red-200 border"
            >
              <div className="flex items-start gap-3 text-red-700">
                <KeyRound size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Incorrect PIN</p>
                  <p className="text-xs mt-1 text-red-600">
                    The PIN you entered is incorrect. If you have lost your PIN, please visit the Hossana City Police Station in person with a valid ID for identity verification.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help notice */}
        {!result && (
          <div className="flex items-start gap-3 p-4 bg-[var(--surface2)] rounded-xl text-xs text-[var(--slate)]">
            <Info size={15} className="shrink-0 text-[var(--green)] mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[var(--charcoal)]">How to find your credentials</p>
              <p>Your Tracking Reference (e.g. RPT-2024-001) and PIN were given to you when you submitted the report.</p>
              <p>Lost your PIN? Visit the police station in person with a valid ID.</p>
            </div>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
