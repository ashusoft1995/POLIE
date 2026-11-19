"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserX, Camera, Fingerprint, Save } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";

export default function PreventiveRegisterPage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Register New Criminal</h1>
          <p className="text-sm text-[var(--slate)]">Add new criminal record to the database</p>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" delay={0.1}>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-[var(--navy)] mb-5">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Full Name" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Alias (if any)" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="date" placeholder="Date of Birth" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="ID Number" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Nationality" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Address" className="input" />
          </div>

          <h3 className="text-lg font-bold text-[var(--navy)] mb-5 pt-4 border-t border-[var(--border)]">Crime Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.select whileFocus={{ scale: 1.01 }} className="input">
              <option>Select Crime Type</option>
              <option>Theft</option>
              <option>Assault</option>
              <option>Robbery</option>
              <option>Fraud</option>
              <option>Drug Offence</option>
            </motion.select>
            <motion.select whileFocus={{ scale: 1.01 }} className="input">
              <option>Select Status</option>
              <option>Wanted</option>
              <option>In Custody</option>
              <option>Released</option>
            </motion.select>
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Last Seen Location" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="date" placeholder="Last Seen Date" className="input" />
          </div>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            placeholder="Additional notes and details..."
            className="input min-h-[100px] mb-6"
          />

          <h3 className="text-lg font-bold text-[var(--navy)] mb-5 pt-4 border-t border-[var(--border)]">Biometric & Photos</h3>
          <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Upload Photo", icon: Camera },
              { label: "Fingerprint Scan", icon: Fingerprint },
              { label: "ID Document", icon: UserX },
            ].map((item) => (
              <StaggerChild key={item.label}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--green)] transition-colors cursor-pointer"
                >
                  <item.icon size={28} className="mx-auto mb-2 text-[var(--muted)]" />
                  <p className="text-sm text-[var(--slate)] font-semibold">{item.label}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>

          <div className="flex gap-3 pt-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary flex-1">
              Cancel
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1">
              <Save size={16} />
              Register Criminal
            </motion.button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
