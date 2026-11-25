"use client";
import { useState, useEffect } from "react";

export interface SessionUser {
  id?: number;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  badge?: string;
  rank?: string;
  department?: string;
}

/** Reads the logged-in user from sessionStorage. Returns null during SSR. */
export function useSessionUser(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hcops_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser({
          id:         parsed.id,
          name:       parsed.fullName ?? parsed.name ?? parsed.username ?? "User",
          fullName:   parsed.fullName ?? parsed.name ?? parsed.username ?? "User",
          email:      parsed.email ?? "",
          role:       parsed.role ?? "",
          badge:      parsed.badge ?? parsed.badgeNumber ?? "",
          rank:       parsed.rank ?? "",
          department: parsed.department ?? "",
        });
      }
    } catch { /* ignore */ }
  }, []);

  return user;
}

/** Returns display name — falls back gracefully */
export function useUserName(fallback: string): string {
  const user = useSessionUser();
  return user?.name && user.name !== "User" ? user.name : fallback;
}
