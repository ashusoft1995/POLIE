"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import ScrollReveal from "@/components/ui/ScrollReveal";
import NewCaseForm from "@/components/dashboard/NewCaseForm";
import { casesApi } from "@/lib/api-client";
import { mockCases } from "@/lib/mock-data/cases";
import type { CrimeCase, CaseStatus, Priority } from "@/types";

const PAGE_SIZE = 5;

export default function CasesPage() {
  const [cases, setCases]           = useState<CrimeCase[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [page, setPage]             = useState(1);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [toasts, setToasts]         = useState<ToastMessage[]>([]);
  const [viewCase, setViewCase]     = useState<CrimeCase | null>(null);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await casesApi.getAll();
      setCases(data.map((c: any) => ({
        id:                c.id?.toString(),
        trackingId:        c.caseNumber,
        title:             c.title,
        crimeType:         c.caseType,
        reportedDate:      c.createdAt?.split("T")[0] ?? "",
        location:          c.location ?? "",
        status:            c.status === "OPEN" ? "Open" : c.status === "UNDER_INVESTIGATION" ? "Under Investigation" : c.status === "PENDING_COURT" ? "Pending Closure" : c.status === "CLOSED_SOLVED" ? "Closed" : c.status,
        priority:          c.priority === "HIGH" ? "High" : c.priority === "MEDIUM" ? "Medium" : "Low",
        assignedDetective: c.assignedDetective?.fullName,
        closureRequested:  false,
      })));
    } catch {
      setCases(mockCases);
      addToast("info", "Showing cached data — backend unavailable.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const handleNewCase = useCallback(async (caseData: CrimeCase) => {
    try {
      await casesApi.create({
        title: caseData.title, caseType: caseData.crimeType?.toUpperCase().replace(/ /g,"_"),
        description: (caseData as any).description ?? "New case", location: caseData.location,
        priority: caseData.priority?.toUpperCase(),
        assignedDetectiveId: (caseData as any).assignedDetectiveId
          ?? JSON.parse(sessionStorage.getItem("hcops_user") || "{}").id
          ?? 2,
      });
      addToast("success", `Case ${caseData.trackingId} created successfully.`);
      await fetchCases();
    } catch {
      setCases(prev => [caseData, ...prev]);
      addToast("success", `Case ${caseData.trackingId} created (local).`);
    }
    setShowNewCaseForm(false);
  }, [addToast, fetchCases]);

  const handleDelete = useCallback(async (id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
    setToDeleteId(null);
    addToast("success", "Case removed.");
  }, [addToast]);

  const filtered = useMemo(() => cases.filter(c => {
    const q = search.toLowerCase();
    return (!q || c.title.toLowerCase().includes(q) || c.trackingId.toLowerCase().includes(q) || c.crimeType.toLowerCase().includes(q)) &&
      (statusFilter === "All" || c.status === statusFilter) &&
      (priorityFilter === "All" || c.priority === priorityFilter);
  }), [cases, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Case Management</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">All reported cases.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchCases} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
            <button onClick={() => setShowNewCaseForm(true)} className="btn-primary"><Plus size={15}/> New Case</button>
          </div>
        </div>

        <div className="card p-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-9 flex-1 min-w-[200px]">
            <Search size={14} className="text-[var(--muted)] shrink-0"/>
            <input type="search" placeholder="Search by title, ID, type…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full"/>
            {search && <button onClick={() => setSearch("")}><X size={13} className="text-[var(--muted)]"/></button>}
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }} className="input text-sm w-auto">
            <option value="All">All Statuses</option>
            <option>Open</option><option>Under Investigation</option>
            <option>Pending Closure</option><option>Closed</option>
          </select>
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value as any); setPage(1); }} className="input text-sm w-auto">
            <option value="All">All Priorities</option>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>

        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["Tracking ID","Case Title","Type","Date","Status","Priority","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-[var(--muted)] text-sm">Loading cases…</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-[var(--muted)] text-sm">No cases match your filters.</td></tr>
                ) : paginated.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.04 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--green)] font-medium">{c.trackingId}</td>
                    <td className="px-4 py-3 font-medium text-[var(--navy)] max-w-[180px]">
                      <div className="truncate">{c.title}</div>
                      <div className="text-xs text-[var(--slate)] truncate">{c.location}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--charcoal)] hidden md:table-cell">{c.crimeType}</td>
                    <td className="px-4 py-3 text-[var(--slate)] hidden lg:table-cell whitespace-nowrap">{c.reportedDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge label={c.status}/></td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge label={c.priority}/></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewCase(c)} className="action-btn action-btn-view" title="View"><Eye size={15}/></button>
                        <button onClick={() => addToast("info","Edit coming soon.")} className="action-btn action-btn-edit" title="Edit"><Pencil size={15}/></button>
                        <button onClick={() => setToDeleteId(c.id)} className="action-btn action-btn-delete" title="Delete"><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--slate)]">Showing {Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg text-[var(--slate)] hover:bg-[var(--surface2)] disabled:opacity-30 transition-colors"><ChevronLeft size={16}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p===page?"bg-[var(--green)] text-white":"text-[var(--slate)] hover:bg-[var(--surface2)]"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg text-[var(--slate)] hover:bg-[var(--surface2)] disabled:opacity-30 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        </motion.div>
      </div>

      {viewCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewCase(null)}/>
          <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto" role="dialog">
            <button onClick={() => setViewCase(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]"><X size={18}/></button>
            <h3 className="text-base font-bold text-[var(--navy)] pr-6">{viewCase.title}</h3>
            <p className="text-xs font-mono text-[var(--green)] mt-0.5 mb-4">{viewCase.trackingId}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Crime Type",viewCase.crimeType],["Date",viewCase.reportedDate],["Location",viewCase.location],["Detective",viewCase.assignedDetective??"Unassigned"]].map(([l,v])=>(
                <div key={l} className="bg-[var(--surface2)] rounded-xl p-3">
                  <p className="text-xs text-[var(--muted)] mb-0.5">{l}</p>
                  <p className="font-medium text-[var(--navy)]">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4"><StatusBadge label={viewCase.status}/><StatusBadge label={viewCase.priority}/></div>
          </motion.div>
        </div>
      )}

      <ConfirmDialog open={!!toDeleteId} title="Remove case" message="Remove this case from the list?" confirmLabel="Remove"
        onConfirm={() => toDeleteId && handleDelete(toDeleteId)} onCancel={() => setToDeleteId(null)}/>
      <NewCaseForm isOpen={showNewCaseForm} onClose={() => setShowNewCaseForm(false)} onSubmit={handleNewCase}/>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
