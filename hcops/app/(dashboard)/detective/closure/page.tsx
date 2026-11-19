"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, FileText, Send } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";

const mockClosureRequests = [
  { id: "CR001", caseId: "TRK-2024-003", title: "Assault and Battery", detective: "Det. Tigist Mekonnen", requestDate: "2024-11-28", status: "Pending" },
  { id: "CR002", caseId: "TRK-2024-008", title: "Theft Investigation", detective: "Det. Abebe Girma", requestDate: "2024-11-26", status: "Approved" },
];

export default function DetectiveClosurePage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Case Closure Requests</h1>
            <p className="text-sm text-[var(--slate)]">Submit and track case closure requests</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <Send size={16} />
            New Request
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Pending Approval", value: mockClosureRequests.filter(r => r.status === "Pending").length, icon: Clock, color: "yellow" },
          { label: "Approved", value: mockClosureRequests.filter(r => r.status === "Approved").length, icon: CheckCircle2, color: "green" },
        ].map((stat) => (
          <StaggerChild key={stat.label}>
            <motion.div whileHover={{ y: -4 }} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-[var(--navy)]">{stat.value}</p>
                </div>
                <stat.icon size={28} className={`text-${stat.color}-600`} />
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>

      <StaggerParent className="space-y-3">
        {mockClosureRequests.map((req) => (
          <StaggerChild key={req.id}>
            <motion.div whileHover={{ x: 4, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
                    <FileText size={20} className="text-[var(--green)]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{req.title}</h4>
                    <p className="text-xs text-[var(--slate)] font-mono">{req.caseId}</p>
                  </div>
                </div>
                <span className={`badge ${req.status === "Pending" ? "badge-yellow" : "badge-green"}`}>
                  {req.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Detective</p>
                  <p className="text-[var(--charcoal)] font-semibold">{req.detective}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Request Date</p>
                  <p className="text-[var(--charcoal)] font-semibold">{req.requestDate}</p>
                </div>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
