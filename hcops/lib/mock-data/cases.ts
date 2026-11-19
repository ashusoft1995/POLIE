import type { CrimeCase, ClosureRequest, MissingPerson, ActivityLog } from "@/types";

export const mockCases: CrimeCase[] = [
  {
    id: "C001",
    trackingId: "TRK-2024-001",
    title: "Armed Robbery at Hossana Market",
    crimeType: "Robbery",
    reportedDate: "2024-11-10",
    location: "Hossana Main Market, Hadiya Zone",
    status: "Under Investigation",
    priority: "High",
    assignedDetective: "Det. Abebe Girma",
    closureRequested: false,
  },
  {
    id: "C002",
    trackingId: "TRK-2024-002",
    title: "Vehicle Theft Near Bus Station",
    crimeType: "Theft",
    reportedDate: "2024-11-14",
    location: "Hossana Bus Terminal",
    status: "Open",
    priority: "Medium",
    assignedDetective: undefined,
    closureRequested: false,
  },
  {
    id: "C003",
    trackingId: "TRK-2024-003",
    title: "Assault and Battery — Residential Area",
    crimeType: "Assault",
    reportedDate: "2024-11-18",
    location: "Kebele 03, Hossana",
    status: "Pending Closure",
    priority: "High",
    assignedDetective: "Det. Tigist Mekonnen",
    closureRequested: true,
    closureReason: "Suspect apprehended; victim statement recorded; sufficient evidence gathered.",
  },
  {
    id: "C004",
    trackingId: "TRK-2024-004",
    title: "Fraud and Document Forgery",
    crimeType: "Fraud",
    reportedDate: "2024-11-20",
    location: "Hossana Town Administrative Office",
    status: "Under Investigation",
    priority: "Medium",
    assignedDetective: "Det. Abebe Girma",
    closureRequested: false,
  },
  {
    id: "C005",
    trackingId: "TRK-2024-005",
    title: "Vandalism of Public Property",
    crimeType: "Vandalism",
    reportedDate: "2024-11-22",
    location: "Hossana Stadium Vicinity",
    status: "Open",
    priority: "Low",
    closureRequested: false,
  },
  {
    id: "C006",
    trackingId: "TRK-2024-006",
    title: "Drug Possession — Market District",
    crimeType: "Drug Offence",
    reportedDate: "2024-11-25",
    location: "Hossana Market District",
    status: "Closed",
    priority: "High",
    assignedDetective: "Det. Lemlem Haile",
    closureRequested: false,
  },
];

export const mockClosureRequests: ClosureRequest[] = [
  {
    id: "CR001",
    caseId: "C003",
    caseTitle: "Assault and Battery — Residential Area",
    detective: "Det. Tigist Mekonnen",
    requestDate: "2024-11-28",
    summary:
      "Investigation complete. Suspect Dawit Bekele (Badge Ref: S-4421) has been apprehended. Victim Almaz Worku provided a signed statement. Forensic evidence from the scene corroborates the report. Requesting formal case closure.",
    evidence: [
      "Victim statement — Almaz Worku (signed)",
      "Forensic scene photographs (12 items)",
      "CCTV footage extract — 2024-11-18 21:34",
      "Medical examination report",
    ],
    status: "Pending",
  },
];

export const mockMissingPersons: MissingPerson[] = [
  {
    id: "MP001",
    name: "Biruk Alemu",
    age: 17,
    lastSeenLocation: "Hossana Secondary School, Kebele 05",
    lastSeenDate: "2024-11-20",
    description: "Male, medium build, last seen wearing a blue school uniform.",
    status: "Missing",
    postedDate: "2024-11-21",
  },
  {
    id: "MP002",
    name: "Selamawit Desta",
    age: 34,
    lastSeenLocation: "Hossana Weekly Market",
    lastSeenDate: "2024-11-15",
    description: "Female, tall, wearing a yellow traditional dress. Has a scar on left forearm.",
    status: "Missing",
    postedDate: "2024-11-16",
  },
  {
    id: "MP003",
    name: "Yonas Tesfaye",
    age: 28,
    lastSeenLocation: "Hosanna Town, near bus terminal",
    lastSeenDate: "2024-10-30",
    description: "Male, wanted in connection with armed robbery case TRK-2024-001.",
    status: "Wanted",
    postedDate: "2024-11-01",
  },
];

export const mockActivityLog: ActivityLog[] = [
  { id: "A1", user: "Chief Habtamu Woldemariam", action: "Approved closure", target: "Case TRK-2024-006", timestamp: "2024-11-27 09:14", type: "approve" },
  { id: "A2", user: "Det. Abebe Girma", action: "Added evidence", target: "Case TRK-2024-001", timestamp: "2024-11-26 15:30", type: "update" },
  { id: "A3", user: "Det. Tigist Mekonnen", action: "Requested closure", target: "Case TRK-2024-003", timestamp: "2024-11-25 11:05", type: "close" },
  { id: "A4", user: "Off. Meron Tadesse", action: "Registered new criminal record", target: "CR-2024-089", timestamp: "2024-11-24 08:50", type: "create" },
  { id: "A5", user: "Chief Habtamu Woldemariam", action: "Assigned detective", target: "Case TRK-2024-004", timestamp: "2024-11-23 10:00", type: "update" },
  { id: "A6", user: "Traffic Off. Kebede Alemu", action: "Filed accident report", target: "ACC-2024-033", timestamp: "2024-11-22 16:45", type: "create" },
];

export const mockCrimeChartData = [
  { month: "Jun", robbery: 4, theft: 7, assault: 3, fraud: 2, vandalism: 1 },
  { month: "Jul", robbery: 6, theft: 5, assault: 5, fraud: 3, vandalism: 2 },
  { month: "Aug", robbery: 3, theft: 9, assault: 4, fraud: 4, vandalism: 3 },
  { month: "Sep", robbery: 7, theft: 6, assault: 6, fraud: 2, vandalism: 1 },
  { month: "Oct", robbery: 5, theft: 8, assault: 5, fraud: 5, vandalism: 4 },
  { month: "Nov", robbery: 8, theft: 10, assault: 7, fraud: 3, vandalism: 2 },
];

export const mockCaseStatusPie = [
  { name: "Open", value: 14, color: "#FACC15" },
  { name: "Under Investigation", value: 22, color: "#3B82F6" },
  { name: "Pending Closure", value: 6, color: "#EC4899" },
  { name: "Closed", value: 38, color: "#16A34A" },
];
