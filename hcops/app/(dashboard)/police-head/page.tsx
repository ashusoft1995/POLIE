"use client";
import { useDateString } from "@/lib/useDateString";
import {
  FolderOpen, CheckSquare, Users, AlertTriangle,
  Clock, Eye, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import KpiCard from "@/components/dashboard/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal, { StaggerParent, StaggerChild, CountUp } from "@/components/ui/ScrollReveal";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  mockCases, mockClosureRequests,
  mockActivityLog, mockCrimeChartData, mockCaseStatusPie,
} from "@/lib/mock-data/cases";
import { useTheme } from "@/lib/theme-context";
import { t } from "@/lib/i18n";

function SectionHeading({
  title, sub, action,
}: {
  title: string; sub?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2 mb-5 flex-wrap">
      <ScrollReveal variant="slideLeft">
        <h3 className="text-base font-bold text-[var(--navy)]">{title}</h3>
        {sub && <p className="text-xs text-[var(--slate)] mt-0.5">{sub}</p>}
      </ScrollReveal>
      {action && <ScrollReveal variant="slideRight">{action}</ScrollReveal>}
    </div>
  );
}

export default function PoliceHeadDashboard() {
  const dateStr = useDateString();
  const { lang } = useTheme();
  const tr = t[lang];

  const pendingClosure = mockClosureRequests.filter((c) => c.status === "Pending");
  const recentCases    = mockCases.slice(0, 5);

  const kpis = [
    { label: tr.totalActiveCases,  value: 42, trend: "up"      as const, trendValue: tr.thisWeek,     icon: FolderOpen,    color: "blue"   as const },
    { label: tr.pendingClosure,    value: pendingClosure.length, trend: "neutral" as const, trendValue: tr.awaitingReview, icon: CheckSquare,  color: "yellow" as const },
    { label: tr.officersOnDuty,    value: 38, trend: "up"      as const, trendValue: tr.fromLastShift, icon: Users,         color: "green"  as const },
    { label: tr.highPriorityCases, value: mockCases.filter((c) => c.priority === "High" && c.status !== "Closed").length,
      trend: "down" as const, trendValue: tr.fromYesterday, icon: AlertTriangle, color: "pink" as const },
  ];

  const tickColor   = "var(--slate)";
  const gridColor   = "var(--border)";
  const tooltipStyle = {
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--card-bg)",
    color: "var(--navy)",
    fontSize: 12,
  };

  return (
    <div className="space-y-8 pb-10">

      {/* ══ Welcome banner ══════════════════════════════════════════ */}
      <ScrollReveal variant="fadeDown" duration={0.6}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] p-6 text-white shadow-xl">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-8 -left-8  w-40 h-40 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute top-4   right-24   w-16 h-16 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-green-200 text-sm font-medium tracking-wide">{tr.goodMorning},</p>
              <h2 className="text-xl font-extrabold mt-1 leading-tight">
                Head Habtamu Woldemariam
              </h2>
              <p className="text-green-100 text-sm mt-1.5">
                {dateStr}
                {" · "}{tr.hossanaPoliceStation}
              </p>
            </div>
            <Link
              href="/police-head/closure-review"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl transition-colors shrink-0 self-start sm:self-center"
            >
              <CheckSquare size={15} />
              {tr.reviewClosureRequests}
              {pendingClosure.length > 0 && (
                <span className="bg-[var(--yellow)] text-[#1E293B] text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                  {pendingClosure.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* ══ KPI cards — staggered ═══════════════════════════════════ */}
      <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <StaggerChild key={k.label}>
            <KpiCard {...k} />
          </StaggerChild>
        ))}
      </StaggerParent>

      {/* ══ Quick-stat number strip ═════════════════════════════════ */}
      <StaggerParent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Reports This Month", value: 23,  color: "text-blue-600  bg-blue-50  dark:bg-blue-900/20  border-blue-200"  },
          { label: "Arrests Made",       value: 11,  color: "text-[var(--green)] bg-green-50 dark:bg-green-900/20 border-green-200" },
          { label: "Court Cases Pending",value: 8,   color: "text-[var(--yellow-dark)] bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200" },
          { label: "Public Tips",        value: 17,  color: "text-[var(--pink)] bg-pink-50 dark:bg-pink-900/20 border-pink-200" },
        ].map((s) => (
          <StaggerChild key={s.label}>
            <div className={`card border p-4 ${s.color}`}>
              <p className={`text-3xl font-extrabold tabular-nums ${s.color.split(" ")[0]}`}>
                <CountUp to={s.value} />
              </p>
              <p className="text-xs font-semibold mt-1 text-[var(--charcoal)]">{s.label}</p>
            </div>
          </StaggerChild>
        ))}
      </StaggerParent>

      {/* ══ Charts row ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar chart */}
        <ScrollReveal variant="slideLeft" delay={0.05} className="lg:col-span-2">
          <div className="card p-5 h-full">
            <SectionHeading title={tr.crimeTrend} sub={tr.crimeByMonth} />
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={mockCrimeChartData} barSize={8} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface2)" }} />
                <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
                <Bar dataKey="robbery"   fill="#EC4899" radius={[4,4,0,0]} name="Robbery"   animationDuration={800} />
                <Bar dataKey="theft"     fill="#FACC15" radius={[4,4,0,0]} name="Theft"     animationDuration={900} />
                <Bar dataKey="assault"   fill="#F97316" radius={[4,4,0,0]} name="Assault"   animationDuration={1000} />
                <Bar dataKey="fraud"     fill="#3B82F6" radius={[4,4,0,0]} name="Fraud"     animationDuration={1100} />
                <Bar dataKey="vandalism" fill="#94A3B8" radius={[4,4,0,0]} name="Vandalism" animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        {/* Pie chart */}
        <ScrollReveal variant="slideRight" delay={0.1}>
          <div className="card p-5 h-full">
            <SectionHeading title={tr.casesByStatus} sub={tr.currentDistribution} />
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={mockCaseStatusPie}
                  cx="50%" cy="50%"
                  innerRadius={46} outerRadius={70}
                  paddingAngle={3} dataKey="value"
                  animationBegin={200} animationDuration={900}
                >
                  {mockCaseStatusPie.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <StaggerParent className="space-y-2 mt-2">
              {mockCaseStatusPie.map((entry) => (
                <StaggerChild key={entry.name}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
                      <span className="text-[var(--charcoal)]">{entry.name}</span>
                    </div>
                    <span className="font-bold text-[var(--navy)] tabular-nums">{entry.value}</span>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>
      </div>

      {/* ══ Area chart — case trend ════════════════════════════════ */}
      <ScrollReveal variant="fadeUp" delay={0.05}>
        <div className="card p-5">
          <SectionHeading title="Monthly Case Volume" sub="Opened vs closed — 6 month trend" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={[
              { month: "Jun", opened: 12, closed: 8  },
              { month: "Jul", opened: 15, closed: 11 },
              { month: "Aug", opened: 10, closed: 14 },
              { month: "Sep", opened: 18, closed: 13 },
              { month: "Oct", opened: 14, closed: 16 },
              { month: "Nov", opened: 20, closed: 15 },
            ]}>
              <defs>
                <linearGradient id="gOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EC4899" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
              <Area type="monotone" dataKey="opened" stroke="#EC4899" fill="url(#gOpened)" strokeWidth={2.5} name="Opened" animationDuration={1200} />
              <Area type="monotone" dataKey="closed" stroke="#16A34A" fill="url(#gClosed)" strokeWidth={2.5} name="Closed" animationDuration={1400} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ScrollReveal>

      {/* ══ Pending closure + Recent cases ════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pending closure */}
        <ScrollReveal variant="slideLeft" delay={0.05}>
          <div className="card p-5 h-full">
            <SectionHeading
              title={tr.pendingClosurePanel}
              sub={tr.casesAwaitingApproval}
              action={
                <Link href="/police-head/closure-review"
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--green)] hover:underline">
                  {tr.viewAll} <ArrowRight size={12} />
                </Link>
              }
            />
            {mockClosureRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-[var(--muted)] text-sm gap-2">
                <CheckSquare size={28} className="text-[var(--green)] opacity-50" />
                <span>No pending requests</span>
              </div>
            ) : (
              <StaggerParent className="space-y-3">
                {mockClosureRequests.map((cr) => (
                  <StaggerChild key={cr.id}>
                    <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-[var(--yellow-light)] dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--navy)] truncate">{cr.caseTitle}</p>
                        <p className="text-xs text-[var(--slate)] mt-0.5">{cr.detective} · {cr.requestDate}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge label={cr.status} />
                        <Link href="/police-head/closure-review" aria-label={`Review ${cr.caseTitle}`}
                          className="p-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--green)] hover:text-[var(--green)] text-[var(--slate)] transition-colors">
                          <Eye size={13} />
                        </Link>
                      </div>
                    </div>
                  </StaggerChild>
                ))}
              </StaggerParent>
            )}
          </div>
        </ScrollReveal>

        {/* Recent cases */}
        <ScrollReveal variant="slideRight" delay={0.08}>
          <div className="card p-5 h-full">
            <SectionHeading
              title={tr.recentCases}
              sub={tr.latestReported}
              action={
                <Link href="/police-head/cases"
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--green)] hover:underline">
                  {tr.allCases} <ArrowRight size={12} />
                </Link>
              }
            />
            <StaggerParent className="space-y-1">
              {recentCases.map((c) => (
                <StaggerChild key={c.id}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--surface2)] transition-colors cursor-default">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--navy)] truncate">{c.title}</p>
                      <p className="text-xs text-[var(--slate)]">{c.crimeType} · {c.reportedDate}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      <StatusBadge label={c.priority} />
                      <StatusBadge label={c.status} />
                    </div>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </ScrollReveal>
      </div>

      {/* ══ Activity timeline ══════════════════════════════════════ */}
      <ScrollReveal variant="fadeUp" delay={0.05}>
        <div className="card p-6">
          <SectionHeading title={tr.recentActivity} sub={tr.latestActions} />
          <div className="relative pl-6">
            <div className="absolute left-2 top-1 bottom-1 w-px bg-[var(--border)]" />
            <StaggerParent className="space-y-5">
              {mockActivityLog.map((log) => (
                <StaggerChild key={log.id}>
                  <div className="relative">
                    <span className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-[var(--green)] border-2 border-[var(--card-bg)] shadow-sm" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="min-w-0 flex-1 text-sm">
                        <span className="font-bold text-[var(--navy)]">{log.user}</span>
                        <span className="text-[var(--slate)]"> {log.action} </span>
                        <span className="font-semibold text-[var(--green)]">{log.target}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted)] shrink-0">
                        <Clock size={11} />
                        {log.timestamp}
                      </div>
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


