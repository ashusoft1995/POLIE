"use client";
/**
 * Shared ProfileCard — used by all role dashboards.
 * Shows avatar, info display, and opens a compact edit modal.
 */
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Edit3 } from "lucide-react";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  badge: string;
  rank: string;
  department: string;
  location: string;
  bio: string;
}

type Errors = Partial<Record<keyof ProfileData, string>>;

function validateProfile(d: ProfileData): Errors {
  const e: Errors = {};
  const name = validators.name(d.name);    if (name)  e.name  = name;
  const email = validators.email(d.email); if (email) e.email = email;
  const phone = validators.phone(d.phone); if (phone) e.phone = phone;
  const badge = validators.badge(d.badge); if (badge) e.badge = badge;
  if (!d.rank)       e.rank       = "Rank is required.";
  if (!d.department) e.department = "Department is required.";
  if (!d.location || d.location.trim().length < 4) e.location = "Location is required.";
  return e;
}

interface Props {
  initial: ProfileData;
  /** Badge colour: "green" | "blue" | "yellow" */
  badgeVariant?: "green" | "blue" | "yellow";
}

export default function ProfileCard({ initial, badgeVariant = "green" }: Props) {
  const [profile, setProfile]     = useState<ProfileData>(initial);
  const [draft, setDraft]         = useState<ProfileData>(initial);
  const [avatar, setAvatar]       = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors]       = useState<Errors>({});
  const [saving, setSaving]       = useState(false);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const addToast = useCallback(
    (type: ToastMessage["type"], message: string) =>
      setToasts((t) => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]),
    [],
  );
  const removeToast = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset the input value so the same file can be re-selected
    e.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast("error", "Image must be smaller than 2 MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      addToast("error", "Only JPG, PNG, or WebP images are accepted.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatar(result);
      addToast("success", "Profile photo updated.");
    };
    reader.readAsDataURL(file);
  }

  function set(field: keyof ProfileData, value: string) {
    setDraft((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => { const c = { ...e }; delete c[field]; return c; });
  }

  function openEdit() { setDraft({ ...profile }); setErrors({}); setModalOpen(true); }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    const errs = validateProfile(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      addToast("error", "Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setProfile({ ...draft });
    setSaving(false);
    setModalOpen(false);
    addToast("success", "Profile updated successfully.");
  }

  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  const infoFields: { label: string; key: keyof ProfileData; Icon: typeof User }[] = [
    { label: "Full Name",  key: "name",       Icon: User   },
    { label: "Email",      key: "email",      Icon: Mail   },
    { label: "Phone",      key: "phone",      Icon: Phone  },
    { label: "Badge No.",  key: "badge",      Icon: Shield },
    { label: "Rank",       key: "rank",       Icon: Shield },
    { label: "Department", key: "department", Icon: Shield },
    { label: "Location",   key: "location",   Icon: MapPin },
  ];

  return (
    <>
      <div className="space-y-5 max-w-2xl pb-8">
        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">My Profile</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Your account information.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={openEdit}
            className="btn-primary"
          >
            <Edit3 size={14} /> Edit Profile
          </motion.button>
        </div>

        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="card p-5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center shadow-lg overflow-hidden ring-4 ring-[var(--green-light)]">
                {avatar ? (
                  <img
                    key={avatar.slice(-20)}
                    src={avatar}
                    alt="Profile"
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  <span className="text-2xl font-extrabold text-white select-none">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Change photo"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--green)] hover:bg-[var(--green-dark)] text-white flex items-center justify-center shadow border-2 border-[var(--card-bg)] transition-colors"
              >
                <Camera size={12} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-extrabold text-[var(--navy)]">{profile.name}</p>
              <p className="text-sm text-[var(--slate)]">{profile.rank} · {profile.department}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
                <span className={`badge badge-${badgeVariant}`}>{profile.badge}</span>
                <span className="badge badge-blue">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="card p-5"
        >
          <h3 className="text-sm font-bold text-[var(--navy)] mb-4 pb-3 border-b border-[var(--border)]">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoFields.map(({ label, key, Icon }) => (
              <div key={key}>
                <p className="text-[10px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">
                  <Icon size={11} /> {label}
                </p>
                <p className="h-9 flex items-center px-3 bg-[var(--surface2)] rounded-xl text-sm font-medium text-[var(--navy)] truncate">
                  {profile[key]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-semibold text-[var(--slate)] uppercase tracking-wide mb-1">Bio</p>
            <p className="p-3 bg-[var(--surface2)] rounded-xl text-sm text-[var(--charcoal)] leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Profile" size="sm" accent="blue">
        <form onSubmit={handleSave} noValidate className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" required id="pcName" type="text" placeholder="Min 4 letters"
              value={draft.name} onChange={(e) => set("name", (e.target as HTMLInputElement).value)}
              error={errors.name} hint="Letters and spaces only" className="col-span-2" />
            <FormField label="Email" required id="pcEmail" type="email" placeholder="user@domain.gov.et"
              value={draft.email} onChange={(e) => set("email", (e.target as HTMLInputElement).value)}
              error={errors.email} className="col-span-2" />
            <FormField label="Phone" required id="pcPhone" type="tel" placeholder="09XXXXXXXX"
              value={draft.phone} onChange={(e) => set("phone", (e.target as HTMLInputElement).value)}
              error={errors.phone} hint="Starts 09 or 07, 10 digits" />
            <FormField label="Badge No." required id="pcBadge" type="text" placeholder="DET-001"
              value={draft.badge} onChange={(e) => set("badge", (e.target as HTMLInputElement).value)}
              error={errors.badge} />
            <FormField label="Rank" required id="pcRank" type="text" placeholder="Detective Sergeant"
              value={draft.rank} onChange={(e) => set("rank", (e.target as HTMLInputElement).value)}
              error={errors.rank} />
            <FormField label="Department" required id="pcDept" type="text" placeholder="CID"
              value={draft.department} onChange={(e) => set("department", (e.target as HTMLInputElement).value)}
              error={errors.department} />
            <FormField label="Location" required id="pcLoc" type="text" placeholder="Hossana City"
              value={draft.location} onChange={(e) => set("location", (e.target as HTMLInputElement).value)}
              error={errors.location} className="col-span-2" />
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Bio</label>
              <textarea rows={3} value={draft.bio} onChange={(e) => set("bio", e.target.value)}
                className="input h-auto px-3 py-2 resize-none text-sm w-full" placeholder="Short professional bio…" />
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary">
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
