"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, XCircle, User, MessageSquare, RefreshCw } from "lucide-react";
import { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { leaveApi } from "@/lib/api-client";

export default function HRLeavePage() {
  const [requests, setRequests]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: number; action: "approve"|"reject" }|null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toasts, setToasts]           = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchLeave = useCallback(async () => {
    setLoading(true);
    try {
      const data = await leaveApi.getAll();
      setRequests(data);
    } catch {
      // mock fallback
      setRequests([
        { id:1, employee:{fullName:"Sgt. Kebede Alemu",badge:"OFF-001"}, leaveType:"ANNUAL",   startDate:"2024-12-01", endDate:"2024-12-05", numberOfDays:5, reason:"Family event",          status:"PENDING"  },
        { id:2, employee:{fullName:"Off. Meron Tadesse",badge:"PRV-021"}, leaveType:"SICK",    startDate:"2024-11-20", endDate:"2024-11-22", numberOfDays:3, reason:"Medical appointment",   status:"APPROVED" },
        { id:3, employee:{fullName:"Det. Tigist Mekonnen",badge:"DET-007"},leaveType:"ANNUAL", startDate:"2024-12-10", endDate:"2024-12-14", numberOfDays:5, reason:"Annual leave",           status:"PENDING"  },
      ]);
      addToast("info","Showing cached data.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchLeave(); }, [fetchLeave]);

  function askAction(id: number, action: "approve"|"reject") {
    setPendingAction({ id, action }); setRejectReason(""); setConfirmOpen(true);
  }

  async function confirmAction() {
    if (!pendingAction) return;
    if (pendingAction.action === "reject" && !rejectReason.trim()) {
      addToast("error","Please enter a reason."); return;
    }
    try {
      if (pendingAction.action === "approve") await leaveApi.approve(pendingAction.id);
      else await leaveApi.reject(pendingAction.id, rejectReason);
      addToast(pendingAction.action === "approve" ? "success" : "warning",
        `Leave request ${pendingAction.action}d successfully.`);
      await fetchLeave();
    } catch {
      setRequests(rs => rs.map(r => r.id === pendingAction.id ? { ...r, status: pendingAction.action === "approve" ? "APPROVED" : "REJECTED" } : r));
      addToast(pendingAction.action === "approve" ? "success" : "warning",
        `Leave request ${pendingAction.action}d.`);
    }
    setConfirmOpen(false); setPendingAction(null);
  }

  const pending  = requests.filter(r => r.status === "PENDING").length;
  const approved = requests.filter(r => r.status === "APPROVED").length;
  const totalDays = requests.reduce((s,r) => s + (r.numberOfDays||0), 0);

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Leave Management</h2>
            <p className="text-sm text-[var(--slate)]">Review and approve officer leave requests.</p>
          </div>
          <button onClick={fetchLeave} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
        </div>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Pending",    value:pending,   icon:Clock,        color:"yellow" },
            { label:"Approved",   value:approved,  icon:CheckCircle2, color:"green"  },
            { label:"Total Days", value:totalDays, icon:Calendar,     color:"blue"   },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y:-3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value}/></p>
                  </div>
                  <s.icon size={26} className={`text-${s.color}-600`}/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {loading ? (
          <div className="text-center py-16 text-[var(--muted)] text-sm">Loading leave requests…</div>
        ) : (
          <StaggerParent className="space-y-3">
            {requests.map(req => (
              <StaggerChild key={req.id}>
                <motion.div whileHover={{ x:3 }} className="card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0"><User size={18} className="text-[var(--green)]"/></div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--navy)]">{req.employee?.fullName}</h4>
                        <p className="text-xs text-[var(--slate)] font-mono">{req.employee?.badge}</p>
                      </div>
                    </div>
                    <span className={`badge ${req.status==="PENDING"?"badge-yellow":req.status==="APPROVED"?"badge-green":"badge-red"}`}>{req.status}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    {[["Type",req.leaveType],["From",req.startDate],["To",req.endDate],["Days",req.numberOfDays]].map(([l,v])=>(
                      <div key={l}><p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase">{l}</p><p className={`font-semibold text-sm ${l==="Days"?"text-[var(--green)]":"text-[var(--charcoal)]"}`}>{String(v)}</p></div>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--slate)] mb-3"><span className="font-semibold text-[var(--charcoal)]">Reason:</span> {req.reason}</p>
                  {req.status === "PENDING" && (
                    <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => askAction(req.id,"approve")} className="btn-primary flex-1"><CheckCircle2 size={14}/> Approve</motion.button>
                      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => askAction(req.id,"reject")} className="btn-secondary flex-1 !border-red-400 !text-red-500 hover:!bg-red-500 hover:!text-white"><XCircle size={14}/> Reject</motion.button>
                    </div>
                  )}
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        )}
      </div>

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}
        title={pendingAction?.action === "approve" ? "Approve Leave" : "Reject Leave"}
        size="xs" accent={pendingAction?.action === "approve" ? "green" : "red"}>
        <div className="space-y-4">
          <p className="text-sm text-[var(--charcoal)]">
            {pendingAction?.action === "approve" ? "Approve this leave request?" : "Please provide a rejection reason."}
          </p>
          {pendingAction?.action === "reject" && (
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1"><MessageSquare size={11}/> Reason <span className="text-red-500">*</span></label>
              <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Enter rejection reason…" className="input h-auto px-3 py-2 resize-none text-sm w-full"/>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button onClick={() => setConfirmOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button onClick={confirmAction} className={`flex-1 btn-primary ${pendingAction?.action==="reject"?"!bg-red-500 hover:!bg-red-600":""}`}>
              {pendingAction?.action === "approve" ? <><CheckCircle2 size={14}/> Approve</> : <><XCircle size={14}/> Reject</>}
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
