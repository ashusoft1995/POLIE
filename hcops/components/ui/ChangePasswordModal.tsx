"use client";
import { useState, useCallback } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import Modal from "@/components/ui/modal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";

interface Props { isOpen: boolean; onClose: () => void; }

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [form, setForm]     = useState({ current: "", next: "", confirm: "" });
  const [show, setShow]     = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c = { ...e }; delete c[field]; return c; });
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.current) e.current = "Current password is required.";
    if (!form.next || form.next.length < 8) e.next = "New password must be at least 8 characters.";
    if (!/[A-Z]/.test(form.next)) e.next = "Must include at least one uppercase letter.";
    if (!/[0-9]/.test(form.next)) e.next = "Must include at least one number.";
    if (form.next !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    addToast("success", "Password changed successfully.");
    setForm({ current: "", next: "", confirm: "" });
    setTimeout(() => onClose(), 1500);
  }

  function handleClose() { setForm({ current:"", next:"", confirm:"" }); setErrors({}); onClose(); }

  const strength = !form.next ? 0
    : [form.next.length >= 8, /[A-Z]/.test(form.next), /[0-9]/.test(form.next), /[^a-zA-Z0-9]/.test(form.next)].filter(Boolean).length;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"][strength];

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Change Password" size="xs" accent="blue">
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {(["current","next","confirm"] as const).map((field) => {
            const labels = { current: "Current Password", next: "New Password", confirm: "Confirm New Password" };
            return (
              <div key={field}>
                <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">
                  <KeyRound size={11}/> {labels[field]}<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={show[field] ? "text" : "password"}
                    value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    className={`input text-sm pr-10 ${errors[field] ? "border-red-400" : ""}`}
                    autoComplete={field === "current" ? "current-password" : "new-password"}
                  />
                  <button type="button" onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--navy)]">
                    {show[field] ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {errors[field] && <p className="text-[11px] text-red-500 mt-0.5">{errors[field]}</p>}
              </div>
            );
          })}

          {form.next && (
            <div>
              <div className="flex justify-between text-[11px] text-[var(--muted)] mb-1">
                <span>Strength</span><span className="font-semibold">{strengthLabel}</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-[var(--border)]"}`}/>
                ))}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-1">Min 8 chars · 1 uppercase · 1 number</p>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={handleClose}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary">
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>Saving…
                </span>
              ) : <><ShieldCheck size={14}/> Change Password</>}
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
