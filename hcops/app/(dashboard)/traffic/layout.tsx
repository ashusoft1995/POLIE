"use client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, AlertTriangle, FilePlus, BarChart2, UserCircle, Settings } from "lucide-react";
export default function TrafficLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { labelKey:"dashboard", label:"Dashboard",         href:"/traffic",           icon:LayoutDashboard },
    { labelKey:"accidents", label:"Accident Records",  href:"/traffic/accidents", icon:AlertTriangle   },
    { labelKey:"register",  label:"Register Accident", href:"/traffic/register",  icon:FilePlus        },
    { labelKey:"reports",   label:"Accident Reports",  href:"/traffic/reports",   icon:BarChart2       },
    { labelKey:"profile",   label:"My Profile",        href:"/traffic/profile",   icon:UserCircle      },
    { labelKey:"settings",  label:"Settings",          href:"/traffic/settings",  icon:Settings        },
  ];
  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/traffic":           { title:"Dashboard",         breadcrumb:["Traffic Police","Dashboard"]         },
    "/traffic/accidents": { title:"Accident Records",  breadcrumb:["Traffic Police","Accident Records"]  },
    "/traffic/register":  { title:"Register Accident", breadcrumb:["Traffic Police","Register Accident"] },
    "/traffic/reports":   { title:"Accident Reports",  breadcrumb:["Traffic Police","Accident Reports"]  },
    "/traffic/profile":   { title:"My Profile",        breadcrumb:["Traffic Police","My Profile"]        },
    "/traffic/settings":  { title:"Settings",          breadcrumb:["Traffic Police","Settings"]          },
  };
  return (
    <DashboardShell navItems={navItems} roleLabel="Traffic Police" userName="Off. Kebede Alemu"
      userRole="Traffic Officer" profileHref="/traffic/profile"
      settingsHref="/traffic/settings"
      metaMap={metaMap} fallbackMeta={{ title:"Traffic Police", breadcrumb:["Traffic Police"] }}>
      {children}
    </DashboardShell>
  );
}
