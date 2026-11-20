"use client";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function SystemAdminProfilePage() {
  return (
    <ProfileCard
      initial={{
        name:       "Daniel Kebede",
        email:      "admin@hossanapolice.gov.et",
        phone:      "0911009009",
        badge:      "ADM-001",
        rank:       "System Administrator",
        department: "IT & Systems Division",
        location:   "Hossana City, Hadiya Zone",
        bio:        "System Administrator responsible for user accounts, system security, access control, and IT infrastructure.",
      }}
      badgeVariant="yellow"
    />
  );
}
