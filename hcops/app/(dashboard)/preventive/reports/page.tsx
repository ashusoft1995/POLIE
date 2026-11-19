"use client";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";

const mockReports = [
  { id: "R001", title: "Monthly Criminal Activity Report", type: "Monthly", date: "2024-11-01", generated: "2024-11-02" },
  { id: "R002", title: "Custody Records Summary", type: "Weekly", date: "2024-11-20", generated: "2024-11-21" },
  { id: "R003", title: "Transfer and Forward Report", type: "Quarterly", date: "2024-10-01", generated: "2024-10-05" },
];

export default function PreventiveReportsPage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Reports & Analytics</h1>
            <p className="text-sm text-[var(--slate)]">Generate and download operational reports</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <FileText size={16} />
            Generate Report
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: mockReports.length, icon: FileText },
          { label: "This Month", value: 2, icon: Calendar },
          { label: "Downloads", value: 45, icon: TrendingUp },
        ].map((stat) => (
          <StaggerChild key={stat.label}>
            <motion.div whileHover={{ y: -4 }} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={stat.value} /></p>
                </div>
                <stat.icon size={24} className="text-[var(--green)]" />
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>

      <StaggerParent className="space-y-3">
        {mockReports.map((rep) => (
          <StaggerChild key={rep.id}>
            <motion.div whileHover={{ x: 4, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
                    <FileText size={20} className="text-[var(--green)]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{rep.title}</h4>
                    <p className="text-xs text-[var(--slate)]">
                      {rep.type} · Generated on {rep.generated}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  <Download size={14} />
                  Download
                </motion.button>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
