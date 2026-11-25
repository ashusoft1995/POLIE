"use client";
import { useState, useEffect } from "react";
import {
  casesApi, crimeReportApi, employeeApi,
  leaveApi, trafficApi, missingPersonApi,
} from "@/lib/api-client";

export interface DashboardStats {
  totalCases:        number;
  openCases:         number;
  pendingCourt:      number;
  closedCases:       number;
  pendingReports:    number;
  urgentReports:     number;
  totalEmployees:    number;
  activeEmployees:   number;
  pendingLeave:      number;
  totalTraffic:      number;
  pendingTraffic:    number;
  totalMissing:      number;
  activeMissing:     number;
  loading:           boolean;
}

const DEFAULT: DashboardStats = {
  totalCases:0, openCases:0, pendingCourt:0, closedCases:0,
  pendingReports:0, urgentReports:0,
  totalEmployees:0, activeEmployees:0, pendingLeave:0,
  totalTraffic:0, pendingTraffic:0,
  totalMissing:0, activeMissing:0,
  loading:true,
};

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT);

  useEffect(() => {
    let alive = true;
    async function load() {
      const s = { ...DEFAULT, loading: false };
      // Run all fetches in parallel, fail silently per-call
      const [cases, reports, employees, leaves, traffic, missing] = await Promise.allSettled([
        casesApi.getAll(),
        crimeReportApi.getAll(),
        employeeApi.getAll(),
        leaveApi.getAll(),
        trafficApi.getAll(),
        missingPersonApi.getAll(),
      ]);

      if (cases.status === "fulfilled") {
        const c = cases.value as any[];
        s.totalCases   = c.length;
        s.openCases    = c.filter(x => x.status === "OPEN" || x.status === "UNDER_INVESTIGATION").length;
        s.pendingCourt = c.filter(x => x.status === "PENDING_COURT").length;
        s.closedCases  = c.filter(x => x.status === "CLOSED_SOLVED" || x.status === "CLOSED_UNSOLVED").length;
      }
      if (reports.status === "fulfilled") {
        const r = reports.value as any[];
        s.pendingReports = r.filter(x => x.status === "PENDING").length;
        s.urgentReports  = r.filter(x => x.isUrgent).length;
      }
      if (employees.status === "fulfilled") {
        const e = employees.value as any[];
        s.totalEmployees  = e.length;
        s.activeEmployees = e.filter(x => x.enabled !== false).length;
      }
      if (leaves.status === "fulfilled") {
        const l = leaves.value as any[];
        s.pendingLeave = l.filter(x => x.status === "PENDING").length;
      }
      if (traffic.status === "fulfilled") {
        const t = traffic.value as any[];
        s.totalTraffic   = t.length;
        s.pendingTraffic = t.filter(x => x.status === "PENDING").length;
      }
      if (missing.status === "fulfilled") {
        const m = missing.value as any[];
        s.totalMissing  = m.length;
        s.activeMissing = m.filter(x => x.status === "ACTIVE").length;
      }
      if (alive) setStats(s);
    }
    load();
    return () => { alive = false; };
  }, []);

  return stats;
}
