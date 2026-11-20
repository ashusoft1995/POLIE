"use client";
/**
 * Shared settings shell — used by every role dashboard.
 * Pass role-specific notification labels via `notifLabels`.
 */
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Globe, Moon, Sun, Save, KeyRound } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { languages } from "@/lib/i18n";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";

interface NotifLabel { key: string; label: string; sub: string }

interface Props {
  notifLabels?: NotifLabel[];
}

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.35 }} className="card p-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[var(--border)]">
        <div className="p-2 rounded-xl bg-[var(--green-light)]">
          <Icon size={16} className="text-[var(--green)]"/>
        </div>
        <h3 className="text-sm font-bold text-[var(--navy)]">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--navy)]">{label}</p>
        {sub && <p className="text-xs text-[var(--muted)] mt-0.5">{sub}</p>}
      </div>
      <button role="switch" aria-checked={checked} onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-[var(--green)]" : "bg-[var(--border)]"}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`}/>
      </button>
    </div>
  );
}

const DEFAULT_NOTIFS: NotifLabel[] = [
  { key:"email",        label:"Email Notifications",   sub:"Receive updates via email"              },
  { key:"browser",      label:"Browser Notifications", sub:"Show desktop alerts"                    },
  { key:"assignments",  label:"Assignment Alerts",     sub:"Notify on new case or task assignments" },
  { key:"system",       label:"System Alerts",         sub:"Maintenance and security notices"       },
];

export default function SettingsShell({ notifLabels = DEFAULT_NOTIFS }: Props) {
  const { dark, toggleDark, lang, setLang } = useTheme();
  const [notifs, setNotifs] = useState<Record<string,boolean>>(
    Object.fromEntries(notifLabels.map(n => [n.key, true]))
  );
  const [pwOpen, setPwOpen]  = useState(false);
  const [toasts, setToasts]  = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id: `${Date.now()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  return (
    <>
      <div className="space-y-5 pb-8 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold text-[var(--navy)]">Settings</h2>
          <p className="text-sm text-[var(--slate)] mt-0.5">Manage your preferences and account security.</p>
        </div>

        {/* Appearance */}
        <SettingSection title="Appearance" icon={dark ? Moon : Sun}>
          <Toggle label="Dark Mode" sub="Switch between light and dark interface" checked={dark} onChange={toggleDark}/>
        </SettingSection>

        {/* Language */}
        <SettingSection title="Language" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${lang===l.code ? "border-[var(--green)] bg-[var(--green-light)]" : "border-[var(--border)] hover:border-[var(--green)]"}`}>
                <span className="text-base font-bold text-[var(--navy)]">{l.native}</span>
                <span className="text-xs text-[var(--slate)]">{l.label}</span>
                {lang===l.code && <span className="badge badge-green text-[10px] mt-0.5">Active</span>}
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          {notifLabels.map(n => (
            <Toggle key={n.key} label={n.label} sub={n.sub}
              checked={notifs[n.key] ?? true}
              onChange={() => setNotifs(s => ({ ...s, [n.key]: !s[n.key] }))}/>
          ))}
        </SettingSection>

        {/* Security */}
        <SettingSection title="Security" icon={Shield}>
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <p className="text-sm font-medium text-[var(--navy)]">Change Password</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">Update your account password. Use a strong, unique password.</p>
            </div>
            <button onClick={() => setPwOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--charcoal)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors shrink-0">
              <KeyRound size={14}/> Change
            </button>
          </div>
        </SettingSection>

        <div className="flex justify-end">
          <button onClick={() => addToast("success","Settings saved successfully.")} className="btn-primary">
            <Save size={14}/> Save Settings
          </button>
        </div>
      </div>

      <ChangePasswordModal isOpen={pwOpen} onClose={() => setPwOpen(false)}/>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
