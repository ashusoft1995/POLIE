"use client";
import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer, { ToastMessage, useAutoDismiss } from "@/components/ui/Toast";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import NewCaseForm from "@/components/dashboard/NewCaseForm";
import { mockCases } from "@/lib/mock-data/cases";
import type { CrimeCase, CaseStatus, Priority } from "@/types";

const PAGE_SIZE = 5;

export default function CasesPage() {
  const [cases, setCases] = useState<CrimeCase[]>(mockCases);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [page, setPage] = useState(1);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [viewCase, setViewCase] = useState<CrimeCase | null>(null);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    setToasts((t) => [...t, { id: Date.now().toString(), type, message }]);
  }, []);
  const removeToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  useAutoDismiss(toasts, removeToast);

  const handleNewCase = useCallback((caseData: CrimeCase) => {
    setCases((prev) => [caseData, ...prev]);
    setShowNewCaseForm(false);
    addToast("success", `Case ${caseData.trackingId} created successfully!`);
  }, [addToast]);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.trackingId.toLowerCase().includes(q) ||
        c.crimeType.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchPriority = priorityFilter === "All" || c.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [cases, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDelete(id: string) {
    setCases((prev) => prev.filter((c) => c.id !== id));
    setToDeleteId(null);
    addToast("success", "Case record removed from the local list.");
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Case Management</h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              All reported cases — search, filter, and review assignments.
            </p>
          </div>
          <button
            onClick={() => setShowNewCaseForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus size={15} />
            New Case
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 flex-1 min-w-[200px]">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="search"
              placeholder="Search by title, ID, type, location…"
              aria-label="Search cases"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-[#334155] placeholder-slate-400 outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={13} className="text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-9 bg-white">
            <Filter size={13} className="text-slate-400" />
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as CaseStatus | "All"); setPage(1); }}
              className="text-sm text-[#334155] bg-transparent outline-none"
            >
              <option value="All">All Statuses</option>
              <option>Open</option>
              <option>Under Investigation</option>
              <option>Pending Closure</option>
              <option>Closed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-9 bg-white">
            <Filter size={13} className="text-slate-400" />
            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value as Priority | "All"); setPage(1); }}
              className="text-sm text-[#334155] bg-transparent outline-none"
            >
              <option value="All">All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <ScrollReveal variant="fadeUp" delay={0.05}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">Tracking ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Case Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#94A3B8] text-sm">
                      No cases match your current filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[#16A34A] font-medium whitespace-nowrap">{c.trackingId}</td>
                      <td className="px-4 py-3 font-medium text-[#1E293B] max-w-[220px]">
                        <div className="truncate">{c.title}</div>
                        <div className="text-xs text-[#64748B] truncate">{c.location}</div>
                      </td>
                      <td className="px-4 py-3 text-[#64748B] whitespace-nowrap hidden md:table-cell">{c.crimeType}</td>
                      <td className="px-4 py-3 text-[#64748B] whitespace-nowrap hidden lg:table-cell">{c.reportedDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><StatusBadge label={c.status} /></td>
                      <td className="px-4 py-3 whitespace-nowrap"><StatusBadge label={c.priority} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewCase(c)}
                            aria-label={`View details for ${c.title}`}
                            title="View details"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#16A34A] hover:bg-green-50 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => addToast("info", `Edit form for case ${c.trackingId} — coming soon.`)}
                            aria-label={`Edit case ${c.title}`}
                            title="Edit case"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#FACC15] hover:bg-yellow-50 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setToDeleteId(c.id)}
                            aria-label={`Delete case ${c.title}`}
                            title="Delete case"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-[#64748B]">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} cases
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E293B] hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                    ${p === page ? "bg-[#16A34A] text-white" : "text-[#64748B] hover:bg-slate-100"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E293B] hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
        </ScrollReveal>
      </div>

      {/* View modal */}
      {viewCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewCase(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-label={`Case details: ${viewCase.title}`}
          >
            <button
              onClick={() => setViewCase(null)}
              aria-label="Close"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-[#1E293B] pr-6">{viewCase.title}</h3>
            <p className="text-xs font-mono text-[#16A34A] mt-0.5">{viewCase.trackingId}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Crime Type", viewCase.crimeType],
                ["Reported Date", viewCase.reportedDate],
                ["Location", viewCase.location],
                ["Assigned Detective", viewCase.assignedDetective ?? "Unassigned"],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-[#64748B] mb-0.5">{label}</p>
                  <p className="font-medium text-[#1E293B]">{val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <StatusBadge label={viewCase.status} />
              <StatusBadge label={viewCase.priority} />
            </div>
            {viewCase.closureRequested && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-[#92400E]">
                <strong>Closure requested.</strong> {viewCase.closureReason}
              </div>
            )}
          </motion.div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDeleteId}
        title="Delete case record"
        message="This will permanently remove the case from the local list. This action cannot be undone."
        confirmLabel="Delete Case"
        onConfirm={() => toDeleteId && handleDelete(toDeleteId)}
        onCancel={() => setToDeleteId(null)}
      />
      <NewCaseForm
        isOpen={showNewCaseForm}
        onClose={() => setShowNewCaseForm(false)}
        onSubmit={handleNewCase}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
