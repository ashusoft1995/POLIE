"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, UserPlus, Mail, Phone, Badge, Clock, Filter } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import { mockOfficerList } from "@/lib/mock-data/officers";

const STATUS_COLORS = {
  Active: "badge-green",
  "On Leave": "badge-yellow",
  Suspended: "badge-red",
};

export default function HROfficersPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = mockOfficerList.filter((off) => {
    const matchSearch =
      off.name.toLowerCase().includes(search.toLowerCase()) ||
      off.badge.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || off.dept === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Officer Directory</h1>
            <p className="text-sm text-[var(--slate)]">Manage personnel records and assignments</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <UserPlus size={16} />
            Add Officer
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Officers", value: mockOfficerList.length, icon: Users },
          { label: "Active", value: mockOfficerList.filter(o => o.status === "Active").length, icon: Badge },
          { label: "On Leave", value: mockOfficerList.filter(o => o.status === "On Leave").length, icon: Clock },
          { label: "CID Detectives", value: mockOfficerList.filter(o => o.dept === "CID").length, icon: Users },
        ].map((stat) => (
          <StaggerChild key={stat.label}>
            <motion.div whileHover={{ y: -4 }} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--slate)] uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-[var(--navy)]">
                    <CountUp to={stat.value} />
                  </p>
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
                placeholder="Search by name or badge number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 w-full"
              />
            </div>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input">
              <option value="All">All Departments</option>
              <option value="CID">CID</option>
              <option value="Preventive">Preventive</option>
              <option value="Traffic">Traffic</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" delay={0.3}>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface2)] border-b-2 border-[var(--border)]">
                <tr>
                  {["Badge", "Name", "Rank", "Department", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((off, idx) => (
                  <motion.tr
                    key={off.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ backgroundColor: "var(--surface2)" }}
                  >
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--navy)]">{off.badge}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--navy)]">{off.name}</p>
                      <p className="text-xs text-[var(--slate)] flex items-center gap-1 mt-0.5">
                        <Mail size={11} /> {off.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{off.rank}</td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{off.dept}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${STATUS_COLORS[off.status as keyof typeof STATUS_COLORS]}`}>
                        {off.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--slate)]">{off.joined}</td>
                    <td className="px-5 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs font-semibold text-[var(--green)] hover:underline"
                      >
                        View Profile
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
