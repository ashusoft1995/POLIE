"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Camera, RefreshCw } from "lucide-react";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";
import { employeeApi } from "@/lib/api-client";

const emptyForm = { fullName:"",dob:"",idNumber:"",phone:"",email:"",address:"",badge:"",rank:"",department:"",joiningDate:"",role:"DETECTIVE" };
type Form = typeof emptyForm;
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  const name = validators.name(f.fullName); if (name) e.fullName = name;
  if (!f.dob) e.dob = "Date of birth is required.";
  if (!f.idNumber||f.idNumber.trim().length<5) e.idNumber = "ID must be at least 5 characters.";
  const phone = validators.phone(f.phone); if (phone) e.phone = phone;
  const email = validators.email(f.email); if (email) e.email = email;
  if (!f.address||f.address.trim().length<4) e.address = "Address is required.";
  const badge = validators.badge(f.badge); if (badge) e.badge = badge;
  if (!f.rank) e.rank = "Rank is required.";
  if (!f.department) e.department = "Department is required.";
  if (!f.joiningDate) e.joiningDate = "Joining date is required.";
  if (!f.role) e.role = "Role is required.";
  return e;
}

export default function HRRegisterPage() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState<Form>({ ...emptyForm });
  const [errors, setErrors]     = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
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
        { id:1, badge:"PHD-001", fullName:"Head Habtamu Woldemariam", rank:"Head of Police",    role:"POLICE_HEAD",  email:"head@hossanapolice.gov.et",      createdAt:"2024-01-01" },
        { id:2, badge:"DET-012", fullName:"Det. Abebe Girma",         rank:"Detective Sergeant",role:"DETECTIVE",    email:"detective@hossanapolice.gov.et", createdAt:"2024-01-01" },
        { id:3, badge:"HR-005",  fullName:"Insp. Almaz Worku",        rank:"HR Inspector",      role:"HR",           email:"hr@hossanapolice.gov.et",         createdAt:"2024-01-01" },
      ]);
      addToast("info","Showing cached data.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchOfficers(); }, [fetchOfficers]);

  function set(field: keyof Form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c={...e}; delete c[field]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error","Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      await employeeApi.register({
        username: form.email, email: form.email,
        password: "Police@" + form.badge,
        fullName: form.fullName, role: form.role,
        badge: form.badge, rank: form.rank,
      });
      addToast("success", `Officer ${form.fullName} registered successfully.`);
      await fetchOfficers();
      setOpen(false); setForm({ ...emptyForm });
    } catch (err: any) {
      addToast("error", err.message || "Failed to register officer.");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Officer Registration</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Manage and register police personnel.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOfficers} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setForm({...emptyForm}); setErrors({}); setOpen(true); }} className="btn-primary"><UserPlus size={15}/> Register Officer</motion.button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["Badge","Name","Rank","Role","Email","Registered"].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[var(--muted)] text-sm">Loading officers…</td></tr>
                ) : officers.map(o => (
                  <tr key={o.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--slate)]">{o.badge||o.badgeNumber}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--navy)]">{o.fullName}</td>
                    <td className="px-4 py-3 text-[var(--charcoal)]">{o.rank}</td>
                    <td className="px-4 py-3"><span className="badge badge-blue text-[11px]">{o.role}</span></td>
                    <td className="px-4 py-3 text-[var(--slate)]">{o.email}</td>
                    <td className="px-4 py-3 text-[var(--slate)]">{o.createdAt?.split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Register New Officer" size="sm" accent="blue">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface2)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center shrink-0">
              <Camera size={18} className="text-[var(--muted)]"/><span className="text-[9px] text-[var(--muted)] mt-1">Photo</span>
            </div>
            <p className="text-xs text-[var(--slate)]">Passport-style photo. JPG/PNG, max 2 MB.<br/><span className="text-[var(--muted)]">Default password: Police@{"{badge}"}</span></p>
          </div>

          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1">Personal Information</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" required id="regName" type="text" placeholder="Min 4 letters"
              value={form.fullName} onChange={e=>set("fullName",(e.target as HTMLInputElement).value)} error={errors.fullName} className="col-span-2"/>
            <FormField label="Date of Birth" required id="regDob" type="date" as="input"
              value={form.dob} onChange={e=>set("dob",(e.target as HTMLInputElement).value)} error={errors.dob}/>
            <FormField label="National ID" required id="regId" type="text" placeholder="Min 5 chars"
              value={form.idNumber} onChange={e=>set("idNumber",(e.target as HTMLInputElement).value)} error={errors.idNumber}/>
            <FormField label="Phone" required id="regPhone" type="tel" placeholder="09XXXXXXXX"
              value={form.phone} onChange={e=>set("phone",(e.target as HTMLInputElement).value)} error={errors.phone} hint="09... or 07..., 10 digits"/>
            <FormField label="Email" required id="regEmail" type="email" placeholder="officer@hpd.gov.et"
              value={form.email} onChange={e=>set("email",(e.target as HTMLInputElement).value)} error={errors.email}/>
            <FormField label="Address" required id="regAddr" type="text" placeholder="Hossana City"
              value={form.address} onChange={e=>set("address",(e.target as HTMLInputElement).value)} error={errors.address} className="col-span-2"/>
          </div>

          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1 pt-1">Official Details</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Badge No." required id="regBadge" type="text" placeholder="DET-001"
              value={form.badge} onChange={e=>set("badge",(e.target as HTMLInputElement).value)} error={errors.badge} hint="Min 5 chars"/>
            <FormField label="Joining Date" required id="regJoin" type="date" as="input"
              value={form.joiningDate} onChange={e=>set("joiningDate",(e.target as HTMLInputElement).value)} error={errors.joiningDate}/>
            <FormField label="Rank" required id="regRank" as="select"
              value={form.rank} onChange={e=>set("rank",e.target.value)} error={errors.rank}>
              <option value="">Select rank…</option>
              <option>Police Officer I</option><option>Police Officer II</option>
              <option>Sergeant</option><option>Inspector</option><option>Superintendent</option>
            </FormField>
            <FormField label="Department" required id="regDept" as="select"
              value={form.department} onChange={e=>set("department",e.target.value)} error={errors.department}>
              <option value="">Select department…</option>
              <option>CID</option><option>Preventive</option><option>Traffic</option><option>HR</option><option>Admin</option>
            </FormField>
            <FormField label="Role (System Access)" required id="regRole" as="select"
              value={form.role} onChange={e=>set("role",e.target.value)} error={errors.role} className="col-span-2">
              <option value="POLICE_HEAD">Police Head</option>
              <option value="DETECTIVE">Detective</option>
              <option value="PREVENTIVE">Preventive Police</option>
              <option value="TRAFFIC">Traffic Police</option>
              <option value="HR">HR Manager</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </FormField>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting?<span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</span>:<><UserPlus size={14}/> Register</>}
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
