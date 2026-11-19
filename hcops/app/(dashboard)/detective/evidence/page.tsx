"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Image as ImageIcon, Video, Paperclip, Upload,
  Search, Filter, Calendar, Download, Trash2, Eye, FolderOpen,
} from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";

const mockEvidence = [
  { id: "E001", caseId: "TRK-2024-001", type: "Photo", name: "crime-scene-001.jpg", size: "2.4 MB", uploaded: "2024-11-10", officer: "Det. Abebe Girma" },
  { id: "E002", caseId: "TRK-2024-001", type: "Video", name: "cctv-footage.mp4", size: "45.2 MB", uploaded: "2024-11-11", officer: "Off. Meron Tadesse" },
  { id: "E003", caseId: "TRK-2024-003", type: "Document", name: "witness-statement.pdf", size: "1.1 MB", uploaded: "2024-11-18", officer: "Det. Tigist Mekonnen" },
  { id: "E004", caseId: "TRK-2024-003", type: "Photo", name: "victim-injuries.jpg", size: "3.8 MB", uploaded: "2024-11-19", officer: "Det. Tigist Mekonnen" },
  { id: "E005", caseId: "TRK-2024-004", type: "Document", name: "forged-documents.pdf", size: "5.2 MB", uploaded: "2024-11-21", officer: "Det. Abebe Girma" },
  { id: "E006", caseId: "TRK-2024-001", type: "Audio", name: "witness-interview.mp3", size: "12.5 MB", uploaded: "2024-11-12", officer: "Det. Abebe Girma" },
];

const TYPE_ICONS = {
  Photo: ImageIcon,
  Video: Video,
  Document: FileText,
  Audio: Paperclip,
};

const TYPE_COLORS = {
  Photo: "text-blue-600 bg-blue-50",
  Video: "text-purple-600 bg-purple-50",
  Document: "text-green-600 bg-green-50",
  Audio: "text-pink-600 bg-pink-50",
};

export default function EvidencePage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = mockEvidence.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.caseId.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || e.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal variant="fadeDown">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Evidence Management</h1>
            <p className="text-sm text-[var(--slate)]">Store and manage case evidence files</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUpload(true)}
            className="btn-primary"
          >
            <Upload size={16} />
            Upload Evidence
          </motion.button>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Files", value: mockEvidence.length, icon: FolderOpen },
          { label: "Photos", value: mockEvidence.filter(e => e.type === "Photo").length, icon: ImageIcon },
          { label: "Videos", value: mockEvidence.filter(e => e.type === "Video").length, icon: Video },
          { label: "Documents", value: mockEvidence.filter(e => e.type === "Document").length, icon: FileText },
        ].map((stat) => (
          <StaggerChild key={stat.label}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12)" }}
              className="card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
                  <stat.icon size={20} className="text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--slate)] mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-[var(--navy)]">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>

      {/* Search & Filter */}
      <ScrollReveal variant="fadeUp" delay={0.2}>
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search evidence files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 w-full"
              />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input">
              <option value="All">All Types</option>
              <option value="Photo">Photo</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
              <option value="Audio">Audio</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Evidence grid */}
      <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ev) => {
          const Icon = TYPE_ICONS[ev.type as keyof typeof TYPE_ICONS];
          const colorClass = TYPE_COLORS[ev.type as keyof typeof TYPE_COLORS];
          return (
            <StaggerChild key={ev.id}>
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 16px 32px -8px rgba(0,0,0,0.15)" }}
                className="card p-5 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <span className="badge badge-gray text-[10px]">{ev.type}</span>
                </div>

                <h3 className="text-sm font-bold text-[var(--navy)] mb-1 truncate group-hover:text-[var(--green)] transition-colors">
                  {ev.name}
                </h3>
                <p className="text-xs text-[var(--slate)] mb-3">Case: <span className="font-mono font-semibold">{ev.caseId}</span></p>

                <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-4">
                  <span>{ev.size}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {ev.uploaded}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--green)] text-white text-xs font-semibold hover:bg-[var(--green-dark)] transition-colors"
                  >
                    <Eye size={13} />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors"
                  >
                    <Download size={13} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--slate)] hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </motion.div>
            </StaggerChild>
          );
        })}
      </StaggerParent>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpload(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-md w-full p-6"
            >
              <h3 className="text-lg font-bold text-[var(--navy)] mb-4">Upload Evidence</h3>
              <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center mb-4 hover:border-[var(--green)] transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto mb-2 text-[var(--muted)]" />
                <p className="text-sm text-[var(--slate)] mb-1">Drag and drop files here or click to browse</p>
                <p className="text-xs text-[var(--muted)]">Max 50MB per file</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowUpload(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button className="btn-primary flex-1">Upload</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
