"use client";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function DetectiveProfilePage() {
  return (
    <ProfileCard
      initial={{
        name:       "Abebe Girma",
        email:      "detective@hossanapolice.gov.et",
        phone:      "0911001001",
        badge:      "DET-012",
        rank:       "Detective Sergeant",
        department: "Criminal Investigations Division",
        location:   "Hossana City, Hadiya Zone",
        bio:        "Detective Sergeant with 6 years in CID. Specialises in armed robbery and assault investigations.",
      }}
      badgeVariant="blue"
    />
  );
}
