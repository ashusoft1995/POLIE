"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Save, MapPin, Calendar, User, FileText,
  AlertCircle, ChevronDown,
} from "lucide-react";

interface NewCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: any) => void;
}

type FormData = {
  title: string;
  crimeType: string;
  location: string;
  reportedDate: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  reporterName: string;
  reporterContact: string;
  assignedDetective: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = {
  title: "", crimeType: "", location: "",
  reportedDate: new Date().toISOString().split("T")[0],
  priority: "Medium", description: "",
  reporterName: "", reporterContact: "", assignedDetective: "",
};

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1 text-[11px] text-red-500 font-medium mt-0.5"
        >
          <AlertCircle size={11} className="shrink-0" />
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1.5 mb-3">
      {children}
    </p>
  );
}

export default function NewCaseForm({ isOpen, onClose, onSubmit }: NewCaseFormProps) {
  const [formData, setFormData] = useState<FormData>({ ...EMPTY });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) setFormData({ ...EMPTY, reportedDate: new Date().toISOString().split("T")[0] });
    setErrors({});
  }, [isOpen]);

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c = { ...e }; delete c[field]; return c; });
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!formData.title.trim()) e.title = "Case title is required.";
    if (!formData.crimeType) e.crimeType = "Select a crime type.";
    if (!formData.location.trim()) e.location = "Location is required.";
    if (!formData.description.trim() || formData.description.trim().length < 10)
      e.description = "Description must be at least 10 characters.";
    return e;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const year = new Date().getFullYear();
    const num  = String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
    onSubmit({
      ...formData,
      id: `C${Date.now()}`,
      trackingId: `TRK-${year}-${num}`,
      status: "Open",
      closureRequested: false,
    });
  };

  /* shared input style helper */
  const inputCls = (field: keyof FormData) =>
    `input text-sm ${errors[field] ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.15)]" : ""}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-[3px] z-50 flex items-end sm:items-center justify-center sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 440, damping: 34, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[540px] bg-[var(--card-bg)] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden"
            style={{ maxHeight: "92dvh" }}
          >
            {/* Accent bar */}
            <div className="h-[3px] w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface2)]/50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <FileText size={14} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--navy)]">File New Case</h3>
                  <p className="text-[11px] text-[var(--muted)]">Create a new crime case record</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="w-7 h-7 rounded-lg text-[var(--muted)] hover:text-[var(--navy)] hover:bg-[var(--border)] flex items-center justify-center transition-colors"
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Scrollable form body */}
            <div
              className="overflow-y-auto px-5 py-5 space-y-5"
              style={{
                maxHeight: "calc(92dvh - 130px)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--border) transparent",
              }}
            >
              {/* Case Details */}
              <div>
                <SectionLabel>Case Details</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Title — full width */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">
                      Case Title <span className="text-red-500">*</span>
                    </label>
                    <input type="text" placeholder="Brief description of the incident"
                      value={formData.title} onChange={e => set("title", e.target.value)}
                      className={inputCls("title")} />
                    <FieldError msg={errors.title} />
                  </div>

                  {/* Crime Type */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">
                      Crime Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select value={formData.crimeType} onChange={e => set("crimeType", e.target.value)}
                        className={`${inputCls("crimeType")} appearance-none pr-9`}>
                        <option value="">Select type…</option>
                        {["Theft","Robbery","Assault","Fraud","Vandalism","Drug Offence","Homicide","Burglary","Other"]
                          .map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    </div>
                    <FieldError msg={errors.crimeType} />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {(["High","Medium","Low"] as const).map(p => (
                        <motion.button
                          key={p} type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => set("priority", p)}
                          className={`flex-1 h-[46px] rounded-[10px] text-xs font-bold border-[1.5px] transition-all duration-150 ${
                            formData.priority === p
                              ? p === "High"   ? "bg-red-50 border-red-400 text-red-600 dark:bg-red-900/20"
                              : p === "Medium" ? "bg-amber-50 border-amber-400 text-amber-600 dark:bg-amber-900/20"
                              :                  "bg-green-50 border-green-400 text-green-600 dark:bg-green-900/20"
                              : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--slate)]"
                          }`}
                        >
                          {p}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                      <input type="text" placeholder="Incident location"
                        value={formData.location} onChange={e => set("location", e.target.value)}
                        className={`${inputCls("location")} pl-9`} />
                    </div>
                    <FieldError msg={errors.location} />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">
                      Date Reported <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                      <input type="date"
                        value={formData.reportedDate} onChange={e => set("reportedDate", e.target.value)}
                        className={`${inputCls("reportedDate")} pl-9`} />
                    </div>
                  </div>

                  {/* Description — full width */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea rows={3} placeholder="Detailed description of the incident…"
                      value={formData.description} onChange={e => set("description", e.target.value)}
                      className={`input text-sm resize-none h-auto py-2.5 ${errors.description ? "border-red-400" : ""}`} />
                    <FieldError msg={errors.description} />
                  </div>
                </div>
              </div>

              {/* Reporter */}
              <div>
                <SectionLabel>Reporter Information</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">Reporter Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                      <input type="text" placeholder="Full name"
                        value={formData.reporterName} onChange={e => set("reporterName", e.target.value)}
                        className="input text-sm pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">Contact Number</label>
                    <input type="tel" placeholder="+251 XXX XXX XXX"
                      value={formData.reporterContact} onChange={e => set("reporterContact", e.target.value)}
                      className="input text-sm" />
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div>
                <SectionLabel>Assignment (Optional)</SectionLabel>
                <div>
                  <label className="block text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1.5">Assign to Detective</label>
                  <div className="relative">
                    <select value={formData.assignedDetective} onChange={e => set("assignedDetective", e.target.value)}
                      className="input text-sm appearance-none pr-9">
                      <option value="">Unassigned</option>
                      <option value="Det. Abebe Girma">Det. Abebe Girma</option>
                      <option value="Det. Tigist Mekonnen">Det. Tigist Mekonnen</option>
                      <option value="Det. Lemlem Haile">Det. Lemlem Haile</option>
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions — sticky */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-[var(--border)] bg-[var(--surface2)]/40">
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                <AlertCircle size={12} />
                Fields marked <span className="text-red-500 font-bold">*</span> are required
              </div>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-4 h-9 rounded-xl border border-[var(--border)] text-[var(--slate)] font-semibold text-sm hover:bg-[var(--surface2)] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit as any}
                  className="px-5 h-9 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-blue-500/30 hover:shadow-md"
                >
                  <Save size={14} />
                  Create Case
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
