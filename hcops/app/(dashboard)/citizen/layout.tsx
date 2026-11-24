"use client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  AlertCircle,
  Car,
  UserX,
  Award,
  Search,
} from "lucide-react";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { labelKey: "dashboard",  label: "Citizen Services",  href: "/citizen",            icon: LayoutDashboard },
    { labelKey: "report",     label: "Report Crime",      href: "/citizen/report",     icon: AlertCircle     },
    { labelKey: "traffic",    label: "Traffic Incident",  href: "/citizen/traffic",    icon: Car             },
    { labelKey: "missing",    label: "Missing Person",    href: "/citizen/missing",    icon: UserX           },
    { labelKey: "nomination", label: "Nominate Officer",  href: "/citizen/nomination", icon: Award           },
    { labelKey: "track",      label: "Track Report",      href: "/citizen/track",      icon: Search          },
  ];

  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/citizen":            { title: "Citizen Services",  breadcrumb: ["Citizen", "Services"]          },
    "/citizen/report":     { title: "Report a Crime",    breadcrumb: ["Citizen", "Report Crime"]      },
    "/citizen/traffic":    { title: "Traffic Incident",  breadcrumb: ["Citizen", "Traffic Incident"]  },
    "/citizen/missing":    { title: "Missing Person",    breadcrumb: ["Citizen", "Missing Person"]    },
    "/citizen/nomination": { title: "Nominate Officer",  breadcrumb: ["Citizen", "Nominate Officer"]  },
    "/citizen/track":      { title: "Track Your Report", breadcrumb: ["Citizen", "Track Report"]      },
  };

  return (
    <DashboardShell
      navItems={navItems}
      roleLabel="Citizen"
      userName="Welcome, Citizen"
      userRole="Public Services"
      profileHref="/citizen"
      metaMap={metaMap}
      fallbackMeta={{ title: "Citizen Services", breadcrumb: ["Citizen"] }}
    >
      {children}
    </DashboardShell>
  );
}
