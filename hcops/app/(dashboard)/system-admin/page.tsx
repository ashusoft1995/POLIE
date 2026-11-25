"use client";
import { useDateString } from "@/lib/useDateString";
import Link from "next/link";
import { Users, Shield, Activity, Settings, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import { mockUsers } from "@/lib/mock-data/auth";
import { mockActivityLog } from "@/lib/mock-data/cases";
import { useDashboardStats } from "@/lib/useDashboardStats";
import { useSessionUser } from "@/lib/useSessionUser";
import { CountUp } from "@/components/ui/ScrollReveal";

const systemServices = [
  { name:"API Gateway",       status:"Operational", uptime:"99.9%" },
  { name:"Database Server",   status:"Operational", uptime:"99.8%" },
  { name:"Authentication",    status:"Operational", uptime:"100%"  },
  { name:"File Storage",      status:"Operational", uptime:"99.7%" },
  { name:"Notification Queue",status:"Operational", uptime:"99.5%" },
  { name:"Citizen Portal",    status:"Operational", uptime:"99.9%" },
];

export default function SystemAdminDashboard() {
  const dateStr = useDateString();
  const stats   = useDashboardStats();
  const user    = useSessionUser();
  const displayName = user?.fullName ?? user?.name ?? "Sys. Admin Yonas Tesfaye";
  return (
    <div className="space-y-6 pb-10">
      <ScrollReveal variant="fadeDown">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"/>
          <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5"/>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Welcome back,</p>
              <h2 className="text-xl font-extrabold mt-1">{displayName}</h2>
              <p className="text-slate-400 text-sm mt-1.5">
                {dateStr}
                {" · "}IT & Systems Division
              </p>
            </div>
            <div className="flex flex-wrap gap-2 self-start sm:self-center">
              <Link href="/system-admin/users"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl transition-colors">
                <Users size={15}/> Manage Users
              </Link>
              <Link href="/system-admin/logs"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl transition-colors">
                <Activity size={15}/> System Logs
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick stat strip */}
      <StaggerParent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Registered Users",  value: stats.totalEmployees || mockUsers.length, color:"text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200" },
          { label:"Active Employees",  value: stats.activeEmployees || mockUsers.length, color:"text-[var(--green)] bg-green-50 dark:bg-green-900/20 border-green-200" },
          { label:"Services Online",   value: systemServices.length, color:"text-[var(--yellow-dark)] bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200" },
          { label:"Security Alerts",   value: 0, color:"text-[var(--pink)] bg-pink-50 dark:bg-pink-900/20 border-pink-200" },
        ].map(s=>(
          <StaggerChild key={s.label}>
            <div className={`card border p-4 ${s.color}`}>
              <p className={`text-3xl font-extrabold tabular-nums ${s.color.split(" ")[0]}`}>
                <CountUp to={s.value}/>
              </p>
              <p className="text-xs font-semibold mt-1 text-[var(--charcoal)]">{s.label}</p>
            </div>
          </StaggerChild>
        ))}
      </StaggerParent>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Users",      value: stats.totalEmployees || mockUsers.length, trend:"up"   as const, trendValue:"In system",       icon:Users,      color:"blue"   as const },
          { label:"Active Accounts",  value: stats.activeEmployees || mockUsers.length,trend:"up"   as const, trendValue:"All active",      icon:Shield,     color:"green"  as const },
          { label:"System Services",  value: systemServices.length,                    trend:"up"   as const, trendValue:"All operational", icon:Activity,   color:"yellow" as const },
          { label:"Security Alerts",  value: 0,                                        trend:"down" as const, trendValue:"No alerts today", icon:AlertCircle,color:"pink"   as const },
        ].map((k,i)=><StaggerChild key={k.label}><KpiCard {...k} delay={i*0.08}/></StaggerChild>)}
      </StaggerParent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ScrollReveal variant="slideLeft">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-bold text-[var(--navy)]">User Accounts</h3><p className="text-xs text-[var(--slate)] mt-0.5">All registered system users</p></div>
              <Link href="/system-admin/users" className="text-xs font-semibold text-[var(--green)] hover:underline flex items-center gap-1">View all <ArrowRight size={12}/></Link>
            </div>
            <StaggerParent className="space-y-2">
              {mockUsers.map(u=>(
                <StaggerChild key={u.id}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--surface2)] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.name.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--navy)] truncate">{u.name}</p>
                      <p className="text-xs text-[var(--slate)]">{u.rank} · {u.email}</p>
                    </div>
                    <span className="badge badge-blue capitalize">{u.role.replace("-"," ")}</span>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideRight">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-[var(--navy)] mb-4">System Status</h3>
            <StaggerParent className="space-y-2">
              {systemServices.map(s=>(
                <StaggerChild key={s.name}>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse shrink-0"/>
                      <span className="text-sm font-medium text-[var(--navy)]">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--muted)]">Uptime {s.uptime}</span>
                      <span className="badge badge-green text-[10px]">{s.status}</span>
                    </div>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fadeUp">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-bold text-[var(--navy)]">Recent System Activity</h3><p className="text-xs text-[var(--slate)] mt-0.5">Last recorded actions</p></div>
            <Link href="/system-admin/logs" className="text-xs font-semibold text-[var(--green)] hover:underline flex items-center gap-1">View logs <ArrowRight size={12}/></Link>
          </div>
          <div className="relative pl-5">
            <div className="absolute left-1.5 top-0 bottom-0 w-px bg-[var(--border)]"/>
            <StaggerParent className="space-y-4">
              {mockActivityLog.map(log=>(
                <StaggerChild key={log.id}>
                  <div className="relative">
                    <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-slate-500 border-2 border-[var(--card-bg)]"/>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="text-sm flex-1"><span className="font-bold text-[var(--navy)]">{log.user}</span><span className="text-[var(--slate)]"> {log.action} </span><span className="font-semibold text-slate-600">{log.target}</span></div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted)] shrink-0"><Clock size={11}/>{log.timestamp}</div>
                    </div>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}


