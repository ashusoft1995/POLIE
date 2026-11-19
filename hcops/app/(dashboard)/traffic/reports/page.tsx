"use client";
import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Car } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";

const mockReports = [
  { id: "TR001", title: "Monthly Accident Summary", period: "November 2024", generated: "2024-11-28" },
  { id: "TR002", title: "Traffic Violations Report", period: "November 2024", generated: "2024-11-27" },
  { id: "TR003", title: "Vehicle Registration Statistics", period: "Q4 2024", generated: "2024-11-25" },
];

export default function TrafficReportsPage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Traffic Reports</h1>
            <p className="text-sm text-[var(--slate)]">Generate and download traffic statistics</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <FileText size={16} />
            New Report
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: mockReports.length, icon: FileText },
          { label: "Accidents Tracked", value: 28, icon: Car },
          { label: "Downloads", value: 67, icon: TrendingUp },
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
                    <p className="text-xs text-[var(--slate)]">Period: {rep.period} · Generated: {rep.generated}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary">
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
