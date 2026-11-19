"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, BarChart2, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { mockCrimeChartData, mockCaseStatusPie } from "@/lib/mock-data/cases";

const monthlyResolution = [
  { month: "Jun", opened: 12, closed: 8  },
  { month: "Jul", opened: 15, closed: 11 },
  { month: "Aug", opened: 10, closed: 14 },
  { month: "Sep", opened: 18, closed: 13 },
  { month: "Oct", opened: 14, closed: 16 },
  { month: "Nov", opened: 20, closed: 15 },
];

const officerPerformance = [
  { name: "Det. Abebe", cases: 12, closed: 8  },
  { name: "Det. Tigist", cases: 9,  closed: 7  },
  { name: "Det. Lemlem", cases: 11, closed: 9  },
  { name: "Off. Meron",  cases: 6,  closed: 5  },
];

const tickColor = "var(--slate)";
const gridColor = "var(--border)";
const tooltipStyle = { borderRadius:12, border:"1px solid var(--border)", background:"var(--card-bg)", color:"var(--navy)", fontSize:12 };

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4}} className="card p-5">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-[var(--navy)]">{title}</h3>
          {sub && <p className="text-xs text-[var(--slate)] mt-0.5">{sub}</p>}
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--slate)] hover:text-[var(--green)] border border-[var(--border)] px-3 py-1.5 rounded-xl transition-colors">
          <Download size={12}/> Export
        </button>
      </div>
      {children}
    </motion.div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--navy)]">Statistical Reports</h2>
          <p className="text-sm text-[var(--slate)] mt-0.5">Crime analytics and performance overview.</p>
        </div>
        <button className="btn-primary"><Download size={15}/> Export All</button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Total Cases YTD",   value:"80",  icon: BarChart2,  color:"text-blue-600  bg-blue-50  dark:bg-blue-900/20  border-blue-200  dark:border-blue-800" },
          { label:"Closed This Month", value:"15",  icon: TrendingUp, color:"text-[var(--green)] bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
          { label:"Avg. Resolution",   value:"18d", icon: BarChart2,  color:"text-[var(--yellow-dark)] bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" },
          { label:"Detection Rate",    value:"74%", icon: TrendingUp, color:"text-[var(--pink)] bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800" },
        ].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className={`card border p-4 ${s.color}`}>
            <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
            <p className="text-xs font-semibold mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Crime Trend by Category" sub="Last 6 months">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockCrimeChartData} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:tickColor}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:tickColor}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltipStyle} cursor={{fill:"var(--surface2)"}}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="robbery"   fill="#EC4899" radius={[4,4,0,0]} name="Robbery"/>
              <Bar dataKey="theft"     fill="#FACC15" radius={[4,4,0,0]} name="Theft"/>
              <Bar dataKey="assault"   fill="#F97316" radius={[4,4,0,0]} name="Assault"/>
              <Bar dataKey="fraud"     fill="#3B82F6" radius={[4,4,0,0]} name="Fraud"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cases Opened vs Closed" sub="Monthly resolution rate">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyResolution}>
              <defs>
                <linearGradient id="gOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EC4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:tickColor}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:tickColor}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Area type="monotone" dataKey="opened" stroke="#EC4899" fill="url(#gOpened)" strokeWidth={2} name="Opened"/>
              <Area type="monotone" dataKey="closed" stroke="#16A34A" fill="url(#gClosed)" strokeWidth={2} name="Closed"/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Case Status Distribution" sub="Current snapshot">
          <div className="flex items-center gap-4 flex-wrap">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={mockCaseStatusPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {mockCaseStatusPie.map((e,i) => <Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {mockCaseStatusPie.map(e=>(
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{background:e.color}}/><span className="text-[var(--charcoal)]">{e.name}</span></div>
                  <span className="font-bold text-[var(--navy)]">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Detective Performance" sub="Cases handled vs closed">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={officerPerformance} barSize={16} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false}/>
              <XAxis type="number" tick={{fontSize:11,fill:tickColor}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:tickColor}} axisLine={false} tickLine={false} width={80}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="cases"  fill="#3B82F6" radius={[0,4,4,0]} name="Assigned"/>
              <Bar dataKey="closed" fill="#16A34A" radius={[0,4,4,0]} name="Closed"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
