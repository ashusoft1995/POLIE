"use client";
import { useDateString } from "@/lib/useDateString";
import Link from "next/link";
import { AlertTriangle, FilePlus, BarChart2, ArrowRight, Clock, Car } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import { mockAccidents } from "@/lib/mock-data/criminals";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboardStats } from "@/lib/useDashboardStats";
import { useSessionUser } from "@/lib/useSessionUser";

const weeklyData = [
  { day:"Mon", accidents:2 }, { day:"Tue", accidents:1 }, { day:"Wed", accidents:3 },
  { day:"Thu", accidents:1 }, { day:"Fri", accidents:4 }, { day:"Sat", accidents:2 }, { day:"Sun", accidents:0 },
];

export default function TrafficDashboard() {
  const dateStr = useDateString();
  const stats   = useDashboardStats();
  const user    = useSessionUser();
  const displayName = user?.fullName ?? user?.name ?? "Off. Kebede Alemu";
  return (
    <div className="space-y-6 pb-10">
      <ScrollReveal variant="fadeDown">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"/>
          <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5"/>
          <div className="relative">
            <p className="text-yellow-100 text-sm font-medium">Welcome back,</p>
            <h2 className="text-xl font-extrabold mt-1">{displayName}</h2>
            <p className="text-yellow-100 text-sm mt-1.5">
              {dateStr}
              {" · "}Traffic Division
            </p>
          </div>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Accidents",        value: stats.totalTraffic,                                         trend:"up"      as const, trendValue:"This period",    icon:Car,           color:"blue"   as const },
          { label:"Under Review",           value: stats.pendingTraffic,                                       trend:"neutral" as const, trendValue:"Pending review", icon:AlertTriangle, color:"yellow" as const },
          { label:"Total Injuries",         value: mockAccidents.reduce((s,a)=>s+a.injuries,0),               trend:"down"    as const, trendValue:"This period",    icon:AlertTriangle, color:"pink"   as const },
          { label:"Fatalities",             value: mockAccidents.reduce((s,a)=>s+a.fatalities,0),             trend:"down"    as const, trendValue:"This period",    icon:AlertTriangle, color:"green"  as const },
        ].map((k,i)=><StaggerChild key={k.label}><KpiCard {...k} delay={i*0.08}/></StaggerChild>)}
      </StaggerParent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ScrollReveal variant="slideLeft">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-bold text-[var(--navy)]">Recent Accidents</h3><p className="text-xs text-[var(--slate)] mt-0.5">Latest recorded incidents</p></div>
              <Link href="/traffic/accidents" className="text-xs font-semibold text-[var(--green)] hover:underline flex items-center gap-1">View all <ArrowRight size={12}/></Link>
            </div>
            <StaggerParent className="space-y-2">
              {mockAccidents.slice(0,4).map(a=>(
                <StaggerChild key={a.id}>
                  <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[var(--surface2)] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                      <Car size={16} className="text-yellow-600"/>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--navy)] truncate">{a.type} · {a.location}</p>
                      <p className="text-xs text-[var(--slate)]">{a.date} · {a.injuries} injuries · {a.fatalities} fatalities</p>
                    </div>
                    <StatusBadge label={a.status}/>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideRight">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Weekly Accident Trend</h3>
            <p className="text-xs text-[var(--slate)] mb-4">Accidents per day this week</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                <XAxis dataKey="day" tick={{fontSize:11,fill:"var(--slate)"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"var(--slate)"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:12,border:"1px solid var(--border)",background:"var(--card-bg)",color:"var(--navy)",fontSize:12}}/>
                <Bar dataKey="accidents" fill="#FACC15" radius={[4,4,0,0]} name="Accidents" animationDuration={800}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fadeUp">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Quick Actions</h3>
          <p className="text-xs text-[var(--slate)] mb-4">Traffic officer tasks</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:"Register Accident", href:"/traffic/register",  color:"bg-yellow-50 dark:bg-yellow-900/20 text-[var(--yellow-dark)] border-yellow-200 dark:border-yellow-800", icon:FilePlus },
              { label:"View Records",      href:"/traffic/accidents", color:"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",   icon:Car },
              { label:"View Reports",      href:"/traffic/reports",   color:"bg-green-50 dark:bg-green-900/20 text-[var(--green)] border-green-200 dark:border-green-800",             icon:BarChart2 },
              { label:"Accident Stats",    href:"/traffic/reports",   color:"bg-pink-50 dark:bg-pink-900/20 text-[var(--pink)] border-pink-200 dark:border-pink-800",                 icon:AlertTriangle },
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


