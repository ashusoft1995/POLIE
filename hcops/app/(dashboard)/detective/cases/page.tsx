"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, FileText, Clock, AlertTriangle, CheckCircle2, XCircle, MapPin, RefreshCw, X } from "lucide-react";
import { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { casesApi } from "@/lib/api-client";
import { mockCases } from "@/lib/mock-data/cases";

const STATUS_COLORS: Record<string,string> = {
  OPEN:"badge-yellow","UNDER_INVESTIGATION":"badge-blue","PENDING_COURT":"badge-pink",
  "CLOSED_SOLVED":"badge-green","CLOSED_UNSOLVED":"badge-gray",
  "Open":"badge-yellow","Under Investigation":"badge-blue","Pending Closure":"badge-pink","Closed":"badge-green",
};
const PRIORITY_COLORS: Record<string,string> = { HIGH:"text-red-500",MEDIUM:"text-yellow-600",LOW:"text-green-600",High:"text-red-500",Medium:"text-yellow-600",Low:"text-green-600" };

export default function DetectiveCasesPage() {
  const [cases, setCases]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewCase, setViewCase] = useState<any|null>(null);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("hcops_user")||"{}");
      const data = user.id ? await casesApi.getByDetective(user.id) : await casesApi.getAll();
      setCases(data);
    } catch {
      setCases(mockCases);
      addToast("info","Showing cached data.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    const title = (c.title||"").toLowerCase();
    const num   = (c.caseNumber||c.trackingId||"").toLowerCase();
    return (!q || title.includes(q) || num.includes(q)) &&
           (statusFilter === "All" || c.status === statusFilter);
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">My Assigned Cases</h2>
            <p className="text-sm text-[var(--slate)]">View and manage your investigation cases.</p>
          </div>
          <button onClick={fetchCases} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
        </div>

        <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total",        value:cases.length,                                                               icon:FileText,    color:"blue"   },
            { label:"Investigating", value:cases.filter(c=>c.status==="UNDER_INVESTIGATION"||c.status==="Under Investigation").length, icon:Clock,     color:"yellow" },
            { label:"Pending",      value:cases.filter(c=>c.status==="PENDING_COURT"||c.status==="Pending Closure").length,            icon:AlertTriangle,color:"pink" },
            { label:"Closed",       value:cases.filter(c=>c.status==="CLOSED_SOLVED"||c.status==="Closed").length,                     icon:CheckCircle2,color:"green" },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{y:-4}} className="card p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]">{s.value}</p></div>
                  <s.icon size={24} className={`text-${s.color}-600`}/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <div className="card p-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/>
              <input type="search" placeholder="Search by title or case ID…" value={search}
                onChange={e => setSearch(e.target.value)} className="input pl-9 w-full text-sm"/>
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input text-sm">
              <option value="All">All Statuses</option>
              <option value="OPEN">Open</option><option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="PENDING_COURT">Pending Closure</option><option value="CLOSED_SOLVED">Closed</option>
            </select>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface2)] border-b-2 border-[var(--border)]">
                <tr>{["Case ID","Title","Type","Status","Priority","Date","Actions"].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-[var(--muted)] text-sm">Loading cases…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center"><XCircle size={32} className="mx-auto mb-2 text-[var(--muted)]"/><p className="text-sm text-[var(--slate)]">No cases match your filters.</p></td></tr>
                ) : filtered.map((c,idx) => (
                  <motion.tr key={c.id||c.trackingId} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:idx*0.05}} whileHover={{backgroundColor:"var(--surface2)"}} className="transition-colors">
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--navy)]">{c.caseNumber||c.trackingId}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--navy)] mb-0.5">{c.title}</p>
                      <p className="text-xs text-[var(--slate)] flex items-center gap-1"><MapPin size={11}/>{c.location||"—"}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{c.caseType||c.crimeType}</td>
                    <td className="px-5 py-4"><span className={`badge ${STATUS_COLORS[c.status]||"badge-gray"}`}>{c.status}</span></td>
                    <td className="px-5 py-4"><span className={`text-xs font-bold uppercase ${PRIORITY_COLORS[c.priority]||"text-[var(--slate)]"}`}>{c.priority}</span></td>
                    <td className="px-5 py-4 text-sm text-[var(--slate)]">{(c.createdAt||c.reportedDate||"").split("T")[0]}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.95}}
                          onClick={() => setViewCase(c)}
                          className="action-btn action-btn-view">
                          <Eye size={16}/>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewCase(null)}/>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto" role="dialog">
            <button onClick={() => setViewCase(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]"><X size={18}/></button>
            <h3 className="text-base font-bold text-[var(--navy)] pr-6">{viewCase.title}</h3>
            <p className="text-xs font-mono text-[var(--green)] mt-0.5 mb-4">{viewCase.caseNumber||viewCase.trackingId}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Type",viewCase.caseType||viewCase.crimeType],["Status",viewCase.status],["Priority",viewCase.priority],["Location",viewCase.location||"—"],["Date",(viewCase.createdAt||viewCase.reportedDate||"").split("T")[0]],["Detective",viewCase.assignedDetective?.fullName||viewCase.assignedDetective||"Me"]].map(([l,v])=>(
                <div key={l} className="bg-[var(--surface2)] rounded-xl p-3">
                  <p className="text-xs text-[var(--muted)] mb-0.5">{l}</p>
                  <p className="font-medium text-[var(--navy)] text-xs">{String(v)}</p>
                </div>
              ))}
            </div>
            {viewCase.description && (
              <div className="mt-3 bg-[var(--surface2)] rounded-xl p-3">
                <p className="text-xs text-[var(--muted)] mb-1">Description</p>
                <p className="text-xs text-[var(--charcoal)] leading-relaxed">{viewCase.description}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
