"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, RefreshCw, Save, Loader2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { employeeApi } from "@/lib/api-client";

const ROLES = ["POLICE_HEAD","DETECTIVE","PREVENTIVE","TRAFFIC","HR","SYSTEM_ADMIN"];
const RANKS = ["Head of Police","Detective Sergeant","Detective Constable","Police Officer I","Police Officer II","Traffic Officer","HR Inspector","System Administrator","Inspector","Sergeant","Constable"];

const MOCK_OFFICERS = [
  { id:"1", name:"Det. Abebe Girma",     email:"detective@hossanapolice.gov.et",  badge:"DET-012", rank:"Detective Sergeant", role:"DETECTIVE",   status:"Active",   joined:"2018-03-15" },
  { id:"2", name:"Off. Meron Tadesse",   email:"preventive@hossanapolice.gov.et", badge:"PRV-021", rank:"Police Officer I",   role:"PREVENTIVE",  status:"Active",   joined:"2020-07-01" },
  { id:"3", name:"Off. Kebede Alemu",    email:"traffic@hossanapolice.gov.et",    badge:"TRF-033", rank:"Traffic Officer",    role:"TRAFFIC",     status:"Active",   joined:"2019-11-20" },
  { id:"4", name:"Insp. Almaz Worku",    email:"hr@hossanapolice.gov.et",         badge:"HR-005",  rank:"HR Inspector",       role:"HR",          status:"Active",   joined:"2015-09-08" },
  { id:"5", name:"Admin Daniel Kebede",  email:"admin@hossanapolice.gov.et",      badge:"ADM-001", rank:"System Administrator",role:"SYSTEM_ADMIN",status:"Active",   joined:"2014-01-01" },
];
const PAGE_SIZE = 5;

interface Officer {
  id: string; name: string; email: string; badge: string;
  rank: string; role: string; status: string; joined: string;
}

export default function OfficersPage() {
  const [officers, setOfficers]       = useState<Officer[]>(MOCK_OFFICERS);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]               = useState(1);
  const [toDeleteId, setToDeleteId]   = useState<string|null>(null);
  const [toasts, setToasts]           = useState<ToastMessage[]>([]);
  const [viewOfficer, setViewOfficer] = useState<Officer|null>(null);

  // Edit state
  const [editOfficer, setEditOfficer] = useState<Officer|null>(null);
  const [editForm, setEditForm]       = useState<Partial<Officer>>({});
  const [saving, setSaving]           = useState(false);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await employeeApi.getAll();
      setOfficers(data.map((o: any) => ({
        id:     String(o.id),
        name:   o.fullName ?? o.name ?? "—",
        email:  o.email ?? "",
        badge:  o.badge ?? o.badgeNumber ?? "—",
        rank:   o.rank ?? "—",
        role:   o.role ?? "—",
        status: o.enabled !== false ? "Active" : "Inactive",
        joined: (o.createdAt ?? "").split("T")[0],
      })));
    } catch {
      setOfficers(MOCK_OFFICERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOfficers(); }, [fetchOfficers]);

  function openEdit(o: Officer) {
    setEditOfficer(o);
    setEditForm({ name: o.name, email: o.email, badge: o.badge, rank: o.rank, role: o.role });
  }

  async function handleSave() {
    if (!editOfficer) return;
    setSaving(true);
    try {
      await employeeApi.update(Number(editOfficer.id), {
        fullName: editForm.name,
        email:    editForm.email,
        badge:    editForm.badge,
        rank:     editForm.rank,
        role:     editForm.role,
      });
      setOfficers(prev => prev.map(o =>
        o.id === editOfficer.id ? { ...o, ...editForm } as Officer : o
      ));
      addToast("success", `${editForm.name} updated successfully.`);
      setEditOfficer(null);
    } catch (err: any) {
      addToast("error", err?.message ?? "Failed to update officer.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await employeeApi.delete(Number(id));
      setOfficers(prev => prev.filter(o => o.id !== id));
      addToast("success", "Officer deleted.");
    } catch {
      // fallback: remove from local list only
      setOfficers(prev => prev.filter(o => o.id !== id));
      addToast("warning", "Removed from list (server sync may differ).");
    }
    setToDeleteId(null);
  }

  const filtered = officers.filter(o => {
    const q = search.toLowerCase();
    return (
      (!q || o.name.toLowerCase().includes(q) || o.badge.toLowerCase().includes(q) || o.rank.toLowerCase().includes(q) || o.email.toLowerCase().includes(q)) &&
      (roleFilter === "All" || o.role === roleFilter) &&
      (statusFilter === "All" || o.status === statusFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  return (
    <>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Officer Directory</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">All officers under your command. Edit or manage accounts.</p>
          </div>
          <button onClick={fetchOfficers} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:"Total Officers", value:officers.length,                                    color:"bg-blue-50 dark:bg-blue-900/20 text-blue-700 border-blue-200" },
            { label:"Active",         value:officers.filter(o=>o.status==="Active").length,     color:"bg-green-50 dark:bg-green-900/20 text-[var(--green-dark)] border-green-200" },
            { label:"On Leave",       value:officers.filter(o=>o.status==="On Leave").length,   color:"bg-yellow-50 dark:bg-yellow-900/20 text-[var(--yellow-dark)] border-yellow-200" },
            { label:"Inactive",       value:officers.filter(o=>o.status==="Inactive").length,   color:"bg-red-50 dark:bg-red-900/20 text-red-700 border-red-200" },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className={`card p-4 border ${s.color}`}>
              <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-xs font-semibold mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-10 flex-1 min-w-[180px]">
            <Search size={14} className="text-[var(--muted)] shrink-0" />
            <input type="search" placeholder="Search name, badge, email…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full" />
            {search && <button onClick={() => setSearch("")}><X size={13} className="text-[var(--muted)]"/></button>}
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="border border-[var(--border)] rounded-xl px-3 h-10 bg-[var(--card-bg)] text-sm text-[var(--navy)] outline-none">
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-[var(--border)] rounded-xl px-3 h-10 bg-[var(--card-bg)] text-sm text-[var(--navy)] outline-none">
            <option value="All">All Statuses</option>
            <option>Active</option><option>Inactive</option><option>On Leave</option>
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["Badge","Name & Rank","Role","Email","Status","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-[var(--muted)] text-sm">No officers match your filters.</td></tr>
                ) : paginated.map((o, i) => (
                  <motion.tr key={o.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--green)] font-semibold">{o.badge}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {o.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--navy)]">{o.name}</p>
                          <p className="text-xs text-[var(--slate)]">{o.rank}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--charcoal)]">{o.role.replace(/_/g," ")}</td>
                    <td className="px-4 py-3 text-xs text-[var(--slate)]">{o.email}</td>
                    <td className="px-4 py-3"><StatusBadge label={o.status}/></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewOfficer(o)} title="View"
                          className="p-1.5 rounded-lg text-[var(--slate)] hover:text-[var(--green)] hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"><Eye size={15}/></button>
                        <button onClick={() => openEdit(o)} title="Edit"
                          className="p-1.5 rounded-lg text-[var(--slate)] hover:text-[var(--yellow-dark)] hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"><Pencil size={15}/></button>
                        <button onClick={() => setToDeleteId(o.id)} title="Delete"
                          className="p-1.5 rounded-lg text-[var(--slate)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={15}/></button>
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
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface2)] disabled:opacity-30"><ChevronLeft size={16}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p===page?"bg-[var(--green)] text-white":"text-[var(--slate)] hover:bg-[var(--surface2)]"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface2)] disabled:opacity-30"><ChevronRight size={16}/></button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── View modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {viewOfficer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setViewOfficer(null)}/>
            <motion.div initial={{opacity:0,scale:0.95,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:16}}
              className="relative bg-[var(--card-bg)] rounded-3xl shadow-2xl w-full max-w-sm p-6 z-10" role="dialog">
              <button onClick={()=>setViewOfficer(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]"><X size={18}/></button>
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                  {viewOfficer.name.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}
                </div>
                <h3 className="text-base font-bold text-[var(--navy)]">{viewOfficer.name}</h3>
                <p className="text-sm text-[var(--slate)]">{viewOfficer.rank}</p>
                <div className="mt-2"><StatusBadge label={viewOfficer.status}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {([["Badge",viewOfficer.badge],["Role",viewOfficer.role.replace(/_/g," ")],["Email",viewOfficer.email],["Joined",viewOfficer.joined]] as [string,string][]).map(([l,v])=>(
                  <div key={l} className="bg-[var(--surface2)] rounded-xl p-3 col-span-1">
                    <p className="text-xs text-[var(--muted)] mb-0.5">{l}</p>
                    <p className="font-semibold text-[var(--navy)] text-xs break-all">{v}</p>
                  </div>
                ))}
              </div>
              <button onClick={()=>{setViewOfficer(null); openEdit(viewOfficer);}}
                className="mt-4 w-full h-10 btn-primary text-sm flex items-center justify-center gap-2">
                <Pencil size={14}/> Edit this Officer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {editOfficer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>!saving && setEditOfficer(null)}/>
            <motion.div initial={{opacity:0,scale:0.95,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:16}}
              className="relative bg-[var(--card-bg)] rounded-3xl shadow-2xl w-full max-w-md p-6 z-10" role="dialog" aria-modal>
              <button onClick={()=>!saving && setEditOfficer(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]" disabled={saving}><X size={18}/></button>

              <h3 className="text-base font-bold text-[var(--navy)] mb-1">Edit Officer</h3>
              <p className="text-xs text-[var(--slate)] mb-5">Changes are saved directly to the database.</p>

              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1.5">Full Name</label>
                  <input value={editForm.name ?? ""} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))}
                    className="input w-full" placeholder="Full name" disabled={saving}/>
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1.5">Email</label>
                  <input type="email" value={editForm.email ?? ""} onChange={e=>setEditForm(f=>({...f,email:e.target.value}))}
                    className="input w-full" placeholder="Email address" disabled={saving}/>
                </div>
                {/* Badge */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1.5">Badge Number</label>
                  <input value={editForm.badge ?? ""} onChange={e=>setEditForm(f=>({...f,badge:e.target.value}))}
                    className="input w-full font-mono" placeholder="e.g. DET-012" disabled={saving}/>
                </div>
                {/* Rank + Role row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1.5">Rank</label>
                    <select value={editForm.rank ?? ""} onChange={e=>setEditForm(f=>({...f,rank:e.target.value}))}
                      className="input w-full" disabled={saving}>
                      <option value="">Select rank</option>
                      {RANKS.map(r=><option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--charcoal)] mb-1.5">Role</label>
                    <select value={editForm.role ?? ""} onChange={e=>setEditForm(f=>({...f,role:e.target.value}))}
                      className="input w-full" disabled={saving}>
                      <option value="">Select role</option>
                      {ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g," ")}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={()=>setEditOfficer(null)} disabled={saving}
                  className="flex-1 h-10 rounded-xl border border-[var(--border)] text-sm text-[var(--charcoal)] hover:bg-[var(--surface2)] transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !editForm.name}
                  className="flex-1 h-10 btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <><Loader2 size={14} className="animate-spin"/> Saving…</> : <><Save size={14}/> Save Changes</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!toDeleteId} title="Delete officer"
        message="This permanently deletes the officer account. This cannot be undone."
        confirmLabel="Delete" onConfirm={()=>handleDelete(toDeleteId!)}
        onCancel={()=>setToDeleteId(null)}/>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
