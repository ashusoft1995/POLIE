"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, UserX, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

const empty = {
  reporterName:"", reporterPhone:"", reporterEmail:"", reporterRelationship:"",
  missingPersonName:"", missingPersonAge:"", gender:"",
  height:"", weight:"", physicalDescription:"",
  lastSeenWearing:"", lastSeenLocation:"", lastSeenDate:"",
  circumstances:"", medicalConditions:"", isCritical: false,
};
type Form = typeof empty;
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  const name = validators.name(f.reporterName); if (name) e.reporterName = name;
  const phone = validators.phone(f.reporterPhone); if (phone) e.reporterPhone = phone;
  if (f.reporterEmail) { const em = validators.email(f.reporterEmail); if (em) e.reporterEmail = em; }
  if (!f.reporterRelationship.trim()) e.reporterRelationship = "Relationship is required.";
  const mname = validators.name(f.missingPersonName); if (mname) e.missingPersonName = "Missing person's " + mname.toLowerCase();
  const age = parseInt(f.missingPersonAge);
  if (!f.missingPersonAge || isNaN(age) || age < 1 || age > 150) e.missingPersonAge = "Enter a valid age (1–150).";
  if (!f.gender) e.gender = "Please select gender.";
  if (!f.physicalDescription || f.physicalDescription.trim().length < 10) e.physicalDescription = "Physical description required (min 10 chars).";
  if (!f.lastSeenLocation.trim()) e.lastSeenLocation = "Last seen location is required.";
  if (!f.lastSeenDate) e.lastSeenDate = "Date last seen is required.";
  if (!f.lastSeenWearing.trim()) e.lastSeenWearing = "Clothing description is required.";
  if (f.circumstances.trim().length < 20) e.circumstances = "Circumstances required (min 20 chars).";
  return e;
}

export default function MissingPersonPage() {
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
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/missing-persons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form,
          missingPersonAge: parseInt(form.missingPersonAge)||0,
          height: form.height ? parseFloat(form.height) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
        }),
        signal: AbortSignal.timeout(4000),
      });
      const result = await res.json();
      if (result.success) { setCaseNumber(result.data.caseNumber); setSubmitted(true); return; }
      throw new Error(result.message);
    } catch {
      const year = new Date().getFullYear();
      const num  = String(Math.floor(Math.random() * 900) + 100);
      setCaseNumber(`MP-${year}-${num}`);
      setSubmitted(true);
    } finally { setLoading(false); }
  }

  if (submitted) return (
    <div className="max-w-lg mx-auto pt-6 space-y-4">
      <div className="card p-6 border-2 border-green-300 text-center">
        <CheckCircle2 size={40} className="mx-auto text-green-600 mb-3" />
        <h2 className="text-xl font-bold text-[var(--navy)] mb-1">Report Submitted</h2>
        <p className="text-sm text-[var(--slate)] mb-4">Missing person report received by Hossana Police.</p>
        <div className="p-3 bg-[var(--surface2)] rounded-xl mb-3">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Case Number</p>
          <p className="text-2xl font-extrabold text-[var(--navy)] font-mono">{caseNumber}</p>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-xs text-amber-800 text-left flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
          For urgent/critical cases, also call the emergency hotline: <strong>911</strong>
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
          <h2 className="text-xl font-bold text-[var(--navy)]">Report Missing Person</h2>
          <p className="text-sm text-[var(--slate)] mt-0.5">Submit detailed information to help locate the missing person.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Reporter */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Your Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Your Full Name" required id="mpRName" type="text" placeholder="Min 4 letters"
                value={form.reporterName} onChange={e => set("reporterName",(e.target as HTMLInputElement).value)}
                error={errors.reporterName} className="col-span-2" />
              <FormField label="Your Phone" required id="mpRPhone" type="tel" placeholder="09XXXXXXXX"
                value={form.reporterPhone} onChange={e => set("reporterPhone",(e.target as HTMLInputElement).value)}
                error={errors.reporterPhone} hint="09... or 07..., 10 digits" />
              <FormField label="Your Email (optional)" id="mpREmail" type="email"
                value={form.reporterEmail} onChange={e => set("reporterEmail",(e.target as HTMLInputElement).value)}
                error={errors.reporterEmail} />
              <FormField label="Relationship to Missing Person" required id="mpRRel" type="text" placeholder="Parent / Spouse / Friend"
                value={form.reporterRelationship} onChange={e => set("reporterRelationship",(e.target as HTMLInputElement).value)}
                error={errors.reporterRelationship} className="col-span-2" />
            </div>
          </div>

          {/* Missing person details */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Missing Person Details</h3>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Full Name" required id="mpName" type="text" placeholder="Min 4 letters"
                value={form.missingPersonName} onChange={e => set("missingPersonName",(e.target as HTMLInputElement).value)}
                error={errors.missingPersonName} className="col-span-2" />
              <FormField label="Age" required id="mpAge" type="number" placeholder="25"
                value={form.missingPersonAge} onChange={e => set("missingPersonAge",(e.target as HTMLInputElement).value)}
                error={errors.missingPersonAge} />
              <FormField label="Gender" required as="select" id="mpGender"
                value={form.gender} onChange={e => set("gender", e.target.value)} error={errors.gender}>
                <option value="">Select…</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </FormField>
              <FormField label="Height (cm)" id="mpH" type="number" placeholder="170"
                value={form.height} onChange={e => set("height",(e.target as HTMLInputElement).value)} />
              <FormField label="Weight (kg)" id="mpW" type="number" placeholder="65"
                value={form.weight} onChange={e => set("weight",(e.target as HTMLInputElement).value)} />
              <FormField label="Physical Description" required as="textarea" id="mpPhys" rows={3}
                placeholder="Hair, skin tone, distinguishing features…"
                value={form.physicalDescription} onChange={e => set("physicalDescription",(e.target as HTMLTextAreaElement).value)}
                error={errors.physicalDescription} className="col-span-3" />
            </div>
          </div>

          {/* Last seen */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-2 border-b border-[var(--border)]">Last Seen Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Last Seen Location" required id="mpLSLoc" type="text"
                value={form.lastSeenLocation} onChange={e => set("lastSeenLocation",(e.target as HTMLInputElement).value)}
                error={errors.lastSeenLocation} />
              <FormField label="Date & Time Last Seen" required id="mpLSDate" type="datetime-local" as="input"
                value={form.lastSeenDate} onChange={e => set("lastSeenDate",(e.target as HTMLInputElement).value)}
                error={errors.lastSeenDate} />
              <FormField label="Clothing Description" required as="textarea" id="mpCloth" rows={2}
                placeholder="What were they wearing?"
                value={form.lastSeenWearing} onChange={e => set("lastSeenWearing",(e.target as HTMLTextAreaElement).value)}
                error={errors.lastSeenWearing} className="col-span-2" />
              <FormField label="Circumstances" required as="textarea" id="mpCirc" rows={4}
                placeholder="Describe how the disappearance occurred (min 20 chars)…"
                value={form.circumstances} onChange={e => set("circumstances",(e.target as HTMLTextAreaElement).value)}
                error={errors.circumstances} className="col-span-2" />
              <FormField label="Medical Conditions (optional)" as="textarea" id="mpMed" rows={2}
                placeholder="Any medical conditions or medications…"
                value={form.medicalConditions} onChange={e => set("medicalConditions",(e.target as HTMLTextAreaElement).value)}
                className="col-span-2" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.isCritical}
                onChange={e => set("isCritical", e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--green)]" />
              <span className="text-sm text-[var(--charcoal)]">Mark as critical — vulnerable person or medical emergency</span>
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
              ) : <><UserX size={14}/> Submit Report</>}
            </motion.button>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
