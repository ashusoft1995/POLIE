"use client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { FolderOpen, FileText, Users, CheckSquare, UserCircle, Settings, LayoutDashboard, Scale } from "lucide-react";
import { useUserName } from "@/lib/useSessionUser";

export default function DetectiveLayout({ children }: { children: React.ReactNode }) {
  const userName = useUserName("Det. Abebe Girma");
  const navItems = [
    { labelKey:"dashboard",   label:"Dashboard",         href:"/detective",             icon:LayoutDashboard },
    { labelKey:"cases",       label:"My Assigned Cases", href:"/detective/cases",       icon:FolderOpen      },
    { labelKey:"evidence",    label:"Evidence & Notes",  href:"/detective/evidence",    icon:FileText        },
    { labelKey:"nominations", label:"Citizen Tips",      href:"/detective/nominations", icon:Users           },
    { labelKey:"closure",     label:"Request Closure",   href:"/detective/closure",     icon:CheckSquare     },
    { labelKey:"referrals",   label:"Court Referrals",   href:"/detective/referrals",   icon:Scale           },
    { labelKey:"profile",     label:"My Profile",        href:"/detective/profile",     icon:UserCircle      },
    { labelKey:"settings",    label:"Settings",          href:"/detective/settings",    icon:Settings        },
  ];
  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/detective":              { title:"Dashboard",        breadcrumb:["Detective","Dashboard"]        },
    "/detective/cases":        { title:"Assigned Cases",   breadcrumb:["Detective","Assigned Cases"]   },
    "/detective/evidence":     { title:"Evidence & Notes", breadcrumb:["Detective","Evidence & Notes"] },
    "/detective/nominations":  { title:"Citizen Tips",     breadcrumb:["Detective","Citizen Tips"]     },
    "/detective/closure":      { title:"Request Closure",  breadcrumb:["Detective","Request Closure"]  },
    "/detective/referrals":    { title:"Court Referrals",  breadcrumb:["Detective","Court Referrals"]  },
    "/detective/profile":      { title:"My Profile",       breadcrumb:["Detective","My Profile"]       },
    "/detective/settings":     { title:"Settings",         breadcrumb:["Detective","Settings"]         },
  };
  return (
    <DashboardShell navItems={navItems} roleLabel="Detective" userName={userName}
      userRole="Detective Sergeant" profileHref="/detective/profile"
      settingsHref="/detective/settings"
      metaMap={metaMap} fallbackMeta={{ title:"Detective", breadcrumb:["Detective"] }}>
      {children}
    </DashboardShell>
  );
}
