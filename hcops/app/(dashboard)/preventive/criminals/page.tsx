"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UserX, Search, AlertTriangle, Eye, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";

type Criminal = { id:string; name:string; alias:string|null; dob:string; crime:string; status:string; lastSeen:string; registered:string; notes:string; };

const mockCriminals: Criminal[] = [
  { id:"CR001", name:"Yonas Tesfaye",   alias:"Yoni",  dob:"1995-04-12", crime:"Armed Robbery", status:"Wanted",     lastSeen:"Hossana Market",  registered:"2024-11-01", notes:"Considered armed and dangerous." },
  { id:"CR002", name:"Dawit Bekele",    alias:"Dagi",  dob:"1998-07-22", crime:"Assault",        status:"In Custody", lastSeen:"Kebele 03",        registered:"2024-11-18", notes:"Currently held at Hossana Station." },
  { id:"CR003", name:"Biruk Alemu",     alias:null,    dob:"2006-11-05", crime:"Theft",           status:"Released",   lastSeen:"Bus Terminal",     registered:"2024-10-15", notes:"Released on bail pending trial." },
  { id:"CR004", name:"Tesfaye Haile",   alias:"Tesfu", dob:"1992-03-18", crime:"Drug Offence",   status:"Wanted",     lastSeen:"Market District",  registered:"2024-09-20", notes:"Linked to supply network." },
  { id:"CR005", name:"Almaz Bekele",    alias:null,    dob:"2000-08-30", crime:"Fraud",           status:"In Custody", lastSeen:"Admin Office",     registered:"2024-11-20", notes:"Financial records seized as evidence." },
];

const STATUS_COLORS: Record<string,string> = { "Wanted":"badge-red","In Custody":"badge-yellow","Released":"badge-green" };

export default function PreventiveCriminalsPage() {
  const router = useRouter();
  const [criminals]       = useState<Criminal[]>(mockCriminals);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewItem, setViewItem]       = useState<Criminal|null>(null);
  const [toasts, setToasts]           = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const filtered = criminals.filter(c => {
    const q = search.toLowerCase();
    return (!q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) &&
           (statusFilter === "All" || c.status === statusFilter);
  });

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Criminal Records</h2>
              <p className="text-sm text-[var(--slate)]">View and manage registered criminals.</p>
            </div>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              onClick={() => router.push("/preventive/register")} className="btn-primary">
              <UserX size={15}/> Register Criminal
            </motion.button>
          </div>
        </ScrollReveal>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Total Records", value:criminals.length,                                       icon:FileText      },
            { label:"Wanted",        value:criminals.filter(c=>c.status==="Wanted").length,        icon:AlertTriangle },
            { label:"In Custody",    value:criminals.filter(c=>c.status==="In Custody").length,    icon:UserX         },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y:-3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value}/></p>
                  </div>
                  <s.icon size={24} className="text-[var(--green)]"/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <div className="card p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/>
            <input type="search" placeholder="Search by name or ID…" value={search}
              onChange={e => setSearch(e.target.value)} className="input pl-9 w-full text-sm"/>
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input text-sm">
            <option value="All">All Statuses</option>
            <option>Wanted</option><option>In Custody</option><option>Released</option>
          </select>
        </div>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(crim => (
            <StaggerChild key={crim.id}>
              <motion.div whileHover={{ y:-5, boxShadow:"0 16px 32px -8px rgba(0,0,0,0.15)" }} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 w-12 h-12 rounded-xl bg-[var(--surface2)] flex items-center justify-center">
                      <UserX size={22} className="text-[var(--slate)]"/>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--navy)]">{crim.name}</h4>
                      {crim.alias && <p className="text-xs text-[var(--muted)] italic">aka "{crim.alias}"</p>}
                    </div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[crim.status]||"badge-gray"}`}>{crim.status}</span>
                </div>

                <div className="space-y-1.5 text-sm mb-4">
                  {[["ID",crim.id],["Crime",crim.crime],["DOB",crim.dob],["Last Seen",crim.lastSeen]].map(([l,v]) => (
                    <div key={l} className="flex items-center justify-between">
                      <span className="text-[var(--muted)] text-xs">{l}</span>
                      <span className={`font-semibold text-xs ${l==="Crime"?"text-red-600":"text-[var(--navy)]"}`}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                  <button onClick={() => setViewItem(crim)}
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--green)] text-white text-xs font-semibold hover:bg-[var(--green-dark)] transition-colors">
                    <Eye size={13}/> View Record
                  </button>
                  <button onClick={() => addToast("info","Full report view — coming soon.")}
                    className="h-9 w-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors">
                    <FileText size={13}/>
                  </button>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-[var(--muted)] text-sm">No records match your filters.</div>
          )}
        </StaggerParent>
      </div>

      {/* Detail modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)}/>
          <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10" role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]"><X size={16}/></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--surface2)] flex items-center justify-center"><UserX size={22} className="text-[var(--slate)]"/></div>
              <div>
                <p className="font-bold text-[var(--navy)]">{viewItem.name}</p>
                {viewItem.alias && <p className="text-xs text-[var(--muted)] italic">aka "{viewItem.alias}"</p>}
                <span className={`badge ${STATUS_COLORS[viewItem.status]||"badge-gray"} text-[11px] mt-1`}>{viewItem.status}</span>
              </div>
            </div>
            <div className="space-y-2">
              {[["Record ID",viewItem.id],["Crime",viewItem.crime],["Date of Birth",viewItem.dob],["Last Seen",viewItem.lastSeen],["Registered",viewItem.registered]].map(([l,v]) => (
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{v}</span>
                </div>
              ))}
              {viewItem.notes && (
                <div className="bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <p className="text-[var(--muted)] text-xs mb-1">Officer Notes</p>
                  <p className="text-[var(--charcoal)] text-xs leading-relaxed">{viewItem.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
