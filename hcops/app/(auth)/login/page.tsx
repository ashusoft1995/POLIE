"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, X, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { loginApi, roleDashboardMap, forgotPasswordApi } from "@/lib/api";

/* ── Shared glass input style ─────────────────────────────────── */
const glassInput =
  "w-full h-11 px-4 text-sm text-white placeholder-transparent rounded-xl outline-none transition-all";
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

/* ── Google Icon ──────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"/>
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
    </svg>
  );
}

/* ── Decorative Blobs (shared background) ─────────────────────── */
function Blobs() {
  return (
    <>
      <div className="pointer-events-none absolute left-[-80px] bottom-[-60px] w-[340px] h-[340px] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute right-[-60px] top-[10%] w-[260px] h-[260px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute left-[10%] top-[-80px] w-[200px] h-[200px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
    </>
  );
}

/* ── Forgot Password Modal ────────────────────────────────────── */
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [fpEmail, setFpEmail]     = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError]     = useState("");
  const [fpDone, setFpDone]       = useState(false);

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!fpEmail.trim()) return;
    setFpError(""); setFpLoading(true);
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
    /* ── Backdrop ── */
    <motion.div
      key="fp-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(5,2,20,0.65)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Modal card ── */}
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
          boxShadow: "0 8px 48px 0 rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-purple-300 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <X size={14} />
        </button>

        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg overflow-hidden"
            style={{ background: "rgba(255,255,255,0.10)", border: "1.5px solid rgba(255,255,255,0.18)" }}
          >
            <img src="/images/hossana-logo.svg" alt="Hossana Police" className="w-9 h-9 object-contain" />
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
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(134,239,172,0.15)", border: "1.5px solid rgba(134,239,172,0.3)" }}>
                <CheckCircle size={28} className="text-green-300" />
              </div>
              <p className="text-white font-semibold text-sm text-center">OTP Sent!</p>
              <p className="text-purple-300/70 text-[11px] text-center leading-relaxed">
                Check your email inbox for the 6-digit OTP to reset your password.
              </p>
              <button
                onClick={onClose}
                className="mt-3 w-full h-10 rounded-xl text-white text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                  border: "1px solid rgba(167,139,250,0.4)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
                }}
              >
                Back to Login
              </button>
            </motion.div>
          ) : (
            /* ── Form state ── */
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
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={fpEmail}
                    onChange={e => setFpEmail(e.target.value)}
                    placeholder=""
                    suppressHydrationWarning
                    className={`${glassInput} pl-9`}
                    style={glassInputStyle}
                    onFocus={onFocusBorder}
                    onBlur={onBlurBorder}
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {fpError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-red-300"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    {fpError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={fpLoading || !fpEmail}
                className="w-full h-11 rounded-xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
                  border: "1px solid rgba(167,139,250,0.4)",
                }}
              >
                {fpLoading
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                  : "Send OTP"
                }
              </motion.button>

              {/* Back link */}
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

/* ── Login Page ───────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await loginApi({ identifier: email.trim(), password });
      if (!res.success || !res.data) {
        setError(res.message || "Invalid credentials.");
        setLoading(false); return;
      }
      const { accessToken, refreshToken, user } = res.data;
      sessionStorage.setItem("hcops_token",   accessToken);
      sessionStorage.setItem("hcops_refresh", refreshToken);
      sessionStorage.setItem("hcops_user",    JSON.stringify(user));
      router.push(roleDashboardMap[user.role] ?? "/");
    } catch {
      setError("Cannot reach server. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 60% 40%, #3b1fa8 0%, #1a0a4a 40%, #0d0520 100%)" }}
    >
      <Blobs />

      {/* ── Login card ── */}
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
          boxShadow: "0 8px 48px 0 rgba(109,40,217,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg overflow-hidden"
            style={{ background: "rgba(255,255,255,0.10)", border: "1.5px solid rgba(255,255,255,0.18)" }}
          >
            <img src="/images/hossana-logo.svg" alt="Hossana Police" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-[11px] font-bold text-purple-300 tracking-[0.18em] uppercase">Hossana Police</p>
          <h1 className="text-[22px] font-bold text-white mt-2 tracking-tight">Welcome Back</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-[11px] text-purple-200 mb-1.5 font-medium">Email address</label>
            <input
              type="text" autoComplete="username" required
              value={email} onChange={e => setEmail(e.target.value)}
              suppressHydrationWarning
              className={glassInput}
              style={glassInputStyle}
              onFocus={onFocusBorder}
              onBlur={onBlurBorder}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] text-purple-200 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                suppressHydrationWarning
                className={`${glassInput} pr-10`}
                style={glassInputStyle}
                onFocus={onFocusBorder}
                onBlur={onBlurBorder}
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Forgot password trigger */}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[11px] text-purple-300 hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                Forget Password ?
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                role="alert"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-red-300"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                <AlertCircle size={12} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login button */}
          <motion.button
            type="submit" whileTap={{ scale: 0.97 }}
            disabled={loading || !email || !password}
            className="w-full h-11 rounded-xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
              border: "1px solid rgba(167,139,250,0.4)",
            }}
          >
            {loading
              ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</>
              : "Login"
            }
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
            <span className="text-[10px] text-purple-300/70 font-medium">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
          </div>

          {/* Google */}
          <motion.button
            type="button" whileTap={{ scale: 0.97 }}
            onClick={() => setError("Google sign-in requires OAuth configuration.")}
            className="w-full h-11 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all"
            style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>
        </form>
      </motion.div>

      {/* ── Forgot Password Modal ── */}
      <AnimatePresence>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      </AnimatePresence>
    </div>
  );
}
