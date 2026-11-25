"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { INACTIVITY_MS, touchSession, getExpiry, clearSession, isSessionAlive } from "@/lib/session";

/** Show warning dialog 2 minutes before timeout */
const WARN_BEFORE_MS = 2 * 60 * 1000;

/** How often we poll the expiry clock (ms) */
const TICK_MS = 10_000;

export interface SessionTimeoutState {
  /** true = show the "you are about to be logged out" warning */
  showWarning: boolean;
  /** seconds remaining when warning is shown */
  secondsLeft: number;
  /** call this to extend the session and dismiss the warning */
  extendSession: () => void;
  /** call this to logout immediately */
  logoutNow: () => void;
}

export function useSessionTimeout(): SessionTimeoutState {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const doLogout = useCallback(() => {
    clearSession();
    setShowWarning(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    // replace = removes dashboard from history → back button goes to login, not dashboard
    router.replace("/login");
  }, [router]);

  const extendSession = useCallback(() => {
    touchSession();
    setShowWarning(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  /* ── Activity listeners — reset idle clock on any interaction ── */
  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll", "click"];
    const handler = () => { if (isSessionAlive()) touchSession(); };
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, []);

  /* ── Poll the expiry clock every 10s ───────────────────────── */
  useEffect(() => {
    pollRef.current = setInterval(() => {
      if (!isSessionAlive()) {
        doLogout();
        return;
      }
      const msLeft = getExpiry() - Date.now();

      if (msLeft <= WARN_BEFORE_MS && !showWarning) {
        // Enter warning state — start second-by-second countdown
        setShowWarning(true);
        setSecondsLeft(Math.ceil(msLeft / 1000));

        countdownRef.current = setInterval(() => {
          setSecondsLeft(prev => {
            const next = prev - 1;
            if (next <= 0) {
              doLogout();
              return 0;
            }
            return next;
          });
        }, 1000);
      }
    }, TICK_MS);

    return () => {
      if (pollRef.current)   clearInterval(pollRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [doLogout, showWarning]);

  return { showWarning, secondsLeft, extendSession, logoutNow: doLogout };
}
