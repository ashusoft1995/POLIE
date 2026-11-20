"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, MapPin, Calendar, AlertCircle, User, FileText } from "lucide-react";

interface NewCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: any) => void;
}

export default function NewCaseForm({ isOpen, onClose, onSubmit }: NewCaseFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    crimeType: "",
    location: "",
    reportedDate: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    description: "",
    reporterName: "",
    reporterContact: "",
    assignedDetective: "",
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      reportedDate: new Date().toISOString().split("T")[0],
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim())     { alert("Case title is required.");    return; }
    if (!formData.crimeType)        { alert("Crime type is required.");     return; }
    if (!formData.location.trim())  { alert("Location is required.");       return; }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      alert("Description must be at least 10 characters."); return;
    }

    const year = new Date().getFullYear();
    const num  = String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
    onSubmit({
      ...formData,
      id: `C${Date.now()}`,
      trackingId: `TRK-${year}-${num}`,
      status: "Open",
      closureRequested: false,
    });

    // Reset form
    setFormData({
      title: "",
      crimeType: "",
      location: "",
      reportedDate: new Date().toISOString().split("T")[0],
      priority: "Medium",
      description: "",
      reporterName: "",
      reporterContact: "",
      assignedDetective: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-3xl my-8"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">File New Case</h3>
                  <p className="text-xs text-blue-100">Create a new crime case record</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Case Details */}
              <div>
                <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide mb-3">Case Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Case Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Brief description of the incident"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Crime Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.crimeType}
                      onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
                      className="input"
                    >
                      <option value="">Select type...</option>
                      <option value="Theft">Theft</option>
                      <option value="Robbery">Robbery</option>
                      <option value="Assault">Assault</option>
                      <option value="Fraud">Fraud</option>
                      <option value="Vandalism">Vandalism</option>
                      <option value="Drug Offence">Drug Offence</option>
                      <option value="Homicide">Homicide</option>
                      <option value="Burglary">Burglary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="input"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Incident location"
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Date Reported <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="date"
                        required
                        value={formData.reportedDate}
                        onChange={(e) => setFormData({ ...formData, reportedDate: e.target.value })}
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Case Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of the incident..."
                      rows={4}
                      className="input min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Reporter Information */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide mb-3">Reporter Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Reporter Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={formData.reporterName}
                        onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                        placeholder="Full name"
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={formData.reporterContact}
                      onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
                      placeholder="+251 XXX XXX XXX"
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide mb-3">Assignment (Optional)</h4>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                    Assign to Detective
                  </label>
                  <select
                    value={formData.assignedDetective}
                    onChange={(e) => setFormData({ ...formData, assignedDetective: e.target.value })}
                    className="input"
                  >
                    <option value="">Unassigned</option>
                    <option value="Det. Abebe Girma">Det. Abebe Girma</option>
                    <option value="Det. Tigist Mekonnen">Det. Tigist Mekonnen</option>
                    <option value="Det. Lemlem Haile">Det. Lemlem Haile</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <AlertCircle size={14} />
                  <span>All fields marked with * are required</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] font-semibold text-sm hover:border-[#CBD5E1] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-semibold text-sm flex items-center gap-2 transition-colors"
                  >
                    <Save size={16} />
                    Create Case
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

