"use client";
import SettingsShell from "@/components/dashboard/SettingsShell";
export default function SettingsPage() {
  return <SettingsShell notifLabels={[{key:"email",label:"Email Notifications",sub:"Receive updates via email"},{key:"browser",label:"Browser Notifications",sub:"Show desktop alerts"},{key:"closure",label:"Closure Request Alerts",sub:"Notify when your closure request is reviewed"},{key:"evidence",label:"Evidence Alerts",sub:"Notify when evidence is requested"}]}/>;
}