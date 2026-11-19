"use client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, Users, UserPlus, FileText, ArrowRight, UserCircle, Settings } from "lucide-react";
export default function PreventiveLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { labelKey:"dashboard",  label:"Dashboard",           href:"/preventive",             icon:LayoutDashboard },
    { labelKey:"criminals",  label:"Criminal Database",   href:"/preventive/criminals",   icon:Users           },
    { labelKey:"register",   label:"Register Criminal",   href:"/preventive/register",    icon:UserPlus        },
    { labelKey:"reports",    label:"Crime Reports",       href:"/preventive/reports",     icon:FileText        },
    { labelKey:"forward",    label:"Forward to Detective",href:"/preventive/forward",     icon:ArrowRight      },
    { labelKey:"profile",    label:"My Profile",          href:"/preventive/profile",     icon:UserCircle      },
    { labelKey:"settings",   label:"Settings",            href:"/preventive/settings",    icon:Settings        },
  ];
  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/preventive":            { title:"Dashboard",           breadcrumb:["Preventive Police","Dashboard"]           },
    "/preventive/criminals":  { title:"Criminal Database",   breadcrumb:["Preventive Police","Criminal Database"]   },
    "/preventive/register":   { title:"Register Criminal",   breadcrumb:["Preventive Police","Register Criminal"]   },
    "/preventive/reports":    { title:"Crime Reports",       breadcrumb:["Preventive Police","Crime Reports"]       },
    "/preventive/forward":    { title:"Forward to Detective",breadcrumb:["Preventive Police","Forward to Detective"]},
    "/preventive/profile":    { title:"My Profile",          breadcrumb:["Preventive Police","My Profile"]          },
    "/preventive/settings":   { title:"Settings",            breadcrumb:["Preventive Police","Settings"]            },
  };
  return (
    <DashboardShell navItems={navItems} roleLabel="Preventive Police" userName="Off. Meron Tadesse"
      userRole="Police Officer I" profileHref="/preventive/profile"
      metaMap={metaMap} fallbackMeta={{ title:"Preventive Police", breadcrumb:["Preventive Police"] }}>
      {children}
    </DashboardShell>
  );
}
