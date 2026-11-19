"use client";
import { useState, useEffect } from "react";

/** Returns a formatted date string, only computed on the client after mount. */
export function useDateString(
  locale = "en-ET",
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString(locale, options));
  }, []);
  return dateStr;
}

/** Returns today as YYYY-MM-DD, only on the client. */
export function useTodayISO(): string {
  const [iso, setIso] = useState("");
  useEffect(() => {
    setIso(new Date().toISOString().split("T")[0]);
  }, []);
  return iso;
}

/** Returns current time string HH:MM, only on the client. */
export function useTimeString(): string {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);
  return time;
}
