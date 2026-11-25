"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, FileText, Eye, X, RefreshCw, Plus, AlertTriangle, ChevronDown } from "lucide-react";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { trafficApi } from "@/lib/api-client";

/* ── types ───────────────────────────────────────────────── */
type Report = {
  id: number;
  reportNumber: string;
  reporterName: string;
  reporterPhone: string;
  incidentType: string;
  description: string;
  location: string;
  incidentDate: string;
  vehiclePlateNumber: string;
  vehicleType: string;
  vehicleColor: string;
  injuredCount: number;
  fatalitiesCount: number;
  status: string;
  submittedAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "badge-yellow", UNDER_REVIEW: "badge-blue", ASSIGNED: "badge-blue",
  INVESTIGATING: "badge-blue", RESOLVED: "badge-green", CLOSED: "badge-gray",
};

const emptyForm = {
  reporterName: "", reporterPhone: "", reporterEmail: "",
  incidentType: "", location: "", incidentDate: "",
  vehiclePlateNumber: "", vehicleType: "", vehicleColor: "",
  injuredCount: "0", fatalitiesCount: "0", description: "",
};
type Errors = Partial<Record<keyof typeof emptyForm, string>>;

function validate(f: typeof emptyForm): Errors {
  const e: Errors = {};
  if (!f.reporterName.trim() || f.reporterName.trim().length < 3)
    e.reporterName = "Reporter name required.";
  if (!f.reporterPhone.trim() || f.reporterPhone.trim().length < 7)
    e.reporterPhone = "Valid phone number required.";
  if (!f.incidentType) e.incidentType = "Select an incident type.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.incidentDate) e.incidentDate = "Date is required.";
  if (!f.description.trim() || f.description.trim().length < 10)
    e.description = "Description must be at least 10 characters.";
  return e;
}

/* ── component ───────────────────────────────────────────── */
export default function TrafficRegisterPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState({ ...emptyForm });
  const [errors, setErrors]     = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [viewItem, setViewItem] = useState<Report | null>(null);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  /* ── fetch ───────────────────────────────────────────── */
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await trafficApi.getAll();
      setReports(data as Report[]);
    } catch {
      addToast("error", "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  function setField(field: keyof typeof emptyForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c = { ...e }; delete c[field]; return c; });
  }

  /* ── submit ──────────────────────────────────────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error", "Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      await trafficApi.submit({
        reporterName:       form.reporterName.trim(),
        reporterPhone:      form.reporterPhone.trim(),
        reporterEmail:      form.reporterEmail.trim() || null,
        incidentType:       form.incidentType,
        description:        form.description.trim(),
        location:           form.location.trim(),
        incidentDate:       form.incidentDate ? `${form.incidentDate}T00:00:00` : new Date().toISOString(),
        vehiclePlateNumber: form.vehiclePlateNumber.trim() || null,
        vehicleType:        form.vehicleType.trim() || null,
        vehicleColor:       form.vehicleColor.trim() || null,
        injuredCount:       parseInt(form.injuredCount) || 0,
        fatalitiesCount:    parseInt(form.fatalitiesCount) || 0,
        policeNotified:     true,
      });
      addToast("success", "Traffic report registered and saved to database.");
      setOpen(false);
      setForm({ ...emptyForm });
      setErrors({});
      await fetchReports();
    } catch (err: any) {
      addToast("error", err?.message ?? "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Traffic Report Registry</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Register and track traffic incidents in the database.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchReports}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setForm({ ...emptyForm }); setErrors({}); setOpen(true); }}
              className="btn-primary">
              <Plus size={15} /> Register Incident
            </motion.button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total",       value: reports.length },
            { label: "Pending",     value: reports.filter(r => r.status === "PENDING").length },
            { label: "Injuries",    value: reports.reduce((s, r) => s + (r.injuredCount ?? 0), 0) },
            { label: "Fatalities",  value: reports.reduce((s, r) => s + (r.fatalitiesCount ?? 0), 0) },
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
                  {["Ref #", "Reporter", "Type", "Location", "Date", "Injuries", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-12 text-[var(--muted)] text-sm">Loading…</td></tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <Car size={32} className="mx-auto mb-2 text-[var(--muted)]" />
                      <p className="text-sm text-[var(--slate)]">No traffic reports yet. Register the first one.</p>
                    </td>
                  </tr>
                ) : reports.map(r => (
                  <tr key={r.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--green)] font-medium">{r.reportNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--navy)]">{r.reporterName}</p>
                      <p className="text-xs text-[var(--muted)]">{r.reporterPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--charcoal)] font-medium">{r.incidentType}</td>
                    <td className="px-4 py-3 text-[var(--slate)] max-w-[160px]">
                      <span className="truncate block">{r.location}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--slate)] whitespace-nowrap">
                      {r.incidentDate?.split("T")[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {(r.injuredCount ?? 0) > 0 ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <AlertTriangle size={11} /> {r.injuredCount}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[r.status] ?? "badge-gray"}`}>
                        {r.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewItem(r)}
                        className="action-btn action-btn-view" title="View">
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

      {/* New report modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-[520px] z-10 overflow-hidden border border-[var(--border)]"
            style={{ maxHeight: "92dvh" }}>
            <div className="h-[3px] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]" />
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface2)]/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Car size={14} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-[var(--navy)]">Register Traffic Incident</h3>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg text-[var(--muted)] hover:text-[var(--navy)] hover:bg-[var(--border)] flex items-center justify-center transition-colors">
                <X size={15} />
              </motion.button>
            </div>

            <div className="overflow-y-auto px-5 py-5 space-y-4"
              style={{ maxHeight: "calc(92dvh - 130px)", scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>

              <p className="form-section-label">Reporter</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={form.reporterName} onChange={e => setField("reporterName", e.target.value)}
                    className={`input text-sm ${errors.reporterName ? "border-red-400" : ""}`} placeholder="Full name" />
                  {errors.reporterName && <p className="text-[11px] text-red-500 mt-0.5">{errors.reporterName}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" value={form.reporterPhone} onChange={e => setField("reporterPhone", e.target.value)}
                    className={`input text-sm ${errors.reporterPhone ? "border-red-400" : ""}`} placeholder="+251…" />
                  {errors.reporterPhone && <p className="text-[11px] text-red-500 mt-0.5">{errors.reporterPhone}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Email</label>
                  <input type="email" value={form.reporterEmail} onChange={e => setField("reporterEmail", e.target.value)}
                    className="input text-sm" placeholder="Optional" />
                </div>
              </div>

              <p className="form-section-label">Incident</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select value={form.incidentType} onChange={e => setField("incidentType", e.target.value)}
                      className={`input text-sm appearance-none pr-8 ${errors.incidentType ? "border-red-400" : ""}`}>
                      <option value="">Select…</option>
                      {["Collision","Pedestrian Hit","Vehicle Rollover","Rear-end Collision",
                        "Head-on Collision","Hit and Run","Multi-vehicle Crash","Other"].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
                  {errors.incidentType && <p className="text-[11px] text-red-500 mt-0.5">{errors.incidentType}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input type="date" value={form.incidentDate} onChange={e => setField("incidentDate", e.target.value)}
                    className={`input text-sm ${errors.incidentDate ? "border-red-400" : ""}`} />
                  {errors.incidentDate && <p className="text-[11px] text-red-500 mt-0.5">{errors.incidentDate}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={form.location} onChange={e => setField("location", e.target.value)}
                    className={`input text-sm ${errors.location ? "border-red-400" : ""}`} placeholder="Street / area" />
                  {errors.location && <p className="text-[11px] text-red-500 mt-0.5">{errors.location}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Injuries</label>
                  <input type="number" min="0" value={form.injuredCount} onChange={e => setField("injuredCount", e.target.value)} className="input text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Fatalities</label>
                  <input type="number" min="0" value={form.fatalitiesCount} onChange={e => setField("fatalitiesCount", e.target.value)} className="input text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea rows={3} value={form.description} onChange={e => setField("description", e.target.value)}
                    className={`input text-sm resize-none h-auto py-2 ${errors.description ? "border-red-400" : ""}`}
                    placeholder="What happened (min 10 chars)…" />
                  {errors.description && <p className="text-[11px] text-red-500 mt-0.5">{errors.description}</p>}
                </div>
              </div>

              <p className="form-section-label">Vehicle (optional)</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Plate</label>
                  <input type="text" value={form.vehiclePlateNumber} onChange={e => setField("vehiclePlateNumber", e.target.value)} className="input text-sm" placeholder="AA-12345" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Type</label>
                  <input type="text" value={form.vehicleType} onChange={e => setField("vehicleType", e.target.value)} className="input text-sm" placeholder="Sedan" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Color</label>
                  <input type="text" value={form.vehicleColor} onChange={e => setField("vehicleColor", e.target.value)} className="input text-sm" placeholder="White" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 px-5 py-4 border-t border-[var(--border)] bg-[var(--surface2)]/40">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 px-4 h-9 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSubmit as any} disabled={submitting} className="flex-1 btn-primary h-9">
                {submitting ? <span className="flex items-center gap-2"><span className="btn-spinner" />Saving…</span>
                  : <><FileText size={14} /> Register</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detail modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10 max-h-[90vh] overflow-y-auto"
            role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]"><X size={16} /></button>
            <h4 className="font-bold text-[var(--navy)] mb-1">{viewItem.incidentType}</h4>
            <p className="text-xs font-mono text-[var(--green)] mb-4">{viewItem.reportNumber}</p>
            <div className="space-y-2">
              {[
                ["Reporter",   viewItem.reporterName],
                ["Phone",      viewItem.reporterPhone],
                ["Location",   viewItem.location],
                ["Date",       viewItem.incidentDate?.split("T")[0] ?? "—"],
                ["Injuries",   String(viewItem.injuredCount ?? 0)],
                ["Fatalities", String(viewItem.fatalitiesCount ?? 0)],
                ["Plate",      viewItem.vehiclePlateNumber || "—"],
                ["Status",     viewItem.status],
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
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
