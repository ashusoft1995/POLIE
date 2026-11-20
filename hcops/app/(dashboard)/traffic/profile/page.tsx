"use client";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function TrafficProfilePage() {
  return (
    <ProfileCard
      initial={{
        name:       "Kebede Alemu",
        email:      "traffic@hossanapolice.gov.et",
        phone:      "0911003003",
        badge:      "TRF-033",
        rank:       "Traffic Officer",
        department: "Traffic Police Division",
        location:   "Hossana City, Hadiya Zone",
        bio:        "Traffic Officer responsible for accident reporting, vehicle registration, and road safety enforcement across Hossana City.",
      }}
    />
  );
}
