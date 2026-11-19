"use client";
import { motion } from "framer-motion";
import { Car, Save, Camera } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";

export default function TrafficRegisterPage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Register Vehicle</h1>
          <p className="text-sm text-[var(--slate)]">Add new vehicle to traffic database</p>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" delay={0.1}>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-[var(--navy)] mb-5">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Plate Number" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Vehicle Make" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Model" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Year" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Color" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="VIN Number" className="input" />
          </div>

          <h3 className="text-lg font-bold text-[var(--navy)] mb-5 pt-4 border-t border-[var(--border)]">Owner Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Owner Full Name" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="ID Number" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="tel" placeholder="Phone Number" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="email" placeholder="Email Address" className="input" />
            <motion.input whileFocus={{ scale: 1.01 }} type="text" placeholder="Address" className="input md:col-span-2" />
          </div>

          <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {["Upload Vehicle Photo", "Upload Registration Document"].map((label) => (
              <StaggerChild key={label}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--green)] transition-colors cursor-pointer"
                >
                  <Camera size={28} className="mx-auto mb-2 text-[var(--muted)]" />
                  <p className="text-sm text-[var(--slate)] font-semibold">{label}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>

          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary flex-1">
              Cancel
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1">
              <Save size={16} />
              Register Vehicle
            </motion.button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
