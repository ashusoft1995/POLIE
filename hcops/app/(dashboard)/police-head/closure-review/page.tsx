"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Eye, FileText, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ToastContainer, { ToastMessage, useAutoDismiss } from "@/components/ui/toast";
import { mockClosureRequests } from "@/lib/mock-data/cases";
import type { ClosureRequest } from "@/types";

export default function ClosureReviewPage() {
  const [requests, setRequests] = useState<ClosureRequest[]>(mockClosureRequests);
  const [expanded, setExpanded] = useState<string | null>(mockClosureRequests[0]?.id ?? null);
  const [actionType, setActionType] = useState<Record<string, "approve" | "reject" | null>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    const id = Date.now().toString();
    setToasts((t) => [...t, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useAutoDismiss(toasts, removeToast);

  function handleAction(requestId: string) {
    const type = actionType[requestId];
    if (!type) return;
    if (type === "reject" && !reasons[requestId]?.trim()) return;

    setSubmitting(requestId);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: type === "approve" ? "Approved" : "Rejected" }
            : r
        )
      );
      setSubmitting(null);
      setExpanded(null);
      addToast(
        type === "approve" ? "success" : "error",
        type === "approve"
          ? `Closure approved — case has been officially closed.`
          : `Closure rejected — detective has been notified to continue investigation.`
      );
    }, 700);
  }

  const pending = requests.filter((r) => r.status === "Pending");
  const resolved = requests.filter((r) => r.status !== "Pending");

  return (
    <>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">Case Closure Review</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Detectives have submitted the following cases for closure. Review the evidence and notes, then approve or reject with a reason.
          </p>
        </div>

        {/* Summary */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-xl text-xs font-medium text-[#CA8A04]">
            <AlertCircle size={14} />
            {pending.length} pending review{pending.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs font-medium text-[#16A34A]">
            <CheckCircle size={14} />
            {resolved.filter((r) => r.status === "Approved").length} approved
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
            <XCircle size={14} />
            {resolved.filter((r) => r.status === "Rejected").length} rejected
          </div>
        </div>

        {/* Pending requests */}
        {pending.length === 0 && (
          <div className="card p-10 text-center">
            <CheckCircle size={36} className="mx-auto text-[#16A34A] mb-3" />
            <p className="font-semibold text-[#1E293B]">No pending closure requests</p>
            <p className="text-sm text-[#64748B] mt-1">All submitted requests have been reviewed.</p>
          </div>
        )}

        {pending.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            {/* Request header */}
            <button
              onClick={() => setExpanded((e) => (e === req.id ? null : req.id))}
              className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-slate-50 transition-colors"
              aria-expanded={expanded === req.id}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-yellow-50 shrink-0">
                  <FileText size={18} className="text-[#CA8A04]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1E293B] truncate">{req.caseTitle}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Requested by <span className="font-medium">{req.detective}</span> · {req.requestDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge label={req.status} />
                {expanded === req.id ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {expanded === req.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
                    {/* Summary */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                        Detective's Summary
                      </p>
                      <p className="text-sm text-[#334155] leading-relaxed bg-slate-50 rounded-xl p-3">
                        {req.summary}
                      </p>
                    </div>

                    {/* Evidence list */}
                    <div>
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                        Attached Evidence ({req.evidence.length} items)
                      </p>
                      <ul className="space-y-1.5">
                        {req.evidence.map((ev, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-[#334155] bg-slate-50 rounded-lg px-3 py-2"
                          >
                            <Eye size={13} className="text-[#16A34A] shrink-0" />
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Decision */}
                    <div>
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                        Your Decision
                      </p>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() =>
                            setActionType((a) => ({
                              ...a,
                              [req.id]: a[req.id] === "approve" ? null : "approve",
                            }))
                          }
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all
                            ${actionType[req.id] === "approve"
                              ? "bg-[#16A34A] text-white border-[#16A34A]"
                              : "border-slate-200 text-[#334155] hover:border-[#16A34A] hover:text-[#16A34A]"
                            }`}
                        >
                          <CheckCircle size={15} />
                          Approve Closure
                        </button>
                        <button
                          onClick={() =>
                            setActionType((a) => ({
                              ...a,
                              [req.id]: a[req.id] === "reject" ? null : "reject",
                            }))
                          }
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all
                            ${actionType[req.id] === "reject"
                              ? "bg-red-500 text-white border-red-500"
                              : "border-slate-200 text-[#334155] hover:border-red-400 hover:text-red-500"
                            }`}
                        >
                          <XCircle size={15} />
                          Reject Request
                        </button>
                      </div>

                      {/* Reason field — required for reject, optional for approve */}
                      {actionType[req.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <label
                            htmlFor={`reason-${req.id}`}
                            className="block text-xs font-medium text-[#334155] mb-1"
                          >
                            {actionType[req.id] === "reject"
                              ? "Reason for rejection (required)"
                              : "Approval note (optional)"}
                            {actionType[req.id] === "reject" && (
                              <span aria-hidden className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                          <textarea
                            id={`reason-${req.id}`}
                            rows={3}
                            value={reasons[req.id] ?? ""}
                            onChange={(e) =>
                              setReasons((r) => ({ ...r, [req.id]: e.target.value }))
                            }
                            placeholder={
                              actionType[req.id] === "reject"
                                ? "Explain why this closure request is being rejected and what further action is required…"
                                : "Add a note to accompany the approval…"
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] resize-none transition"
                          />
                          <button
                            onClick={() => handleAction(req.id)}
                            disabled={
                              submitting === req.id ||
                              (actionType[req.id] === "reject" && !reasons[req.id]?.trim())
                            }
                            className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                              ${actionType[req.id] === "approve"
                                ? "bg-[#16A34A] hover:bg-[#15803D] text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                              }`}
                          >
                            {submitting === req.id ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Processing…
                              </>
                            ) : actionType[req.id] === "approve" ? (
                              <>
                                <CheckCircle size={14} />
                                Confirm Approval
                              </>
                            ) : (
                              <>
                                <XCircle size={14} />
                                Confirm Rejection
                              </>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Resolved requests */}
        {resolved.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-3">
              Previously Resolved
            </h3>
            <div className="space-y-2">
              {resolved.map((req) => (
                <div
                  key={req.id}
                  className="card px-5 py-3 flex items-center justify-between gap-3 opacity-70"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] truncate">{req.caseTitle}</p>
                    <p className="text-xs text-[#64748B]">{req.detective} · {req.requestDate}</p>
                  </div>
                  <StatusBadge label={req.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
