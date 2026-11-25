"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, AlertCircle, X, Mail, ArrowLeft, CheckCircle, Clock,
} from "lucide-react";
import { loginApi, roleDashboardMap, forgotPasswordApi } from "@/lib/api";
import { mockUsers, roleRedirectMap } from "@/lib/mock-data/auth";
import { saveSession, saveCitizenSession, isSessionAlive } from "@/lib/session";

const glassInput =
  "w-full h-11 px-4 text-sm text-white rounded-xl outline-none transition-all";
const glassInputStyle = {
  background: "rgba(255,255,255,0.07)",
  border: "1.5px solid rgba(255,255,255,0.15)",
};
function onFocusBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.border = "1.5px solid rgba(167,139,250,0.7)";
}
function onBlurBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.15)";
}

function Blobs() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-[-80px] bottom-[-60px] w-[340px] h-[340px] rounded-full opacity-60"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-[-60px] top-[10%] w-[260px] h-[260px] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-[10%] top-[-80px] w-[200px] h-[200px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
        }}
      />
    </>
  );
}

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [fpEmail, setFpEmail] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState("");
  const [fpDone, setFpDone] = useState(false);

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!fpEmail.trim()) return;
    setFpError("");
    setFpLoading(true);
    try {
      const res = await forgotPasswordApi(fpEmail.trim());
      if (res.success) {
        setFpDone(true);
      } else {
        setFpError(res.message || "Something went wrong.");
      }
    } catch {
      setFpError("Cannot reach server. Try again.");
    } finally {
      setFpLoading(false);
    }
  }

  return (
    <motion.div
      key="fp-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(5,2,20,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        key="fp-card"
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-[340px] rounded-3xl px-7 py-8"
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1.5px solid rgba(255,255,255,0.13)",
          boxShadow:
            "0 8px 48px 0 rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-purple-300 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <X size={14} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1.5px solid rgba(255,255,255,0.18)",
            }}
          >
            <img
              src="/images/hossana-logo.svg"
              alt="Hossana Police"
              className="w-9 h-9 object-contain"
            />
          </div>
          <p className="text-[10px] font-bold text-purple-300 tracking-[0.18em] uppercase">
            Hossana Police
          </p>
          <h2 className="text-[20px] font-bold text-white mt-1.5 tracking-tight">
            Reset Password
          </h2>
          <p className="text-[11px] text-purple-300/70 mt-1 text-center">
            Enter your email to receive an OTP
          </p>
        </div>

        <AnimatePresence mode="wait">
          {fpDone ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(134,239,172,0.15)",
                  border: "1.5px solid rgba(134,239,172,0.3)",
                }}
              >
                <CheckCircle size={28} className="text-green-300" />
              </div>
              <p className="text-white font-semibold text-sm text-center">
                OTP Sent!
              </p>
              <p className="text-purple-300/70 text-[11px] text-center leading-relaxed">
                Check your email inbox for the 6-digit OTP.
              </p>
              <button
                onClick={onClose}
                className="mt-3 w-full h-10 rounded-xl text-white text-xs font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                  border: "1px solid rgba(167,139,250,0.4)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
                }}
              >
                Back to Login
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleForgot}
              noValidate
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] text-purple-200 mb-1.5 font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    suppressHydrationWarning
                    className={`${glassInput} pl-9`}
                    style={glassInputStyle}
                    onFocus={onFocusBorder}
                    onBlur={onBlurBorder}
                  />
                </div>
              </div>

              <AnimatePresence>
                {fpError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-red-300"
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    {fpError}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={fpLoading || !fpEmail}
                className="w-full h-11 rounded-xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
                  border: "1px solid rgba(167,139,250,0.4)",
                }}
              >
                {fpLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                    Sending…
                  </>
                ) : (
                  "Send OTP"
                )}
              </motion.button>

              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] text-purple-300 hover:text-white transition-colors pt-1"
              >
                <ArrowLeft size={12} /> Back to Login
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // If already logged in, skip the login page entirely
  useEffect(() => {
    if (isSessionAlive()) {
      const user = JSON.parse(sessionStorage.getItem("hcops_user") ?? "{}");
      const dest = roleDashboardMap[user.role] ?? "/";
      router.replace(dest);
    }
  }, [router]);

  // Show "session expired" banner if middleware redirected here with ?next=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("next")) setSessionExpired(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await loginApi({ identifier: email.trim(), password });
      if (res.success && res.data) {
        const { accessToken, refreshToken, user } = res.data;
        // saveSession writes both sessionStorage AND cookies (for middleware)
        saveSession(accessToken, refreshToken, user);
        // replace = login page removed from history → back button can't return here
        router.replace(roleDashboardMap[user.role] ?? "/");
        return;
      }
      setError(res.message || "Invalid username or password.");
    } catch {
      // Backend unreachable — try local mock accounts
      const id = email.trim().toLowerCase();
      const found = mockUsers.find(
        (u) =>
          (u.email.toLowerCase() === id || u.name.toLowerCase() === id) &&
          u.password === password,
      );
      if (found) {
        saveSession("session-token", "", found);
        router.replace(roleRedirectMap[found.role] ?? "/");
        return;
      }
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 60% 40%, #3b1fa8 0%, #1a0a4a 40%, #0d0520 100%)" }}
    >
      {/* Hossana City background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hossana-city.webp')" }}
      />
      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0" style={{ background: "rgba(10, 5, 40, 0.72)" }} />

      <Blobs />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-[340px] rounded-3xl px-7 py-8"
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(255,255,255,0.13)",
          boxShadow:
            "0 8px 48px 0 rgba(109,40,217,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1.5px solid rgba(255,255,255,0.18)",
            }}
          >
            <img
              src="/images/hossana-logo.svg"
              alt="Hossana Police"
              className="w-10 h-10 object-contain"
            />
          </div>
          <p className="text-[11px] font-bold text-purple-300 tracking-[0.18em] uppercase">
            Hossana City Police
          </p>
          <h1 className="text-[22px] font-bold text-white mt-2 tracking-tight">
            Sign In
          </h1>
          <p className="text-[11px] text-purple-300/70 mt-1">
            Use your official credentials
          </p>
        </div>

        {/* Session expired banner */}
        <AnimatePresence>
          {sessionExpired && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] text-amber-300 mb-2"
              style={{
                background: "rgba(217,119,6,0.15)",
                border: "1px solid rgba(217,119,6,0.3)",
              }}
            >
              <Clock size={13} className="shrink-0" />
              Your session expired. Please sign in again.
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email / Username */}
          <div>
            <label className="block text-[11px] text-purple-200 mb-1.5 font-medium">
              Email address
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning
              className={glassInput}
              style={glassInputStyle}
              onFocus={onFocusBorder}
              onBlur={onBlurBorder}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] text-purple-200 mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suppressHydrationWarning
                className={`${glassInput} pr-10`}
                style={glassInputStyle}
                onFocus={onFocusBorder}
                onBlur={onBlurBorder}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[11px] text-purple-300 hover:text-white transition-colors hover:underline underline-offset-2"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                role="alert"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-red-300"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                <AlertCircle size={12} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading || !email || !password}
            className="w-full h-11 rounded-xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
              border: "1px solid rgba(167,139,250,0.4)",
            }}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Citizen access */}
          <div className="text-center pt-1">
            <p className="text-[11px] text-purple-300/70">Are you a citizen?</p>
            <button
              type="button"
              onClick={() => {
                saveCitizenSession();
                router.replace("/citizen");
              }}
              className="text-[11px] text-purple-300 hover:text-white underline underline-offset-2 transition-colors mt-0.5"
            >
              Access Citizen Services →
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showForgot && (
          <ForgotPasswordModal onClose={() => setShowForgot(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
