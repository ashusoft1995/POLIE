"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Car, Users, MapPin, Calendar, FileText, Activity } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";

const mockAccidents = [
  { id: "ACC001", type: "Collision", location: "Hossana-Durame Road", date: "2024-11-25", time: "14:30", severity: "Major", vehicles: 2, injuries: 3, fatalities: 0, officer: "Off. Kebede Alemu", status: "Investigating" },
  { id: "ACC002", type: "Pedestrian Hit", location: "Main Market Area", date: "2024-11-22", time: "08:15", severity: "Minor", vehicles: 1, injuries: 1, fatalities: 0, officer: "Off. Lemlem Tadesse", status: "Closed" },
  { id: "ACC003", type: "Vehicle Rollover", location: "Kebele 07 Junction", date: "2024-11-20", time: "21:45", severity: "Critical", vehicles: 1, injuries: 4, fatalities: 1, officer: "Off. Kebede Alemu", status: "Investigating" },
  { id: "ACC004", type: "Rear-end Collision", location: "Bus Terminal", date: "2024-11-18", time: "16:00", severity: "Minor", vehicles: 2, injuries: 0, fatalities: 0, officer: "Off. Dawit Bekele", status: "Closed" },
  { id: "ACC005", type: "Multi-vehicle Crash", location: "Highway KM 12", date: "2024-11-15", time: "07:20", severity: "Major", vehicles: 4, injuries: 7, fatalities: 0, officer: "Off. Kebede Alemu", status: "Pending Report" },
];

const SEVERITY_COLORS = {
  Minor: "badge-green",
  Major: "badge-yellow",
  Critical: "badge-red",
};

export default function TrafficAccidentsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockAccidents.filter((acc) =>
    acc.id.toLowerCase().includes(search.toLowerCase()) ||
    acc.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Accident Reports</h1>
            <p className="text-sm text-[var(--slate)]">Track and document traffic accidents</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <FileText size={16} />
            New Report
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Accidents", value: mockAccidents.length, icon: AlertCircle },
          { label: "Total Vehicles", value: mockAccidents.reduce((sum, a) => sum + a.vehicles, 0), icon: Car },
          { label: "Total Injuries", value: mockAccidents.reduce((sum, a) => sum + a.injuries, 0), icon: Activity },
          { label: "Fatalities", value: mockAccidents.reduce((sum, a) => sum + a.fatalities, 0), icon: Users },
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
        {filtered.map((acc) => (
          <StaggerChild key={acc.id}>
            <motion.div whileHover={{ x: 4, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)" }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    acc.severity === "Critical" ? "bg-red-50 text-red-600" :
                    acc.severity === "Major" ? "bg-yellow-50 text-yellow-600" :
                    "bg-green-50 text-green-600"
                  }`}>
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{acc.type}</h4>
                    <p className="text-xs text-[var(--slate)] font-mono">{acc.id}</p>
                  </div>
                </div>
                <span className={`badge ${SEVERITY_COLORS[acc.severity as keyof typeof SEVERITY_COLORS]}`}>
                  {acc.severity}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-4">
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Location</p>
                  <p className="text-[var(--charcoal)] font-semibold text-xs">{acc.location}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Date & Time</p>
                  <p className="text-[var(--charcoal)] font-semibold text-xs">{acc.date} {acc.time}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Vehicles</p>
                  <p className="text-[var(--charcoal)] font-bold">{acc.vehicles}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Injuries</p>
                  <p className="text-yellow-600 font-bold">{acc.injuries}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-0.5">Fatalities</p>
                  <p className="text-red-600 font-bold">{acc.fatalities}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="text-xs text-[var(--slate)]">
                  Officer: <span className="font-semibold text-[var(--charcoal)]">{acc.officer}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs font-semibold text-[var(--green)] hover:underline"
                >
                  View Full Report
                </motion.button>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
