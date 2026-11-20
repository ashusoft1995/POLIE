"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, X, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ToastContainer, { ToastMessage, useAutoDismiss } from "@/components/ui/toast";
import { mockMissingPersons } from "@/lib/mock-data/cases";

export default function MissingPersonsPage() {
  const [persons] = useState(mockMissingPersons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewPerson, setViewPerson] = useState<typeof mockMissingPersons[0] | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((type: ToastMessage["type"], msg: string) => setToasts(t => [...t, { id: Date.now().toString(), type, message: msg }]), []);
  const removeToast = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []);
  useAutoDismiss(toasts, removeToast);

  const filtered = persons.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.lastSeenLocation.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "All" || p.status === statusFilter)
  );

  return (
    <>
      <div className="space-y-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Missing & Wanted Persons</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Public posts for missing citizens and wanted criminals.</p>
          </div>
          <button onClick={() => addToast("info","Post form — coming in Preventive module.")} className="btn-primary">
            <Plus size={15}/> New Post
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Missing", count: persons.filter(p=>p.status==="Missing").length, cls:"bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-[var(--yellow-dark)]" },
            { label:"Wanted",  count: persons.filter(p=>p.status==="Wanted").length,  cls:"bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400" },
            { label:"Found",   count: persons.filter(p=>p.status==="Found").length,   cls:"bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-[var(--green)]" },
          ].map((s,i)=>(
            <motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className={`card border p-4 ${s.cls}`}>
              <p className="text-2xl font-extrabold tabular-nums">{s.count}</p>
              <p className="text-xs font-semibold mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-10 flex-1 min-w-[180px]">
            <Search size={14} className="text-[var(--muted)] shrink-0"/>
            <input type="search" placeholder="Search name or location…" value={search}
              onChange={e=>{setSearch(e.target.value);}}
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full"/>
            {search && <button onClick={()=>setSearch("")}><X size={13} className="text-[var(--muted)]"/></button>}
          </div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
            className="border border-[var(--border)] rounded-xl px-3 h-10 bg-[var(--card-bg)] text-sm text-[var(--navy)] outline-none">
            <option value="All">All Statuses</option>
            <option>Missing</option><option>Wanted</option><option>Found</option>
          </select>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} className={p.status==="Wanted"?"text-red-500":"text-[var(--yellow-dark)]"}/>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--navy)]">{p.name}</p>
                    <p className="text-xs text-[var(--slate)]">Age {p.age}</p>
                  </div>
                </div>
                <StatusBadge label={p.status}/>
              </div>
              <div className="text-sm text-[var(--charcoal)] space-y-1">
                <p><span className="text-[var(--muted)] text-xs">Last seen: </span>{p.lastSeenLocation}</p>
                <p><span className="text-[var(--muted)] text-xs">Date: </span>{p.lastSeenDate}</p>
                <p className="text-xs text-[var(--slate)] leading-relaxed line-clamp-2">{p.description}</p>
              </div>
              <button onClick={()=>setViewPerson(p)}
                className="flex items-center gap-2 justify-center w-full py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors mt-auto">
                <Eye size={14}/> View Details
              </button>
            </motion.div>
          ))}
          {filtered.length===0 && (
            <div className="col-span-3 text-center py-16 text-[var(--muted)] text-sm">No records match your filters.</div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {viewPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setViewPerson(null)}/>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
            className="relative bg-[var(--card-bg)] rounded-3xl shadow-2xl w-full max-w-md p-6 z-10" role="dialog">
            <button onClick={()=>setViewPerson(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]"><X size={18}/></button>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <AlertTriangle size={24} className={viewPerson.status==="Wanted"?"text-red-500":"text-[var(--yellow-dark)]"}/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--navy)]">{viewPerson.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[var(--slate)]">Age {viewPerson.age}</span>
                  <StatusBadge label={viewPerson.status}/>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[["Last Seen Location",viewPerson.lastSeenLocation],["Last Seen Date",viewPerson.lastSeenDate],["Posted Date",viewPerson.postedDate]].map(([l,v])=>(
                <div key={l} className="bg-[var(--surface2)] rounded-xl p-3">
                  <p className="text-xs text-[var(--muted)] mb-0.5">{l}</p>
                  <p className="font-semibold text-[var(--navy)]">{v}</p>
                </div>
              ))}
              <div className="bg-[var(--surface2)] rounded-xl p-3">
                <p className="text-xs text-[var(--muted)] mb-0.5">Description</p>
                <p className="text-[var(--charcoal)] leading-relaxed">{viewPerson.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
