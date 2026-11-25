"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Eye, X, RefreshCw, ChevronDown } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { crimeReportApi, casesApi, employeeApi } from "@/lib/api-client";

/* forward = create a detective case from a crime report */

type Report = {
  id: number; caseNumber: string; reporterName: string;
  crimeType: string; incidentLocation: string; incidentDate: string;
  description: string; status: string;
};
type Detective = { id: number; fullName?: string; firstName?: string; lastName?: string; badge?: string; badgeNumber?: string; };
type Forward   = { id: number; caseNumber: string; title: string; crimeType: string; status: string; createdAt: string; };

const STATUS_COLORS: Record<string, string> = {
  OPEN: "badge-yellow", UNDER_INVESTIGATION: "badge-blue",
  PENDING_COURT: "badge-pink", CLOSED_SOLVED: "badge-green",
  CLOSED_UNSOLVED: "badge-gray", SUSPENDED: "badge-gray",
};

type FormState = { reportId: string; detectiveId: string; priority: string; notes: string; };
type Errors    = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.reportId)    e.reportId    = "Select a crime report.";
  if (!f.detectiveId) e.detectiveId = "Assign a detective.";
  return e;
}

export default function PreventiveForwardPage() {
  const [reports,     setReports]     = useState<Report[]>([]);
  const [detectives,  setDetectives]  = useState<Detective[]>([]);
  const [forwards,    setForwards]    = useState<Forward[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [form,        setForm]        = useState<FormState>({ reportId: "", detectiveId: "", priority: "MEDIUM", notes: "" });
  const [errors,      setErrors]      = useState<Errors>({});
  const [submitting,  setSubmitting]  = useState(false);
  const [viewItem,    setViewItem]    = useState<Forward | null>(null);
  const [toasts,      setToasts]      = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [reps, dets, cases] = await Promise.all([
        crimeReportApi.getAll(),
        employeeApi.getByRole("DETECTIVE"),
        casesApi.getAll(),
      ]);
      // Show PENDING/UNDER_REVIEW reports — forwarding is idempotent so duplicates are handled server-side
      setReports((reps as Report[]).filter(r =>
        ["PENDING", "UNDER_REVIEW"].includes(r.status)
      ));
      setDetectives(dets as Detective[]);
      setForwards(cases as Forward[]);
    } catch {
      addToast("error", "Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function setField(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c = { ...e }; delete c[field]; return c; });
  }

  function openModal() {
    setForm({ reportId: "", detectiveId: "", priority: "MEDIUM", notes: "" });
    setErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error", "Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      const report = reports.find(r => r.id === Number(form.reportId));
      if (!report) throw new Error("Report not found.");

      // Create a real case linked to this crime report
      // Backend is idempotent — if a case already exists for this report it re-assigns the detective
      const result = await casesApi.create({
        title:               `Case: ${report.crimeType.replace(/_/g," ")} — ${report.incidentLocation}`,
        caseType:            mapCrimeType(report.crimeType),
        description:         form.notes.trim() || report.description,
        priority:            form.priority,
        location:            report.incidentLocation,
        incidentDate:        report.incidentDate,
        assignedDetectiveId: Number(form.detectiveId),
        crimeReportId:       report.id,
      });

      const det = detectives.find(d => d.id === Number(form.detectiveId));
      const detName = det ? detectiveName(det) : "detective";
      addToast("success", `Case forwarded to ${detName} — detective has been notified.`);
      setModalOpen(false);
      await fetchAll();
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already")) {
        addToast("warning", "This report already has a case. Re-assigning detective...");
        setModalOpen(false);
        await fetchAll();
      } else {
        addToast("error", msg || "Forwarding failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function mapCrimeType(t: string): string {
    const u = t.toUpperCase();
    if (u.includes("THEFT") || u.includes("STEAL") || u.includes("ROBBERY")) return "THEFT";
    if (u.includes("ASSAULT") || u.includes("ATTACK")) return "ASSAULT";
    if (u.includes("FRAUD")) return "FRAUD";
    if (u.includes("BURGLARY")) return "BURGLARY";
    if (u.includes("HOMICIDE") || u.includes("MURDER")) return "HOMICIDE";
    if (u.includes("DRUG")) return "DRUG_OFFENSE";
    if (u.includes("CYBER")) return "CYBERCRIME";
    if (u.includes("MISSING")) return "MISSING_PERSON";
    if (u.includes("DOMESTIC")) return "DOMESTIC_VIOLENCE";
    return "OTHER";
  }

  function detectiveName(d: Detective) {
    return d.fullName ?? `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim();
  }

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Forward to Detective</h2>
              <p className="text-sm text-[var(--slate)]">Assign crime reports to detectives — creates a real case in the database.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchAll}
                className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={openModal} className="btn-primary" disabled={loading}>
                <Send size={15} /> Forward Report
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Reports Available",  value: reports.length },
            { label: "Cases Created",      value: forwards.length },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card p-4">
              <p className="text-2xl font-extrabold text-[var(--navy)] tabular-nums">{s.value}</p>
              <p className="text-xs text-[var(--slate)] mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Cases created from reports (forwarded) */}
        <div>
          <h3 className="text-sm font-bold text-[var(--slate)] uppercase tracking-widest mb-3">Cases Created (Forwarded)</h3>
          {loading ? (
            <div className="card p-10 text-center text-[var(--muted)] text-sm">Loading…</div>
          ) : forwards.length === 0 ? (
            <div className="card p-10 text-center text-[var(--muted)] text-sm">No cases created yet.</div>
          ) : (
            <StaggerParent className="space-y-3">
              {forwards.slice(0, 10).map(fwd => (
                <StaggerChild key={fwd.id}>
                  <motion.div whileHover={{ x: 3 }} className="card p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--navy)]">{fwd.title}</h4>
                        <p className="text-xs text-[var(--muted)] font-mono">{fwd.caseNumber}</p>
                      </div>
                      <span className={`badge ${STATUS_COLORS[fwd.status] ?? "badge-gray"}`}>
                        {fwd.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[var(--slate)]">
                        Created: {fwd.createdAt ? String(fwd.createdAt).split("T")[0] : "—"}
                      </p>
                      <button onClick={() => setViewItem(fwd)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[var(--green)] hover:underline">
                        <Eye size={12} /> View
                      </button>
                    </div>
                  </motion.div>
                </StaggerChild>
              ))}
            </StaggerParent>
          )}
        </div>
      </div>

      {/* Forward modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-[440px] z-10 overflow-hidden border border-[var(--border)]"
            role="dialog">
            <div className="h-[3px] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]" />
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Send size={14} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-[var(--navy)]">Forward Crime Report</h3>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg text-[var(--muted)] hover:text-[var(--navy)] hover:bg-[var(--border)] flex items-center justify-center transition-colors">
                <X size={15} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="px-5 py-5 space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                This creates a real detective case linked to the selected crime report and saves it to the database.
              </div>

              {/* Report selector */}
              <div>
                <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1.5">
                  Crime Report <span className="text-red-500">*</span>
                </label>
                {reports.length === 0 ? (
                  <div className="p-3 bg-[var(--surface2)] rounded-xl text-xs text-[var(--muted)]">
                    No unforwarded reports available. File a new crime report first.
                  </div>
                ) : (
                  <div className="relative">
                    <select value={form.reportId} onChange={e => setField("reportId", e.target.value)}
                      className={`input text-sm appearance-none pr-8 ${errors.reportId ? "border-red-400" : ""}`}>
                      <option value="">Select report…</option>
                      {reports.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.caseNumber} — {r.crimeType} ({r.incidentLocation})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
                )}
                {errors.reportId && <p className="text-[11px] text-red-500 mt-0.5">{errors.reportId}</p>}
              </div>

              {/* Detective selector */}
              <div>
                <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1.5">
                  Assign Detective <span className="text-red-500">*</span>
                </label>
                {detectives.length === 0 ? (
                  <div className="p-3 bg-[var(--surface2)] rounded-xl text-xs text-[var(--muted)]">
                    No detectives found. Register a detective in HR first.
                  </div>
                ) : (
                  <div className="relative">
                    <select value={form.detectiveId} onChange={e => setField("detectiveId", e.target.value)}
                      className={`input text-sm appearance-none pr-8 ${errors.detectiveId ? "border-red-400" : ""}`}>
                      <option value="">Select detective…</option>
                      {detectives.map(d => (
                        <option key={d.id} value={d.id}>
                          {detectiveName(d)} — {d.badge ?? d.badgeNumber ?? ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
                )}
                {errors.detectiveId && <p className="text-[11px] text-red-500 mt-0.5">{errors.detectiveId}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {(["HIGH","MEDIUM","LOW"] as const).map(p => (
                    <motion.button key={p} type="button" whileTap={{ scale: 0.95 }}
                      onClick={() => setField("priority", p)}
                      className={`flex-1 h-10 rounded-[10px] text-xs font-bold border-[1.5px] transition-all duration-150 ${
                        form.priority === p
                          ? p === "HIGH"   ? "bg-red-50 border-red-400 text-red-600"
                          : p === "MEDIUM" ? "bg-amber-50 border-amber-400 text-amber-600"
                          :                  "bg-green-50 border-green-400 text-green-600"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--slate)]"
                      }`}>
                      {p}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1.5">
                  Notes for Detective <span className="text-[var(--muted)] font-normal">(optional)</span>
                </label>
                <textarea rows={3} value={form.notes} onChange={e => setField("notes", e.target.value)}
                  className="input text-sm resize-none h-auto py-2"
                  placeholder="Additional instructions for the detective…" />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 h-9 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || reports.length === 0}
                  className="flex-1 btn-primary h-9 disabled:opacity-50">
                  {submitting
                    ? <span className="flex items-center gap-2"><span className="btn-spinner" />Forwarding…</span>
                    : <><Send size={14} /> Forward</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Case detail modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10"
            role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]">
              <X size={16} />
            </button>
            <h4 className="font-bold text-[var(--navy)] pr-6">{viewItem.title}</h4>
            <p className="text-xs font-mono text-[var(--green)] mt-0.5 mb-4">{viewItem.caseNumber}</p>
            <div className="space-y-2">
              {[
                ["Status",  viewItem.status?.replace(/_/g, " ")],
                ["Created", String(viewItem.createdAt || "").split("T")[0]],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
