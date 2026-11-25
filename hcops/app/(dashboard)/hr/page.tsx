"use client";
import { useDateString } from "@/lib/useDateString";
import Link from "next/link";
import { Users, UserPlus, CalendarDays, DollarSign, ArrowRight, Clock, CheckCircle } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import { mockOfficerList, mockLeaveRequests } from "@/lib/mock-data/officers";
import { useDashboardStats } from "@/lib/useDashboardStats";
import { useSessionUser } from "@/lib/useSessionUser";

export default function HRDashboard() {
  const dateStr  = useDateString();
  const stats    = useDashboardStats();
  const user     = useSessionUser();
  const displayName = user?.fullName ?? user?.name ?? "Insp. Almaz Worku";
  return (
    <div className="space-y-6 pb-10">
      <ScrollReveal variant="fadeDown">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"/>
          <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5"/>
          <div className="relative">
            <p className="text-purple-200 text-sm font-medium">Welcome back,</p>
            <h2 className="text-xl font-extrabold mt-1">{displayName}</h2>
            <p className="text-purple-100 text-sm mt-1.5">
              {dateStr}
              {" · "}Human Resources Department
            </p>
          </div>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Officers",    value: stats.totalEmployees,  trend:"up"      as const, trendValue:"In system",         icon:Users,       color:"blue"   as const },
          { label:"Active Officers",   value: stats.activeEmployees, trend:"up"      as const, trendValue:"On duty",           icon:Users,       color:"green"  as const },
          { label:"On Leave",          value: mockOfficerList.filter(o=>o.status==="On Leave").length, trend:"neutral" as const, trendValue:"Currently away", icon:CalendarDays, color:"yellow" as const },
          { label:"Pending Leave Reqs",value: stats.pendingLeave,    trend:"neutral" as const, trendValue:"Awaiting approval", icon:CheckCircle, color:"pink"   as const },
        ].map((k,i)=><StaggerChild key={k.label}><KpiCard {...k} delay={i*0.08}/></StaggerChild>)}
      </StaggerParent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ScrollReveal variant="slideLeft">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-bold text-[var(--navy)]">Leave Requests</h3><p className="text-xs text-[var(--slate)] mt-0.5">Pending approval</p></div>
              <Link href="/hr/leave" className="text-xs font-semibold text-[var(--green)] hover:underline flex items-center gap-1">View all <ArrowRight size={12}/></Link>
            </div>
            <StaggerParent className="space-y-2">
              {mockLeaveRequests.map(l=>(
                <StaggerChild key={l.id}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--surface2)] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                      {l.officer.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--navy)] truncate">{l.officer}</p>
                      <p className="text-xs text-[var(--slate)]">{l.type} · {l.from} → {l.to}</p>
                    </div>
                    <StatusBadge label={l.status}/>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideRight">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-bold text-[var(--navy)]">Officer Directory</h3><p className="text-xs text-[var(--slate)] mt-0.5">Recent additions</p></div>
              <Link href="/hr/officers" className="text-xs font-semibold text-[var(--green)] hover:underline flex items-center gap-1">View all <ArrowRight size={12}/></Link>
            </div>
            <StaggerParent className="space-y-2">
              {mockOfficerList.slice(0,4).map(o=>(
                <StaggerChild key={o.id}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--surface2)] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {o.name.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--navy)] truncate">{o.name}</p>
                      <p className="text-xs text-[var(--slate)]">{o.rank} · {o.dept}</p>
                    </div>
                    <StatusBadge label={o.status}/>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fadeUp">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Quick Actions</h3>
          <p className="text-xs text-[var(--slate)] mb-4">HR management tasks</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:"Register Officer",   href:"/hr/register",  color:"bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800", icon:UserPlus },
              { label:"View Directory",     href:"/hr/officers",  color:"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",             icon:Users },
              { label:"Leave Requests",     href:"/hr/leave",     color:"bg-yellow-50 dark:bg-yellow-900/20 text-[var(--yellow-dark)] border-yellow-200 dark:border-yellow-800",            icon:CalendarDays },
              { label:"Payroll",            href:"/hr/payroll",   color:"bg-green-50 dark:bg-green-900/20 text-[var(--green)] border-green-200 dark:border-green-800",                      icon:DollarSign },
            ].map(a=>(
              <Link key={a.label} href={a.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${a.color} hover:shadow-md transition-all text-center`}>
                <a.icon size={20}/>
                <span className="text-xs font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}


