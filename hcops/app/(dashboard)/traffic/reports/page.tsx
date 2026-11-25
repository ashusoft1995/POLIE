"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, TrendingUp, Download, FileText, RefreshCw, AlertTriangle } from "lucide-react";
import { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { trafficApi } from "@/lib/api-client";

type TrafficReport = {
  id: number;
  reportNumber: string;
  incidentType: string;
  location: string;
  incidentDate: string;
  submittedAt: string;
  injuredCount: number;
  fatalitiesCount: number;
  status: string;
  reporterName: string;
};

export default function TrafficReportsPage() {
  const [reports, setReports]   = useState<TrafficReport[]>([]);
  const [loading, setLoading]   = useState(true);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await trafficApi.getAll();
      setReports(data as TrafficReport[]);
    } catch {
      addToast("error", "Failed to load traffic reports.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  function handleDownload(rep: TrafficReport) {
    const csv = [
      ["Ref #","Type","Location","Date","Injuries","Fatalities","Status","Reporter"],
      [rep.reportNumber, rep.incidentType, rep.location,
       rep.incidentDate?.split("T")[0] ?? "",
       rep.injuredCount, rep.fatalitiesCount, rep.status, rep.reporterName],
    ].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `traffic_report_${rep.reportNumber}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    addToast("success", `${rep.reportNumber} downloaded.`);
  }

  const stats = {
    total:      reports.length,
    accidents:  reports.length,
    injuries:   reports.reduce((s, r) => s + (r.injuredCount ?? 0), 0),
    fatalities: reports.reduce((s, r) => s + (r.fatalitiesCount ?? 0), 0),
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Traffic Reports</h2>
            <p className="text-sm text-[var(--slate)]">Real traffic incident reports from the database.</p>
          </div>
          <button onClick={fetchReports}
            className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: stats.total,      icon: FileText,       color: "text-blue-600"    },
            { label: "Incidents",     value: stats.accidents,  icon: Car,            color: "text-[var(--green)]" },
            { label: "Total Injuries",value: stats.injuries,   icon: TrendingUp,     color: "text-amber-600"   },
            { label: "Fatalities",    value: stats.fatalities, icon: AlertTriangle,  color: "text-red-600"     },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y: -3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                  <s.icon size={22} className={s.color} />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {loading ? (
          <div className="card p-12 text-center text-[var(--muted)] text-sm">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="card p-12 text-center">
            <Car size={32} className="mx-auto mb-2 text-[var(--muted)]" />
            <p className="text-sm text-[var(--slate)]">No traffic reports yet.</p>
          </div>
        ) : (
          <StaggerParent className="space-y-3">
            {reports.map(rep => (
              <StaggerChild key={rep.id}>
                <motion.div whileHover={{ x: 3 }} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        rep.fatalitiesCount > 0 ? "bg-red-50 text-red-600" :
                        rep.injuredCount > 0    ? "bg-amber-50 text-amber-600" :
                                                  "bg-[var(--green-light)] text-[var(--green)]"
                      }`}>
                        <Car size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[var(--navy)] truncate">{rep.incidentType}</h4>
                        <p className="text-xs text-[var(--slate)]">
                          {rep.location} · {rep.incidentDate?.split("T")[0] ?? "—"}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5 font-mono">{rep.reportNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {rep.fatalitiesCount > 0 && (
                        <span className="badge badge-red">{rep.fatalitiesCount} fatal</span>
                      )}
                      {rep.injuredCount > 0 && (
                        <span className="badge badge-yellow">{rep.injuredCount} injured</span>
                      )}
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
