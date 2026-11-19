"use client";
import { useDateString } from "@/lib/useDateString";
import Link from "next/link";
import { Users, UserPlus, FileText, ArrowRight, Clock, AlertTriangle } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import { mockCriminals } from "@/lib/mock-data/criminals";
import { mockActivityLog } from "@/lib/mock-data/cases";

export default function PreventiveDashboard() {
  const dateStr = useDateString();
  return (
    <div className="space-y-6 pb-10">
      <ScrollReveal variant="fadeDown">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"/>
          <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5"/>
          <div className="relative">
            <p className="text-orange-200 text-sm font-medium">Welcome back,</p>
            <h2 className="text-xl font-extrabold mt-1">Off. Meron Tadesse</h2>
            <p className="text-orange-100 text-sm mt-1.5">
              {dateStr}
              {" · "}Preventive Police Division
            </p>
          </div>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Criminals Registered", value:mockCriminals.length,                                trend:"up"      as const, trendValue:"+2 this month",   icon:Users,       color:"blue"   as const },
          { label:"Convicted",                  value:mockCriminals.filter(c=>c.status==="Convicted").length,trend:"up"     as const, trendValue:"In database",     icon:AlertTriangle,color:"pink"  as const },
          { label:"Arrested",                   value:mockCriminals.filter(c=>c.status==="Arrested").length, trend:"neutral" as const,trendValue:"Awaiting trial",  icon:Users,       color:"yellow" as const },
          { label:"Crime Reports Generated",    value:8,                                                     trend:"up"      as const, trendValue:"This month",     icon:FileText,    color:"green"  as const },
        ].map((k,i)=><StaggerChild key={k.label}><KpiCard {...k} delay={i*0.08}/></StaggerChild>)}
      </StaggerParent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ScrollReveal variant="slideLeft">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-bold text-[var(--navy)]">Recent Criminal Records</h3><p className="text-xs text-[var(--slate)] mt-0.5">Latest entries in the database</p></div>
              <Link href="/preventive/criminals" className="text-xs font-semibold text-[var(--green)] hover:underline flex items-center gap-1">View all <ArrowRight size={12}/></Link>
            </div>
            <StaggerParent className="space-y-2">
              {mockCriminals.map(c=>(
                <StaggerChild key={c.id}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--surface2)] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                      {c.name.split(" ").map((n:string)=>n[0]).slice(0,2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--navy)] truncate">{c.name}</p>
                      <p className="text-xs text-[var(--slate)]">{c.crimeType} · {c.registeredDate}</p>
                    </div>
                    <StatusBadge label={c.status}/>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideRight">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Quick Actions</h3>
            <p className="text-xs text-[var(--slate)] mb-4">Common tasks for preventive officers</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:"Register Criminal",    href:"/preventive/register",  color:"bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800", icon:UserPlus },
                { label:"View Database",        href:"/preventive/criminals", color:"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",             icon:Users },
                { label:"Generate Report",      href:"/preventive/reports",   color:"bg-green-50 dark:bg-green-900/20 text-[var(--green)] border-green-200 dark:border-green-800",                       icon:FileText },
                { label:"Forward to Detective", href:"/preventive/forward",   color:"bg-pink-50 dark:bg-pink-900/20 text-[var(--pink)] border-pink-200 dark:border-pink-800",                           icon:ArrowRight },
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

      <ScrollReveal variant="fadeUp">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[var(--navy)] mb-4">Recent Activity</h3>
          <div className="relative pl-5">
            <div className="absolute left-1.5 top-0 bottom-0 w-px bg-[var(--border)]"/>
            <StaggerParent className="space-y-4">
              {mockActivityLog.filter((_,i)=>i<4).map(log=>(
                <StaggerChild key={log.id}>
                  <div className="relative">
                    <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-[var(--card-bg)]"/>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="text-sm flex-1"><span className="font-bold text-[var(--navy)]">{log.user}</span><span className="text-[var(--slate)]"> {log.action} </span><span className="font-semibold text-orange-600">{log.target}</span></div>
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


