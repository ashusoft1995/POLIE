"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Globe, Moon, Sun, Save } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { languages } from "@/lib/i18n";
import ToastContainer, { ToastMessage, useAutoDismiss } from "@/components/ui/Toast";

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4}} className="card p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[var(--border)]">
        <div className="p-2 rounded-xl bg-[var(--green-light)] dark:bg-green-900/30">
          <Icon size={17} className="text-[var(--green)]"/>
        </div>
        <h3 className="text-sm font-bold text-[var(--navy)]">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--border)] last:border-0">
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

export default function SettingsPage() {
  const { dark, toggleDark, lang, setLang } = useTheme();
  const [notifs, setNotifs] = useState({ email: true, browser: false, closure: true, assignment: true });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((type: ToastMessage["type"], msg: string) => setToasts(t => [...t, { id: Date.now().toString(), type, message: msg }]), []);
  const removeToast = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []);
  useAutoDismiss(toasts, removeToast);

  return (
    <>
      <div className="space-y-6 pb-8 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold text-[var(--navy)]">Settings</h2>
          <p className="text-sm text-[var(--slate)] mt-0.5">Manage your preferences and account settings.</p>
        </div>

        <SettingSection title="Appearance" icon={dark ? Moon : Sun}>
          <Toggle label="Dark Mode" sub="Switch between light and dark interface" checked={dark} onChange={toggleDark}/>
        </SettingSection>

        <SettingSection title="Language" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${lang===l.code ? "border-[var(--green)] bg-[var(--green-light)] dark:bg-green-900/20" : "border-[var(--border)] hover:border-[var(--green)]"}`}>
                <span className="text-lg font-bold text-[var(--navy)]">{l.native}</span>
                <span className="text-xs text-[var(--slate)]">{l.label}</span>
                {lang===l.code && <span className="badge badge-green text-[10px] mt-1">Active</span>}
              </button>
            ))}
          </div>
        </SettingSection>

        <SettingSection title="Notifications" icon={Bell}>
          <Toggle label="Email Notifications" sub="Receive updates via email" checked={notifs.email} onChange={() => setNotifs(n => ({...n, email: !n.email}))}/>
          <Toggle label="Browser Notifications" sub="Show desktop alerts" checked={notifs.browser} onChange={() => setNotifs(n => ({...n, browser: !n.browser}))}/>
          <Toggle label="Closure Request Alerts" sub="Notify when a detective requests case closure" checked={notifs.closure} onChange={() => setNotifs(n => ({...n, closure: !n.closure}))}/>
          <Toggle label="Case Assignment Alerts" sub="Notify when a case is assigned to your command" checked={notifs.assignment} onChange={() => setNotifs(n => ({...n, assignment: !n.assignment}))}/>
        </SettingSection>

        <SettingSection title="Security" icon={Shield}>
          <div className="space-y-3">
            <p className="text-sm text-[var(--slate)]">Change your password and manage session security.</p>
            <button className="btn-primary" onClick={() => {}}>Change Password</button>
          </div>
        </SettingSection>

        <div className="flex justify-end">
          <button onClick={() => addToast("success","Settings saved successfully.")} className="btn-primary">
            <Save size={15}/> Save Settings
          </button>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
