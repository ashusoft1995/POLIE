"use client";
import SettingsShell from "@/components/dashboard/SettingsShell";
export default function SettingsPage() {
  return <SettingsShell notifLabels={[{key:"email",label:"Email Notifications",sub:"Receive updates via email"},{key:"browser",label:"Browser Notifications",sub:"Show desktop alerts"},{key:"security",label:"Security Alerts",sub:"Login attempts and account changes"},{key:"system",label:"System Alerts",sub:"Maintenance and backup notifications"}]}/>;
}