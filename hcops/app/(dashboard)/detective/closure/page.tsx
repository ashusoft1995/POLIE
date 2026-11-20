"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, FileText, Send } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";

type ClosureReq = {
  id: string; caseId: string; title: string;
  detective: string; requestDate: string; status: string; summary?: string;
};

const initial: ClosureReq[] = [
  { id:"CR001", caseId:"TRK-2024-003", title:"Assault and Battery",  detective:"Det. Tigist Mekonnen", requestDate:"2024-11-28", status:"Pending",  summary:"All witnesses interviewed. Evidence collected and documented." },
  { id:"CR002", caseId:"TRK-2024-008", title:"Theft Investigation",  detective:"Det. Abebe Girma",     requestDate:"2024-11-26", status:"Approved", summary:"Suspect identified and charged. Case ready for closure." },
];

const MOCK_CASES = [
  { id:"TRK-2024-001", title:"Armed Robbery - Market St" },
  { id:"TRK-2024-005", title:"Fraud Investigation" },
  { id:"TRK-2024-009", title:"Domestic Violence Case" },
];

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
  const [requests, setRequests]   = useState<ClosureReq[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState<ReqForm>({ caseId:"", summary:"", finalFindings:"" });
  const [errors, setErrors]       = useState<ReqErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof ReqForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c = { ...e }; delete c[field]; return c; });
  }

  function openModal() { setForm({ caseId:"", summary:"", finalFindings:"" }); setErrors({}); setModalOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateReq(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error", "Please fix the highlighted fields."); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const caseInfo = MOCK_CASES.find(c => c.id === form.caseId);
    const newReq: ClosureReq = {
      id: `CR${String(requests.length + 1).padStart(3,"0")}`,
      caseId: form.caseId,
      title: caseInfo?.title ?? form.caseId,
      detective: "Det. Abebe Girma",
      requestDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      summary: form.summary,
    };
    setRequests(r => [newReq, ...r]);
    setSubmitting(false);
    setModalOpen(false);
    addToast("success", "Closure request submitted. Awaiting Police Head approval.");
  }

  const pending  = requests.filter(r => r.status === "Pending").length;
  const approved = requests.filter(r => r.status === "Approved").length;

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)] mb-1">Case Closure Requests</h2>
              <p className="text-sm text-[var(--slate)]">Submit and track your case closure requests for Police Head approval.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={openModal}
              className="btn-primary"
            >
              <Send size={15} /> New Request
            </motion.button>
          </div>
        </ScrollReveal>

        {/* KPIs */}
        <StaggerParent className="grid grid-cols-2 gap-4">
          {[
            { label:"Pending Approval", value: pending,  icon: Clock,        color:"yellow" },
            { label:"Approved",         value: approved, icon: CheckCircle2, color:"green"  },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y:-3 }} className="card p-5">
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

        {/* Request cards */}
        <StaggerParent className="space-y-3">
          {requests.map(req => (
            <StaggerChild key={req.id}>
              <motion.div
                whileHover={{ x:3, boxShadow:"0 8px 24px -6px rgba(0,0,0,0.1)" }}
                className="card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-[var(--green)]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--navy)]">{req.title}</h4>
                      <p className="text-xs text-[var(--slate)] font-mono">{req.caseId}</p>
                    </div>
                  </div>
                  <span className={`badge ${req.status === "Pending" ? "badge-yellow" : req.status === "Approved" ? "badge-green" : "badge-pink"}`}>
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">Detective</p>
                    <p className="text-[var(--charcoal)] font-semibold text-sm">{req.detective}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">Request Date</p>
                    <p className="text-[var(--charcoal)] font-semibold text-sm">{req.requestDate}</p>
                  </div>
                </div>

                {req.summary && (
                  <p className="text-xs text-[var(--slate)] bg-[var(--surface2)] p-2.5 rounded-lg">
                    {req.summary}
                  </p>
                )}

                {req.status === "Pending" && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <Clock size={12}/> Awaiting review by Police Head
                    </p>
                  </div>
                )}
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>

      {/* New request modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Closure Request" size="sm" accent="blue">
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          A closure request will be sent to the Police Head for review. You cannot approve your own closure requests.
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <FormField label="Case" required as="select" id="crCase"
            value={form.caseId} onChange={e => set("caseId", e.target.value)} error={errors.caseId}>
            <option value="">Select a case…</option>
            {MOCK_CASES.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title}</option>)}
          </FormField>
          <FormField label="Investigation Summary" required as="textarea" id="crSummary" rows={4}
            placeholder="Summarise the investigation findings (min 20 chars)…"
            value={form.summary} onChange={e => set("summary",(e.target as HTMLTextAreaElement).value)}
            error={errors.summary} />
          <FormField label="Final Findings & Recommendation" required as="textarea" id="crFindings" rows={4}
            placeholder="State your final findings and why the case should be closed (min 20 chars)…"
            value={form.finalFindings} onChange={e => set("finalFindings",(e.target as HTMLTextAreaElement).value)}
            error={errors.finalFindings} />

          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>Submitting…
                </span>
              ) : <><Send size={14}/> Submit Request</>}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
