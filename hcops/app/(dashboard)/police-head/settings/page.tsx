"use client";
import SettingsShell from "@/components/dashboard/SettingsShell";
export default function SettingsPage() {
  return <SettingsShell notifLabels={[{key:"email",label:"Email Notifications",sub:"Receive updates via email"},{key:"browser",label:"Browser Notifications",sub:"Show desktop alerts"},{key:"closure",label:"Closure Request Alerts",sub:"Notify when a detective requests case closure"},{key:"assignment",label:"Case Assignment Alerts",sub:"Notify when a case is assigned to your command"}]}/>;
}