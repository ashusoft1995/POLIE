"use client";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function PreventiveProfilePage() {
  return (
    <ProfileCard
      initial={{
        name:       "Meron Tadesse",
        email:      "preventive@hossanapolice.gov.et",
        phone:      "0911002002",
        badge:      "PRV-021",
        rank:       "Police Officer I",
        department: "Preventive Police Division",
        location:   "Hossana City, Hadiya Zone",
        bio:        "Police Officer specialising in crime prevention, criminal registration, and community outreach programs.",
      }}
    />
  );
}
