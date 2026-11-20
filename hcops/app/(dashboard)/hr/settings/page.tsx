"use client";
import SettingsShell from "@/components/dashboard/SettingsShell";
export default function SettingsPage() {
  return <SettingsShell notifLabels={[{key:"email",label:"Email Notifications",sub:"Receive updates via email"},{key:"browser",label:"Browser Notifications",sub:"Show desktop alerts"},{key:"leave",label:"Leave Request Alerts",sub:"Notify on new leave requests"},{key:"payroll",label:"Payroll Alerts",sub:"Notify on payroll processing"}]}/>;
}