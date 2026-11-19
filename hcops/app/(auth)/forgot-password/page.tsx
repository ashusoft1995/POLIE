"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Eye, EyeOff, Lock } from "lucide-react";
import { forgotPasswordApi, verifyOtpApi, resetPasswordApi } from "@/lib/api";
import { useTheme } from "@/lib/theme-context";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { dark } = useTheme();

  const [step,       setStep]       = useState<Step>("email");
  const [email,      setEmail]      = useState("");
  const [otp,        setOtp]        = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [message,    setMessage]    = useState("");

  /* ── Step 1: request OTP ────────────────────────────────────── */
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await forgotPasswordApi(email.trim());
      setMessage(res.message);
      setStep("otp");
    } catch {
      setError("Could not connect to the server.");
    } finally { setLoading(false); }
  }

  /* ── Step 2: verify OTP ─────────────────────────────────────── */
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await verifyOtpApi(email.trim(), otp.trim());
      if (!res.success) { setError(res.message); setLoading(false); return; }
      setStep("reset");
    } catch {
      setError("Could not connect to the server.");
    } finally { setLoading(false); }
  }

  /* ── Step 3: reset password ─────────────────────────────────── */
  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    if (newPw.length < 8)   { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await resetPasswordApi(email.trim(), otp.trim(), newPw);
      if (!res.success) { setError(res.message); setLoading(false); return; }
      setStep("done");
    } catch {
      setError("Could not connect to the server.");
    } finally { setLoading(false); }
  }

  const stepLabels = ["Request OTP", "Verify OTP", "New Password"];
  const stepIndex  = step === "email" ? 0 : step === "otp" ? 1 : step === "reset" ? 2 : 3;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E2E8F0]">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#102A43] to-[#2563EB] px-7 py-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-white/15 flex items-center justify-center shadow-xl ring-4 ring-white/20 overflow-hidden mb-4">
              <img src="/images/hossana-logo.svg" alt="Hossana Police" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-lg font-extrabold text-white">Forgot Password</h1>
            <p className="text-xs text-blue-100 mt-1">Hossana City Police Station</p>

            {/* Stepper */}
            {step !== "done" && (
              <div className="flex items-center gap-2 mt-5">
                {stepLabels.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      i < stepIndex   ? "bg-[#15803D] text-white" :
                      i === stepIndex ? "bg-white text-[#102A43]" :
                      "bg-white/20 text-white/60"
                    }`}>
                      <span>{i < stepIndex ? "✓" : i + 1}</span>
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                    {i < 2 && <div className={`w-6 h-px ${i < stepIndex ? "bg-white" : "bg-white/30"}`} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-7 py-7">

            {/* ── Step 1: Email ── */}
            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.form key="email" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  onSubmit={handleRequestOtp} className="space-y-5">
                  <div>
                    <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
                      Enter your registered email address and we'll send you a 6-digit OTP.
                    </p>
                    <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@hossanapolice.gov.et" className="input pl-10" />
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
                  <button type="submit" disabled={loading || !email}
                    className="btn-primary w-full">
                    {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</> : "Send OTP"}
                  </button>
                </motion.form>
              )}

              {/* ── Step 2: OTP ── */}
              {step === "otp" && (
                <motion.form key="otp" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  onSubmit={handleVerifyOtp} className="space-y-5">
                  <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
                    {message || "Check your email for the 6-digit OTP. It expires in 15 minutes."}
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                      6-Digit OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input type="text" required maxLength={6} value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="input pl-10 tracking-[0.4em] text-center text-xl font-bold" />
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
                  <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full">
                    {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying…</> : "Verify OTP"}
                  </button>
                  <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                    className="w-full text-sm text-[#2563EB] hover:underline">
                    ← Resend OTP
                  </button>
                </motion.form>
              )}

              {/* ── Step 3: New Password ── */}
              {step === "reset" && (
                <motion.form key="reset" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  onSubmit={handleReset} className="space-y-4">
                  <p className="text-sm text-[#64748B] mb-2">OTP verified! Set your new password.</p>
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input type={showPw ? "text" : "password"} required value={newPw}
                        onChange={e => setNewPw(e.target.value)} placeholder="Min 8 characters"
                        className="input pl-10 pr-11" />
                      <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input type={showPw ? "text" : "password"} required value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat password"
                        className="input pl-10" />
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
                  <button type="submit" disabled={loading || !newPw || !confirmPw} className="btn-primary w-full">
                    {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</> : "Reset Password"}
                  </button>
                </motion.form>
              )}

              {/* ── Step 4: Done ── */}
              {step === "done" && (
                <motion.div key="done" initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
                  className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} className="text-[#15803D]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#243B53]">Password Reset!</h3>
                  <p className="text-sm text-[#64748B]">
                    Your password has been updated. You can now log in with your new password.
                  </p>
                  <button onClick={() => router.push("/login")} className="btn-primary w-full">
                    Go to Login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to login */}
            {step !== "done" && (
              <div className="mt-5 text-center">
                <button onClick={() => router.push("/login")}
                  className="text-xs text-[#64748B] hover:text-[#2563EB] flex items-center gap-1 mx-auto transition-colors">
                  <ArrowLeft size={12} /> Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

