"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UserX, Camera, Fingerprint, Save, FileText } from "lucide-react";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

type Criminal = { id:string; name:string; alias:string; dob:string; idNumber:string; nationality:string; address:string; crimeType:string; status:string; lastSeen:string; lastSeenDate:string; notes:string; registered:string; };
const emptyCriminal: Omit<Criminal,"id"|"registered"> = { name:"",alias:"",dob:"",idNumber:"",nationality:"Ethiopia",address:"",crimeType:"",status:"",lastSeen:"",lastSeenDate:"",notes:"" };
type Errors = Partial<Record<keyof typeof emptyCriminal, string>>;

const CRIME_TYPES = ["Theft","Assault","Robbery","Fraud","Drug Offence","Murder","Kidnapping","Other"];
const STATUSES    = ["Wanted","In Custody","Released","Deceased"];

const mockList: Criminal[] = [
  { id:"CR001", name:"Yonas Tesfaye", alias:"Yoni", dob:"1995-04-12", idNumber:"ET123456", nationality:"Ethiopia", address:"Kebele 03", crimeType:"Armed Robbery", status:"Wanted", lastSeen:"Hossana Market", lastSeenDate:"2024-11-01", notes:"", registered:"2024-11-01" },
  { id:"CR002", name:"Dawit Bekele",  alias:"Dagi", dob:"1998-07-22", idNumber:"ET789012", nationality:"Ethiopia", address:"Kebele 07", crimeType:"Assault",       status:"In Custody", lastSeen:"Kebele 03", lastSeenDate:"2024-11-18", notes:"", registered:"2024-11-18" },
];

function validate(f: typeof emptyCriminal): Errors {
  const e: Errors = {};
  const name = validators.name(f.name); if (name) e.name = name;
  if (!f.dob) e.dob = "Date of birth is required.";
  if (!f.idNumber || f.idNumber.trim().length < 5) e.idNumber = "ID must be at least 5 characters.";
  if (!f.address || f.address.trim().length < 4) e.address = "Address is required.";
  if (!f.crimeType) e.crimeType = "Select a crime type.";
  if (!f.status) e.status = "Select a status.";
  if (!f.lastSeen.trim()) e.lastSeen = "Last seen location is required.";
  if (!f.lastSeenDate) e.lastSeenDate = "Last seen date is required.";
  return e;
}

export default function PreventiveRegisterPage() {
  const [list, setList]           = useState<Criminal[]>(mockList);
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState({ ...emptyCriminal });
  const [errors, setErrors]       = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof typeof emptyCriminal, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c={...e}; delete c[field]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error","Please fix the highlighted fields."); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const newRecord: Criminal = { ...form, id:`CR${String(list.length+1).padStart(3,"0")}`, registered: new Date().toISOString().split("T")[0] };
    setList(l => [newRecord, ...l]);
    setSubmitting(false);
    setOpen(false);
    setForm({ ...emptyCriminal });
    addToast("success", `Criminal record for ${form.name} registered successfully.`);
  }

  const STATUS_COLOR: Record<string,string> = { "Wanted":"badge-red","In Custody":"badge-yellow","Released":"badge-green","Deceased":"badge-gray" };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Criminal Records</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Register and manage criminal records.</p>
          </div>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={() => { setForm({...emptyCriminal}); setErrors({}); setOpen(true); }} className="btn-primary">
            <UserX size={15}/> Register Criminal
          </motion.button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["ID","Name","Crime","Status","Last Seen","Registered"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {list.map(c => (
                  <tr key={c.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--slate)]">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--navy)]">{c.name}</p>
                      {c.alias && <p className="text-xs text-[var(--muted)] italic">aka "{c.alias}"</p>}
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">{c.crimeType}</td>
                    <td className="px-4 py-3"><span className={`badge ${STATUS_COLOR[c.status]||"badge-gray"}`}>{c.status}</span></td>
                    <td className="px-4 py-3 text-[var(--charcoal)]">{c.lastSeen}</td>
                    <td className="px-4 py-3 text-[var(--slate)]">{c.registered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Register Criminal Record" size="sm" accent="red">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1">Personal Information</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" required id="crName" type="text" placeholder="Min 4 letters"
              value={form.name} onChange={e => set("name",(e.target as HTMLInputElement).value)} error={errors.name} className="col-span-2"/>
            <FormField label="Alias" id="crAlias" type="text" placeholder="Nickname if any"
              value={form.alias} onChange={e => set("alias",(e.target as HTMLInputElement).value)}/>
            <FormField label="Date of Birth" required id="crDob" type="date" as="input"
              value={form.dob} onChange={e => set("dob",(e.target as HTMLInputElement).value)} error={errors.dob}/>
            <FormField label="National ID" required id="crId" type="text" placeholder="Min 5 chars"
              value={form.idNumber} onChange={e => set("idNumber",(e.target as HTMLInputElement).value)} error={errors.idNumber}/>
            <FormField label="Nationality" id="crNat" type="text"
              value={form.nationality} onChange={e => set("nationality",(e.target as HTMLInputElement).value)}/>
            <FormField label="Address" required id="crAddr" type="text" placeholder="Kebele / Zone"
              value={form.address} onChange={e => set("address",(e.target as HTMLInputElement).value)} error={errors.address} className="col-span-2"/>
          </div>

          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1 pt-1">Crime Details</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Crime Type" required as="select" id="crCrime"
              value={form.crimeType} onChange={e => set("crimeType",e.target.value)} error={errors.crimeType}>
              <option value="">Select…</option>
              {CRIME_TYPES.map(t => <option key={t}>{t}</option>)}
            </FormField>
            <FormField label="Status" required as="select" id="crStatus"
              value={form.status} onChange={e => set("status",e.target.value)} error={errors.status}>
              <option value="">Select…</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </FormField>
            <FormField label="Last Seen Location" required id="crLSLoc" type="text"
              value={form.lastSeen} onChange={e => set("lastSeen",(e.target as HTMLInputElement).value)} error={errors.lastSeen}/>
            <FormField label="Last Seen Date" required id="crLSDate" type="date" as="input"
              value={form.lastSeenDate} onChange={e => set("lastSeenDate",(e.target as HTMLInputElement).value)} error={errors.lastSeenDate}/>
            <FormField label="Notes" as="textarea" id="crNotes" rows={3}
              placeholder="Additional details…"
              value={form.notes} onChange={e => set("notes",(e.target as HTMLTextAreaElement).value)} className="col-span-2"/>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? <span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</span>
              : <><UserX size={14}/> Register</>}
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
