"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UserPlus, Shield, Clock, CheckCircle2, XCircle, Send, Eye, X } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

type Nomination = { id:string; suspect:string; crime:string; location:string; date:string; status:string; priority:string; evidence:number; notes:string; };

const mockNominations: Nomination[] = [
  { id:"N001", suspect:"Dawit Bekele",    crime:"Assault and Battery", location:"Kebele 03",      date:"2024-11-18", status:"Pending",  priority:"High",   evidence:5, notes:"Victim identified suspect from CCTV footage." },
  { id:"N002", suspect:"Yonas Tesfaye",   crime:"Armed Robbery",       location:"Hossana Market", date:"2024-11-10", status:"Approved", priority:"High",   evidence:8, notes:"Multiple witnesses confirmed identity." },
  { id:"N003", suspect:"Biruk Alemu",     crime:"Theft",               location:"Bus Terminal",   date:"2024-11-14", status:"Pending",  priority:"Medium", evidence:3, notes:"Security guard report attached." },
  { id:"N004", suspect:"Selamawit Desta", crime:"Fraud",               location:"Admin Office",   date:"2024-11-20", status:"Rejected", priority:"Low",    evidence:2, notes:"Insufficient evidence at this stage." },
];

const emptyForm = { suspect:"", crime:"", location:"", date:"", priority:"High", notes:"" };
type Errors = Partial<Record<keyof typeof emptyForm, string>>;

function validate(f: typeof emptyForm): Errors {
  const e: Errors = {};
  const name = validators.name(f.suspect); if (name) e.suspect = "Suspect's " + name.toLowerCase();
  if (!f.crime.trim()) e.crime = "Crime type is required.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.date) e.date = "Date is required.";
  if (f.notes.trim().length > 0 && f.notes.trim().length < 10) e.notes = "Notes must be at least 10 characters.";
  return e;
}

export default function NominationsPage() {
  const [nominations, setNominations] = useState<Nomination[]>(mockNominations);
  const [modalOpen, setModalOpen]     = useState(false);
  const [viewItem, setViewItem]       = useState<Nomination|null>(null);
  const [form, setForm]               = useState({ ...emptyForm });
  const [errors, setErrors]           = useState<Errors>({});
  const [submitting, setSubmitting]   = useState(false);
  const [toasts, setToasts]           = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof typeof emptyForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c={...e}; delete c[field]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error","Please fix the highlighted fields."); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setNominations(n => [{
      id: `N${String(nominations.length+1).padStart(3,"0")}`,
      ...form, status:"Pending", evidence:0,
    }, ...n]);
    setSubmitting(false);
    setModalOpen(false);
    setForm({ ...emptyForm });
    addToast("success", `Nomination for ${form.suspect} submitted successfully.`);
  }

  const BADGE: Record<string,string> = { Pending:"badge-yellow", Approved:"badge-green", Rejected:"badge-red" };
  const PRIORITY_COLOR: Record<string,string> = { High:"text-red-600", Medium:"text-amber-600", Low:"text-green-600" };

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Criminal Nominations</h2>
              <p className="text-sm text-[var(--slate)]">Submit and track suspect nominations for prosecution.</p>
            </div>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              onClick={() => { setForm({...emptyForm}); setErrors({}); setModalOpen(true); }} className="btn-primary">
              <UserPlus size={15}/> Nominate Suspect
            </motion.button>
          </div>
        </ScrollReveal>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Pending Review", value:nominations.filter(n=>n.status==="Pending").length,  icon:Clock,        color:"yellow" },
            { label:"Approved",       value:nominations.filter(n=>n.status==="Approved").length, icon:CheckCircle2, color:"green"  },
            { label:"Rejected",       value:nominations.filter(n=>n.status==="Rejected").length, icon:XCircle,      color:"red"    },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y:-3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]">{s.value}</p>
                  </div>
                  <s.icon size={26} className={`text-${s.color}-600`}/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <StaggerParent className="space-y-3">
          {nominations.map(nom => (
            <StaggerChild key={nom.id}>
              <motion.div whileHover={{ x:3, boxShadow:"0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0">
                      <Shield size={18} className="text-[var(--green)]"/>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--navy)]">{nom.suspect}</h4>
                      <p className="text-xs text-[var(--slate)]">{nom.crime}</p>
                    </div>
                  </div>
                  <span className={`badge ${BADGE[nom.status]||"badge-gray"}`}>{nom.status}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                  {[["Location",nom.location],["Date",nom.date],["Evidence",`${nom.evidence} items`]].map(([l,v]) => (
                    <div key={l}>
                      <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">{l}</p>
                      <p className="text-[var(--charcoal)] font-semibold text-sm">{v}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">Priority</p>
                    <p className={`font-bold text-sm ${PRIORITY_COLOR[nom.priority]}`}>{nom.priority}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[var(--border)]">
                  <button onClick={() => setViewItem(nom)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--green)] hover:underline">
                    <Eye size={13}/> View Details
                  </button>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>

      {/* New nomination modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nominate Suspect" size="sm" accent="blue">
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <FormField label="Suspect Name" required id="nomSus" type="text" placeholder="Min 4 letters"
            value={form.suspect} onChange={e => set("suspect",(e.target as HTMLInputElement).value)} error={errors.suspect}/>
          <FormField label="Crime Type" required id="nomCrime" type="text" placeholder="e.g. Armed Robbery"
            value={form.crime} onChange={e => set("crime",(e.target as HTMLInputElement).value)} error={errors.crime}/>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Location" required id="nomLoc" type="text"
              value={form.location} onChange={e => set("location",(e.target as HTMLInputElement).value)} error={errors.location}/>
            <FormField label="Date of Offence" required id="nomDate" type="date" as="input"
              value={form.date} onChange={e => set("date",(e.target as HTMLInputElement).value)} error={errors.date}/>
            <FormField label="Priority" required as="select" id="nomPri"
              value={form.priority} onChange={e => set("priority",e.target.value)}>
              <option>High</option><option>Medium</option><option>Low</option>
            </FormField>
          </div>
          <FormField label="Evidence Notes (optional)" as="textarea" id="nomNotes" rows={3}
            placeholder="Describe evidence supporting this nomination…"
            value={form.notes} onChange={e => set("notes",(e.target as HTMLTextAreaElement).value)} error={errors.notes}/>

          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? <span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Submitting…</span>
              : <><Send size={14}/> Submit</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* View detail modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)}/>
          <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10" role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]"><X size={16}/></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center"><Shield size={20} className="text-[var(--green)]"/></div>
              <div>
                <p className="font-bold text-[var(--navy)]">{viewItem.suspect}</p>
                <span className={`badge ${BADGE[viewItem.status]||"badge-gray"} text-[11px]`}>{viewItem.status}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[["Crime",viewItem.crime],["Location",viewItem.location],["Date",viewItem.date],["Priority",viewItem.priority],["Evidence",`${viewItem.evidence} items`]].map(([l,v]) => (
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{v}</span>
                </div>
              ))}
              {viewItem.notes && (
                <div className="bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <p className="text-[var(--muted)] text-xs mb-1">Notes</p>
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
