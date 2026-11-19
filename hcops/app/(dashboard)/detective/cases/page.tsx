"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, ChevronDown, Eye, FileText, UserCheck,
  Clock, MapPin, AlertTriangle, CheckCircle2, XCircle, Users,
} from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import { mockCases } from "@/lib/mock-data/cases";

const STATUS_COLORS = {
  "Open": "badge-yellow",
  "Under Investigation": "badge-blue",
  "Pending Closure": "badge-pink",
  "Closed": "badge-green",
};

const PRIORITY_COLORS = {
  "High": "text-red-500",
  "Medium": "text-yellow-600",
  "Low": "text-green-600",
};

export default function DetectiveCasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const filtered = mockCases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trackingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchPriority = filterPriority === "All" || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal variant="fadeDown">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Case Management</h1>
            <p className="text-sm text-[var(--slate)]">View and manage assigned investigation cases</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
          >
            <FileText size={16} />
            File Report
          </motion.button>
        </div>
      </ScrollReveal>

      {/* Stats cards */}
      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Cases", value: mockCases.length, icon: FileText, color: "blue" },
          { label: "Under Investigation", value: mockCases.filter(c => c.status === "Under Investigation").length, icon: Clock, color: "yellow" },
          { label: "Pending Closure", value: mockCases.filter(c => c.status === "Pending Closure").length, icon: AlertTriangle, color: "pink" },
          { label: "Closed", value: mockCases.filter(c => c.status === "Closed").length, icon: CheckCircle2, color: "green" },
        ].map((stat) => (
          <StaggerChild key={stat.label}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12)" }}
              className="card p-5 transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[var(--slate)] uppercase tracking-wide mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-extrabold text-[var(--navy)]">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                  <stat.icon size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>

      {/* Search & Filters */}
      <ScrollReveal variant="fadeUp" delay={0.2}>
        <div className="card p-5">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search by case title or tracking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 w-full"
              />
            </div>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Pending Closure">Pending Closure</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Priority filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Cases table */}
      <ScrollReveal variant="fadeUp" delay={0.3}>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface2)] border-b-2 border-[var(--border)]">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <XCircle size={32} className="mx-auto mb-2 text-[var(--muted)]" />
                      <p className="text-sm text-[var(--slate)]">No cases match your filters</p>
                    </td>
                  </tr>
                )}
                {filtered.map((c, idx) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ backgroundColor: "var(--surface2)" }}
                    className="transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--navy)]">
                      {c.trackingId}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--navy)] mb-0.5">{c.title}</p>
                      <p className="text-xs text-[var(--slate)] flex items-center gap-1">
                        <MapPin size={11} />
                        {c.location}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{c.crimeType}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${STATUS_COLORS[c.status as keyof typeof STATUS_COLORS]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold uppercase ${PRIORITY_COLORS[c.priority as keyof typeof PRIORITY_COLORS]}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--slate)]">{c.reportedDate}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg hover:bg-[var(--green-light)] text-[var(--green)] transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="View Evidence"
                        >
                          <FileText size={16} />
                        </motion.button>
                      </div>
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
