"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, FileText, Send, RefreshCw, XCircle } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { casesApi } from "@/lib/api-client";

type ReqForm = { caseId: string; summary: string; finalFindings: string };
type ReqErrors = Partial<Record<keyof ReqForm, string>>;

function validateReq(f: ReqForm): ReqErrors {
  const e: ReqErrors = {};
  if (!f.caseId) e.caseId = "Please select a case.";
  if (f.summary.trim().length < 20) e.summary = "Summary must be at least 20 characters.";
  if (f.finalFindings.trim().length < 20) e.finalFindings = "Final findings must be at least 20 characters.";
  return e;
}

export default function DetectiveClosurePage() {
  const [cases, setCases]         = useState<any[]>([]);
  const [pendingClosure, setPendingClosure] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState<ReqForm>({ caseId: "", summary: "", finalFindings: "" });
  const [errors, setErrors]       = useState<ReqErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("hcops_user") || "{}");
      const token = sessionStorage.getItem("hcops_token");
      
      // Check if user is authenticated
      if (!token) {
        addToast("error", "Authentication required. Please log in again.");
        setLoading(false);
        return;
      }
      
      // Load active cases for this detective (to pick one for closure)
      const all = user.id
        ? await casesApi.getByDetective(user.id)
        : await casesApi.getAll();
      const active = all.filter((c: any) =>
        !["CLOSED_SOLVED", "CLOSED_UNSOLVED", "SUSPENDED"].includes(c.status)
      );
      setCases(active);
      // Cases already flagged for closure review
      const pending = all.filter((c: any) => c.status === "PENDING_COURT");
      setPendingClosure(pending);
    } catch (err: any) {
      console.error("Error loading cases:", err);
      addToast("error", "Could not load cases from server.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function set(field: keyof ReqForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c = { ...e }; delete c[field]; return c; });
  }

  function openModal() {
    setForm({ caseId: "", summary: "", finalFindings: "" });
    setErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateReq(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error", "Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      // Set case status to PENDING_COURT — signals it's awaiting closure approval
      await casesApi.updateStatus(Number(form.caseId), "PENDING_COURT");
      // Store the summary in investigation notes
      await casesApi.updateNotes(
        Number(form.caseId),
        `CLOSURE REQUEST:\n${form.summary}\n\nFINAL FINDINGS:\n${form.finalFindings}`
      );
      addToast("success", "Closure request submitted. Awaiting Police Head approval.");
      setModalOpen(false);
      await fetchData();
    } catch (err: any) {
      addToast("error", err?.message ?? "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)] mb-1">Case Closure Requests</h2>
              <p className="text-sm text-[var(--slate)]">Submit and track your case closure requests for Police Head approval.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchData} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={openModal} className="btn-primary">
                <Send size={15} /> New Request
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* KPIs */}
        <StaggerParent className="grid grid-cols-2 gap-4">
          {[
            { label: "Pending Approval", value: pendingClosure.length,                                      icon: Clock,        color: "yellow" },
            { label: "Available Cases",  value: cases.length,                                                icon: FileText,     color: "blue"   },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y: -3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]">{s.value}</p>
                  </div>
                  <s.icon size={26} className={`text-${s.color}-600`} />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Pending closure cards */}
        {loading ? (
          <div className="card p-10 text-center text-[var(--muted)] text-sm">Loading cases…</div>
        ) : pendingClosure.length === 0 ? (
          <div className="card p-10 text-center">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-[var(--green)] opacity-60" />
            <p className="text-sm text-[var(--slate)]">No pending closure requests.</p>
          </div>
        ) : (
          <StaggerParent className="space-y-3">
            {pendingClosure.map(req => (
              <StaggerChild key={req.id}>
                <motion.div whileHover={{ x: 3, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--navy)]">{req.title}</h4>
                        <p className="text-xs text-[var(--slate)] font-mono">{req.caseNumber}</p>
                      </div>
                    </div>
                    <span className="badge badge-yellow">Pending Approval</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">Type</p>
                      <p className="text-[var(--charcoal)] font-semibold text-sm">{req.caseType}</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">Priority</p>
                      <p className="text-[var(--charcoal)] font-semibold text-sm">{req.priority}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <Clock size={12} /> Awaiting review by Police Head
                    </p>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        )}
      </div>

      {/* New request modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Closure Request" size="sm" accent="blue">
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          A closure request will be sent to the Police Head for review. The case status will change to "Pending Court".
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1.5">
              Case <span className="text-red-500">*</span>
            </label>
            <select value={form.caseId} onChange={e => set("caseId", e.target.value)}
              className={`input text-sm w-full ${errors.caseId ? "border-red-400" : ""}`}>
              <option value="">Select a case…</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} — {c.title}
                </option>
              ))}
            </select>
            {errors.caseId && <p className="text-[11px] text-red-500 mt-0.5">{errors.caseId}</p>}
          </div>
          <FormField label="Investigation Summary" required as="textarea" id="crSummary" rows={4}
            placeholder="Summarise the investigation findings (min 20 chars)…"
            value={form.summary} onChange={e => set("summary", (e.target as HTMLTextAreaElement).value)}
            error={errors.summary} />
          <FormField label="Final Findings & Recommendation" required as="textarea" id="crFindings" rows={4}
            placeholder="State your final findings and why the case should be closed (min 20 chars)…"
            value={form.finalFindings} onChange={e => set("finalFindings", (e.target as HTMLTextAreaElement).value)}
            error={errors.finalFindings} />
          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="btn-spinner" />Submitting…
                </span>
              ) : <><Send size={14} /> Submit Request</>}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
