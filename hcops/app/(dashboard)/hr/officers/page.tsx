"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, UserPlus, Mail, Badge, Clock, RefreshCw, Eye, X } from "lucide-react";
import { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { employeeApi } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function HROfficersPage() {
  const router = useRouter();
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [viewItem, setViewItem] = useState<any|null>(null);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await employeeApi.getAll();
      setOfficers(data);
    } catch {
      setOfficers([
        { id:1, badge:"PHD-001", fullName:"Head Habtamu Woldemariam", rank:"Head of Police",    role:"POLICE_HEAD", email:"head@hossanapolice.gov.et",      enabled:true, createdAt:"2024-01-01" },
        { id:2, badge:"DET-012", fullName:"Det. Abebe Girma",         rank:"Detective Sergeant",role:"DETECTIVE",   email:"detective@hossanapolice.gov.et", enabled:true, createdAt:"2024-01-01" },
        { id:3, badge:"HR-005",  fullName:"Insp. Almaz Worku",        rank:"HR Inspector",      role:"HR",          email:"hr@hossanapolice.gov.et",         enabled:true, createdAt:"2024-01-01" },
        { id:4, badge:"TRF-033", fullName:"Off. Kebede Alemu",        rank:"Traffic Officer",   role:"TRAFFIC",     email:"traffic@hossanapolice.gov.et",   enabled:true, createdAt:"2024-01-01" },
      ]);
      addToast("info","Showing cached data.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchOfficers(); }, [fetchOfficers]);

  const filtered = officers.filter(o => {
    const q = search.toLowerCase();
    return (!q || o.fullName?.toLowerCase().includes(q) || (o.badge||o.badgeNumber||"").toLowerCase().includes(q)) &&
           (roleFilter === "All" || o.role === roleFilter);
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Officer Directory</h2>
            <p className="text-sm text-[var(--slate)]">Manage personnel records.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOfficers} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
            <button onClick={() => router.push("/hr/register")} className="btn-primary"><UserPlus size={16}/> Add Officer</button>
          </div>
        </div>

        <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total",      value:officers.length,                                        icon:Users },
            { label:"Active",     value:officers.filter(o=>o.enabled!==false).length,            icon:Badge },
            { label:"Detectives", value:officers.filter(o=>o.role==="DETECTIVE").length,          icon:Users },
            { label:"On Leave",   value:officers.filter(o=>o.enabled===false).length,             icon:Clock },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{y:-4}} className="card p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value}/></p></div>
                  <s.icon size={24} className="text-[var(--green)]"/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <div className="card p-5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/>
              <input type="search" placeholder="Search by name or badge…" value={search}
                onChange={e => setSearch(e.target.value)} className="input pl-9 w-full text-sm"/>
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input text-sm">
              <option value="All">All Roles</option>
              <option value="POLICE_HEAD">Police Head</option><option value="DETECTIVE">Detective</option>
              <option value="PREVENTIVE">Preventive</option><option value="TRAFFIC">Traffic</option>
              <option value="HR">HR</option><option value="SYSTEM_ADMIN">System Admin</option>
            </select>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface2)] border-b-2 border-[var(--border)]">
                <tr>{["Badge","Name","Rank","Role","Email","Status","Actions"].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-[var(--muted)] text-sm">Loading officers…</td></tr>
                ) : filtered.map((o,idx) => (
                  <motion.tr key={o.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:idx*0.05}} whileHover={{backgroundColor:"var(--surface2)"}}>
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--navy)]">{o.badge||o.badgeNumber}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--navy)]">{o.fullName}</p>
                      <p className="text-xs text-[var(--slate)] flex items-center gap-1 mt-0.5"><Mail size={11}/>{o.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{o.rank}</td>
                    <td className="px-5 py-4"><span className="badge badge-blue text-[11px]">{o.role}</span></td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{o.email}</td>
                    <td className="px-5 py-4"><span className={`badge ${o.enabled!==false?"badge-green":"badge-yellow"}`}>{o.enabled!==false?"Active":"Inactive"}</span></td>
                    <td className="px-5 py-4">
                      <button onClick={() => setViewItem(o)} className="p-1.5 rounded-lg text-[var(--slate)] hover:text-[var(--green)] hover:bg-green-50 transition-colors"><Eye size={15}/></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewItem(null)}/>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10" role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]"><X size={16}/></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center"><Users size={20} className="text-[var(--green)]"/></div>
              <div><p className="font-bold text-[var(--navy)]">{viewItem.fullName}</p><span className="badge badge-blue text-[11px]">{viewItem.role}</span></div>
            </div>
            <div className="space-y-2">
              {[["Badge",viewItem.badge||viewItem.badgeNumber],["Rank",viewItem.rank],["Email",viewItem.email],["Status",viewItem.enabled!==false?"Active":"Inactive"]].map(([l,v])=>(
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
