"use client";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function PoliceHeadProfilePage() {
  return (
    <ProfileCard
      initial={{
        name:       "Habtamu Woldemariam",
        email:      "head@hossanapolice.gov.et",
        phone:      "0912345678",
        badge:      "PHD-001",
        rank:       "Head of Police",
        department: "Command Division",
        location:   "Hossana City, Hadiya Zone",
        bio:        "Head of Police with over 20 years of service in the Hossana City Police Force. Committed to community safety and professional law enforcement.",
      }}
      badgeVariant="yellow"
    />
  );
}
