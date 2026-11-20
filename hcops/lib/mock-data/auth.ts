import type { Role } from "@/types";

export interface MockUser {
  id: string;
  name: string;
  badge: string;
  role: Role;
  rank: string;
  department: string;
  email: string;
  /** Plain-text — demo only. Never store real credentials this way. */
  password: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "U001",
    name: "Head Habtamu Woldemariam",
    badge: "PHD-001",
    role: "police-head",
    rank: "Head of Police",
    department: "Command",
    email: "head@hossanapolice.gov.et",
    password: "head123",
  },
  {
    id: "U002",
    name: "Det. Abebe Girma",
    badge: "DET-012",
    role: "detective",
    rank: "Detective Sergeant",
    department: "Criminal Investigation",
    email: "abebe.girma@hossanapolice.gov.et",
    password: "det123",
  },
  {
    id: "U003",
    name: "Off. Meron Tadesse",
    badge: "PRV-021",
    role: "preventive",
    rank: "Police Officer I",
    department: "Preventive Police",
    email: "meron.tadesse@hossanapolice.gov.et",
    password: "prev123",
  },
  {
    id: "U004",
    name: "Off. Kebede Alemu",
    badge: "TRF-033",
    role: "traffic",
    rank: "Traffic Officer",
    department: "Traffic Division",
    email: "kebede.alemu@hossanapolice.gov.et",
    password: "traffic123",
  },
  {
    id: "U005",
    name: "Insp. Almaz Bekele",
    badge: "HR-005",
    role: "hr",
    rank: "HR Inspector",
    department: "Human Resources",
    email: "almaz.bekele@hossanapolice.gov.et",
    password: "hr123",
  },
  {
    id: "U006",
    name: "Sys. Admin Yonas Tesfaye",
    badge: "ADM-001",
    role: "system-admin",
    rank: "System Administrator",
    department: "IT & Systems",
    email: "admin@hossanapolice.gov.et",
    password: "admin123",
  },
];

export const roleRedirectMap: Record<Role, string> = {
  "police-head": "/police-head",
  "detective": "/detective",
  "preventive": "/preventive",
  "traffic": "/traffic",
  "hr": "/hr",
  "system-admin": "/system-admin",
  "citizen": "/citizen",
};
