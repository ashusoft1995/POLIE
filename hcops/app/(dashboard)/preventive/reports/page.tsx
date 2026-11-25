"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, AlertTriangle, RefreshCw, Eye, X } from "lucide-react";
import { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { crimeReportApi } from "@/lib/api-client";

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
  suspectDescription?: string;
  status: string;
  submittedAt: string;
  isUrgent: boolean;
  officerNotes?: string;
};

export default function PreventiveReportsPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [viewItem, setViewItem] = useState<Report | null>(null);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crimeReportApi.getAll();
      setReports(data as Report[]);
    } catch {
      addToast("error", "Failed to load crime reports from server.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  function handleDownload(rep: Report) {
    const rows = [
      ["Ref #", "Reporter", "Phone", "Crime Type", "Location", "Date", "Status", "Urgent"],
      [rep.caseNumber, rep.reporterName, rep.reporterPhone, rep.crimeType,
        rep.incidentLocation, rep.incidentDate?.split("T")[0] ?? "", rep.status, rep.isUrgent ? "Yes" : "No"],
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `crime_report_${rep.caseNumber ?? rep.id}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    addToast("success", `${rep.crimeType} report downloaded.`);
  }

  const counts = {
    total:   reports.length,
    pending: reports.filter(r => r.status === "PENDING").length,
    urgent:  reports.filter(r => r.isUrgent).length,
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Crime Reports</h2>
            <p className="text-sm text-[var(--slate)]">Real-time crime reports submitted by citizens.</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={fetchReports} disabled={loading}
            className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Reports",    value: counts.total,   icon: FileText },
            { label: "Pending Review",   value: counts.pending, icon: AlertTriangle },
            { label: "Urgent Reports",   value: counts.urgent,  icon: TrendingUp },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y: -3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]">{s.value}</p>
                  </div>
                  <s.icon size={22} className="text-[var(--green)]" />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {loading ? (
          <div className="card p-12 text-center text-[var(--muted)] text-sm">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={32} className="mx-auto mb-2 text-[var(--muted)]" />
            <p className="text-sm text-[var(--slate)]">No crime reports submitted yet.</p>
          </div>
        ) : (
          <StaggerParent className="space-y-3">
            {reports.map(rep => (
              <StaggerChild key={rep.id}>
                <motion.div whileHover={{ x: 3 }} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        rep.isUrgent ? "bg-red-100 dark:bg-red-900/20" : "bg-[var(--green-light)]"
                      }`}>
                        <FileText size={18} className={rep.isUrgent ? "text-red-500" : "text-[var(--green)]"} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-[var(--navy)] truncate">{rep.crimeType}</h4>
                          {rep.isUrgent && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--slate)]">
                          {rep.incidentLocation} · Submitted: {rep.submittedAt?.split("T")[0] ?? "—"}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">Reporter: {rep.reporterName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <span className={`badge ${STATUS_COLORS[rep.status] ?? "badge-gray"} text-[11px]`}>
                        {rep.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-[var(--muted)] font-mono">{rep.caseNumber}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setViewItem(rep)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors">
                        <Eye size={13} /> View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(rep)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors">
                        <Download size={13} /> Download
                      </motion.button>
                    </div>
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto"
            role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]">
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${STATUS_COLORS[viewItem.status] ?? "badge-gray"} text-[11px]`}>
                {viewItem.status.replace(/_/g, " ")}
              </span>
              {viewItem.isUrgent && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">URGENT</span>
              )}
            </div>
            <h3 className="text-base font-bold text-[var(--navy)]">{viewItem.crimeType}</h3>
            <p className="text-xs font-mono text-[var(--green)] mt-0.5 mb-4">{viewItem.caseNumber}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              {[
                ["Reporter",  viewItem.reporterName],
                ["Phone",     viewItem.reporterPhone],
                ["Location",  viewItem.incidentLocation],
                ["Incident Date", viewItem.incidentDate?.split("T")[0] ?? "—"],
                ["Submitted", viewItem.submittedAt?.split("T")[0] ?? "—"],
              ].map(([l, v]) => (
                <div key={l} className="bg-[var(--surface2)] rounded-xl p-3">
                  <p className="text-xs text-[var(--muted)] mb-0.5">{l}</p>
                  <p className="font-medium text-[var(--navy)] text-xs">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-[var(--surface2)] rounded-xl p-3 mb-2">
              <p className="text-xs text-[var(--muted)] mb-1">Description</p>
              <p className="text-xs text-[var(--charcoal)] leading-relaxed">{viewItem.description}</p>
            </div>
            {viewItem.suspectDescription && (
              <div className="bg-[var(--surface2)] rounded-xl p-3">
                <p className="text-xs text-[var(--muted)] mb-1">Suspect Description</p>
                <p className="text-xs text-[var(--charcoal)] leading-relaxed">{viewItem.suspectDescription}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
