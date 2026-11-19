"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserX, Search, AlertTriangle, Eye, FileText, MapPin, Calendar } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";

const mockCriminals = [
  { id: "CR001", name: "Yonas Tesfaye", alias: "Yoni", dob: "1995-04-12", crime: "Armed Robbery", status: "Wanted", photo: null, lastSeen: "Hossana Market", registered: "2024-11-01" },
  { id: "CR002", name: "Dawit Bekele", alias: "Dagi", dob: "1998-07-22", crime: "Assault", status: "In Custody", photo: null, lastSeen: "Kebele 03", registered: "2024-11-18" },
  { id: "CR003", name: "Biruk Alemu", alias: null, dob: "2006-11-05", crime: "Theft", status: "Released", photo: null, lastSeen: "Bus Terminal", registered: "2024-10-15" },
  { id: "CR004", name: "Tesfaye Haile", alias: "Tesfu", dob: "1992-03-18", crime: "Drug Offence", status: "Wanted", photo: null, lastSeen: "Market District", registered: "2024-09-20" },
  { id: "CR005", name: "Almaz Bekele", alias: null, dob: "2000-08-30", crime: "Fraud", status: "In Custody", photo: null, lastSeen: "Admin Office", registered: "2024-11-20" },
];

const STATUS_COLORS = {
  Wanted: "badge-red",
  "In Custody": "badge-yellow",
  Released: "badge-green",
};

export default function PreventiveCriminalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockCriminals.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Criminal Records</h1>
            <p className="text-sm text-[var(--slate)]">Track and manage registered criminals</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <UserX size={16} />
            Register Criminal
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Records", value: mockCriminals.length, icon: FileText },
          { label: "Wanted", value: mockCriminals.filter(c => c.status === "Wanted").length, icon: AlertTriangle },
          { label: "In Custody", value: mockCriminals.filter(c => c.status === "In Custody").length, icon: UserX },
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

      <ScrollReveal variant="fadeUp" delay={0.2}>
        <div className="card p-5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 w-full"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
              <option value="All">All Status</option>
              <option value="Wanted">Wanted</option>
              <option value="In Custody">In Custody</option>
              <option value="Released">Released</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((crim) => (
          <StaggerChild key={crim.id}>
            <motion.div whileHover={{ y: -6, boxShadow: "0 16px 32px -8px rgba(0,0,0,0.15)" }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[var(--surface2)] flex items-center justify-center">
                    <UserX size={24} className="text-[var(--slate)]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{crim.name}</h4>
                    {crim.alias && <p className="text-xs text-[var(--muted)] italic">aka "{crim.alias}"</p>}
                  </div>
                </div>
                <span className={`badge ${STATUS_COLORS[crim.status as keyof typeof STATUS_COLORS]}`}>
                  {crim.status}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">ID:</span>
                  <span className="font-mono font-semibold text-[var(--navy)]">{crim.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Crime:</span>
                  <span className="font-semibold text-red-600">{crim.crime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">DOB:</span>
                  <span className="text-[var(--charcoal)]">{crim.dob}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[var(--muted)] shrink-0">Last Seen:</span>
                  <span className="text-[var(--charcoal)] text-right">{crim.lastSeen}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--green)] text-white text-xs font-semibold"
                >
                  <Eye size={13} />
                  View Record
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--slate)] hover:border-[var(--green)] hover:text-[var(--green)]"
                >
                  <FileText size={13} />
                </motion.button>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
