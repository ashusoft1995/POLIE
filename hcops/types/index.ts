// ─── Shared domain types ──────────────────────────────────────

export type Role =
  | "police-head"
  | "detective"
  | "preventive"
  | "traffic"
  | "hr"
  | "system-admin"
  | "citizen";

export type CaseStatus =
  | "Open"
  | "Under Investigation"
  | "Pending Closure"
  | "Closed"
  | "Rejected";

export type Priority = "High" | "Medium" | "Low";

export interface Officer {
  id: string;
  name: string;
  badge: string;
  rank: string;
  department: string;
  status: "Active" | "On Leave" | "Suspended";
  avatar?: string;
}

export interface CrimeCase {
  id: string;
  trackingId: string;
  title: string;
  crimeType: string;
  reportedDate: string;
  location: string;
  status: CaseStatus;
  priority: Priority;
  assignedDetective?: string;
  closureRequested?: boolean;
  closureReason?: string;
}

export interface ClosureRequest {
  id: string;
  caseId: string;
  caseTitle: string;
  detective: string;
  requestDate: string;
  summary: string;
  evidence: string[];
  status: "Pending" | "Approved" | "Rejected";
}

export interface KPI {
  label: string;
  value: string | number;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  color: "green" | "yellow" | "pink" | "blue";
  icon: string;
}

export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  lastSeenLocation: string;
  lastSeenDate: string;
  description: string;
  status: "Missing" | "Wanted" | "Found";
  postedDate: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: "create" | "update" | "close" | "approve" | "reject" | "login";
}
