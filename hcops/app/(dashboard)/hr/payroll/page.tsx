"use client";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, Download, Calendar } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import { mockPayroll } from "@/lib/mock-data/officers";

export default function HRPayrollPage() {
  const totalBasic = mockPayroll.reduce((sum, p) => sum + p.basic, 0);
  const totalNet = mockPayroll.reduce((sum, p) => sum + p.net, 0);

  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Payroll Management</h1>
            <p className="text-sm text-[var(--slate)]">Monthly salary and compensation tracking</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <Download size={16} />
            Export Report
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Officers", value: mockPayroll.length, icon: Users, suffix: "" },
          { label: "Total Basic Salary", value: totalBasic, icon: DollarSign, suffix: " ETB" },
          { label: "Total Net Pay", value: totalNet, icon: TrendingUp, suffix: " ETB" },
        ].map((stat) => (
          <StaggerChild key={stat.label}>
            <motion.div whileHover={{ y: -4 }} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-[var(--navy)]">
                    <CountUp to={stat.value} />
                    {stat.suffix}
                  </p>
                </div>
                <stat.icon size={24} className="text-[var(--green)]" />
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>

      <ScrollReveal variant="fadeUp" delay={0.2}>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface2)] border-b-2 border-[var(--border)]">
                <tr>
                  {["Badge", "Officer", "Rank", "Basic", "Allowance", "Deduction", "Net Pay"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {mockPayroll.map((pay, idx) => (
                  <motion.tr
                    key={pay.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    whileHover={{ backgroundColor: "var(--surface2)" }}
                  >
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--navy)]">{pay.badge}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--navy)]">{pay.officer}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{pay.rank}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--charcoal)]">{pay.basic.toLocaleString()} ETB</td>
                    <td className="px-5 py-4 text-sm text-green-600 font-semibold">+{pay.allowance.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-red-600 font-semibold">-{pay.deduction.toLocaleString()}</td>
                    <td className="px-5 py-4 text-base font-bold text-[var(--green)]">{pay.net.toLocaleString()} ETB</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
