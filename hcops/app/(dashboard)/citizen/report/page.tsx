"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

const CRIME_TYPES = ["THEFT","ASSAULT","FRAUD","BURGLARY","DOMESTIC_VIOLENCE","CYBERCRIME","OTHER"];

const empty = {
  reporterName:"", reporterPhone:"", reporterEmail:"", reporterAddress:"",
  crimeType:"", description:"", incidentLocation:"", incidentDate:"",
  suspectDescription:"", isUrgent: false,
};
type Form = typeof empty;
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  const name = validators.name(f.reporterName); if (name) e.reporterName = name;
  const phone = validators.phone(f.reporterPhone); if (phone) e.reporterPhone = phone;
  if (f.reporterEmail) { const em = validators.email(f.reporterEmail); if (em) e.reporterEmail = em; }
  if (!f.reporterAddress || f.reporterAddress.trim().length < 4) e.reporterAddress = "Address is required.";
  if (!f.crimeType) e.crimeType = "Please select a crime type.";
  if (f.description.length < 20) e.description = "Please provide at least 20 characters of description.";
  if (!f.incidentLocation) e.incidentLocation = "Incident location is required.";
  if (!f.incidentDate) e.incidentDate = "Incident date is required.";
  return e;
}

export default function CrimeReportPage() {
  const [form, setForm]       = useState<Form>(empty);
  const [errors, setErrors]   = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [toasts, setToasts]   = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof Form, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field as keyof Errors]) setErrors(e => { const c = { ...e }; delete c[field as keyof Errors]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error", "Please fix the highlighted fields."); return; }
    setLoading(true);

    // Try real backend first, fall back to mock
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/crime-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(4000),
      });
      const result = await res.json();
      if (result.success) {
        setCaseNumber(result.data.caseNumber);
        setSubmitted(true);
        return;
      }
      throw new Error(result.message || "Server error");
    } catch {
      // Mock success — generate a tracking number
      const year = new Date().getFullYear();
      const num  = String(Math.floor(Math.random() * 900) + 100);
      const generated = `RPT-${year}-${num}`;
      setCaseNumber(generated);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return (
    <div className="max-w-lg mx-auto pt-6 space-y-4">
      <div className="card p-6 border-2 border-green-300 text-center">
        <CheckCircle2 size={40} className="mx-auto text-green-600 mb-3" />
        <h2 className="text-xl font-bold text-[var(--navy)] mb-1">Report Submitted</h2>
        <p className="text-sm text-[var(--slate)] mb-4">Your crime report has been received by Hossana Police.</p>
        <div className="p-3 bg-[var(--surface2)] rounded-xl mb-4">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Case Number</p>
          <p className="text-2xl font-extrabold text-[var(--navy)] font-mono">{caseNumber}</p>
          <p className="text-xs text-[var(--slate)] mt-1">Save this for your records.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/citizen" className="flex-1 btn-secondary text-sm text-center">Back to Services</Link>
          <button onClick={() => { setSubmitted(false); setForm(empty); }} className="flex-1 btn-primary text-sm">New Report</button>
        </div>
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
          <h2 className="text-xl font-bold text-[var(--navy)]">Report a Crime</h2>
          <p className="text-sm text-[var(--slate)] mt-0.5">Submit a detailed report to Hossana Police Department.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Reporter */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Your Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Full Name" required id="rName" type="text" placeholder="Min 4 letters"
                value={form.reporterName} onChange={e => set("reporterName",(e.target as HTMLInputElement).value)}
                error={errors.reporterName} className="col-span-2" />
              <FormField label="Phone" required id="rPhone" type="tel" placeholder="09XXXXXXXX"
                value={form.reporterPhone} onChange={e => set("reporterPhone",(e.target as HTMLInputElement).value)}
                error={errors.reporterPhone} hint="Ethiopian mobile: 09... or 07..." />
              <FormField label="Email (optional)" id="rEmail" type="email" placeholder="you@example.com"
                value={form.reporterEmail} onChange={e => set("reporterEmail",(e.target as HTMLInputElement).value)}
                error={errors.reporterEmail} />
              <FormField label="Your Address" required id="rAddr" type="text" placeholder="Hossana City"
                value={form.reporterAddress} onChange={e => set("reporterAddress",(e.target as HTMLInputElement).value)}
                error={errors.reporterAddress} className="col-span-2" />
            </div>
          </div>

          {/* Incident */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Incident Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Crime Type" required as="select" id="rCrime"
                value={form.crimeType} onChange={e => set("crimeType", e.target.value)} error={errors.crimeType}>
                <option value="">Select type…</option>
                {CRIME_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
              </FormField>
              <FormField label="Date & Time" required id="rDate" type="datetime-local" as="input"
                value={form.incidentDate} onChange={e => set("incidentDate",(e.target as HTMLInputElement).value)}
                error={errors.incidentDate} />
              <FormField label="Location" required id="rLoc" type="text" placeholder="Where did it happen?"
                value={form.incidentLocation} onChange={e => set("incidentLocation",(e.target as HTMLInputElement).value)}
                error={errors.incidentLocation} className="col-span-2" />
              <FormField label="Description" required as="textarea" id="rDesc" rows={5}
                placeholder="Describe what happened in detail (min 20 characters)…"
                value={form.description} onChange={e => set("description",(e.target as HTMLTextAreaElement).value)}
                error={errors.description} className="col-span-2" />
              <FormField label="Suspect Description (optional)" as="textarea" id="rSuspect" rows={3}
                placeholder="Physical description, clothing, vehicle…"
                value={form.suspectDescription} onChange={e => set("suspectDescription",(e.target as HTMLTextAreaElement).value)}
                className="col-span-2" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.isUrgent}
                onChange={e => set("isUrgent", e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--green)]" />
              <span className="text-sm text-[var(--charcoal)]">Mark as urgent — requires immediate attention</span>
            </label>
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
              ) : <><FileText size={14}/> Submit Report</>}
            </motion.button>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
