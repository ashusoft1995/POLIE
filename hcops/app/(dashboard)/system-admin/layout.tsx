"use client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, Users, Shield, Activity, Settings, UserCircle } from "lucide-react";
import { useUserName } from "@/lib/useSessionUser";

export default function SystemAdminLayout({ children }: { children: React.ReactNode }) {
  const userName = useUserName("Sys. Admin Daniel Kebede");
  const navItems = [
    { labelKey:"dashboard", label:"Dashboard",    href:"/system-admin",           icon:LayoutDashboard },
    { labelKey:"users",     label:"User Accounts",href:"/system-admin/users",     icon:Users           },
    { labelKey:"roles",     label:"Roles & Access",href:"/system-admin/roles",    icon:Shield          },
    { labelKey:"logs",      label:"Activity Logs", href:"/system-admin/logs",     icon:Activity        },
    { labelKey:"profile",   label:"My Profile",    href:"/system-admin/profile",  icon:UserCircle      },
    { labelKey:"settings",  label:"Settings",      href:"/system-admin/settings", icon:Settings        },
  ];
  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/system-admin":          { title:"Dashboard",     breadcrumb:["System Admin","Dashboard"]     },
    "/system-admin/users":    { title:"User Accounts", breadcrumb:["System Admin","User Accounts"] },
    "/system-admin/roles":    { title:"Roles & Access",breadcrumb:["System Admin","Roles & Access"]},
    "/system-admin/logs":     { title:"Activity Logs", breadcrumb:["System Admin","Activity Logs"] },
    "/system-admin/profile":  { title:"My Profile",    breadcrumb:["System Admin","My Profile"]    },
    "/system-admin/settings": { title:"Settings",      breadcrumb:["System Admin","Settings"]      },
  };
  return (
    <DashboardShell navItems={navItems} roleLabel="System Admin" userName={userName}
      userRole="System Administrator" profileHref="/system-admin/profile"
      settingsHref="/system-admin/settings"
      metaMap={metaMap} fallbackMeta={{ title:"System Admin", breadcrumb:["System Admin"] }}>
      {children}
    </DashboardShell>
  );
}
