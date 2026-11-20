"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, User, X } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

type Forward = { id:string; criminal:string; crime:string; from:string; to:string; date:string; status:string; reason:string; };
const MOCK: Forward[] = [
  { id:"F001", criminal:"Yonas Tesfaye", crime:"Armed Robbery", from:"Hossana Station",  to:"Hadiya Zone HQ",  date:"2024-11-25", status:"Pending",   reason:"Case requires zone-level prosecution." },
  { id:"F002", criminal:"Dawit Bekele",  crime:"Assault",        from:"Hossana Station",  to:"Regional Court",  date:"2024-11-20", status:"Completed", reason:"Court hearing scheduled for Dec 10." },
];

const DESTINATIONS = ["Hadiya Zone HQ","Regional Court","Federal Court","Neighbouring Station","Rehabilitation Centre"];
const emptyForm = { criminal:"", crime:"", to:"", date:"", reason:"" };
type Errors = Partial<Record<keyof typeof emptyForm, string>>;

function validate(f: typeof emptyForm): Errors {
  const e: Errors = {};
  const name = validators.name(f.criminal); if (name) e.criminal = name;
  if (!f.crime.trim()) e.crime = "Crime type is required.";
  if (!f.to) e.to = "Destination is required.";
  if (!f.date) e.date = "Transfer date is required.";
  if (f.reason.trim().length < 10) e.reason = "Reason must be at least 10 characters.";
  return e;
}

export default function PreventiveForwardPage() {
  const [forwards, setForwards]     = useState<Forward[]>(MOCK);
  const [modalOpen, setModalOpen]   = useState(false);
  const [form, setForm]             = useState({ ...emptyForm });
  const [errors, setErrors]         = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]         = useState<ToastMessage[]>([]);

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
    setForwards(fs => [{ id:`F${String(forwards.length+1).padStart(3,"0")}`, ...form, from:"Hossana Station", status:"Pending" }, ...fs]);
    setSubmitting(false);
    setModalOpen(false);
    setForm({ ...emptyForm });
    addToast("success", `Transfer for ${form.criminal} submitted successfully.`);
  }

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Forward Criminals</h2>
              <p className="text-sm text-[var(--slate)]">Track transfers to courts and other stations.</p>
            </div>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              onClick={() => { setForm({...emptyForm}); setErrors({}); setModalOpen(true); }} className="btn-primary">
              <Send size={15}/> New Transfer
            </motion.button>
          </div>
        </ScrollReveal>

        <StaggerParent className="space-y-3">
          {forwards.map(fwd => (
            <StaggerChild key={fwd.id}>
              <motion.div whileHover={{ x:3, boxShadow:"0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0">
                      <User size={18} className="text-[var(--green)]"/>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--navy)]">{fwd.criminal}</h4>
                      <p className="text-xs text-[var(--slate)]">{fwd.crime}</p>
                    </div>
                  </div>
                  <span className={`badge ${fwd.status==="Pending"?"badge-yellow":"badge-green"}`}>{fwd.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                  {[["From",fwd.from],["To",fwd.to],["Date",fwd.date]].map(([l,v]) => (
                    <div key={l}>
                      <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">{l}</p>
                      <p className="text-[var(--charcoal)] font-semibold text-xs">{v}</p>
                    </div>
                  ))}
                </div>
                {fwd.reason && <p className="text-xs text-[var(--slate)] bg-[var(--surface2)] p-2.5 rounded-lg">{fwd.reason}</p>}
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Criminal Transfer" size="xs" accent="blue">
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <FormField label="Criminal Name" required id="fwName" type="text" placeholder="Min 4 letters"
            value={form.criminal} onChange={e => set("criminal",(e.target as HTMLInputElement).value)} error={errors.criminal}/>
          <FormField label="Crime" required id="fwCrime" type="text" placeholder="e.g. Armed Robbery"
            value={form.crime} onChange={e => set("crime",(e.target as HTMLInputElement).value)} error={errors.crime}/>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Destination" required as="select" id="fwTo"
              value={form.to} onChange={e => set("to",e.target.value)} error={errors.to}>
              <option value="">Select…</option>
              {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
            </FormField>
            <FormField label="Transfer Date" required id="fwDate" type="date" as="input"
              value={form.date} onChange={e => set("date",(e.target as HTMLInputElement).value)} error={errors.date}/>
          </div>
          <FormField label="Reason" required as="textarea" id="fwReason" rows={3}
            placeholder="Reason for transfer (min 10 chars)…"
            value={form.reason} onChange={e => set("reason",(e.target as HTMLTextAreaElement).value)} error={errors.reason}/>
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
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
