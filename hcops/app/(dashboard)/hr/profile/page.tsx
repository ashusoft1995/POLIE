"use client";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function HRProfilePage() {
  return (
    <ProfileCard
      initial={{
        name:       "Almaz Worku",
        email:      "hr@hossanapolice.gov.et",
        phone:      "0911006006",
        badge:      "HR-005",
        rank:       "HR Inspector",
        department: "Human Resources Division",
        location:   "Hossana City, Hadiya Zone",
        bio:        "HR Inspector responsible for managing officer records, payroll, and leave management across all departments.",
      }}
    />
  );
}
