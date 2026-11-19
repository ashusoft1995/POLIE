"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, Shield, Lock, CheckCircle2, XCircle, Mail } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import { mockUsers } from "@/lib/mock-data/auth";

const ROLE_COLORS = {
  "police-head": "badge-blue",
  detective: "badge-purple",
  preventive: "badge-green",
  traffic: "badge-yellow",
  hr: "badge-pink",
  admin: "badge-gray",
};

export default function SystemAdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">User Management</h1>
            <p className="text-sm text-[var(--slate)]">Manage system access and user accounts</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <UserPlus size={16} />
            Add User
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: mockUsers.length, icon: Users },
          { label: "Admin & Head", value: mockUsers.filter(u => u.role === "system-admin" || u.role === "police-head").length, icon: Shield },
          { label: "Detectives", value: mockUsers.filter(u => u.role === "detective").length, icon: Users },
          { label: "Officers", value: mockUsers.filter(u => u.role === "preventive" || u.role === "traffic").length, icon: Users },
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
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 w-full"
              />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input">
              <option value="All">All Roles</option>
              <option value="police-head">Police Head</option>
              <option value="detective">Detective</option>
              <option value="preventive">Preventive</option>
              <option value="traffic">Traffic</option>
              <option value="hr">HR</option>
              <option value="admin">System Admin</option>
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
                  {["Name", "Email", "Role", "Badge", "Rank", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ backgroundColor: "var(--surface2)" }}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--navy)]">{user.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-[var(--charcoal)] flex items-center gap-1">
                        <Mail size={12} className="text-[var(--muted)]" />
                        {user.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${ROLE_COLORS[user.role as keyof typeof ROLE_COLORS]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--navy)]">{user.badge || "—"}</td>
                    <td className="px-5 py-4 text-sm text-[var(--charcoal)]">{user.rank || "—"}</td>
                    <td className="px-5 py-4">
                      <CheckCircle2 size={18} className="text-green-600" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                          title="Edit"
                        >
                          <Shield size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          title="Reset Password"
                        >
                          <Lock size={14} />
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
