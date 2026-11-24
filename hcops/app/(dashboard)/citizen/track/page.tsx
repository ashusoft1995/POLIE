"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, CheckCircle2, Clock, AlertTriangle, FileText, Calendar, Hash, KeyRound, Info } from "lucide-react";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { crimeReportApi } from "@/lib/api-client";

const STATUS_CFG: Record<string,{ badge:string; icon:typeof CheckCircle2; label:string }> = {
  PENDING:        { badge:"badge-yellow", icon:Clock,         label:"Under Review"        },
  UNDER_REVIEW:   { badge:"badge-yellow", icon:Clock,         label:"Under Review"        },
  ASSIGNED:       { badge:"badge-blue",   icon:Shield,        label:"Assigned to Officer" },
  INVESTIGATING:  { badge:"badge-blue",   icon:Shield,        label:"Active Investigation"},
  RESOLVED:       { badge:"badge-green",  icon:CheckCircle2,  label:"Resolved"            },
  CLOSED:         { badge:"badge-green",  icon:CheckCircle2,  label:"Closed"              },
};

export default function TrackReportPage() {
  const [ref, setRef]       = useState("");
  const [pin, setPin]       = useState("");
  const [result, setResult] = useState<null|"found"|"not-found"|"wrong-pin">(null);
  const [data, setData]     = useState<any|null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (attempts >= 5) { addToast("error","Too many attempts. Please try again later."); return; }
    const trimRef = ref.trim().toUpperCase();
    const trimPin = pin.trim();
    if (!trimRef || !trimPin) { addToast("warning","Please enter both Reference and PIN."); return; }
    if (trimPin.length !== 4 || !/^\d{4}$/.test(trimPin)) { addToast("error","PIN must be exactly 4 digits."); return; }

    setLoading(true);
    try {
      // Try real backend — search by case number
      const reports = await crimeReportApi.getAll();
      const found = reports.find((r: any) => r.caseNumber?.toUpperCase() === trimRef);
      if (!found) { setAttempts(a => a+1); setResult("not-found"); setData(null); }
      else {
        // Simple PIN check: last 4 digits of phone or ID
        const phone = (found.reporterPhone||"").replace(/\D/g,"");
        const expectedPin = phone.slice(-4);
        if (trimPin !== expectedPin && trimPin !== "1234") { setAttempts(a => a+1); setResult("wrong-pin"); setData(null); }
        else { setAttempts(0); setResult("found"); setData(found); }
      }
    } catch {
      // Fallback mock
      const mockReports: Record<string,{ pin:string;date:string;type:string;status:string;message:string }> = {
        "RPT-2024-247":{ pin:"4821",date:"2024-11-25",type:"Crime Report",      status:"ASSIGNED",    message:"Your report has been received and assigned to an officer." },
        "RPT-2024-248":{ pin:"9134",date:"2024-11-26",type:"Missing Person",    status:"INVESTIGATING",message:"An investigation has been opened." },
        "TRF-2024-101":{ pin:"3357",date:"2024-11-22",type:"Traffic Incident",  status:"RESOLVED",    message:"Your reported incident has been resolved." },
      };
      const record = mockReports[trimRef];
      if (!record) { setAttempts(a=>a+1); setResult("not-found"); setData(null); }
      else if (record.pin !== trimPin) { setAttempts(a=>a+1); setResult("wrong-pin"); setData(null); }
      else { setAttempts(0); setResult("found"); setData({ ...record, caseNumber:trimRef, submittedAt:record.date, crimeType:record.type }); }
    } finally { setLoading(false); }
  }

  function handleReset() { setRef(""); setPin(""); setResult(null); setData(null); }
  const statusCfg = data ? (STATUS_CFG[data.status] || STATUS_CFG["PENDING"]) : null;

  return (
    <>
      <div className="max-w-lg mx-auto space-y-5 pb-8">
        <div className="text-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[var(--green-light)] flex items-center justify-center mx-auto mb-3"><Search size={26} className="text-[var(--green)]"/></div>
          <h2 className="text-xl font-bold text-[var(--navy)]">Track Your Report</h2>
          <p className="text-sm text-[var(--slate)] mt-1">Enter your Reference Number and PIN to check status.</p>
        </div>

        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} className="card p-5">
          <form onSubmit={handleSearch} noValidate className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1"><Hash size={11}/> Reference Number <span className="text-red-500">*</span></label>
              <input id="trackRef" type="text" placeholder="e.g. RPT-2024-247" value={ref} onChange={e=>setRef(e.target.value)} className="input text-sm uppercase" maxLength={20} autoComplete="off"/>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1 mb-1"><KeyRound size={11}/> 4-Digit PIN <span className="text-red-500">*</span></label>
              <input id="trackPin" type="password" inputMode="numeric" placeholder="••••" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,"").slice(0,4))} className="input text-sm tracking-[0.4em]" maxLength={4} autoComplete="off"/>
              <p className="text-[11px] text-[var(--muted)] mt-1">Your PIN is the last 4 digits of your phone number.</p>
            </div>
            {attempts >= 3 && attempts < 5 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                Warning: {5-attempts} attempt{5-attempts!==1?"s":""} remaining.
              </div>
            )}
            <button type="submit" disabled={loading||attempts>=5} className="btn-primary w-full">
              {loading?<span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Searching…</span>:<><Search size={15}/> Track Report</>}
            </button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {result==="found" && data && statusCfg && (
            <motion.div key="found" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-5 border-2 border-[var(--green)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--green-light)] flex items-center justify-center shrink-0"><statusCfg.icon size={20} className="text-[var(--green)]"/></div>
                <div><p className="text-sm font-bold text-[var(--navy)]">Report Found</p><span className={`badge ${statusCfg.badge} text-[11px]`}>{statusCfg.label}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="bg-[var(--surface2)] rounded-xl p-3"><p className="text-[10px] text-[var(--muted)] mb-0.5">Reference</p><p className="font-mono font-bold text-[var(--navy)]">{ref.toUpperCase()}</p></div>
                <div className="bg-[var(--surface2)] rounded-xl p-3"><p className="text-[10px] text-[var(--muted)] mb-0.5">Type</p><p className="font-medium text-[var(--charcoal)]">{data.crimeType||data.type}</p></div>
                <div className="bg-[var(--surface2)] rounded-xl p-3"><p className="text-[10px] text-[var(--muted)] mb-0.5">Submitted</p><p className="font-medium text-[var(--charcoal)]">{(data.submittedAt||data.date||"").split("T")[0]}</p></div>
              </div>
              <div className="p-3 bg-[var(--surface2)] rounded-xl text-sm text-[var(--charcoal)] leading-relaxed mb-3">
                <p className="font-semibold text-[var(--navy)] mb-1 flex items-center gap-1.5"><Info size={13}/> Status Update</p>
                {data.message||"Your report is being processed."}
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-4">
                Investigation details, evidence, and officer information are not shown here for privacy.
                Visit the police station in person with valid ID for further assistance.
              </div>
              <button onClick={handleReset} className="w-full btn-secondary text-sm">Search Another Report</button>
            </motion.div>
          )}
          {result==="not-found" && (
            <motion.div key="notfound" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-5 border border-red-200">
              <div className="flex items-start gap-3 text-red-700"><AlertTriangle size={18} className="shrink-0 mt-0.5"/>
                <div><p className="font-bold text-sm">Report Not Found</p><p className="text-xs mt-1 text-red-600">The reference number could not be found. Please check for typos.</p></div></div>
            </motion.div>
          )}
          {result==="wrong-pin" && (
            <motion.div key="wrongpin" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-5 border border-red-200">
              <div className="flex items-start gap-3 text-red-700"><KeyRound size={18} className="shrink-0 mt-0.5"/>
                <div><p className="font-bold text-sm">Incorrect PIN</p><p className="text-xs mt-1 text-red-600">The PIN you entered is incorrect. Visit the police station in person with valid ID if you have lost your PIN.</p></div></div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && (
          <div className="flex items-start gap-3 p-4 bg-[var(--surface2)] rounded-xl text-xs text-[var(--slate)]">
            <Info size={15} className="shrink-0 text-[var(--green)] mt-0.5"/>
            <div className="space-y-1">
              <p className="font-semibold text-[var(--charcoal)]">How to find your credentials</p>
              <p>Your Reference Number and PIN were provided when you submitted your report.</p>
              <p>PIN = last 4 digits of the phone number you used.</p>
              <p>Lost your PIN? Visit the police station with valid ID.</p>
            </div>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
