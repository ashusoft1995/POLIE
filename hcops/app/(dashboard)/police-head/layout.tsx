"use client";
import {
  LayoutDashboard, FolderOpen, CheckSquare,
  Users, UserX, BarChart2, Settings, UserCircle, Scale, FileSearch,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { t } from "@/lib/i18n";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useUserName } from "@/lib/useSessionUser";

export default function PoliceHeadLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useTheme();
  const tr = t[lang];
  const userName = useUserName("Head Habtamu Woldemariam");

  const navItems = [
    { labelKey: "dashboard",          label: tr.dashboard,          href: "/police-head",                icon: LayoutDashboard },
    { labelKey: "caseManagement",     label: tr.caseManagement,     href: "/police-head/cases",          icon: FolderOpen },
    { labelKey: "closureReview",      label: tr.closureReview,      href: "/police-head/closure-review", icon: CheckSquare },
    { labelKey: "crimeReports",       label: "Crime Reports",       href: "/police-head/crime-reports",  icon: FileSearch },
    { labelKey: "officerOverview",    label: tr.officerOverview,    href: "/police-head/officers",       icon: Users },
    { labelKey: "missingPersons",     label: tr.missingPersons,     href: "/police-head/missing-persons",icon: UserX },
    { labelKey: "referrals",          label: "Court Referrals",     href: "/police-head/referrals",      icon: Scale },
    { labelKey: "statisticalReports", label: tr.statisticalReports, href: "/police-head/reports",        icon: BarChart2 },
    { labelKey: "settings",           label: tr.settings,           href: "/police-head/settings",       icon: Settings },
    { labelKey: "profile",            label: "My Profile",          href: "/police-head/profile",        icon: UserCircle },
  ];

  const metaMap: Record<string, { title: string; breadcrumb: string[] }> = {
    "/police-head":                 { title: tr.dashboard,          breadcrumb: ["Police Head", tr.dashboard] },
    "/police-head/cases":           { title: tr.caseManagement,     breadcrumb: ["Police Head", tr.caseManagement] },
    "/police-head/closure-review":  { title: tr.closureReview,      breadcrumb: ["Police Head", tr.closureReview] },
    "/police-head/crime-reports":   { title: "Crime Reports",        breadcrumb: ["Police Head", "Crime Reports"] },
    "/police-head/officers":        { title: tr.officerOverview,    breadcrumb: ["Police Head", tr.officerOverview] },
    "/police-head/missing-persons": { title: tr.missingPersons,     breadcrumb: ["Police Head", tr.missingPersons] },
    "/police-head/referrals":        { title: "Court Referrals",      breadcrumb: ["Police Head", "Court Referrals"] },
    "/police-head/reports":         { title: tr.statisticalReports, breadcrumb: ["Police Head", tr.statisticalReports] },
    "/police-head/settings":        { title: tr.settings,           breadcrumb: ["Police Head", tr.settings] },
    "/police-head/profile":         { title: "My Profile",          breadcrumb: ["Police Head", "My Profile"] },
  };

  return (
    <DashboardShell
      navItems={navItems}
      roleLabel={tr.policeHead}
      userName={userName}
      userRole={tr.headOfPolice}
      profileHref="/police-head/profile"
      settingsHref="/police-head/settings"
      metaMap={metaMap}
      fallbackMeta={{ title: "Police Head", breadcrumb: ["Police Head"] }}
    >
      {children}
    </DashboardShell>
  );
}
