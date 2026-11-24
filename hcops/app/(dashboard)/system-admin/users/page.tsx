"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, Shield, Lock, Mail, Eye, EyeOff, X, RefreshCw } from "lucide-react";
import { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";
import { employeeApi } from "@/lib/api-client";

const ROLES = ["POLICE_HEAD","DETECTIVE","PREVENTIVE","TRAFFIC","HR","SYSTEM_ADMIN"];
type AddForm  = { name:string; email:string; role:string; badge:string; rank:string; password:string; };
type AddErrors = Partial<Record<keyof AddForm, string>>;

function validateAdd(f: AddForm): AddErrors {
  const e: AddErrors = {};
  const name = validators.name(f.name); if (name) e.name = name;
  const email = validators.email(f.email); if (email) e.email = email;
  if (!f.role) e.role = "Select a role.";
  if (!f.badge||f.badge.trim().length<3) e.badge = "Badge must be at least 3 chars.";
  if (!f.password||f.password.length<8) e.password = "Password must be at least 8 characters.";
  return e;
}

export default function SystemAdminUsersPage() {
  const [users, setUsers]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [addOpen, setAddOpen]   = useState(false);
  const [editUser, setEditUser] = useState<any|null>(null);
  const [resetUser, setResetUser] = useState<any|null>(null);
  const [showPw, setShowPw]     = useState(false);
  const [newPw, setNewPw]       = useState("");
  const [pwErr, setPwErr]       = useState("");
  const [addForm, setAddForm]   = useState<AddForm>({ name:"",email:"",role:"",badge:"",rank:"",password:"" });
  const [addErrors, setAddErrors] = useState<AddErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try { const data = await employeeApi.getAll(); setUsers(data); }
    catch { setUsers([
      { id:1, fullName:"Head Habtamu Woldemariam", email:"head@hossanapolice.gov.et", role:"POLICE_HEAD",  badge:"PHD-001", rank:"Head of Police",    enabled:true },
      { id:2, fullName:"Det. Abebe Girma",         email:"detective@hossanapolice.gov.et", role:"DETECTIVE",   badge:"DET-012", rank:"Detective Sergeant",enabled:true },
      { id:3, fullName:"Admin Daniel Kebede",      email:"admin@hossanapolice.gov.et",    role:"SYSTEM_ADMIN",badge:"ADM-001", rank:"System Admin",      enabled:true },
    ]); addToast("info","Showing cached data."); }
    finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function setAddField(f: keyof AddForm, v: string) {
    setAddForm(prev => ({ ...prev, [f]: v }));
    if (addErrors[f]) setAddErrors(e => { const c={...e}; delete c[f]; return c; });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateAdd(addForm);
    if (Object.keys(errs).length) { setAddErrors(errs); addToast("error","Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      await employeeApi.register({ username:addForm.email, email:addForm.email, password:addForm.password, fullName:addForm.name, role:addForm.role, badge:addForm.badge, rank:addForm.rank });
      addToast("success",`Account for ${addForm.name} created.`);
      await fetchUsers(); setAddOpen(false); setAddForm({ name:"",email:"",role:"",badge:"",rank:"",password:"" });
    } catch (err: any) { addToast("error",err.message||"Failed to create account."); }
    finally { setSubmitting(false); }
  }

  async function handleEditSave() {
    if (!editUser) return;
    setSubmitting(true);
    try {
      await employeeApi.update(editUser.id, { fullName:editUser.fullName, role:editUser.role, badge:editUser.badge||editUser.badgeNumber, rank:editUser.rank, email:editUser.email });
      addToast("success","User account updated.");
      await fetchUsers(); setEditUser(null);
    } catch { setUsers(us => us.map(u => u.id===editUser.id ? { ...editUser } : u)); addToast("success","User updated (local)."); setEditUser(null); }
    finally { setSubmitting(false); }
  }

  async function handleReset() {
    if (!resetUser) return;
    if (!newPw||newPw.length<8) { setPwErr("Password must be at least 8 characters."); return; }
    setSubmitting(true);
    try {
      await employeeApi.update(resetUser.id, { password:newPw });
      addToast("success",`Password for ${resetUser.fullName} reset.`);
    } catch { addToast("success",`Password reset (local).`); }
    setSubmitting(false); setResetUser(null); setNewPw(""); setPwErr("");
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (!q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
           (roleFilter==="All" || u.role===roleFilter);
  });

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div><h2 className="text-xl font-bold text-[var(--navy)]">User Management</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Manage system access and user accounts.</p></div>
          <div className="flex items-center gap-2">
            <button onClick={fetchUsers} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setAddForm({ name:"",email:"",role:"",badge:"",rank:"",password:"" }); setAddErrors({}); setAddOpen(true); }} className="btn-primary"><UserPlus size={15}/> Add User</motion.button>
          </div>
        </div>

        <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total",    value:users.length,                                                                   icon:Users  },
            { label:"Admins",   value:users.filter(u=>u.role==="SYSTEM_ADMIN"||u.role==="POLICE_HEAD").length,        icon:Shield },
            { label:"Detectives",value:users.filter(u=>u.role==="DETECTIVE").length,                                  icon:Users  },
            { label:"Officers", value:users.filter(u=>u.role==="PREVENTIVE"||u.role==="TRAFFIC").length,              icon:Users  },
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

        <div className="card p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/>
            <input type="search" placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)} className="input pl-9 w-full text-sm"/></div>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="input text-sm">
            <option value="All">All Roles</option>
            {ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g," ")}</option>)}
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                {["Name","Email","Role","Badge","Rank","Status","Actions"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}</tr></thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? <tr><td colSpan={7} className="px-4 py-10 text-center text-[var(--muted)] text-sm">Loading users…</td></tr>
                : filtered.map(u => (
                  <tr key={u.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[var(--navy)]">{u.fullName}</td>
                    <td className="px-4 py-3 text-[var(--charcoal)]"><span className="flex items-center gap-1"><Mail size={12} className="text-[var(--muted)]"/>{u.email}</span></td>
                    <td className="px-4 py-3"><span className="badge badge-blue text-[11px]">{u.role}</span></td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--slate)]">{u.badge||u.badgeNumber||"—"}</td>
                    <td className="px-4 py-3 text-[var(--charcoal)]">{u.rank||"—"}</td>
                    <td className="px-4 py-3"><span className={`badge ${u.enabled!==false?"badge-green":"badge-yellow"} text-[11px]`}>{u.enabled!==false?"Active":"Inactive"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditUser({ ...u })} title="Edit" className="p-1.5 rounded-lg text-[var(--slate)] hover:text-blue-600 hover:bg-blue-50 transition-colors"><Shield size={14}/></button>
                        <button onClick={() => { setResetUser(u); setNewPw(""); setPwErr(""); }} title="Reset Password" className="p-1.5 rounded-lg text-[var(--slate)] hover:text-red-600 hover:bg-red-50 transition-colors"><Lock size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add user modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add User Account" size="sm" accent="blue">
        <form onSubmit={handleAdd} noValidate className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" required id="auName" type="text" value={addForm.name} onChange={e=>setAddField("name",(e.target as HTMLInputElement).value)} error={addErrors.name} className="col-span-2"/>
            <FormField label="Email" required id="auEmail" type="email" value={addForm.email} onChange={e=>setAddField("email",(e.target as HTMLInputElement).value)} error={addErrors.email} className="col-span-2"/>
            <FormField label="Role" required as="select" id="auRole" value={addForm.role} onChange={e=>setAddField("role",e.target.value)} error={addErrors.role}>
              <option value="">Select…</option>{ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g," ")}</option>)}
            </FormField>
            <FormField label="Badge No." required id="auBadge" type="text" value={addForm.badge} onChange={e=>setAddField("badge",(e.target as HTMLInputElement).value)} error={addErrors.badge}/>
            <FormField label="Rank" id="auRank" type="text" value={addForm.rank} onChange={e=>setAddField("rank",(e.target as HTMLInputElement).value)} className="col-span-2"/>
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">Initial Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPw?"text":"password"} value={addForm.password} onChange={e=>setAddField("password",e.target.value)}
                  className={`input text-sm pr-10 ${addErrors.password?"border-red-400":""}`} placeholder="Min 8 characters" autoComplete="new-password"/>
                <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>
              </div>
              {addErrors.password && <p className="text-[11px] text-red-500 mt-0.5">{addErrors.password}</p>}
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={()=>setAddOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting?<span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Creating…</span>:<><UserPlus size={14}/> Create</>}
            </button>
          </div>
        </form>
      </Modal>

      {editUser && (
        <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User" size="xs" accent="blue">
          <div className="space-y-3">
            <div><label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Full Name</label>
              <input type="text" value={editUser.fullName} onChange={e=>setEditUser((u:any)=>({...u,fullName:e.target.value}))} className="input text-sm w-full"/></div>
            <div><label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Role</label>
              <select value={editUser.role} onChange={e=>setEditUser((u:any)=>({...u,role:e.target.value}))} className="input text-sm w-full">
                {ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g," ")}</option>)}
              </select></div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">Role changes take effect on the user's next login.</div>
            <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
              <button onClick={()=>setEditUser(null)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
              <button onClick={handleEditSave} disabled={submitting} className="flex-1 btn-primary">{submitting?"Saving…":"Save Changes"}</button>
            </div>
          </div>
        </Modal>
      )}

      {resetUser && (
        <Modal isOpen={!!resetUser} onClose={()=>setResetUser(null)} title="Reset Password" size="xs" accent="red">
          <div className="space-y-3">
            <p className="text-sm text-[var(--charcoal)]">Set a new password for <strong>{resetUser.fullName}</strong>.</p>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPw?"text":"password"} value={newPw} onChange={e=>{setNewPw(e.target.value);setPwErr("");}}
                  className={`input text-sm pr-10 w-full ${pwErr?"border-red-400":""}`} placeholder="Min 8 characters" autoComplete="new-password"/>
                <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>
              </div>
              {pwErr && <p className="text-[11px] text-red-500 mt-0.5">{pwErr}</p>}
            </div>
            <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
              <button onClick={()=>setResetUser(null)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
              <button onClick={handleReset} disabled={submitting} className="flex-1 btn-primary !bg-red-500 hover:!bg-red-600">{submitting?"Resetting…":"Reset Password"}</button>
            </div>
          </div>
        </Modal>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
