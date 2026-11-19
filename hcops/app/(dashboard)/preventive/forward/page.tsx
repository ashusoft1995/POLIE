"use client";
import { motion } from "framer-motion";
import { Send, FileText, User } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";

const mockForwards = [
  { id: "F001", criminal: "Yonas Tesfaye", crime: "Armed Robbery", from: "Hossana Station", to: "Hadiya Zone HQ", date: "2024-11-25", status: "Pending" },
  { id: "F002", criminal: "Dawit Bekele", crime: "Assault", from: "Hossana Station", to: "Regional Court", date: "2024-11-20", status: "Completed" },
];

export default function PreventiveForwardPage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Forward Criminals</h1>
            <p className="text-sm text-[var(--slate)]">Track transfers to court and other stations</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <Send size={16} />
            New Forward
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="space-y-3">
        {mockForwards.map((fwd) => (
          <StaggerChild key={fwd.id}>
            <motion.div whileHover={{ x: 4, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
                    <User size={20} className="text-[var(--green)]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{fwd.criminal}</h4>
                    <p className="text-xs text-[var(--slate)]">{fwd.crime}</p>
                  </div>
                </div>
                <span className={`badge ${fwd.status === "Pending" ? "badge-yellow" : "badge-green"}`}>
                  {fwd.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">From</p>
                  <p className="text-[var(--charcoal)] font-semibold text-xs">{fwd.from}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">To</p>
                  <p className="text-[var(--charcoal)] font-semibold text-xs">{fwd.to}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Date</p>
                  <p className="text-[var(--charcoal)] font-semibold">{fwd.date}</p>
                </div>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
