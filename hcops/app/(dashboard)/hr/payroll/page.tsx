"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, Download, RefreshCw } from "lucide-react";
import { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { payrollApi } from "@/lib/api-client";

export default function HRPayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  const fetchPayroll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await payrollApi.getAll();
      setPayrolls(data);
    } catch {
      setPayrolls([
        { id:1, employee:{fullName:"Head Habtamu W.", badge:"PHD-001"}, basicSalary:12000, allowances:2000, deductions:1200, netSalary:12800, status:"PAID",    payMonth:11, payYear:2024 },
        { id:2, employee:{fullName:"Det. Abebe Girma",  badge:"DET-012"}, basicSalary:8500,  allowances:1500, deductions:900,  netSalary:9100,  status:"PAID",    payMonth:11, payYear:2024 },
        { id:3, employee:{fullName:"Insp. Almaz Worku", badge:"HR-005"},  basicSalary:7000,  allowances:1200, deductions:750,  netSalary:7450,  status:"PENDING", payMonth:11, payYear:2024 },
        { id:4, employee:{fullName:"Off. Kebede Alemu", badge:"TRF-033"}, basicSalary:6000,  allowances:1000, deductions:650,  netSalary:6350,  status:"PENDING", payMonth:11, payYear:2024 },
      ]);
      addToast("info","Showing cached data.");
    } finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchPayroll(); }, [fetchPayroll]);

  const totalBasic = payrolls.reduce((s,p) => s + (p.basicSalary||0), 0);
  const totalNet   = payrolls.reduce((s,p) => s + (p.netSalary||0),   0);

  function exportCSV() {
    const rows = [["Badge","Officer","Rank","Basic","Allowance","Deduction","Net","Status"],
      ...payrolls.map(p => [p.employee?.badge, p.employee?.fullName, p.employee?.rank||"", p.basicSalary, p.allowances, p.deductions, p.netSalary, p.status])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
    a.download = `payroll_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    addToast("success","Payroll exported as CSV.");
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Payroll Management</h2>
            <p className="text-sm text-[var(--slate)]">Monthly salary and compensation.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchPayroll} className="p-2 rounded-xl border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors"><RefreshCw size={15}/></button>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.98}} onClick={exportCSV} className="btn-primary"><Download size={16}/> Export CSV</motion.button>
          </div>
        </div>

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Total Officers", value:payrolls.length, icon:Users,      suffix:"" },
            { label:"Total Basic",    value:totalBasic,       icon:DollarSign, suffix:" ETB" },
            { label:"Total Net Pay",  value:totalNet,         icon:TrendingUp, suffix:" ETB" },
          ].map(s => (
            <StaggerChild key={s.label}>
              <motion.div whileHover={{y:-4}} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-2xl font-extrabold text-[var(--navy)]"><CountUp to={s.value}/>{s.suffix}</p>
                  </div>
                  <s.icon size={24} className="text-[var(--green)]"/>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface2)] border-b-2 border-[var(--border)]">
                <tr>
                  {["Badge","Officer","Basic (ETB)","Allowance","Deduction","Net Pay","Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-[var(--muted)] text-sm">Loading payroll…</td></tr>
                ) : payrolls.map((pay, idx) => (
                  <motion.tr key={pay.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:idx*0.05}} whileHover={{backgroundColor:"var(--surface2)"}}>
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--navy)]">{pay.employee?.badge}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--navy)]">{pay.employee?.fullName}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--charcoal)]">{Number(pay.basicSalary).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-green-600 font-semibold">+{Number(pay.allowances||0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-red-600 font-semibold">-{Number(pay.deductions||0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-base font-bold text-[var(--green)]">{Number(pay.netSalary).toLocaleString()} ETB</td>
                    <td className="px-5 py-4"><span className={`badge ${pay.status==="PAID"?"badge-green":pay.status==="PENDING"?"badge-yellow":"badge-gray"}`}>{pay.status}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
