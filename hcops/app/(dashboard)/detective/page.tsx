"use client";
import { useDateString } from "@/lib/useDateString";
import Link from "next/link";
import { FolderOpen, FileText, Users, CheckSquare, Clock, ArrowRight, Eye, AlertCircle } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal, { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";
import { useEffect, useState } from "react";
import { useDashboardStats } from "@/lib/useDashboardStats";
import { useSessionUser } from "@/lib/useSessionUser";

export default function DetectiveDashboard() {
  const [crimeReports, setCrimeReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const stats = useDashboardStats();
  const user  = useSessionUser();
  const displayName = user?.fullName ?? user?.name ?? "Det. Abebe Girma";
  
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${apiUrl}/api/crime-reports/status/PENDING`, { signal: AbortSignal.timeout(3000) })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCrimeReports(data.data);
        else throw new Error();
      })
      .catch(() => {
        // Mock fallback
        setCrimeReports([
          { id:1, caseNumber:"RPT-2024-101", crimeType:"THEFT",           isUrgent:false, submittedAt:"2024-11-25T09:00:00", incidentLocation:"Hossana Market",   status:"PENDING" },
          { id:2, caseNumber:"RPT-2024-102", crimeType:"ASSAULT",         isUrgent:true,  submittedAt:"2024-11-26T14:30:00", incidentLocation:"Kebele 03",         status:"PENDING" },
          { id:3, caseNumber:"RPT-2024-103", crimeType:"DOMESTIC_VIOLENCE",isUrgent:true, submittedAt:"2024-11-27T08:15:00", incidentLocation:"Residential Area",  status:"PENDING" },
          { id:4, caseNumber:"RPT-2024-104", crimeType:"FRAUD",           isUrgent:false, submittedAt:"2024-11-27T11:00:00", incidentLocation:"Admin Office",      status:"PENDING" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);
  const dateStr = useDateString();
  return (
    <div className="space-y-6 pb-10">
      <ScrollReveal variant="fadeDown">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-blue-200 text-sm font-medium">Welcome back,</p>
            <h2 className="text-xl font-extrabold mt-1">{displayName}</h2>
            <p className="text-blue-100 text-sm mt-1.5">
              {dateStr}
              {" · "}Criminal Investigation Department
            </p>
          </div>
        </div>
      </ScrollReveal>

      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Pending Reports",    value: stats.pendingReports || crimeReports.length,              trend:"up"      as const, trendValue:"Need review",        icon:AlertCircle, color:"pink"   as const },
          { label:"Urgent Cases",       value: stats.urgentReports  || crimeReports.filter(r=>r.isUrgent).length, trend:"neutral" as const, trendValue:"Requires attention", icon:FolderOpen, color:"yellow" as const },
          { label:"Open Investigations",value: stats.openCases,                                          trend:"up"      as const, trendValue:"Active cases",       icon:FileText,    color:"green"  as const },
          { label:"Pending Court",      value: stats.pendingCourt,                                       trend:"neutral" as const, trendValue:"Awaiting hearing",   icon:CheckSquare, color:"blue"   as const },
        ].map((k,i)=><StaggerChild key={k.label}><KpiCard {...k} delay={i*0.08}/></StaggerChild>)}
      </StaggerParent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ScrollReveal variant="slideLeft">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-bold text-[var(--navy)]">Pending Crime Reports</h3><p className="text-xs text-[var(--slate)] mt-0.5">New reports awaiting assignment</p></div>
              <Link href="/detective/cases" className="text-xs font-semibold text-[var(--green)] hover:underline flex items-center gap-1">View all <ArrowRight size={12}/></Link>
            </div>
            {loading ? (
              <p className="text-sm text-[var(--muted)] text-center py-6">Loading reports...</p>
            ) : (
              <StaggerParent className="space-y-2">
                {crimeReports.slice(0, 5).map(report=>(
                  <StaggerChild key={report.id}>
                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--surface2)] transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[var(--navy)] truncate">{report.crimeType.replace(/_/g, ' ')}</p>
                          {report.isUrgent && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">URGENT</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--slate)]">{report.caseNumber} · {new Date(report.submittedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-[var(--muted)] truncate mt-1">{report.incidentLocation}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <StatusBadge label={report.status}/>
                        <button className="p-1.5 rounded-lg hover:bg-[var(--surface2)] text-[var(--slate)] hover:text-[var(--green)] transition-colors"><Eye size={13}/></button>
                      </div>
                    </div>
                  </StaggerChild>
                ))}
                {crimeReports.length===0 && <p className="text-sm text-[var(--muted)] text-center py-6">No pending reports.</p>}
              </StaggerParent>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideRight">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Quick Actions</h3>
            <p className="text-xs text-[var(--slate)] mb-4">Common investigation tasks</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:"Add Evidence",       href:"/detective/evidence",    color:"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800", icon:FileText },
                { label:"View Tips",          href:"/detective/nominations", color:"bg-green-50 dark:bg-green-900/20 text-[var(--green)] border-green-200 dark:border-green-800",          icon:Users },
                { label:"Request Closure",    href:"/detective/closure",     color:"bg-yellow-50 dark:bg-yellow-900/20 text-[var(--yellow-dark)] border-yellow-200 dark:border-yellow-800",icon:CheckSquare },
                { label:"My Cases",           href:"/detective/cases",       color:"bg-pink-50 dark:bg-pink-900/20 text-[var(--pink)] border-pink-200 dark:border-pink-800",               icon:FolderOpen },
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
          <h3 className="text-sm font-bold text-[var(--navy)] mb-4">Recent Crime Reports</h3>
          <div className="relative pl-5">
            <div className="absolute left-1.5 top-0 bottom-0 w-px bg-[var(--border)]"/>
            <StaggerParent className="space-y-4">
              {crimeReports.slice(0, 4).map(report=>(
                <StaggerChild key={report.id}>
                  <div className="relative">
                    <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-[var(--card-bg)]"/>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="text-sm flex-1">
                        <span className="font-bold text-[var(--navy)]">{report.reporterName}</span>
                        <span className="text-[var(--slate)]"> reported </span>
                        <span className="font-semibold text-blue-600">{report.crimeType.replace(/_/g, ' ')}</span>
                        <span className="text-[var(--slate)]"> at {report.incidentLocation}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted)] shrink-0">
                        <Clock size={11}/>
                        {new Date(report.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </StaggerChild>
              ))}
              {crimeReports.length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-4">No recent reports</p>
              )}
            </StaggerParent>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}


