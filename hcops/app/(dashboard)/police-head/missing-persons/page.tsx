"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, X, AlertTriangle, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { missingPersonApi } from "@/lib/api-client";

export default function MissingPersonsPage() {
  const [persons, setPersons]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewPerson, setViewPerson] = useState<any|null>(null);
  const [toasts, setToasts]         = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchPersons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await missingPersonApi.getAll();
      setPersons(data);
    } catch {
      setPersons([
        { id:1, name:"Biruk Alemu",      age:17, lastSeenLocation:"Kebele 05", lastSeenDate:"2024-11-20", status:"MISSING",  description:"Male, blue school uniform." },
        { id:2, name:"Selamawit Desta",  age:34, lastSeenLocation:"Weekly Market", lastSeenDate:"2024-11-15", status:"MISSING", description:"Female, yellow dress." },
        { id:3, name:"Yonas Tesfaye",    age:28, lastSeenLocation:"Bus Terminal",  lastSeenDate:"2024-10-30", status:"WANTED",  description:"Wanted for armed robbery." },
      ]);
      addToast("info","Showing cached data.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchPersons(); }, [fetchPersons]);

  const filtered = persons.filter(p =>
    (!search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.lastSeenLocation?.toLowerCase().includes(search.toLowerCase())) &&
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
          <div className="flex items-center gap-2">
            <button onClick={fetchPersons} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
            <button onClick={() => addToast("info","Submit missing person reports via the Citizen portal.")} className="btn-primary"><Plus size={15}/> New Post</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Missing", count:persons.filter(p=>p.status==="MISSING"||p.status==="Missing").length,  cls:"bg-yellow-50 border-yellow-200 text-yellow-700" },
            { label:"Wanted",  count:persons.filter(p=>p.status==="WANTED"||p.status==="Wanted").length,    cls:"bg-red-50 border-red-200 text-red-600"           },
            { label:"Found",   count:persons.filter(p=>p.status==="FOUND"||p.status==="Found").length,      cls:"bg-green-50 border-green-200 text-green-700"      },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className={`card border p-4 ${s.cls}`}>
              <p className="text-2xl font-extrabold tabular-nums">{s.count}</p>
              <p className="text-xs font-semibold mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="card p-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 h-10 flex-1 min-w-[180px]">
            <Search size={14} className="text-[var(--muted)] shrink-0"/>
            <input type="search" placeholder="Search name or location…" value={search} onChange={e=>setSearch(e.target.value)}
              className="bg-transparent text-sm text-[var(--navy)] placeholder-[var(--muted)] outline-none w-full"/>
            {search && <button onClick={() => setSearch("")}><X size={13} className="text-[var(--muted)]"/></button>}
          </div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border border-[var(--border)] rounded-xl px-3 h-10 bg-[var(--card-bg)] text-sm text-[var(--navy)] outline-none">
            <option value="All">All</option><option value="MISSING">Missing</option><option value="WANTED">Wanted</option><option value="FOUND">Found</option>
          </select>
        </div>

        {loading ? <div className="text-center py-16 text-[var(--muted)] text-sm">Loading records…</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p,i) => (
              <motion.div key={p.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      <AlertTriangle size={20} className={p.status==="WANTED"||p.status==="Wanted"?"text-red-500":"text-yellow-600"}/>
                    </div>
                    <div><p className="font-bold text-[var(--navy)]">{p.name}</p><p className="text-xs text-[var(--slate)]">Age {p.age}</p></div>
                  </div>
                  <StatusBadge label={p.status}/>
                </div>
                <div className="text-sm text-[var(--charcoal)] space-y-1">
                  <p><span className="text-[var(--muted)] text-xs">Last seen: </span>{p.lastSeenLocation}</p>
                  <p><span className="text-[var(--muted)] text-xs">Date: </span>{(p.lastSeenDate||"").split("T")[0]}</p>
                  <p className="text-xs text-[var(--slate)] leading-relaxed line-clamp-2">{p.description}</p>
                </div>
                <button onClick={() => setViewPerson(p)} className="flex items-center gap-2 justify-center w-full py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors mt-auto">
                  <Eye size={14}/> View Details
                </button>
              </motion.div>
            ))}
            {filtered.length===0 && <div className="col-span-3 text-center py-16 text-[var(--muted)] text-sm">No records match your filters.</div>}
          </div>
        )}
      </div>

      {viewPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewPerson(null)}/>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
            className="relative bg-[var(--card-bg)] rounded-3xl shadow-2xl w-full max-w-md p-6 z-10" role="dialog">
            <button onClick={() => setViewPerson(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--navy)]"><X size={18}/></button>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <AlertTriangle size={24} className={viewPerson.status==="WANTED"?"text-red-500":"text-yellow-600"}/>
              </div>
              <div><h3 className="text-lg font-bold text-[var(--navy)]">{viewPerson.name}</h3>
                <div className="flex items-center gap-2 mt-1"><span className="text-sm text-[var(--slate)]">Age {viewPerson.age}</span><StatusBadge label={viewPerson.status}/></div></div>
            </div>
            <div className="space-y-3 text-sm">
              {[["Last Seen",viewPerson.lastSeenLocation],["Date",(viewPerson.lastSeenDate||"").split("T")[0]],["Reported",(viewPerson.reportedAt||viewPerson.postedDate||"").split("T")[0]||"—"]].map(([l,v])=>(
                <div key={l} className="bg-[var(--surface2)] rounded-xl p-3"><p className="text-xs text-[var(--muted)] mb-0.5">{l}</p><p className="font-semibold text-[var(--navy)]">{String(v)}</p></div>
              ))}
              <div className="bg-[var(--surface2)] rounded-xl p-3"><p className="text-xs text-[var(--muted)] mb-0.5">Description</p><p className="text-[var(--charcoal)] leading-relaxed">{viewPerson.description}</p></div>
            </div>
          </motion.div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
