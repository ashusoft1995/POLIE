"use client";
import { useState, useCallback } from "react";
import { UserPlus, Camera } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

interface OfficerForm {
  fullName: string;
  dob: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  badge: string;
  rank: string;
  department: string;
  joiningDate: string;
}

const empty: OfficerForm = {
  fullName: "", dob: "", idNumber: "", phone: "",
  email: "", address: "", badge: "", rank: "",
  department: "", joiningDate: "",
};

type Errors = Partial<Record<keyof OfficerForm, string>>;

function validate(form: OfficerForm): Errors {
  const e: Errors = {};
  const name = validators.name(form.fullName);
  if (name) e.fullName = name;

  if (!form.dob) e.dob = "Date of birth is required.";

  if (!form.idNumber || form.idNumber.trim().length < 5)
    e.idNumber = "ID number must be at least 5 characters.";

  const phone = validators.phone(form.phone);
  if (phone) e.phone = phone;

  const email = validators.email(form.email);
  if (email) e.email = email;

  if (!form.address || form.address.trim().length < 4)
    e.address = "Address is required (at least 4 characters).";

  const badge = validators.badge(form.badge);
  if (badge) e.badge = badge;

  if (!form.rank) e.rank = "Please select a rank.";
  if (!form.department) e.department = "Please select a department.";
  if (!form.joiningDate) e.joiningDate = "Joining date is required.";

  return e;
}

/* ── Mock table data ─────────────────────────────── */
const mockOfficers = [
  { id: "OFF-001", name: "Sgt. Kebede Alemu",   rank: "Sergeant",    dept: "CID",        date: "2019-03-12" },
  { id: "OFF-002", name: "Off. Tigist Mekonnen", rank: "Officer II",  dept: "Traffic",    date: "2021-07-05" },
  { id: "OFF-003", name: "Insp. Meron Tadesse",  rank: "Inspector",   dept: "Preventive", date: "2017-11-20" },
];

export default function HRRegisterPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OfficerForm>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage["type"], message: string) =>
      setToasts((t) => [...t, { id: Date.now().toString(), type, message }]),
    [],
  );
  const removeToast = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  function set(field: keyof OfficerForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const copy = { ...e }; delete copy[field]; return copy; });
  }

  function handleOpen() { setForm(empty); setErrors({}); setOpen(true); }
  function handleClose() { setOpen(false); setErrors({}); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      addToast("error", "Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setOpen(false);
    addToast("success", `Officer ${form.fullName} registered successfully.`);
    setForm(empty);
  }

  return (
    <>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Officer Registration</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Manage and register police personnel.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpen}
            className="btn-primary"
          >
            <UserPlus size={15} /> Register Officer
          </motion.button>
        </div>

        {/* Officers table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface2)]">
                  {["ID", "Name", "Rank", "Department", "Joined"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[var(--slate)] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {mockOfficers.map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--slate)]">{o.id}</td>
                    <td className="px-4 py-3 font-medium text-[var(--navy)]">{o.name}</td>
                    <td className="px-4 py-3 text-[var(--charcoal)]">{o.rank}</td>
                    <td className="px-4 py-3"><span className="badge badge-blue">{o.dept}</span></td>
                    <td className="px-4 py-3 text-[var(--slate)]">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Registration modal ──────────────────────── */}
      <Modal
        isOpen={open}
        onClose={handleClose}
        title="Register New Officer"
        size="sm"
        accent="blue"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface2)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--green)] transition-colors group shrink-0">
              <Camera size={18} className="text-[var(--muted)] group-hover:text-[var(--green)] transition-colors" />
              <span className="text-[9px] text-[var(--muted)] mt-1">Photo</span>
            </div>
            <div className="text-xs text-[var(--slate)] leading-relaxed">
              Upload a clear passport-style photo.<br />
              <span className="text-[var(--muted)]">JPG / PNG, max 2 MB</span>
            </div>
          </div>

          {/* Personal info */}
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest pt-1 border-t border-[var(--border)]">
            Personal Information
          </p>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Full Name" required
              id="fullName" name="fullName" type="text"
              placeholder="e.g. Kebede Alemu"
              value={form.fullName}
              onChange={(e) => set("fullName", (e.target as HTMLInputElement).value)}
              error={errors.fullName}
              className="col-span-2"
            />
            <FormField
              label="Date of Birth" required
              id="dob" name="dob" type="date" as="input"
              value={form.dob}
              onChange={(e) => set("dob", (e.target as HTMLInputElement).value)}
              error={errors.dob}
            />
            <FormField
              label="National ID" required
              id="idNumber" name="idNumber" type="text"
              placeholder="12345678"
              value={form.idNumber}
              onChange={(e) => set("idNumber", (e.target as HTMLInputElement).value)}
              error={errors.idNumber}
            />
            <FormField
              label="Phone" required
              id="phone" name="phone" type="tel"
              placeholder="09XXXXXXXX or 07XXXXXXXX"
              value={form.phone}
              onChange={(e) => set("phone", (e.target as HTMLInputElement).value)}
              error={errors.phone}
              hint="Ethiopian mobile: 09... or 07..., 10 digits"
            />
            <FormField
              label="Email" required
              id="email" name="email" type="email"
              placeholder="officer@hossanapolice.gov.et"
              value={form.email}
              onChange={(e) => set("email", (e.target as HTMLInputElement).value)}
              error={errors.email}
            />
            <FormField
              label="Address" required
              id="address" name="address" type="text"
              placeholder="Hossana, Hadiya Zone"
              value={form.address}
              onChange={(e) => set("address", (e.target as HTMLInputElement).value)}
              error={errors.address}
              className="col-span-2"
            />
          </div>

          {/* Official info */}
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest pt-1 border-t border-[var(--border)]">
            Official Details
          </p>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Badge No." required
              id="badge" name="badge" type="text"
              placeholder="PHD-001"
              value={form.badge}
              onChange={(e) => set("badge", (e.target as HTMLInputElement).value)}
              error={errors.badge}
              hint="Min 5 characters"
            />
            <FormField
              label="Joining Date" required
              id="joiningDate" name="joiningDate" type="date" as="input"
              value={form.joiningDate}
              onChange={(e) => set("joiningDate", (e.target as HTMLInputElement).value)}
              error={errors.joiningDate}
            />
            <FormField
              label="Rank" required as="select"
              id="rank" name="rank"
              value={form.rank}
              onChange={(e) => set("rank", e.target.value)}
              error={errors.rank}
            >
              <option value="">Select rank…</option>
              <option>Police Officer I</option>
              <option>Police Officer II</option>
              <option>Sergeant</option>
              <option>Inspector</option>
              <option>Superintendent</option>
            </FormField>
            <FormField
              label="Department" required as="select"
              id="department" name="department"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              error={errors.department}
            >
              <option value="">Select department…</option>
              <option>CID</option>
              <option>Preventive</option>
              <option>Traffic</option>
              <option>HR</option>
              <option>Admin</option>
            </FormField>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : (
                <><UserPlus size={14} /> Register</>
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
