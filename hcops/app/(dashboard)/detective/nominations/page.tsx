"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Shield, AlertTriangle, Clock, CheckCircle2, XCircle, Send } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";

const mockNominations = [
  { id: "N001", suspect: "Dawit Bekele", crime: "Assault and Battery", location: "Kebele 03", date: "2024-11-18", status: "Pending", priority: "High", evidence: 5 },
  { id: "N002", suspect: "Yonas Tesfaye", crime: "Armed Robbery", location: "Hossana Market", date: "2024-11-10", status: "Approved", priority: "High", evidence: 8 },
  { id: "N003", suspect: "Biruk Alemu", crime: "Theft", location: "Bus Terminal", date: "2024-11-14", status: "Pending", priority: "Medium", evidence: 3 },
  { id: "N004", suspect: "Selamawit Desta", crime: "Fraud", location: "Admin Office", date: "2024-11-20", status: "Rejected", priority: "Low", evidence: 2 },
];

export default function NominationsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Criminal Nominations</h1>
            <p className="text-sm text-[var(--slate)]">Submit and review suspect nominations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            <UserPlus size={16} />
            Nominate Suspect
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pending Review", value: mockNominations.filter(n => n.status === "Pending").length, icon: Clock, color: "yellow" },
          { label: "Approved", value: mockNominations.filter(n => n.status === "Approved").length, icon: CheckCircle2, color: "green" },
          { label: "Rejected", value: mockNominations.filter(n => n.status === "Rejected").length, icon: XCircle, color: "red" },
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

      {showForm && (
        <ScrollReveal variant="fadeUp">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-4">Submit New Nomination</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Suspect Name" className="input" />
              <input type="text" placeholder="Crime Type" className="input" />
              <input type="text" placeholder="Location" className="input" />
              <input type="date" className="input" />
            </div>
            <textarea placeholder="Evidence details..." className="input min-h-[100px] mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button className="btn-primary"><Send size={16} /> Submit Nomination</button>
            </div>
          </div>
        </ScrollReveal>
      )}

      <StaggerParent className="space-y-3">
        {mockNominations.map((nom) => (
          <StaggerChild key={nom.id}>
            <motion.div whileHover={{ x: 4, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
                    <Shield size={20} className="text-[var(--green)]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{nom.suspect}</h4>
                    <p className="text-xs text-[var(--slate)]">Nominated for: {nom.crime}</p>
                  </div>
                </div>
                <span className={`badge ${
                  nom.status === "Pending" ? "badge-yellow" :
                  nom.status === "Approved" ? "badge-green" : "badge-red"
                }`}>
                  {nom.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Location</p>
                  <p className="text-[var(--charcoal)] font-semibold">{nom.location}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Date</p>
                  <p className="text-[var(--charcoal)] font-semibold">{nom.date}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Priority</p>
                  <p className={`font-bold ${
                    nom.priority === "High" ? "text-red-600" :
                    nom.priority === "Medium" ? "text-yellow-600" : "text-green-600"
                  }`}>{nom.priority}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Evidence</p>
                  <p className="text-[var(--charcoal)] font-semibold">{nom.evidence} items</p>
                </div>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
