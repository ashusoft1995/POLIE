"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Lock, Settings, Plus, X } from "lucide-react";
import { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";

// Use static color classes (not dynamic) to avoid Tailwind purge
const ROLE_STYLE: Record<string, { ring: string; bg: string; text: string }> = {
  "Police Head": { ring:"ring-blue-200",   bg:"bg-blue-50",   text:"text-blue-700"   },
  "Detective":   { ring:"ring-purple-200", bg:"bg-purple-50", text:"text-purple-700" },
  "Preventive":  { ring:"ring-green-200",  bg:"bg-green-50",  text:"text-green-700"  },
  "Traffic":     { ring:"ring-yellow-200", bg:"bg-yellow-50", text:"text-yellow-700" },
  "HR Manager":  { ring:"ring-pink-200",   bg:"bg-pink-50",   text:"text-pink-700"   },
  "System Admin":{ ring:"ring-slate-200",  bg:"bg-slate-50",  text:"text-slate-700"  },
};

const initRoles = [
  { id:"R001", name:"Police Head",  users:1, permissions:["All Access","Approve Cases","View Reports","Approve Referrals"] },
  { id:"R002", name:"Detective",    users:3, permissions:["Manage Cases","Add Evidence","Request Closure","Submit Referrals"] },
  { id:"R003", name:"Preventive",   users:4, permissions:["Register Criminals","View Reports","Forward Cases"] },
  { id:"R004", name:"Traffic",      users:5, permissions:["Register Vehicles","File Accidents","Traffic Reports"] },
  { id:"R005", name:"HR Manager",   users:2, permissions:["Register Officers","Manage Leave","View Payroll"] },
  { id:"R006", name:"System Admin", users:1, permissions:["Manage Users","View Logs","System Config","All Access"] },
];

export default function SystemAdminRolesPage() {
  const [roles, setRoles]       = useState(initRoles);
  const [viewRole, setViewRole] = useState<typeof initRoles[0]|null>(null);
  const [addOpen, setAddOpen]   = useState(false);
  const [newName, setNewName]   = useState("");
  const [nameErr, setNameErr]   = useState("");
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function handleAddRole() {
    if (!newName.trim() || newName.trim().length < 3) { setNameErr("Role name must be at least 3 characters."); return; }
    setRoles(rs => [...rs, { id:`R${String(rs.length+1).padStart(3,"0")}`, name:newName.trim(), users:0, permissions:[] }]);
    addToast("success",`Role "${newName.trim()}" created.`);
    setNewName(""); setNameErr(""); setAddOpen(false);
  }

  const totalUsers = roles.reduce((s,r) => s+r.users, 0);
  const totalPerms = roles.reduce((s,r) => s+r.permissions.length, 0);

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Roles & Access Control</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">System roles and their permissions.</p>
          </div>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setNewName(""); setNameErr(""); setAddOpen(true); }} className="btn-primary">
            <Plus size={15}/> Add Role
          </motion.button>
        </div>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Total Roles",       value:roles.length,  icon:Shield },
            { label:"Total Users",       value:totalUsers,    icon:Users  },
            { label:"Total Permissions", value:totalPerms,    icon:Lock   },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{y:-3}} className="card p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value}/></p></div>
                  <s.icon size={22} className="text-[var(--green)]"/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map(role => {
            const style = ROLE_STYLE[role.name] ?? { ring:"ring-slate-200", bg:"bg-slate-50", text:"text-slate-700" };
            return (
              <StaggerChild key={role.id}>
                <motion.div whileHover={{y:-4,boxShadow:"0 12px 24px -8px rgba(0,0,0,0.12)"}} className="card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${style.bg} ring-2 ${style.ring} flex items-center justify-center`}>
                        <Shield size={22} className={style.text}/>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--navy)]">{role.name}</h4>
                        <p className="text-xs text-[var(--slate)]">{role.users} user{role.users!==1?"s":""}</p>
                      </div>
                    </div>
                    <button onClick={() => setViewRole(role)}
                      className="p-1.5 rounded-lg text-[var(--slate)] hover:text-[var(--green)] hover:bg-[var(--green-light)] transition-colors">
                      <Settings size={15}/>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.slice(0,3).map(p => (
                      <span key={p} className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${style.bg} ${style.text}`}>{p}</span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[var(--surface2)] text-[var(--muted)]">+{role.permissions.length-3} more</span>
                    )}
                  </div>
                </motion.div>
              </StaggerChild>
            );
          })}
        </StaggerParent>
      </div>

      {/* View/Edit role */}
      {viewRole && (
        <Modal isOpen={!!viewRole} onClose={() => setViewRole(null)} title={`${viewRole.name} — Permissions`} size="sm" accent="blue">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[var(--surface2)] rounded-xl">
              <Shield size={18} className="text-[var(--green)]"/>
              <div><p className="font-semibold text-[var(--navy)] text-sm">{viewRole.name}</p><p className="text-xs text-[var(--muted)]">{viewRole.users} user{viewRole.users!==1?"s":""} assigned</p></div>
            </div>
            <p className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide">Permissions ({viewRole.permissions.length})</p>
            <div className="space-y-1.5">
              {viewRole.permissions.map(p => (
                <div key={p} className="flex items-center gap-2 bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <Lock size={12} className="text-[var(--green)] shrink-0"/>
                  <span className="text-sm text-[var(--navy)]">{p}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted)]">Role permissions are managed by the system administrator. Contact your IT team to modify permissions.</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Add role modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Role" size="xs" accent="blue">
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Role Name <span className="text-red-500">*</span></label>
            <input type="text" value={newName} onChange={e => { setNewName(e.target.value); setNameErr(""); }}
              placeholder="e.g. Court Liaison" className={`input text-sm w-full ${nameErr?"border-red-400":""}`}/>
            {nameErr && <p className="text-[11px] text-red-500 mt-0.5">{nameErr}</p>}
          </div>
          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button onClick={() => setAddOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button onClick={handleAddRole} className="flex-1 btn-primary"><Plus size={14}/> Create Role</button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
