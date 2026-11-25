"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Eye, CheckCircle2, XCircle, RefreshCw, X,
  Clock, AlertTriangle, FileText, ChevronLeft, ChevronRight,
} from "lucide-react";
import { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { crimeReportApi, casesApi, employeeApi } from "@/lib/api-client";

const PAGE_SIZE = 8;

const STATUS_COLORS: Record<string, string> = {
  PENDING:        "badge-yellow",
  UNDER_REVIEW:   "badge-blue",
  ASSIGNED:       "badge-blue",
  INVESTIGATING:  "badge-blue",
  RESOLVED:       "badge-green",
  CLOSED:         "badge-gray",
  REJECTED:       "badge-red",
};

type Report = {
  id: number;
  caseNumber: string;
  reporterName: string;
  reporterPhone: string;
  crimeType: string;
  description: string;
  incidentLocation: string;
  incidentDate: string;
  suspectDescription: string;
  status: string;
  submittedAt: string;
  isUrgent: boolean;
  officerNotes?: string;
  assignedOfficer?: { id: number; fullName: string };
};

export default function PoliceHeadCrimeReportsPage() {
  const [reports, setReports]       = useState<Report[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]             = useState(1);
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [actionReport, setActionReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detectives, setDetectives] = useState<any[]>([]);
  const [selectedDetective, setSelectedDetective] = useState<number | "">("");
  const [toasts, setToasts]         = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], msg: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message: msg }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crimeReportApi.getAll();
      setReports(data as Report[]);
    } catch {
      addToast("error", "Failed to load crime reports.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchDetectives = useCallback(async () => {
    try {
      const data = await employeeApi.getByRole("DETECTIVE");
      setDetectives(data);
    } catch {
      /* non-critical */
    }
  }, []);

  useEffect(() => {
    fetchReports();
    fetchDetectives();
  }, [fetchReports, fetchDetectives]);

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    return (
      (!q ||
        r.reporterName.toLowerCase().includes(q) ||
        r.caseNumber?.toLowerCase().includes(q) ||
        r.crimeType.toLowerCase().includes(q) ||
        r.incidentLocation.toLowerCase().includes(q)) &&
      (statusFilter === "All" || r.status === statusFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAction(report: Report, type: "approve" | "reject") {
    setActionReport(report);
    setActionType(type);
    setNotes("");
    setSelectedDetective("");
  }

  async function handleAction() {
    if (!actionReport || !actionType) return;
    setSubmitting(true);
    try {
      if (actionType === "approve") {
        // 1. Approve the report (status → UNDER_REVIEW)
        await crimeReportApi.approve(actionReport.id, notes || undefined);

        // 2. Auto-create a case linked to this report if a detective was selected
        if (selectedDetective) {
          const caseType = mapCrimeTypeToCase(actionReport.crimeType);
          await casesApi.create({
            title:               `Case: ${actionReport.crimeType} — ${actionReport.incidentLocation}`,
            caseType,
            description:         actionReport.description,
            priority:            actionReport.isUrgent ? "HIGH" : "MEDIUM",
            location:            actionReport.incidentLocation,
            incidentDate:        actionReport.incidentDate,
            assignedDetectiveId: Number(selectedDetective),
            crimeReportId:       actionReport.id,
          });
          addToast("success", "Report approved and case created for detective.");
        } else {
          addToast("success", "Report approved. Assign a detective to create a case.");
        }
      } else {
        await crimeReportApi.reject(actionReport.id, notes || undefined);
        addToast("info", "Report rejected.");
      }
      setActionReport(null);
      setActionType(null);
      await fetchReports();
    } catch (err: any) {
      addToast("error", err?.message ?? "Action failed.");
    } finally {
      setSubmitting(false);
    }
  }

  // Map crime type string to backend CaseType enum value
  function mapCrimeTypeToCase(crimeType: string): string {
    const t = crimeType.toUpperCase();
    if (t.includes("THEFT") || t.includes("STEAL") || t.includes("ROBBERY")) return "THEFT";
    if (t.includes("ASSAULT") || t.includes("ATTACK")) return "ASSAULT";
    if (t.includes("FRAUD") || t.includes("SCAM")) return "FRAUD";
    if (t.includes("BURGLARY") || t.includes("BREAK")) return "BURGLARY";
    if (t.includes("HOMICIDE") || t.includes("MURDER") || t.includes("KILL")) return "HOMICIDE";
    if (t.includes("DRUG")) return "DRUG_OFFENSE";
    if (t.includes("CYBER") || t.includes("HACK")) return "CYBERCRIME";
    if (t.includes("MISSING")) return "MISSING_PERSON";
    if (t.includes("DOMESTIC") || t.includes("FAMILY")) return "DOMESTIC_VIOLENCE";
    return "OTHER";
  }

  const counts = {
    total:      reports.length,
    pending:    reports.filter(r => r.status === "PENDING").length,
    approved:   reports.filter(r => r.status === "UNDER_REVIEW" || r.status === "ASSIGNED" || r.status === "INVESTIGATING").length,
    rejected:   reports.filter(r => r.status === "REJECTED").length,
  };

  return (
    <>
      <div className="space-y-5 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Crime Report Review</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">
              Review submitted citizen crime reports and approve or reject them.
            </p>
          </div>
          <button
            onClick={fetchReports}
            className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {/* KPI strip */}
        <StaggerParent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Reports",    value: counts.total,    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",          icon: FileText },
            { label: "Awaiting Review",  value: counts.pending,  color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800", icon: Clock },
            { label: "Approved",         value: counts.approved, color: "text-[var(--green)] bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",  icon: CheckCircle2 },
            { label: "Rejected",         value: counts.rejected, color: "text-[var(--pink)] bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",        icon: XCircle },
          ].map((s, i) => (
            <StaggerChild key={s.label}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`card border p-4 ${s.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
                    <p className="text-xs font-semibold mt-0.5">{s.label}</p>
                  </div>
                  <s.icon size={20} className="opacity-60" />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-9 flex-1 min-w-[200px]">
            <Search size={14} className="text-[var(--muted)] shrink-0" />
            <input
              type="search"
              placeholder="Search by reporter, type, location…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={13} className="text-[var(--muted)]" /></button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input text-sm w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["Ref #", "Reporter", "Crime Type", "Location", "Date", "Urgent", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-14 text-[var(--muted)] text-sm">
                      Loading reports…
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-14">
                      <FileText size={32} className="mx-auto mb-2 text-[var(--muted)]" />
                      <p className="text-sm text-[var(--slate)]">No reports match your filters.</p>
                    </td>
                  </tr>
                ) : paginated.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface2)] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[var(--green)] font-medium whitespace-nowrap">
                      {r.caseNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--navy)]">{r.reporterName}</p>
                      <p className="text-xs text-[var(--slate)]">{r.reporterPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--charcoal)] font-medium">{r.crimeType}</td>
                    <td className="px-4 py-3 text-[var(--slate)] max-w-[160px]">
                      <span className="truncate block">{r.incidentLocation}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--slate)] whitespace-nowrap">
                      {r.incidentDate ? r.incidentDate.split("T")[0] : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.isUrgent ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                          <AlertTriangle size={12} /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`badge ${STATUS_COLORS[r.status] ?? "badge-gray"}`}>
                        {r.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewReport(r)}
                          className="action-btn action-btn-view"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                        {r.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => openAction(r, "approve")}
                              className="action-btn action-btn-approve"
                              title="Approve"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                            <button
                              onClick={() => openAction(r, "reject")}
                              className="action-btn action-btn-reject"
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--slate)]">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-[var(--slate)] hover:bg-[var(--surface2)] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-[var(--green)] text-white" : "text-[var(--slate)] hover:bg-[var(--surface2)]"}`}>
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-[var(--slate)] hover:bg-[var(--surface2)] disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── View detail modal ───────────────────────────────────── */}
      <AnimatePresence>
        {viewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setViewReport(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto"
              role="dialog"
            >
              <button onClick={() => setViewReport(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]">
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 mb-1">
                {viewReport.isUrgent && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} /> URGENT
                  </span>
                )}
                <span className={`badge ${STATUS_COLORS[viewReport.status] ?? "badge-gray"} text-[11px]`}>
                  {viewReport.status.replace(/_/g, " ")}
                </span>
              </div>
              <h3 className="text-base font-bold text-[var(--navy)] mt-2">{viewReport.crimeType}</h3>
              <p className="text-xs font-mono text-[var(--green)] mt-0.5 mb-4">{viewReport.caseNumber}</p>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                {[
                  ["Reporter",  viewReport.reporterName],
                  ["Phone",     viewReport.reporterPhone],
                  ["Location",  viewReport.incidentLocation],
                  ["Date",      viewReport.incidentDate ? viewReport.incidentDate.split("T")[0] : "—"],
                  ["Submitted", viewReport.submittedAt ? viewReport.submittedAt.split("T")[0] : "—"],
                  ["Assigned",  viewReport.assignedOfficer?.fullName ?? "Unassigned"],
                ].map(([l, v]) => (
                  <div key={l} className="bg-[var(--surface2)] rounded-xl p-3">
                    <p className="text-xs text-[var(--muted)] mb-0.5">{l}</p>
                    <p className="font-medium text-[var(--navy)] text-xs">{v}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[var(--surface2)] rounded-xl p-3 mb-3">
                <p className="text-xs text-[var(--muted)] mb-1">Description</p>
                <p className="text-xs text-[var(--charcoal)] leading-relaxed">{viewReport.description}</p>
              </div>

              {viewReport.suspectDescription && (
                <div className="bg-[var(--surface2)] rounded-xl p-3 mb-3">
                  <p className="text-xs text-[var(--muted)] mb-1">Suspect Description</p>
                  <p className="text-xs text-[var(--charcoal)] leading-relaxed">{viewReport.suspectDescription}</p>
                </div>
              )}

              {viewReport.officerNotes && (
                <div className="bg-[var(--surface2)] rounded-xl p-3">
                  <p className="text-xs text-[var(--muted)] mb-1">Officer Notes</p>
                  <p className="text-xs text-[var(--charcoal)] leading-relaxed">{viewReport.officerNotes}</p>
                </div>
              )}

              {viewReport.status === "PENDING" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => { setViewReport(null); openAction(viewReport, "approve"); }}
                    className="flex-1 btn-primary text-sm"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button
                    onClick={() => { setViewReport(null); openAction(viewReport, "reject"); }}
                    className="flex-1 py-2 px-4 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Approve / Reject action modal ──────────────────────── */}
      <AnimatePresence>
        {actionReport && actionType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => { setActionReport(null); setActionType(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
              role="dialog"
            >
              <button
                onClick={() => { setActionReport(null); setActionType(null); }}
                className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]"
              >
                <X size={18} />
              </button>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                actionType === "approve" ? "bg-green-100 text-[var(--green)]" : "bg-red-100 text-red-600"
              }`}>
                {actionType === "approve" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>

              <h3 className="text-base font-bold text-[var(--navy)]">
                {actionType === "approve" ? "Approve Report" : "Reject Report"}
              </h3>
              <p className="text-xs text-[var(--slate)] mt-0.5 mb-4">
                <span className="font-semibold text-[var(--charcoal)]">{actionReport.crimeType}</span>
                {" — "}{actionReport.reporterName}
              </p>

              {actionType === "approve" && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1.5">
                    Assign Detective <span className="text-[var(--muted)] font-normal">(optional — creates case automatically)</span>
                  </label>
                  <select
                    value={selectedDetective}
                    onChange={e => setSelectedDetective(e.target.value ? Number(e.target.value) : "")}
                    className="input text-sm w-full"
                  >
                    <option value="">No assignment yet</option>
                    {detectives.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName ?? `${d.firstName} ${d.lastName}`} — {d.badgeNumber ?? d.employeeId ?? ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-5">
                <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1.5">
                  Notes <span className="text-[var(--muted)] font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={actionType === "approve" ? "Review notes…" : "Reason for rejection…"}
                  className="input text-sm w-full resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setActionReport(null); setActionType(null); }}
                  className="flex-1 py-2 px-4 rounded-xl border border-[var(--border)] text-[var(--slate)] text-sm font-semibold hover:bg-[var(--surface2)] transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={submitting}
                  className={`flex-1 py-2 px-4 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${
                    actionType === "approve"
                      ? "bg-[var(--green)] hover:bg-[var(--green-dark)]"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {submitting ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : actionType === "approve" ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <XCircle size={15} />
                  )}
                  {submitting ? "Processing…" : actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
