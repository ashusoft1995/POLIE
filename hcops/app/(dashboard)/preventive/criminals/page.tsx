"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { UserX, Search, AlertTriangle, Eye, FileText, X, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { crimeReportApi } from "@/lib/api-client";

/* backend crime reports are the criminal database for preventive officers */
type CrimeReport = {
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
  officerNotes: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:        "badge-yellow",
  UNDER_REVIEW:   "badge-blue",
  ASSIGNED:       "badge-blue",
  INVESTIGATING:  "badge-blue",
  RESOLVED:       "badge-green",
  CLOSED:         "badge-gray",
  REJECTED:       "badge-red",
};

export default function PreventiveCriminalsPage() {
  const router = useRouter();
  const [reports, setReports]           = useState<CrimeReport[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewItem, setViewItem]         = useState<CrimeReport | null>(null);
  const [toasts, setToasts]             = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crimeReportApi.getAll();
      setReports(data as CrimeReport[]);
    } catch {
      addToast("error", "Failed to load criminal records from server.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    return (
      (!q ||
        r.reporterName?.toLowerCase().includes(q) ||
        r.caseNumber?.toLowerCase().includes(q) ||
        r.crimeType?.toLowerCase().includes(q) ||
        r.incidentLocation?.toLowerCase().includes(q)) &&
      (statusFilter === "All" || r.status === statusFilter)
    );
  });

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Criminal Records Database</h2>
              <p className="text-sm text-[var(--slate)]">
                All crime reports from the database — real data, persisted in Neon.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchReports}
                className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/preventive/register")} className="btn-primary">
                <UserX size={15} /> File New Report
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* KPIs */}
        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Records",   value: reports.length,                                                             icon: FileText      },
            { label: "Pending Review",  value: reports.filter(r => r.status === "PENDING").length,                        icon: AlertTriangle },
            { label: "Under Investigation", value: reports.filter(r => ["ASSIGNED","INVESTIGATING","UNDER_REVIEW"].includes(r.status)).length, icon: UserX },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y: -3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value} /></p>
                  </div>
                  <s.icon size={24} className="text-[var(--green)]" />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input type="search" placeholder="Search by name, ref, type, location…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-9 w-full text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input text-sm w-auto">
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="card p-12 text-center text-[var(--muted)] text-sm">Loading records…</div>
        ) : (
          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => (
              <StaggerChild key={r.id}>
                <motion.div whileHover={{ y: -5, boxShadow: "0 16px 32px -8px rgba(0,0,0,0.15)" }} className="card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[var(--surface2)] flex items-center justify-center">
                        <UserX size={20} className="text-[var(--slate)]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--navy)]">{r.reporterName}</h4>
                        <p className="text-xs text-[var(--muted)] font-mono">{r.caseNumber}</p>
                      </div>
                    </div>
                    <span className={`badge ${STATUS_COLORS[r.status] ?? "badge-gray"}`}>
                      {r.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm mb-4">
                    {[
                      ["Crime",     r.crimeType],
                      ["Location",  r.incidentLocation],
                      ["Date",      r.incidentDate?.split("T")[0] ?? "—"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between">
                        <span className="text-[var(--muted)] text-xs">{l}</span>
                        <span className={`font-semibold text-xs ${l === "Crime" ? "text-red-600" : "text-[var(--navy)]"}`}>{v}</span>
                      </div>
                    ))}
                    {r.isUrgent && (
                      <div className="flex items-center gap-1 text-xs font-bold text-red-600 mt-1">
                        <AlertTriangle size={11} /> URGENT
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                    <button onClick={() => setViewItem(r)}
                      className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--green)] text-white text-xs font-semibold hover:bg-[var(--green-dark)] transition-colors">
                      <Eye size={13} /> View Record
                    </button>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="col-span-3 text-center py-16 text-[var(--muted)] text-sm">
                {reports.length === 0
                  ? "No criminal records yet. File a crime report to add one."
                  : "No records match your filters."}
              </div>
            )}
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
              <div className="w-12 h-12 rounded-xl bg-[var(--surface2)] flex items-center justify-center">
                <UserX size={22} className="text-[var(--slate)]" />
              </div>
              <div>
                <p className="font-bold text-[var(--navy)]">{viewItem.reporterName}</p>
                <p className="text-xs text-[var(--muted)] font-mono">{viewItem.caseNumber}</p>
                <span className={`badge ${STATUS_COLORS[viewItem.status] ?? "badge-gray"} text-[11px] mt-1`}>
                  {viewItem.status?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ["Crime Type",   viewItem.crimeType],
                ["Location",     viewItem.incidentLocation],
                ["Incident Date",viewItem.incidentDate?.split("T")[0] ?? "—"],
                ["Reported On",  viewItem.submittedAt?.split("T")[0] ?? "—"],
                ["Phone",        viewItem.reporterPhone],
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
                  <p className="text-[var(--muted)] text-xs mb-1">Suspect Description</p>
                  <p className="text-[var(--charcoal)] text-xs leading-relaxed">{viewItem.suspectDescription}</p>
                </div>
              )}
              {viewItem.officerNotes && (
                <div className="bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <p className="text-[var(--muted)] text-xs mb-1">Officer Notes</p>
                  <p className="text-[var(--charcoal)] text-xs leading-relaxed">{viewItem.officerNotes}</p>
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
