"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, XCircle, User, MessageSquare } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { mockLeaveRequests } from "@/lib/mock-data/officers";

type LeaveReq = (typeof mockLeaveRequests)[number] & { status: string };

export default function HRLeavePage() {
  const [requests, setRequests]       = useState<LeaveReq[]>(mockLeaveRequests as LeaveReq[]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: string; action: "Approved" | "Rejected" } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toasts, setToasts]           = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage["type"], message: string) =>
      setToasts((t) => [...t, { id: `${Date.now()}-${Math.random()}`, type, message }]),
    [],
  );
  const removeToast = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  function askAction(id: string, action: "Approved" | "Rejected") {
    setPendingAction({ id, action });
    setRejectReason("");
    setConfirmOpen(true);
  }

  function confirmAction() {
    if (!pendingAction) return;
    if (pendingAction.action === "Rejected" && !rejectReason.trim()) {
      addToast("error", "Please enter a reason for rejection.");
      return;
    }
    setRequests((rs) =>
      rs.map((r) => r.id === pendingAction.id ? { ...r, status: pendingAction.action } : r),
    );
    addToast(
      pendingAction.action === "Approved" ? "success" : "warning",
      `Leave request ${pendingAction.action.toLowerCase()} successfully.`,
    );
    setConfirmOpen(false);
    setPendingAction(null);
  }

  const pending  = requests.filter((r) => r.status === "Pending").length;
  const approved = requests.filter((r) => r.status === "Approved").length;
  const totalDays = requests.reduce((s, r) => s + r.days, 0);

  return (
    <>
      <div className="space-y-5">
        <ScrollReveal variant="fadeDown">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-1">Leave Management</h2>
            <p className="text-sm text-[var(--slate)]">Review and approve officer leave requests.</p>
          </div>
        </ScrollReveal>

        {/* KPIs */}
        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pending",   value: pending,   icon: Clock,        color: "yellow" },
            { label: "Approved",  value: approved,  icon: CheckCircle2, color: "green"  },
            { label: "Total Days",value: totalDays, icon: Calendar,     color: "blue"   },
          ].map((s) => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{ y: -3 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={s.value} /></p>
                  </div>
                  <s.icon size={26} className={`text-${s.color}-600`} />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Request cards */}
        <StaggerParent className="space-y-3">
          {requests.map((req) => (
            <StaggerChild key={req.id}>
              <motion.div
                whileHover={{ x: 3, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }}
                className="card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0">
                      <User size={18} className="text-[var(--green)]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--navy)]">{req.officer}</h4>
                      <p className="text-xs text-[var(--slate)] font-mono">{req.badge}</p>
                    </div>
                  </div>
                  <span className={`badge ${
                    req.status === "Pending"  ? "badge-yellow" :
                    req.status === "Approved" ? "badge-green"  : "badge-pink"
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  {[
                    { label: "Type", value: req.type },
                    { label: "From", value: req.from },
                    { label: "To",   value: req.to   },
                    { label: "Days", value: req.days, bold: true },
                  ].map(({ label, value, bold }) => (
                    <div key={label}>
                      <p className="text-[var(--muted)] text-[10px] mb-0.5 uppercase tracking-wide">{label}</p>
                      <p className={`text-[var(--charcoal)] ${bold ? "font-bold text-[var(--green)] text-lg" : "font-semibold"}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-[var(--slate)] mb-3">
                  <span className="font-semibold text-[var(--charcoal)]">Reason:</span> {req.reason}
                </p>

                {req.status === "Pending" && (
                  <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => askAction(req.id, "Approved")}
                      className="btn-primary flex-1"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => askAction(req.id, "Rejected")}
                      className="btn-secondary flex-1 !border-red-400 !text-red-500 hover:!bg-red-500 hover:!text-white"
                    >
                      <XCircle size={14} /> Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>

      {/* Confirm dialog */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={pendingAction?.action === "Approved" ? "Approve Leave Request" : "Reject Leave Request"}
        size="xs"
        accent={pendingAction?.action === "Approved" ? "green" : "red"}
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--charcoal)]">
            {pendingAction?.action === "Approved"
              ? "Are you sure you want to approve this leave request? This action will be recorded."
              : "Please provide a reason for rejecting this leave request."}
          </p>

          {pendingAction?.action === "Rejected" && (
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1">
                <MessageSquare size={11} /> Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection…"
                className="input h-auto px-3 py-2 resize-none text-sm w-full"
              />
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className={`flex-1 btn-primary ${
                pendingAction?.action === "Rejected"
                  ? "!bg-red-500 hover:!bg-red-600"
                  : ""
              }`}
            >
              {pendingAction?.action === "Approved" ? (
                <><CheckCircle2 size={14} /> Approve</>
              ) : (
                <><XCircle size={14} /> Reject</>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
