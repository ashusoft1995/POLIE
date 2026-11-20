"use client";
import SettingsShell from "@/components/dashboard/SettingsShell";
export default function SettingsPage() {
  return <SettingsShell notifLabels={[{key:"email",label:"Email Notifications",sub:"Receive updates via email"},{key:"browser",label:"Browser Notifications",sub:"Show desktop alerts"},{key:"accident",label:"Accident Alerts",sub:"Notify on new accident reports"},{key:"vehicle",label:"Vehicle Alerts",sub:"Notify on vehicle registration updates"}]}/>;
}