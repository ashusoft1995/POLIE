"use client";
import { motion } from "framer-motion";
import { Shield, Users, Lock, Settings } from "lucide-react";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";

const mockRoles = [
  { id: "R001", name: "Police Head", users: 1, permissions: ["All Access", "Approve Cases", "View Reports"], color: "blue" },
  { id: "R002", name: "Detective", users: 3, permissions: ["Manage Cases", "Add Evidence", "Request Closure"], color: "purple" },
  { id: "R003", name: "Preventive Officer", users: 4, permissions: ["Register Criminals", "Forward Cases", "View Records"], color: "green" },
  { id: "R004", name: "Traffic Officer", users: 2, permissions: ["File Accidents", "Register Vehicles", "View Reports"], color: "yellow" },
  { id: "R005", name: "HR Manager", users: 1, permissions: ["Manage Officers", "Approve Leave", "Process Payroll"], color: "pink" },
  { id: "R006", name: "System Admin", users: 1, permissions: ["Full System Access", "Manage Users", "View Logs"], color: "gray" },
];

export default function SystemAdminRolesPage() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="fadeDown">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Role Management</h1>
            <p className="text-sm text-[var(--slate)]">Define and manage user roles and permissions</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <Shield size={16} />
            Add Role
          </motion.button>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Roles", value: mockRoles.length, icon: Shield },
          { label: "Total Users", value: mockRoles.reduce((sum, r) => sum + r.users, 0), icon: Users },
          { label: "Permissions", value: 24, icon: Lock },
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

      <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRoles.map((role) => (
          <StaggerChild key={role.id}>
            <motion.div whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12)" }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-${role.color}-50 flex items-center justify-center`}>
                    <Shield size={20} className={`text-${role.color}-600`} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--navy)]">{role.name}</h4>
                    <p className="text-xs text-[var(--slate)]">{role.users} users assigned</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-[var(--surface2)] text-[var(--slate)]"
                >
                  <Settings size={16} />
                </motion.button>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-[var(--slate)] uppercase tracking-wide mb-2">Permissions:</p>
                {role.permissions.map((perm) => (
                  <div key={perm} className="flex items-center gap-2 text-sm">
                    <Lock size={12} className="text-[var(--green)]" />
                    <span className="text-[var(--charcoal)]">{perm}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </StaggerParent>
    </div>
  );
}
