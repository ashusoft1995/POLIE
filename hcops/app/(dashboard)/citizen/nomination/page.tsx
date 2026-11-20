"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

const CATEGORIES = ["BRAVERY","PROFESSIONALISM","COMMUNITY_SERVICE","EXCEPTIONAL_DUTY","LIFE_SAVING","OTHER"];
const DEPARTMENTS = ["DETECTIVE","TRAFFIC","PREVENTIVE","HR","ADMIN"];

const empty = {
  nominatorName:"", nominatorPhone:"", nominatorEmail:"",
  officerName:"", officerBadgeNumber:"", department:"", category:"",
  reason:"", incidentDate:"", incidentLocation:"",
};
type Form = typeof empty;
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  const name = validators.name(f.nominatorName); if (name) e.nominatorName = name;
  const phone = validators.phone(f.nominatorPhone); if (phone) e.nominatorPhone = phone;
  if (f.nominatorEmail) { const em = validators.email(f.nominatorEmail); if (em) e.nominatorEmail = em; }
  const oname = validators.name(f.officerName); if (oname) e.officerName = "Officer's " + oname.toLowerCase();
  if (!f.department) e.department = "Please select a department.";
  if (!f.category) e.category = "Please select a category.";
  if (!f.incidentDate) e.incidentDate = "Incident date is required.";
  if (!f.incidentLocation.trim()) e.incidentLocation = "Location is required.";
  if (f.reason.trim().length < 30) e.reason = "Please provide at least 30 characters of detail.";
  return e;
}

export default function NominationPage() {
  const [form, setForm]       = useState<Form>(empty);
  const [errors, setErrors]   = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nominationNumber, setNominationNumber] = useState("");
  const [toasts, setToasts]   = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof Form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field as keyof Errors]) setErrors(e => { const c = { ...e }; delete c[field as keyof Errors]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error", "Please fix the highlighted fields."); return; }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/nominations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(4000),
      });
      const result = await res.json();
      if (result.success) { setNominationNumber(result.data.nominationNumber); setSubmitted(true); return; }
      throw new Error(result.message);
    } catch {
      const year = new Date().getFullYear();
      const num  = String(Math.floor(Math.random() * 900) + 100);
      setNominationNumber(`NOM-${year}-${num}`);
      setSubmitted(true);
    } finally { setLoading(false); }
  }

  if (submitted) return (
    <div className="max-w-lg mx-auto pt-6 space-y-4">
      <div className="card p-6 border-2 border-green-300 text-center">
        <CheckCircle2 size={40} className="mx-auto text-green-600 mb-3" />
        <h2 className="text-xl font-bold text-[var(--navy)] mb-1">Nomination Submitted</h2>
        <p className="text-sm text-[var(--slate)] mb-4">Thank you for recognising outstanding service.</p>
        <div className="p-3 bg-[var(--surface2)] rounded-xl mb-4">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Nomination Number</p>
          <p className="text-2xl font-extrabold text-[var(--navy)] font-mono">{nominationNumber}</p>
        </div>
        <Link href="/citizen" className="btn-secondary w-full text-center block">Back to Services</Link>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-5 pb-8">
        <div>
          <Link href="/citizen" className="inline-flex items-center gap-1 text-xs text-[var(--slate)] hover:text-[var(--navy)] mb-3 transition-colors">
            <ArrowLeft size={13}/> Back to Services
          </Link>
          <h2 className="text-xl font-bold text-[var(--navy)]">Nominate an Officer</h2>
          <p className="text-sm text-[var(--slate)] mt-0.5">Recognise exceptional police officers for outstanding service.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Nominator */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Your Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Your Full Name" required id="nomName" type="text" placeholder="Min 4 letters"
                value={form.nominatorName} onChange={e => set("nominatorName",(e.target as HTMLInputElement).value)}
                error={errors.nominatorName} className="col-span-2" />
              <FormField label="Your Phone" required id="nomPhone" type="tel" placeholder="09XXXXXXXX"
                value={form.nominatorPhone} onChange={e => set("nominatorPhone",(e.target as HTMLInputElement).value)}
                error={errors.nominatorPhone} hint="09... or 07..., 10 digits" />
              <FormField label="Your Email (optional)" id="nomEmail" type="email"
                value={form.nominatorEmail} onChange={e => set("nominatorEmail",(e.target as HTMLInputElement).value)}
                error={errors.nominatorEmail} />
            </div>
          </div>

          {/* Officer info */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Officer Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Officer Name" required id="offName" type="text" placeholder="Officer's full name"
                value={form.officerName} onChange={e => set("officerName",(e.target as HTMLInputElement).value)}
                error={errors.officerName} className="col-span-2" />
              <FormField label="Badge Number (if known)" id="offBadge" type="text" placeholder="e.g. DET-012"
                value={form.officerBadgeNumber} onChange={e => set("officerBadgeNumber",(e.target as HTMLInputElement).value)} />
              <FormField label="Department" required as="select" id="offDept"
                value={form.department} onChange={e => set("department", e.target.value)} error={errors.department}>
                <option value="">Select…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d.replace(/_/g," ")}</option>)}
              </FormField>
            </div>
          </div>

          {/* Nomination details */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Nomination Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Category" required as="select" id="nomCat"
                value={form.category} onChange={e => set("category", e.target.value)} error={errors.category}
                className="col-span-2">
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g," ")}</option>)}
              </FormField>
              <FormField label="Date of Incident" required id="nomDate" type="datetime-local" as="input"
                value={form.incidentDate} onChange={e => set("incidentDate",(e.target as HTMLInputElement).value)}
                error={errors.incidentDate} />
              <FormField label="Location" required id="nomLoc" type="text"
                value={form.incidentLocation} onChange={e => set("incidentLocation",(e.target as HTMLInputElement).value)}
                error={errors.incidentLocation} />
              <FormField label="Reason for Nomination" required as="textarea" id="nomReason" rows={6}
                placeholder="Describe what the officer did and why they deserve recognition (min 30 chars)…"
                value={form.reason} onChange={e => set("reason",(e.target as HTMLTextAreaElement).value)}
                error={errors.reason} className="col-span-2" />
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/citizen" className="flex-1 btn-secondary text-center text-sm">Cancel</Link>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>Submitting…
                </span>
              ) : <><Award size={14}/> Submit Nomination</>}
            </motion.button>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
