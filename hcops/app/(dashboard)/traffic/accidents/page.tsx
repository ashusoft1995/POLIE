"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Car, Users, FileText, Activity, Eye, X, Send } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

type Accident = { id:string; type:string; location:string; date:string; time:string; severity:string; vehicles:number; injuries:number; fatalities:number; officer:string; status:string; description:string; };
const MOCK: Accident[] = [
  { id:"ACC001", type:"Collision",          location:"Hossana-Durame Road", date:"2024-11-25", time:"14:30", severity:"Major",    vehicles:2, injuries:3, fatalities:0, officer:"Off. Kebede Alemu",   status:"Investigating",  description:"Two vehicles collided at the junction. All occupants taken to hospital." },
  { id:"ACC002", type:"Pedestrian Hit",     location:"Main Market Area",    date:"2024-11-22", time:"08:15", severity:"Minor",    vehicles:1, injuries:1, fatalities:0, officer:"Off. Lemlem Tadesse",  status:"Closed",         description:"Pedestrian struck while crossing. Minor injuries sustained." },
  { id:"ACC003", type:"Vehicle Rollover",   location:"Kebele 07 Junction",  date:"2024-11-20", time:"21:45", severity:"Critical", vehicles:1, injuries:4, fatalities:1, officer:"Off. Kebede Alemu",   status:"Investigating",  description:"Single vehicle rollover on the bend. One fatality declared at scene." },
  { id:"ACC004", type:"Rear-end Collision", location:"Bus Terminal",        date:"2024-11-18", time:"16:00", severity:"Minor",    vehicles:2, injuries:0, fatalities:0, officer:"Off. Dawit Bekele",    status:"Closed",         description:"Minor rear-end. No injuries. Vehicles driveable." },
  { id:"ACC005", type:"Multi-vehicle Crash",location:"Highway KM 12",      date:"2024-11-15", time:"07:20", severity:"Major",    vehicles:4, injuries:7, fatalities:0, officer:"Off. Kebede Alemu",   status:"Pending Report", description:"Multiple vehicles involved in chain collision." },
];

const SEV_COLOR: Record<string,string> = { Minor:"badge-green", Major:"badge-yellow", Critical:"badge-red" };
const STA_COLOR: Record<string,string> = { Investigating:"badge-blue", Closed:"badge-green", "Pending Report":"badge-yellow" };

const emptyReport = { type:"", location:"", date:"", time:"", severity:"Minor", vehicles:"1", injuries:"0", fatalities:"0", description:"" };
type Errors = Partial<Record<keyof typeof emptyReport, string>>;

function validate(f: typeof emptyReport): Errors {
  const e: Errors = {};
  if (!f.type.trim()) e.type = "Accident type is required.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.date) e.date = "Date is required.";
  if (!f.time) e.time = "Time is required.";
  if (f.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
  return e;
}

export default function TrafficAccidentsPage() {
  const [accidents, setAccidents]   = useState<Accident[]>(MOCK);
  const [search, setSearch]         = useState("");
  const [sevFilter, setSevFilter]   = useState("All");
  const [viewItem, setViewItem]     = useState<Accident|null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [form, setForm]             = useState({ ...emptyReport });
  const [errors, setErrors]         = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]         = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof typeof emptyReport, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c={...e}; delete c[field]; return c; });
  }

  const filtered = accidents.filter(a => {
    const q = search.toLowerCase();
    return (!q || a.id.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)) &&
           (sevFilter === "All" || a.severity === sevFilter);
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error","Please fix the highlighted fields."); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const newAcc: Accident = {
      id: `ACC${String(accidents.length+1).padStart(3,"0")}`,
      ...form,
      vehicles: parseInt(form.vehicles)||1,
      injuries: parseInt(form.injuries)||0,
      fatalities: parseInt(form.fatalities)||0,
      officer: "Off. Kebede Alemu",
      status: "Pending Report",
    };
    setAccidents(a => [newAcc, ...a]);
    setSubmitting(false);
    setReportOpen(false);
    setForm({ ...emptyReport });
    addToast("success", "Accident report filed successfully.");
  }

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Accident Reports</h2>
              <p className="text-sm text-[var(--slate)]">Track and document traffic accidents.</p>
            </div>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              onClick={() => { setForm({...emptyReport}); setErrors({}); setReportOpen(true); }} className="btn-primary">
              <FileText size={15}/> New Report
            </motion.button>
          </div>
        </ScrollReveal>

        <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total",    value:accidents.length,                                       icon:AlertCircle },
            { label:"Vehicles", value:accidents.reduce((s,a) => s+a.vehicles,0),             icon:Car         },
            { label:"Injuries", value:accidents.reduce((s,a) => s+a.injuries,0),             icon:Activity    },
            { label:"Fatalities",value:accidents.reduce((s,a) => s+a.fatalities,0),          icon:Users       },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y:-3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value}/></p>
                  </div>
                  <s.icon size={22} className="text-[var(--green)]"/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <div className="card p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <AlertCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/>
            <input type="search" placeholder="Search by ID, location, or type…" value={search}
              onChange={e => setSearch(e.target.value)} className="input pl-9 w-full text-sm"/>
          </div>
          <select value={sevFilter} onChange={e => setSevFilter(e.target.value)} className="input text-sm">
            <option value="All">All Severities</option>
            <option>Minor</option><option>Major</option><option>Critical</option>
          </select>
        </div>

        <StaggerParent className="space-y-3">
          {filtered.map(acc => (
            <StaggerChild key={acc.id}>
              <motion.div whileHover={{ x:3, boxShadow:"0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${acc.severity==="Critical"?"bg-red-50 text-red-600":acc.severity==="Major"?"bg-amber-50 text-amber-600":"bg-green-50 text-green-600"}`}>
                      <AlertCircle size={20}/>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--navy)]">{acc.type}</h4>
                      <p className="text-xs text-[var(--slate)] font-mono">{acc.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className={`badge ${SEV_COLOR[acc.severity]||"badge-gray"}`}>{acc.severity}</span>
                    <span className={`badge ${STA_COLOR[acc.status]||"badge-gray"}`}>{acc.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-3">
                  {[["Location",acc.location],["Date",acc.date+" "+acc.time],["Vehicles",String(acc.vehicles)],["Injuries",String(acc.injuries)],["Fatalities",String(acc.fatalities)]].map(([l,v]) => (
                    <div key={l}>
                      <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">{l}</p>
                      <p className={`font-semibold text-sm ${l==="Fatalities"&&acc.fatalities>0?"text-red-600":l==="Injuries"&&acc.injuries>0?"text-amber-600":"text-[var(--charcoal)]"}`}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--slate)]">Officer: <span className="font-semibold text-[var(--charcoal)]">{acc.officer}</span></p>
                  <button onClick={() => setViewItem(acc)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--green)] hover:underline">
                    <Eye size={13}/> View Full Report
                  </button>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
          {filtered.length===0 && <div className="text-center py-16 text-[var(--muted)] text-sm">No accidents match your filters.</div>}
        </StaggerParent>
      </div>

      {/* Detail view */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)}/>
          <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10" role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]"><X size={16}/></button>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${viewItem.severity==="Critical"?"bg-red-50 text-red-600":viewItem.severity==="Major"?"bg-amber-50 text-amber-600":"bg-green-50 text-green-600"}`}>
                <AlertCircle size={22}/>
              </div>
              <div>
                <p className="font-bold text-[var(--navy)]">{viewItem.type}</p>
                <p className="text-xs text-[var(--muted)] font-mono">{viewItem.id}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[["Location",viewItem.location],["Date & Time",viewItem.date+" "+viewItem.time],["Severity",viewItem.severity],["Status",viewItem.status],["Vehicles",String(viewItem.vehicles)],["Injuries",String(viewItem.injuries)],["Fatalities",String(viewItem.fatalities)],["Officer",viewItem.officer]].map(([l,v]) => (
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{v}</span>
                </div>
              ))}
              <div className="bg-[var(--surface2)] rounded-xl px-3 py-2">
                <p className="text-[var(--muted)] text-xs mb-1">Description</p>
                <p className="text-[var(--charcoal)] text-xs leading-relaxed">{viewItem.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* New report modal */}
      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="File Accident Report" size="sm" accent="red">
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Accident Type" required id="aType" type="text" placeholder="e.g. Collision"
              value={form.type} onChange={e => set("type",(e.target as HTMLInputElement).value)} error={errors.type} className="col-span-2"/>
            <FormField label="Location" required id="aLoc" type="text"
              value={form.location} onChange={e => set("location",(e.target as HTMLInputElement).value)} error={errors.location} className="col-span-2"/>
            <FormField label="Date" required id="aDate" type="date" as="input"
              value={form.date} onChange={e => set("date",(e.target as HTMLInputElement).value)} error={errors.date}/>
            <FormField label="Time" required id="aTime" type="time" as="input"
              value={form.time} onChange={e => set("time",(e.target as HTMLInputElement).value)} error={errors.time}/>
            <FormField label="Severity" required as="select" id="aSev"
              value={form.severity} onChange={e => set("severity",e.target.value)}>
              <option>Minor</option><option>Major</option><option>Critical</option>
            </FormField>
            <FormField label="Vehicles" id="aVeh" type="number" placeholder="1"
              value={form.vehicles} onChange={e => set("vehicles",(e.target as HTMLInputElement).value)}/>
            <FormField label="Injuries" id="aInj" type="number" placeholder="0"
              value={form.injuries} onChange={e => set("injuries",(e.target as HTMLInputElement).value)}/>
            <FormField label="Fatalities" id="aFat" type="number" placeholder="0"
              value={form.fatalities} onChange={e => set("fatalities",(e.target as HTMLInputElement).value)}/>
            <FormField label="Description" required as="textarea" id="aDesc" rows={4}
              placeholder="Describe what happened (min 20 chars)…"
              value={form.description} onChange={e => set("description",(e.target as HTMLTextAreaElement).value)} error={errors.description} className="col-span-2"/>
          </div>
          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setReportOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? <span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Filing…</span>
              : <><Send size={14}/> File Report</>}
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
