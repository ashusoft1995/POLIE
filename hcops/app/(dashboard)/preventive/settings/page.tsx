"use client";
import SettingsShell from "@/components/dashboard/SettingsShell";
export default function SettingsPage() {
  return <SettingsShell notifLabels={[{key:"email",label:"Email Notifications",sub:"Receive updates via email"},{key:"browser",label:"Browser Notifications",sub:"Show desktop alerts"},{key:"criminal",label:"Criminal Record Alerts",sub:"Notify on new criminal registrations"},{key:"forward",label:"Forward Alerts",sub:"Notify on transfer updates"}]}/>;
}