"use client";
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Save, User, Mail, Phone, MapPin, Shield, Edit3 } from "lucide-react";
import ToastContainer, { ToastMessage, useAutoDismiss } from "@/components/ui/Toast";

const initialProfile = {
  name:       "Meron Tadesse",
  email:      "preventive@hossanapolice.gov.et",
  phone:      "+251 911 002 002",
  badge:      "PRV-021",
  rank:       "Police Officer I",
  department: "Preventive Police Division",
  location:   "Hossana City, Hadiya Zone",
  bio:        "Police Officer specialising in crime prevention, criminal registration and community outreach programs.",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialProfile);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const addToast = useCallback((type: ToastMessage["type"], msg: string) => setToasts(t => [...t, { id: Date.now().toString(), type, message: msg }]), []);
  const removeToast = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []);
  useAutoDismiss(toasts, removeToast);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
    addToast("success", "Profile picture updated.");
  }

  function handleSave() {
    setProfile(draft);
    setEditing(false);
    addToast("success", "Profile information saved successfully.");
  }

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  const fields = [
    { label: "Full Name",   key: "name",       icon: User,    type: "text" },
    { label: "Email",       key: "email",      icon: Mail,    type: "email" },
    { label: "Phone",       key: "phone",      icon: Phone,   type: "tel" },
    { label: "Badge No.",   key: "badge",      icon: Shield,  type: "text" },
    { label: "Rank",        key: "rank",       icon: Shield,  type: "text" },
    { label: "Department",  key: "department", icon: Shield,  type: "text" },
    { label: "Location",    key: "location",   icon: MapPin,  type: "text" },
  ] as const;

  return (
    <>
      <div className="space-y-6 pb-8 max-w-2xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">My Profile</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">View and update your personal information.</p>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-primary">
              <Edit3 size={15}/> Edit Profile
            </button>
          )}
        </div>

        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] flex items-center justify-center shadow-xl overflow-hidden ring-4 ring-[var(--green-light)] dark:ring-green-900/40">
                {avatar
                  ? <img src={avatar} alt="Profile picture" className="w-full h-full object-cover"/>
                  : <span className="text-3xl font-extrabold text-white">{profile.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</span>
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                aria-label="Change profile picture"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--green)] hover:bg-[var(--green-dark)] text-white flex items-center justify-center shadow-md transition-colors border-2 border-[var(--card-bg)]"
              >
                <Camera size={14}/>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl font-extrabold text-[var(--navy)]">{profile.name}</p>
              <p className="text-sm text-[var(--slate)] mt-0.5">{profile.rank}</p>
              <p className="text-sm text-[var(--slate)]">{profile.department}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
                <span className="badge badge-green">{profile.badge}</span>
                <span className="badge badge-blue">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="card p-6">
          <h3 className="text-sm font-bold text-[var(--navy)] mb-5 pb-3 border-b border-[var(--border)]">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, key, icon: Icon, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[var(--slate)] mb-1.5 uppercase tracking-wide">
                  <div className="flex items-center gap-1.5"><Icon size={12}/>{label}</div>
                </label>
                {editing ? (
                  <input type={type} value={draft[key]} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} className="input"/>
                ) : (
                  <p className="h-10 flex items-center px-3 bg-[var(--surface2)] rounded-xl text-sm font-medium text-[var(--navy)]">{profile[key]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-[var(--slate)] mb-1.5 uppercase tracking-wide">Bio</label>
            {editing ? (
              <textarea rows={3} value={draft.bio} onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))} className="input h-auto px-3 py-2 resize-none"/>
            ) : (
              <p className="p-3 bg-[var(--surface2)] rounded-xl text-sm text-[var(--charcoal)] leading-relaxed">{profile.bio}</p>
            )}
          </div>
          {editing && (
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[var(--border)]">
              <button onClick={handleSave} className="btn-primary"><Save size={15}/>Save Changes</button>
              <button onClick={handleCancel} className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            </div>
          )}
        </motion.div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
