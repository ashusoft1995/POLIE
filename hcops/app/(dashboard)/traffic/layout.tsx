"use client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, AlertTriangle, Car, BarChart2, UserCircle, Settings } from "lucide-react";
import { useUserName } from "@/lib/useSessionUser";

export default function TrafficLayout({ children }: { children: React.ReactNode }) {
  const userName = useUserName("Off. Kebede Alemu");
  const navItems = [
    { labelKey:"dashboard", label:"Dashboard",        href:"/traffic",           icon:LayoutDashboard },
    { labelKey:"accidents", label:"Accident Records", href:"/traffic/accidents", icon:AlertTriangle   },
    { labelKey:"register",  label:"Register Vehicle", href:"/traffic/register",  icon:Car             },
    { labelKey:"reports",   label:"Traffic Reports",  href:"/traffic/reports",   icon:BarChart2       },
    { labelKey:"profile",   label:"My Profile",       href:"/traffic/profile",   icon:UserCircle      },
    { labelKey:"settings",  label:"Settings",         href:"/traffic/settings",  icon:Settings        },
  ];
  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/traffic":           { title:"Dashboard",        breadcrumb:["Traffic Police","Dashboard"]        },
    "/traffic/accidents": { title:"Accident Records", breadcrumb:["Traffic Police","Accident Records"] },
    "/traffic/register":  { title:"Register Vehicle", breadcrumb:["Traffic Police","Register Vehicle"] },
    "/traffic/reports":   { title:"Traffic Reports",  breadcrumb:["Traffic Police","Traffic Reports"]  },
    "/traffic/profile":   { title:"My Profile",       breadcrumb:["Traffic Police","My Profile"]       },
    "/traffic/settings":  { title:"Settings",         breadcrumb:["Traffic Police","Settings"]         },
  };
  return (
    <DashboardShell navItems={navItems} roleLabel="Traffic Police" userName={userName}
      userRole="Traffic Officer" profileHref="/traffic/profile"
      settingsHref="/traffic/settings"
      metaMap={metaMap} fallbackMeta={{ title:"Traffic Police", breadcrumb:["Traffic Police"] }}>
      {children}
    </DashboardShell>
  );
}
