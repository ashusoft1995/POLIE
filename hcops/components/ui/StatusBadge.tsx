"use client";

const map: Record<string, string> = {
  "Open":                 "badge badge-yellow",
  "Under Investigation":  "badge badge-blue",
  "Pending Closure":      "badge badge-pink",
  "Closed":               "badge badge-green",
  "Rejected":             "badge badge-red",
  "Active":               "badge badge-green",
  "On Leave":             "badge badge-yellow",
  "Suspended":            "badge badge-red",
  "Missing":              "badge badge-yellow",
  "Wanted":               "badge badge-red",
  "Found":                "badge badge-green",
  "High":                 "badge badge-red",
  "Medium":               "badge badge-yellow",
  "Low":                  "badge badge-gray",
  "Pending":              "badge badge-yellow",
  "Approved":             "badge badge-green",
};

export default function StatusBadge({ label }: { label: string }) {
  return <span className={map[label] ?? "badge badge-gray"}>{label}</span>;
}
