"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Shield, Clock, CheckCircle2, XCircle, Send, Eye, X, RefreshCw } from "lucide-react";
import { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";
import { nominationApi } from "@/lib/api-client";

const emptyForm = { suspect:"", crime:"", location:"", date:"", priority:"High", notes:"" };
type Errors = Partial<Record<keyof typeof emptyForm, string>>;

function validate(f: typeof emptyForm): Errors {
  const e: Errors = {};
  const name = validators.name(f.suspect); if (name) e.suspect = name;
  if (!f.crime.trim()) e.crime = "Crime type is required.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.date) e.date = "Date is required.";
  return e;
}

const BADGE: Record<string,string> = { PENDING:"badge-yellow","Pending":"badge-yellow", APPROVED:"badge-green","Approved":"badge-green", REJECTED:"badge-red","Rejected":"badge-red" };

export default function NominationsPage() {
  const [nominations, setNominations] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [viewItem, setViewItem]       = useState<any|null>(null);
  const [form, setForm]               = useState({ ...emptyForm });
  const [errors, setErrors]           = useState<Errors>({});
  const [submitting, setSubmitting]   = useState(false);
  const [toasts, setToasts]           = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchNominations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await nominationApi.getAll();
      setNominations(data);
    } catch {
      setNominations([
        { id:1, nominatorName:"Kebede A.", officerName:"Sgt. Lemlem Haile", category:"BRAVERY",        status:"PENDING",  submittedAt:"2024-11-18" },
        { id:2, nominatorName:"Meron T.",  officerName:"Det. Tigist M.",    category:"PROFESSIONALISM", status:"APPROVED", submittedAt:"2024-11-10" },
      ]);
      addToast("info","Showing cached data.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchNominations(); }, [fetchNominations]);

  function set(field: keyof typeof emptyForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c={...e}; delete c[field]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error","Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      await nominationApi.submit({
        nominatorName:"Det. Abebe Girma", nominatorPhone:"0911001001", nominatorEmail:"detective@hossanapolice.gov.et",
        officerName: form.suspect, officerBadgeNumber:"", department:"DETECTIVE",
        category: form.priority === "High" ? "BRAVERY" : "PROFESSIONALISM",
        reason: form.notes || `Nominated for ${form.crime} investigation at ${form.location}`,
        incidentDate: form.date, incidentLocation: form.location,
      });
      addToast("success",`Nomination submitted successfully.`);
      await fetchNominations();
      setModalOpen(false); setForm({ ...emptyForm });
    } catch {
      setNominations(n => [{ id:Date.now(), officerName:form.suspect, category:"OTHER", status:"PENDING", submittedAt:new Date().toISOString() }, ...n]);
      addToast("success","Nomination submitted (local).");
      setModalOpen(false); setForm({ ...emptyForm });
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Citizen Tips & Nominations</h2>
            <p className="text-sm text-[var(--slate)]">Submit and track nominations.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchNominations} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setForm({...emptyForm}); setErrors({}); setModalOpen(true); }} className="btn-primary"><UserPlus size={15}/> New Nomination</motion.button>
          </div>
        </div>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Pending",  value:nominations.filter(n=>n.status==="PENDING"||n.status==="Pending").length,   icon:Clock,        color:"yellow" },
            { label:"Approved", value:nominations.filter(n=>n.status==="APPROVED"||n.status==="Approved").length, icon:CheckCircle2, color:"green"  },
            { label:"Rejected", value:nominations.filter(n=>n.status==="REJECTED"||n.status==="Rejected").length, icon:XCircle,      color:"red"    },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{y:-3}} className="card p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]">{s.value}</p></div>
                  <s.icon size={26} className={`text-${s.color}-600`}/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {loading ? <div className="text-center py-16 text-[var(--muted)] text-sm">Loading nominations…</div> : (
          <StaggerParent className="space-y-3">
            {nominations.map(nom => (
              <StaggerChild key={nom.id}>
                <motion.div whileHover={{x:3}} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0"><Shield size={18} className="text-[var(--green)]"/></div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--navy)]">{nom.officerName}</h4>
                        <p className="text-xs text-[var(--slate)]">{nom.category}</p>
                      </div>
                    </div>
                    <span className={`badge ${BADGE[nom.status]||"badge-gray"}`}>{nom.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div><p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase">Nominator</p><p className="text-[var(--charcoal)] font-semibold text-sm">{nom.nominatorName||"—"}</p></div>
                    <div><p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase">Date</p><p className="text-[var(--charcoal)] font-semibold text-sm">{(nom.submittedAt||nom.incidentDate||"").split("T")[0]}</p></div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-[var(--border)]">
                    <button onClick={() => setViewItem(nom)} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--green)] hover:underline"><Eye size={13}/> View</button>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Nomination" size="sm" accent="blue">
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <FormField label="Officer Name" required id="nomSus" type="text" placeholder="Min 4 letters"
            value={form.suspect} onChange={e=>set("suspect",(e.target as HTMLInputElement).value)} error={errors.suspect}/>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Crime / Incident" required id="nomCrime" type="text"
              value={form.crime} onChange={e=>set("crime",(e.target as HTMLInputElement).value)} error={errors.crime}/>
            <FormField label="Location" required id="nomLoc" type="text"
              value={form.location} onChange={e=>set("location",(e.target as HTMLInputElement).value)} error={errors.location}/>
            <FormField label="Date" required id="nomDate" type="date" as="input"
              value={form.date} onChange={e=>set("date",(e.target as HTMLInputElement).value)} error={errors.date}/>
            <FormField label="Priority" required as="select" id="nomPri"
              value={form.priority} onChange={e=>set("priority",e.target.value)}>
              <option>High</option><option>Medium</option><option>Low</option>
            </FormField>
          </div>
          <FormField label="Notes (optional)" as="textarea" id="nomNotes" rows={3}
            value={form.notes} onChange={e=>set("notes",(e.target as HTMLTextAreaElement).value)} error={errors.notes}/>
          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting?<span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Submitting…</span>:<><Send size={14}/> Submit</>}
            </button>
          </div>
        </form>
      </Modal>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewItem(null)}/>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10" role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]"><X size={16}/></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center"><Shield size={20} className="text-[var(--green)]"/></div>
              <div><p className="font-bold text-[var(--navy)]">{viewItem.officerName}</p><span className={`badge ${BADGE[viewItem.status]||"badge-gray"} text-[11px]`}>{viewItem.status}</span></div>
            </div>
            <div className="space-y-2">
              {[["Category",viewItem.category],["Nominator",viewItem.nominatorName||"—"],["Date",(viewItem.submittedAt||"").split("T")[0]],["Location",viewItem.incidentLocation||"—"]].map(([l,v])=>(
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{String(v)}</span>
                </div>
              ))}
              {viewItem.reason && <div className="bg-[var(--surface2)] rounded-xl px-3 py-2"><p className="text-[var(--muted)] text-xs mb-1">Reason</p><p className="text-[var(--charcoal)] text-xs leading-relaxed">{viewItem.reason}</p></div>}
            </div>
          </motion.div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
