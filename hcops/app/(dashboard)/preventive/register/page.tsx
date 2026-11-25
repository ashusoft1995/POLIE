"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { UserX, FileText, Eye, X, RefreshCw, Plus, AlertTriangle } from "lucide-react";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { crimeReportApi } from "@/lib/api-client";

/* ── Types ─────────────────────────────────────────────────── */
type Report = {
  id: number;
  caseNumber: string;
  reporterName: string;
  reporterPhone: string;
  crimeType: string;
  description: string;
  incidentLocation: string;
  incidentDate: string;
  suspectDescription?: string;
  status: string;
  submittedAt: string;
  isUrgent: boolean;
};

type FormState = {
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  reporterAddress: string;
  crimeType: string;
  description: string;
  incidentLocation: string;
  incidentDate: string;
  suspectDescription: string;
  isUrgent: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  reporterName: "", reporterPhone: "", reporterEmail: "", reporterAddress: "",
  crimeType: "", description: "", incidentLocation: "",
  incidentDate: "", suspectDescription: "", isUrgent: false,
};

const CRIME_TYPES = [
  "Theft", "Assault", "Robbery", "Fraud", "Drug Offence",
  "Murder", "Kidnapping", "Burglary", "Cybercrime",
  "Domestic Violence", "Missing Person", "Other",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING:        "badge-yellow",
  UNDER_REVIEW:   "badge-blue",
  ASSIGNED:       "badge-blue",
  INVESTIGATING:  "badge-blue",
  RESOLVED:       "badge-green",
  CLOSED:         "badge-gray",
  REJECTED:       "badge-red",
};

/* ── Validation ─────────────────────────────────────────────── */
function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.reporterName.trim() || f.reporterName.trim().length < 4)
    e.reporterName = "Full name must be at least 4 characters.";
  if (!f.reporterPhone.trim() || f.reporterPhone.trim().length < 7)
    e.reporterPhone = "Valid phone number required.";
  if (!f.reporterAddress.trim())
    e.reporterAddress = "Reporter address is required.";
  if (!f.crimeType)
    e.crimeType = "Select a crime type.";
  if (!f.description.trim() || f.description.trim().length < 10)
    e.description = "Description must be at least 10 characters.";
  if (!f.incidentLocation.trim())
    e.incidentLocation = "Incident location is required.";
  if (!f.incidentDate)
    e.incidentDate = "Incident date is required.";
  return e;
}

/* ── Component ──────────────────────────────────────────────── */
export default function PreventiveRegisterPage() {
  const [reports, setReports]     = useState<Report[]>([]);
  const [loading, setLoading]     = useState(true);
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState<FormState>({ ...EMPTY });
  const [errors, setErrors]       = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [viewItem, setViewItem]   = useState<Report | null>(null);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  /* Fetch existing crime reports */
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crimeReportApi.getAll();
      setReports(data as Report[]);
    } catch {
      addToast("error", "Failed to load existing reports.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  function setField(field: keyof FormState, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field as keyof Errors]) {
      setErrors(e => { const c = { ...e }; delete c[field as keyof Errors]; return c; });
    }
  }

  /* Submit to real API */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      addToast("error", "Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      await crimeReportApi.submit({
        reporterName:       form.reporterName.trim(),
        reporterPhone:      form.reporterPhone.trim(),
        reporterEmail:      form.reporterEmail.trim() || null,
        reporterAddress:    form.reporterAddress.trim(),
        crimeType:          form.crimeType,
        description:        form.description.trim(),
        incidentLocation:   form.incidentLocation.trim(),
        incidentDate:       form.incidentDate ? `${form.incidentDate}T00:00:00` : new Date().toISOString(),
        suspectDescription: form.suspectDescription.trim() || null,
        isUrgent:           form.isUrgent,
      });
      addToast("success", `Crime report for "${form.crimeType}" submitted successfully.`);
      setOpen(false);
      setForm({ ...EMPTY });
      setErrors({});
      await fetchReports();
    } catch (err: any) {
      addToast("error", err?.message ?? "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── UI ───────────────────────────────────────────────────── */
  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Crime Report Registration</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">
              File and track crime reports in the system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReports}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setForm({ ...EMPTY }); setErrors({}); setOpen(true); }}
              className="btn-primary"
            >
              <Plus size={15} /> File Crime Report
            </motion.button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Reports",  value: reports.length },
            { label: "Pending Review", value: reports.filter(r => r.status === "PENDING").length },
            { label: "Investigating",  value: reports.filter(r => ["ASSIGNED","INVESTIGATING","UNDER_REVIEW"].includes(r.status)).length },
            { label: "Urgent",         value: reports.filter(r => r.isUrgent).length },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card p-4">
              <p className="text-2xl font-extrabold text-[var(--navy)] tabular-nums">{s.value}</p>
              <p className="text-xs text-[var(--slate)] mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["Ref #", "Reporter", "Crime Type", "Location", "Date Filed", "Urgent", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-[var(--muted)] text-sm">Loading reports…</td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <FileText size={32} className="mx-auto mb-2 text-[var(--muted)]" />
                      <p className="text-sm text-[var(--slate)]">No crime reports yet. File the first one.</p>
                    </td>
                  </tr>
                ) : reports.map(r => (
                  <tr key={r.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--green)] font-medium">{r.caseNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--navy)]">{r.reporterName}</p>
                      <p className="text-xs text-[var(--muted)]">{r.reporterPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">{r.crimeType}</td>
                    <td className="px-4 py-3 text-[var(--charcoal)] max-w-[160px]">
                      <span className="truncate block">{r.incidentLocation}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--slate)] whitespace-nowrap">
                      {r.submittedAt?.split("T")[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.isUrgent ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                          <AlertTriangle size={11} /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[r.status] ?? "badge-gray"}`}>
                        {r.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewItem(r)}
                        className="action-btn action-btn-view"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── New Report Modal ─────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[92vh] overflow-y-auto"
            role="dialog"
          >
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]">
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                <UserX size={16} className="text-orange-600" />
              </div>
              <h3 className="text-base font-bold text-[var(--navy)]">File Crime Report</h3>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Reporter info */}
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1">
                Reporter Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">
                    Reporter Full Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={form.reporterName} onChange={e => setField("reporterName", e.target.value)}
                    placeholder="Citizen full name" className={`input w-full text-sm ${errors.reporterName ? "border-red-400" : ""}`} />
                  {errors.reporterName && <p className="text-xs text-red-500 mt-0.5">{errors.reporterName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" value={form.reporterPhone} onChange={e => setField("reporterPhone", e.target.value)}
                    placeholder="+251 …" className={`input w-full text-sm ${errors.reporterPhone ? "border-red-400" : ""}`} />
                  {errors.reporterPhone && <p className="text-xs text-red-500 mt-0.5">{errors.reporterPhone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">Email</label>
                  <input type="email" value={form.reporterEmail} onChange={e => setField("reporterEmail", e.target.value)}
                    placeholder="Optional" className="input w-full text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">
                    Reporter Address <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={form.reporterAddress} onChange={e => setField("reporterAddress", e.target.value)}
                    placeholder="Kebele / Woreda" className={`input w-full text-sm ${errors.reporterAddress ? "border-red-400" : ""}`} />
                  {errors.reporterAddress && <p className="text-xs text-red-500 mt-0.5">{errors.reporterAddress}</p>}
                </div>
              </div>

              {/* Crime info */}
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1 pt-1">
                Crime Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">
                    Crime Type <span className="text-red-500">*</span>
                  </label>
                  <select value={form.crimeType} onChange={e => setField("crimeType", e.target.value)}
                    className={`input w-full text-sm ${errors.crimeType ? "border-red-400" : ""}`}>
                    <option value="">Select…</option>
                    {CRIME_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {errors.crimeType && <p className="text-xs text-red-500 mt-0.5">{errors.crimeType}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">
                    Incident Date <span className="text-red-500">*</span>
                  </label>
                  <input type="date" value={form.incidentDate} onChange={e => setField("incidentDate", e.target.value)}
                    className={`input w-full text-sm ${errors.incidentDate ? "border-red-400" : ""}`} />
                  {errors.incidentDate && <p className="text-xs text-red-500 mt-0.5">{errors.incidentDate}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">
                    Incident Location <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={form.incidentLocation} onChange={e => setField("incidentLocation", e.target.value)}
                    placeholder="Street / area" className={`input w-full text-sm ${errors.incidentLocation ? "border-red-400" : ""}`} />
                  {errors.incidentLocation && <p className="text-xs text-red-500 mt-0.5">{errors.incidentLocation}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea rows={3} value={form.description} onChange={e => setField("description", e.target.value)}
                    placeholder="Describe what happened…"
                    className={`input w-full text-sm resize-none ${errors.description ? "border-red-400" : ""}`} />
                  {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1">Suspect Description</label>
                  <textarea rows={2} value={form.suspectDescription} onChange={e => setField("suspectDescription", e.target.value)}
                    placeholder="Physical description, clothing, vehicle…" className="input w-full text-sm resize-none" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="isUrgent" checked={form.isUrgent}
                    onChange={e => setField("isUrgent", e.target.checked)}
                    className="w-4 h-4 accent-red-500 cursor-pointer" />
                  <label htmlFor="isUrgent" className="text-sm font-semibold text-red-600 cursor-pointer">
                    Mark as Urgent
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--border)] text-[var(--slate)] text-sm font-semibold hover:bg-[var(--surface2)] transition-colors"
                  disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--green)] hover:bg-[var(--green-dark)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {submitting ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : <FileText size={15} />}
                  {submitting ? "Submitting…" : "Submit Report"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── View detail modal ────────────────────────────────── */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10 max-h-[90vh] overflow-y-auto"
            role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]">
              <X size={16} />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge ${STATUS_COLORS[viewItem.status] ?? "badge-gray"} text-[11px]`}>
                {viewItem.status?.replace(/_/g, " ")}
              </span>
              {viewItem.isUrgent && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">URGENT</span>
              )}
            </div>
            <h4 className="font-bold text-[var(--navy)]">{viewItem.crimeType}</h4>
            <p className="text-xs font-mono text-[var(--green)] mt-0.5 mb-4">{viewItem.caseNumber}</p>
            <div className="space-y-2">
              {[
                ["Reporter",  viewItem.reporterName],
                ["Phone",     viewItem.reporterPhone],
                ["Location",  viewItem.incidentLocation],
                ["Incident Date", viewItem.incidentDate?.split("T")[0] ?? "—"],
                ["Filed On",  viewItem.submittedAt?.split("T")[0] ?? "—"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{v}</span>
                </div>
              ))}
              <div className="bg-[var(--surface2)] rounded-xl px-3 py-2">
                <p className="text-[var(--muted)] text-xs mb-1">Description</p>
                <p className="text-[var(--charcoal)] text-xs leading-relaxed">{viewItem.description}</p>
              </div>
              {viewItem.suspectDescription && (
                <div className="bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <p className="text-[var(--muted)] text-xs mb-1">Suspect</p>
                  <p className="text-[var(--charcoal)] text-xs leading-relaxed">{viewItem.suspectDescription}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
