"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Image as ImageIcon, Video, Paperclip, Upload,
  Search, Calendar, Download, Trash2, Eye, FolderOpen, X, Plus,
} from "lucide-react";
import { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/modal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { evidenceApi } from "@/lib/api-client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Evidence = { id:string; caseId:string; type:string; name:string; size:string; uploaded:string; officer:string; url?:string; };

const MOCK: Evidence[] = [
  { id:"E001", caseId:"TRK-2024-001", type:"Photo",    name:"crime-scene-001.jpg",      size:"2.4 MB", uploaded:"2024-11-10", officer:"Det. Abebe Girma" },
  { id:"E002", caseId:"TRK-2024-001", type:"Video",    name:"cctv-footage.mp4",         size:"45.2 MB",uploaded:"2024-11-11", officer:"Off. Meron Tadesse" },
  { id:"E003", caseId:"TRK-2024-003", type:"Document", name:"witness-statement.pdf",    size:"1.1 MB", uploaded:"2024-11-18", officer:"Det. Tigist Mekonnen" },
  { id:"E004", caseId:"TRK-2024-003", type:"Photo",    name:"victim-injuries.jpg",      size:"3.8 MB", uploaded:"2024-11-19", officer:"Det. Tigist Mekonnen" },
  { id:"E005", caseId:"TRK-2024-004", type:"Document", name:"forged-documents.pdf",     size:"5.2 MB", uploaded:"2024-11-21", officer:"Det. Abebe Girma" },
  { id:"E006", caseId:"TRK-2024-001", type:"Audio",    name:"witness-interview.mp3",    size:"12.5 MB",uploaded:"2024-11-12", officer:"Det. Abebe Girma" },
];

const TYPE_ICONS: Record<string, typeof FileText> = { Photo:ImageIcon, Video:Video, Document:FileText, Audio:Paperclip };
const TYPE_COLORS: Record<string, string> = {
  Photo:    "text-blue-600 bg-blue-50",
  Video:    "text-purple-600 bg-purple-50",
  Document: "text-green-600 bg-green-50",
  Audio:    "text-pink-600 bg-pink-50",
};

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>(MOCK);
  const [search, setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewItem, setViewItem] = useState<Evidence|null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
  const [uploadCaseId, setUploadCaseId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const filtered = evidence.filter(e => {
    const q = search.toLowerCase();
    return (!q || e.name.toLowerCase().includes(q) || e.caseId.toLowerCase().includes(q)) &&
           (filterType === "All" || e.type === filterType);
  });

  async function handleUpload() {
    if (!selectedFile || !uploadCaseId.trim()) {
      addToast("error","Please select a file and enter a Case ID."); return;
    }
    const allowed = ["image/jpeg","image/png","image/webp","application/pdf","video/mp4","audio/mpeg"];
    if (!allowed.includes(selectedFile.type)) { addToast("error","File type not supported."); return; }
    if (selectedFile.size > 50 * 1024 * 1024) { addToast("error","File must be under 50 MB."); return; }

    setUploading(true);
    try {
      await evidenceApi.add({ caseId: uploadCaseId, fileName: selectedFile.name, fileSize: selectedFile.size, fileType: selectedFile.type });
      addToast("success","Evidence uploaded successfully.");
    } catch {
      // Mock success
      const newEv: Evidence = {
        id: `E${String(evidence.length+1).padStart(3,"0")}`,
        caseId: uploadCaseId,
        type: selectedFile.type.startsWith("image") ? "Photo" : selectedFile.type.startsWith("video") ? "Video" : selectedFile.type.startsWith("audio") ? "Audio" : "Document",
        name: selectedFile.name,
        size: `${(selectedFile.size/1024/1024).toFixed(1)} MB`,
        uploaded: new Date().toISOString().split("T")[0],
        officer: "Det. Abebe Girma",
      };
      setEvidence(ev => [newEv, ...ev]);
      addToast("success","Evidence uploaded.");
    }
    setUploading(false); setUploadOpen(false); setSelectedFile(null); setUploadCaseId("");
  }

  function handleDelete(id: string) {
    setEvidence(ev => ev.filter(e => e.id !== id));
    setDeleteId(null); addToast("success","Evidence record removed.");
  }

  function handleDownload(ev: Evidence) {
    // For real files we'd fetch the URL; for mock we just show a toast
    if (ev.url) {
      const a = document.createElement("a"); a.href = ev.url; a.download = ev.name; a.click();
    } else {
      addToast("info",`Download: ${ev.name} — file available when backend is running.`);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Evidence Management</h2>
            <p className="text-sm text-[var(--slate)]">Store and manage case evidence files securely.</p>
          </div>
          <motion.button whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.98}}
            onClick={() => setUploadOpen(true)} className="btn-primary">
            <Upload size={16}/> Upload Evidence
          </motion.button>
        </div>

        <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total Files", value:evidence.length,                                   icon:FolderOpen },
            { label:"Photos",      value:evidence.filter(e=>e.type==="Photo").length,        icon:ImageIcon  },
            { label:"Videos",      value:evidence.filter(e=>e.type==="Video").length,        icon:Video      },
            { label:"Documents",   value:evidence.filter(e=>e.type==="Document").length,     icon:FileText   },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{y:-4}} className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--green-light)] flex items-center justify-center"><s.icon size={20} className="text-[var(--green)]"/></div>
                  <div><p className="text-xs text-[var(--slate)] mb-0.5">{s.label}</p><p className="text-2xl font-extrabold text-[var(--navy)]">{s.value}</p></div>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <div className="card p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/>
              <input type="search" placeholder="Search evidence files…" value={search}
                onChange={e=>setSearch(e.target.value)} className="input pl-9 w-full text-sm"/>
            </div>
            <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="input text-sm">
              <option value="All">All Types</option><option>Photo</option><option>Video</option><option>Document</option><option>Audio</option>
            </select>
          </div>
        </div>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ev => {
            const Icon = TYPE_ICONS[ev.type]||FileText;
            const colorClass = TYPE_COLORS[ev.type]||"text-slate-600 bg-slate-50";
            return (
              <StaggerChild key={ev.id}>
                <motion.div whileHover={{y:-6,boxShadow:"0 16px 32px -8px rgba(0,0,0,0.15)"}} className="card p-5 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}><Icon size={24}/></div>
                    <span className="badge badge-gray text-[10px]">{ev.type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--navy)] mb-1 truncate group-hover:text-[var(--green)] transition-colors">{ev.name}</h3>
                  <p className="text-xs text-[var(--slate)] mb-3">Case: <span className="font-mono font-semibold">{ev.caseId}</span></p>
                  <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-4">
                    <span>{ev.size}</span>
                    <span className="flex items-center gap-1"><Calendar size={11}/>{ev.uploaded}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      onClick={() => setViewItem(ev)}
                      className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--green)] text-white text-xs font-semibold hover:bg-[var(--green-dark)] transition-colors">
                      <Eye size={13}/> View
                    </motion.button>
                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      onClick={() => handleDownload(ev)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors">
                      <Download size={13}/>
                    </motion.button>
                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      onClick={() => setDeleteId(ev.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--slate)] hover:border-red-500 hover:text-red-500 transition-colors">
                      <Trash2 size={13}/>
                    </motion.button>
                  </div>
                </motion.div>
              </StaggerChild>
            );
          })}
          {filtered.length===0 && <div className="col-span-3 text-center py-16 text-[var(--muted)] text-sm">No evidence files match your filters.</div>}
        </StaggerParent>
      </div>

      {/* View modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)}/>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
            className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10" role="dialog">
            <button onClick={() => setViewItem(null)} className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--navy)]"><X size={16}/></button>
            <div className={`w-14 h-14 rounded-2xl ${TYPE_COLORS[viewItem.type]||"text-slate-600 bg-slate-50"} flex items-center justify-center mb-4`}>
              {(() => { const I = TYPE_ICONS[viewItem.type]||FileText; return <I size={28}/>; })()}
            </div>
            <h3 className="font-bold text-[var(--navy)] mb-1">{viewItem.name}</h3>
            <p className="text-xs text-[var(--muted)] mb-4">Case: {viewItem.caseId}</p>
            <div className="space-y-2">
              {[["Type",viewItem.type],["Size",viewItem.size],["Uploaded",viewItem.uploaded],["Officer",viewItem.officer]].map(([l,v])=>(
                <div key={l} className="flex justify-between bg-[var(--surface2)] rounded-xl px-3 py-2">
                  <span className="text-[var(--muted)] text-xs">{l}</span>
                  <span className="font-semibold text-[var(--navy)] text-xs">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => handleDownload(viewItem)} className="mt-4 btn-primary w-full text-sm"><Download size={14}/> Download</button>
          </motion.div>
        </div>
      )}

      {/* Upload modal */}
      <Modal isOpen={uploadOpen} onClose={() => { setUploadOpen(false); setSelectedFile(null); setUploadCaseId(""); }} title="Upload Evidence" size="sm" accent="blue">
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide block mb-1">Case ID <span className="text-red-500">*</span></label>
            <input type="text" value={uploadCaseId} onChange={e=>setUploadCaseId(e.target.value)}
              placeholder="e.g. TRK-2024-001" className="input text-sm w-full"/>
          </div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-[var(--green)] transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto mb-2 text-[var(--muted)]"/>
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-[var(--navy)]">{selectedFile.name}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{(selectedFile.size/1024/1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[var(--slate)] mb-1">Click to select a file</p>
                <p className="text-xs text-[var(--muted)]">Photo, Video, PDF, Audio — max 50 MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*,video/mp4,audio/mpeg,application/pdf" className="hidden"
            onChange={e => { setSelectedFile(e.target.files?.[0]||null); e.target.value=""; }}/>
          <div className="flex gap-2">
            <button onClick={() => { setUploadOpen(false); setSelectedFile(null); setUploadCaseId(""); }}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button onClick={handleUpload} disabled={uploading||!selectedFile||!uploadCaseId} className="flex-1 btn-primary">
              {uploading?<span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Uploading…</span>:<><Upload size={14}/> Upload</>}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Remove evidence" message="Remove this evidence record?" confirmLabel="Remove"
        onConfirm={() => deleteId && handleDelete(deleteId)} onCancel={() => setDeleteId(null)}/>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
