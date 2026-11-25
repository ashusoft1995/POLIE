"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle, Car, Users, FileText, Activity,
  Eye, X, Send, RefreshCw, ChevronDown,
} from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
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
  policeNotified: boolean;
  status: string;
  submittedAt: string;
};

const SEV_COLOR: Record<string, string> = {
  PENDING:       "badge-yellow",
  UNDER_REVIEW:  "badge-blue",
  ASSIGNED:      "badge-blue",
  INVESTIGATING: "badge-blue",
  RESOLVED:      "badge-green",
  CLOSED:        "badge-gray",
};

const emptyForm = {
  reporterName: "", reporterPhone: "", reporterEmail: "",
  incidentType: "", location: "", incidentDate: "", incidentTime: "",
  vehiclePlateNumber: "", vehicleType: "", vehicleColor: "",
  injuredCount: "0", fatalitiesCount: "0",
  policeNotified: false, description: "",
};
type Errors = Partial<Record<keyof typeof emptyForm, string>>;

function validate(f: typeof emptyForm): Errors {
  const e: Errors = {};
  if (!f.reporterName.trim() || f.reporterName.trim().length < 3)
    e.reporterName = "Reporter name required (min 3 chars).";
  if (!f.reporterPhone.trim() || f.reporterPhone.trim().length < 7)
    e.reporterPhone = "Valid phone number required.";
  if (!f.incidentType.trim()) e.incidentType = "Incident type is required.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.incidentDate) e.incidentDate = "Date is required.";
  if (f.description.trim().length < 10)
    e.description = "Description must be at least 10 characters.";
  return e;
}

/* ── component ───────────────────────────────────────────── */
export default function TrafficAccidentsPage() {
  const [reports, setReports]     = useState<Report[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewItem, setViewItem]   = useState<Report | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [form, setForm]           = useState({ ...emptyForm });
  const [errors, setErrors]       = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  /* ── fetch real data ─────────────────────────────────── */
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await trafficApi.getAll();
      setReports(data as Report[]);
    } catch {
      addToast("error", "Failed to load traffic reports from server.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  function setField(field: keyof typeof emptyForm, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field as keyof Errors])
      setErrors(e => { const c = { ...e }; delete c[field as keyof Errors]; return c; });
  }

  /* ── submit real data ────────────────────────────────── */
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
      const dateTime = form.incidentDate
        ? `${form.incidentDate}T${form.incidentTime || "00:00"}:00`
        : new Date().toISOString();
      await trafficApi.submit({
        reporterName:       form.reporterName.trim(),
        reporterPhone:      form.reporterPhone.trim(),
        reporterEmail:      form.reporterEmail.trim() || null,
        incidentType:       form.incidentType.trim(),
        description:        form.description.trim(),
        location:           form.location.trim(),
        incidentDate:       dateTime,
        vehiclePlateNumber: form.vehiclePlateNumber.trim() || null,
        vehicleType:        form.vehicleType.trim() || null,
        vehicleColor:       form.vehicleColor.trim() || null,
        injuredCount:       parseInt(form.injuredCount) || 0,
        fatalitiesCount:    parseInt(form.fatalitiesCount) || 0,
        policeNotified:     form.policeNotified,
      });
      addToast("success", "Traffic report filed and saved to database.");
      setReportOpen(false);
      setForm({ ...emptyForm });
      setErrors({});
      await fetchReports();
    } catch (err: any) {
      addToast("error", err?.message ?? "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    return (
      (!q ||
        r.reportNumber?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.incidentType?.toLowerCase().includes(q) ||
        r.reporterName?.toLowerCase().includes(q)) &&
      (statusFilter === "All" || r.status === statusFilter)
    );
  });

  const totals = {
    injuries:    reports.reduce((s, r) => s + (r.injuredCount ?? 0), 0),
    fatalities:  reports.reduce((s, r) => s + (r.fatalitiesCount ?? 0), 0),
  };

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Traffic Accident Reports</h2>
              <p className="text-sm text-[var(--slate)]">Real-time traffic incidents stored in the database.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchReports}
                className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setForm({ ...emptyForm }); setErrors({}); setReportOpen(true); }}
                className="btn-primary">
                <FileText size={15} /> New Report
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* KPI strip */}
        <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: reports.length,     icon: AlertCircle },
            { label: "Vehicles",      value: reports.length,     icon: Car         },
            { label: "Injuries",      value: totals.injuries,    icon: Activity    },
            { label: "Fatalities",    value: totals.fatalities,  icon: Users       },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y: -3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value} /></p>
                  </div>
                  <s.icon size={22} className="text-[var(--green)]" />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <AlertCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input type="search" placeholder="Search by ref, location, type…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-9 w-full text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input text-sm w-auto">
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div className="card p-12 text-center text-[var(--muted)] text-sm">Loading reports…</div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={32} className="mx-auto mb-2 text-[var(--muted)]" />
            <p className="text-sm text-[var(--slate)]">
              {reports.length === 0 ? "No traffic reports yet. File the first one." : "No reports match your filters."}
            </p>
          </div>
        ) : (
          <StaggerParent className="space-y-3">
            {filtered.map(r => (
              <StaggerChild key={r.id}>
                <motion.div whileHover={{ x: 3, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        r.fatalitiesCount > 0 ? "bg-red-50 text-red-600" :
                        r.injuredCount > 0    ? "bg-amber-50 text-amber-600" :
                                               "bg-green-50 text-green-600"}`}>
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--navy)]">{r.incidentType}</h4>
                        <p className="text-xs text-[var(--slate)] font-mono">{r.reportNumber}</p>
                      </div>
                    </div>
                    <span className={`badge ${SEV_COLOR[r.status] ?? "badge-gray"}`}>
                      {r.status?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    {[
                      ["Location",    r.location],
                      ["Date",        r.incidentDate?.split("T")[0] ?? "—"],
                      ["Injuries",    String(r.injuredCount ?? 0)],
                      ["Fatalities",  String(r.fatalitiesCount ?? 0)],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">{l}</p>
                        <p className={`font-semibold text-sm ${
                          l === "Fatalities" && Number(v) > 0 ? "text-red-600" :
                          l === "Injuries"   && Number(v) > 0 ? "text-amber-600" :
                          "text-[var(--charcoal)]"}`}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                    <p className="text-xs text-[var(--slate)]">
                      Reporter: <span className="font-semibold text-[var(--charcoal)]">{r.reporterName}</span>
                    </p>
                    <button onClick={() => setViewItem(r)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--green)] hover:underline">
                      <Eye size={13} /> View Details
                    </button>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        )}
      </div>

      {/* Detail modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10 max-h-[90vh] overflow-y-auto"
            role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]">
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                viewItem.fatalitiesCount > 0 ? "bg-red-50 text-red-600" :
                viewItem.injuredCount > 0    ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                <AlertCircle size={22} />
              </div>
              <div>
                <p className="font-bold text-[var(--navy)]">{viewItem.incidentType}</p>
                <p className="text-xs text-[var(--muted)] font-mono">{viewItem.reportNumber}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Reporter",    viewItem.reporterName],
                ["Phone",       viewItem.reporterPhone],
                ["Location",    viewItem.location],
                ["Date",        viewItem.incidentDate?.split("T")[0] ?? "—"],
                ["Status",      viewItem.status],
                ["Injuries",    String(viewItem.injuredCount ?? 0)],
                ["Fatalities",  String(viewItem.fatalitiesCount ?? 0)],
                ["Plate",       viewItem.vehiclePlateNumber || "—"],
                ["Vehicle",     [viewItem.vehicleColor, viewItem.vehicleType].filter(Boolean).join(" ") || "—"],
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

      {/* New report modal */}
      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="File Traffic Report" size="md" accent="red">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          <p className="form-section-label">Reporter Information</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                Reporter Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.reporterName}
                onChange={e => setField("reporterName", e.target.value)}
                className={`input text-sm ${errors.reporterName ? "border-red-400" : ""}`}
                placeholder="Full name" />
              {errors.reporterName && <p className="text-[11px] text-red-500 mt-0.5">{errors.reporterName}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input type="tel" value={form.reporterPhone}
                onChange={e => setField("reporterPhone", e.target.value)}
                className={`input text-sm ${errors.reporterPhone ? "border-red-400" : ""}`}
                placeholder="+251…" />
              {errors.reporterPhone && <p className="text-[11px] text-red-500 mt-0.5">{errors.reporterPhone}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Email</label>
              <input type="email" value={form.reporterEmail}
                onChange={e => setField("reporterEmail", e.target.value)}
                className="input text-sm" placeholder="Optional" />
            </div>
          </div>

          <p className="form-section-label">Incident Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select value={form.incidentType}
                  onChange={e => setField("incidentType", e.target.value)}
                  className={`input text-sm appearance-none pr-8 ${errors.incidentType ? "border-red-400" : ""}`}>
                  <option value="">Select…</option>
                  {["Collision","Pedestrian Hit","Vehicle Rollover","Rear-end Collision",
                    "Head-on Collision","Hit and Run","Multi-vehicle Crash","Other"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              </div>
              {errors.incidentType && <p className="text-[11px] text-red-500 mt-0.5">{errors.incidentType}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.location}
                onChange={e => setField("location", e.target.value)}
                className={`input text-sm ${errors.location ? "border-red-400" : ""}`}
                placeholder="Street / area" />
              {errors.location && <p className="text-[11px] text-red-500 mt-0.5">{errors.location}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input type="date" value={form.incidentDate}
                onChange={e => setField("incidentDate", e.target.value)}
                className={`input text-sm ${errors.incidentDate ? "border-red-400" : ""}`} />
              {errors.incidentDate && <p className="text-[11px] text-red-500 mt-0.5">{errors.incidentDate}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Time</label>
              <input type="time" value={form.incidentTime}
                onChange={e => setField("incidentTime", e.target.value)}
                className="input text-sm" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Injuries</label>
              <input type="number" min="0" value={form.injuredCount}
                onChange={e => setField("injuredCount", e.target.value)}
                className="input text-sm" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Fatalities</label>
              <input type="number" min="0" value={form.fatalitiesCount}
                onChange={e => setField("fatalitiesCount", e.target.value)}
                className="input text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea rows={3} value={form.description}
                onChange={e => setField("description", e.target.value)}
                className={`input text-sm resize-none h-auto py-2 ${errors.description ? "border-red-400" : ""}`}
                placeholder="Describe what happened (min 10 chars)…" />
              {errors.description && <p className="text-[11px] text-red-500 mt-0.5">{errors.description}</p>}
            </div>
          </div>

          <p className="form-section-label">Vehicle (optional)</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Plate</label>
              <input type="text" value={form.vehiclePlateNumber}
                onChange={e => setField("vehiclePlateNumber", e.target.value)}
                className="input text-sm" placeholder="AA-12345" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Type</label>
              <input type="text" value={form.vehicleType}
                onChange={e => setField("vehicleType", e.target.value)}
                className="input text-sm" placeholder="Sedan / Truck…" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Color</label>
              <input type="text" value={form.vehicleColor}
                onChange={e => setField("vehicleColor", e.target.value)}
                className="input text-sm" placeholder="White" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="policeNotified" checked={form.policeNotified as boolean}
              onChange={e => setField("policeNotified", e.target.checked)}
              className="w-4 h-4 accent-[var(--green)] cursor-pointer" />
            <label htmlFor="policeNotified" className="text-sm text-[var(--charcoal)] cursor-pointer font-medium">
              Police already notified at scene
            </label>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setReportOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting
                ? <span className="flex items-center gap-2"><span className="btn-spinner" />Saving…</span>
                : <><Send size={14} /> File Report</>}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
