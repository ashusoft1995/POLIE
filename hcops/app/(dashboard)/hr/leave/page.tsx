"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, User } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import { mockLeaveRequests } from "@/lib/mock-data/officers";

export default function HRLeavePage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Leave Management</h1>
          <p className="text-sm text-[var(--slate)]">Approve and track leave requests</p>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pending Requests", value: mockLeaveRequests.filter(r => r.status === "Pending").length, icon: Clock, color: "yellow" },
          { label: "Approved", value: mockLeaveRequests.filter(r => r.status === "Approved").length, icon: CheckCircle2, color: "green" },
          { label: "Total Days", value: mockLeaveRequests.reduce((sum, r) => sum + r.days, 0), icon: Calendar, color: "blue" },
        ].map((stat) => (
          <StaggerChild key={stat.label}>
            <motion.div whileHover={{ y: -4 }} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--slate)] uppercase mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-[var(--navy)]"><CountUp to={stat.value} /></p>
                </div>
                <stat.icon size={28} className={`text-${stat.color}-600`} />
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>

      <StaggerParent className="space-y-3">
        {mockLeaveRequests.map((req) => (
          <StaggerChild key={req.id}>
            <motion.div whileHover={{ x: 4, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
                    <User size={20} className="text-[var(--green)]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{req.officer}</h4>
                    <p className="text-xs text-[var(--slate)] font-mono">{req.badge}</p>
                  </div>
                </div>
                <span className={`badge ${req.status === "Pending" ? "badge-yellow" : "badge-green"}`}>
                  {req.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Type</p>
                  <p className="text-[var(--charcoal)] font-semibold">{req.type}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">From</p>
                  <p className="text-[var(--charcoal)] font-semibold">{req.from}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">To</p>
                  <p className="text-[var(--charcoal)] font-semibold">{req.to}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Days</p>
                  <p className="text-[var(--green)] font-bold text-lg">{req.days}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--slate)] mb-3">
                <span className="font-semibold text-[var(--charcoal)]">Reason:</span> {req.reason}
              </p>
              {req.status === "Pending" && (
                <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1">
                    <CheckCircle2 size={14} /> Approve
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary flex-1">
                    <XCircle size={14} /> Reject
                  </motion.button>
                </div>
              )}
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
