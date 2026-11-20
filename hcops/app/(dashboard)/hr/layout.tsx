"use client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, Users, UserPlus, CalendarDays, DollarSign, UserCircle, Settings } from "lucide-react";
export default function HRLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { labelKey:"dashboard", label:"Dashboard",       href:"/hr",           icon:LayoutDashboard },
    { labelKey:"officers",  label:"Officer Directory",href:"/hr/officers",  icon:Users           },
    { labelKey:"register",  label:"Register Officer", href:"/hr/register",  icon:UserPlus        },
    { labelKey:"leave",     label:"Leave Requests",   href:"/hr/leave",     icon:CalendarDays    },
    { labelKey:"payroll",   label:"Payroll",          href:"/hr/payroll",   icon:DollarSign      },
    { labelKey:"profile",   label:"My Profile",       href:"/hr/profile",   icon:UserCircle      },
    { labelKey:"settings",  label:"Settings",         href:"/hr/settings",  icon:Settings        },
  ];
  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/hr":           { title:"Dashboard",        breadcrumb:["HR Manager","Dashboard"]        },
    "/hr/officers":  { title:"Officer Directory", breadcrumb:["HR Manager","Officer Directory"] },
    "/hr/register":  { title:"Register Officer",  breadcrumb:["HR Manager","Register Officer"]  },
    "/hr/leave":     { title:"Leave Requests",    breadcrumb:["HR Manager","Leave Requests"]    },
    "/hr/payroll":   { title:"Payroll",           breadcrumb:["HR Manager","Payroll"]           },
    "/hr/profile":   { title:"My Profile",        breadcrumb:["HR Manager","My Profile"]        },
    "/hr/settings":  { title:"Settings",          breadcrumb:["HR Manager","Settings"]          },
  };
  return (
    <DashboardShell navItems={navItems} roleLabel="HR Manager" userName="Insp. Almaz Bekele"
      userRole="HR Inspector" profileHref="/hr/profile"
      settingsHref="/hr/settings"
      metaMap={metaMap} fallbackMeta={{ title:"HR Manager", breadcrumb:["HR Manager"] }}>
      {children}
    </DashboardShell>
  );
}
