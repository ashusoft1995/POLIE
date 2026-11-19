"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer, { ToastMessage, useAutoDismiss } from "@/components/ui/Toast";

const mockOfficers = [
  { id: "O001", name: "Det. Abebe Girma",     badge: "DET-012", rank: "Detective Sergeant",  department: "CID",         status: "Active" as const,   joined: "2018-03-15" },
  { id: "O002", name: "Off. Meron Tadesse",   badge: "PRV-021", rank: "Police Officer I",     department: "Preventive",  status: "Active" as const,   joined: "2020-07-01" },
  { id: "O003", name: "Off. Kebede Alemu",    badge: "TRF-033", rank: "Traffic Officer",      department: "Traffic",     status: "Active" as const,   joined: "2019-11-20" },
  { id: "O004", name: "Sgt. Lemlem Haile",    badge: "DET-018", rank: "Detective Constable",  department: "CID",         status: "Active" as const,   joined: "2017-05-10" },
  { id: "O005", name: "Off. Dawit Bekele",    badge: "PRV-029", rank: "Police Officer II",    department: "Preventive",  status: "On Leave" as const, joined: "2021-02-14" },
  { id: "O006", name: "Insp. Almaz Worku",    badge: "PRV-005", rank: "Inspector",            department: "Preventive",  status: "Active" as const,   joined: "2015-09-08" },
  { id: "O007", name: "Off. Yonas Tesfaye",   badge: "TRF-041", rank: "Traffic Officer",      department: "Traffic",     status: "Suspended" as const,joined: "2022-01-30" },
  { id: "O008", name: "Det. Tigist Mekonnen", badge: "DET-022", rank: "Detective Sergeant",   department: "CID",         status: "Active" as const,   joined: "2016-06-25" },
];

const PAGE_SIZE = 5;

export default function OfficersPage() {
  const [officers, setOfficers] = useState(mockOfficers);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [viewOfficer, setViewOfficer] = useState<typeof mockOfficers[0] | null>(null);

  const addToast = useCallback((type: ToastMessage["type"], msg: string) => {
    setToasts((t) => [...t, { id: Date.now().toString(), type, message: msg }]);
  }, []);
  const removeToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  useAutoDismiss(toasts, removeToast);

  const filtered = officers.filter((o) => {
    const q = search.toLowerCase();
    return (
      (!q || o.name.toLowerCase().includes(q) || o.badge.toLowerCase().includes(q) || o.rank.toLowerCase().includes(q)) &&
      (deptFilter === "All" || o.department === deptFilter) &&
      (statusFilter === "All" || o.status === statusFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Officer Overview</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">All active and assigned officers under your command.</p>
          </div>
          <button onClick={() => addToast("info", "Register Officer form — available in HR module.")} className="btn-primary">
            <Plus size={15} /> Add Officer
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Officers", value: officers.length, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
            { label: "Active", value: officers.filter(o => o.status === "Active").length, color: "bg-green-50 dark:bg-green-900/20 text-[var(--green-dark)] border-green-200 dark:border-green-800" },
            { label: "On Leave", value: officers.filter(o => o.status === "On Leave").length, color: "bg-yellow-50 dark:bg-yellow-900/20 text-[var(--yellow-dark)] border-yellow-200 dark:border-yellow-800" },
            { label: "Suspended", value: officers.filter(o => o.status === "Suspended").length, color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`card p-4 border ${s.color}`}>
              <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-xs font-semibold mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-10 flex-1 min-w-[200px]">
            <Search size={14} className="text-[var(--muted)] shrink-0" />
            <input type="search" placeholder="Search name, badge, rank…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full" />
            {search && <button onClick={() => setSearch("")}><X size={13} className="text-[var(--muted)]" /></button>}
          </div>
          <div className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 h-10 bg-[var(--card-bg)]">
            <Filter size={13} className="text-[var(--muted)]" />
            <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
              className="text-sm text-[var(--navy)] bg-transparent outline-none">
              <option value="All">All Departments</option>
              <option>CID</option><option>Preventive</option><option>Traffic</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 h-10 bg-[var(--card-bg)]">
            <Filter size={13} className="text-[var(--muted)]" />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm text-[var(--navy)] bg-transparent outline-none">
              <option value="All">All Statuses</option>
              <option>Active</option><option>On Leave</option><option>Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["Badge", "Name & Rank", "Department", "Joined", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-[var(--muted)] text-sm">No officers match your filters.</td></tr>
                ) : paginated.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--green)] font-semibold">{o.badge}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {o.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--navy)]">{o.name}</p>
                          <p className="text-xs text-[var(--slate)]">{o.rank}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--charcoal)]">{o.department}</td>
                    <td className="px-4 py-3 text-[var(--slate)] whitespace-nowrap">{o.joined}</td>
                    <td className="px-4 py-3"><StatusBadge label={o.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewOfficer(o)} title="View" className="p-1.5 rounded-lg text-[var(--slate)] hover:text-[var(--green)] hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"><Eye size={15} /></button>
                        <button onClick={() => addToast("info", `Edit form for ${o.name} — HR module.`)} title="Edit" className="p-1.5 rounded-lg text-[var(--slate)] hover:text-[var(--yellow-dark)] hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => setToDeleteId(o.id)} title="Remove" className="p-1.5 rounded-lg text-[var(--slate)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--slate)]">Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface2)] disabled:opacity-30"><ChevronLeft size={16}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p===page?"bg-[var(--green)] text-white":"text-[var(--slate)] hover:bg-[var(--surface2)]"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface2)] disabled:opacity-30"><ChevronRight size={16}/></button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* View modal */}
      {viewOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewOfficer(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[var(--card-bg)] rounded-3xl shadow-2xl w-full max-w-sm p-6 z-10" role="dialog">
            <button onClick={() => setViewOfficer(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]"><X size={18}/></button>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                {viewOfficer.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
              </div>
              <h3 className="text-base font-bold text-[var(--navy)]">{viewOfficer.name}</h3>
              <p className="text-sm text-[var(--slate)]">{viewOfficer.rank}</p>
              <div className="mt-2"><StatusBadge label={viewOfficer.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Badge", viewOfficer.badge],["Department", viewOfficer.department],["Joined", viewOfficer.joined]].map(([l,v])=>(
                <div key={l} className="bg-[var(--surface2)] rounded-xl p-3">
                  <p className="text-xs text-[var(--muted)] mb-0.5">{l}</p>
                  <p className="font-semibold text-[var(--navy)]">{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmDialog open={!!toDeleteId} title="Remove officer record"
        message="This removes the officer from the local list. This action cannot be undone."
        confirmLabel="Remove" onConfirm={() => { setOfficers(o => o.filter(x=>x.id!==toDeleteId)); setToDeleteId(null); addToast("success","Officer record removed."); }}
        onCancel={() => setToDeleteId(null)} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
