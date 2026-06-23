"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Loader2, ArrowLeft, Mail, Lock, EyeOff, Eye, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const cleanEmail = email.trim().toLowerCase();
  const otp = code.join("");

  const resetAlerts = () => {
    setMessage("");
    setError("");
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetAlerts();

    try {
      const res = await axios.post("/api/auth/forget-password/send-reset-code", {
        email: cleanEmail,
      });

      if (res.data.success) {
        setStep(2);
        setMessage(res.data.message||"If an account exists, an OTP has been sent.");
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetAlerts();

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/forget-password/verify-reset-code", {
        email: cleanEmail,
        code: otp,
      });

      if (res.data.success) {
        setStep(3);
        setMessage("OTP verified. You can now change your password.");
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetAlerts();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/forget-password/change-password", {
        email: cleanEmail,
        newPassword,
      });

      if (res.data.success) {
        setMessage("Password changed successfully. Redirecting...");
        setTimeout(() => router.push("/signin"), 700);
      } else {
        setError(res.data.message || "Failed to change password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePasteCode = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updatedCode = Array(6).fill("");
    pasted.split("").forEach((digit, index) => {
      updatedCode[index] = digit;
    });

    setCode(updatedCode);
    inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const goBackToEmail = () => {
    setStep(1);
    setCode(Array(6).fill(""));
    setNewPassword("");
    setConfirmPassword("");
    resetAlerts();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-0.5 bg-[#2563EB] rounded-3xl blur-2xl opacity-20" />

        <div className="relative bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-white/10 p-8 sm:p-10 flex flex-col gap-6">
          <Link
            href="/signin"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2563EB] mb-3">
              {step === 1 && <Mail className="w-8 h-8 text-white" />}
              {step === 2 && <ShieldCheck className="w-8 h-8 text-white" />}
              {step === 3 && <Lock className="w-8 h-8 text-white" />}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
              Reset Password
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Verify the 6-digit OTP sent to your email"}
              {step === 3 && "Create your new password"}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  required
                />
              </div>

              <button
                disabled={loading || !email.trim()}
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading && <Loader2 className="animate-spin h-4 w-4" />}
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-blue-700 dark:text-blue-300 text-sm text-center">
                  OTP sent to <strong>{cleanEmail}</strong>
                </p>
              </div>

              <div className="space-y-3">
                {/* <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  6-Digit OTP
                </label> */}

                <div className="flex justify-center gap-2 sm:gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePasteCode}
                      disabled={loading}
                      className="w-11 sm:w-12 h-11 text-center text-xl font-mono rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                  ))}
                </div>
              </div>

              <button
                disabled={loading || otp.length !== 6}
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading && <Loader2 className="animate-spin h-4 w-4" />}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={goBackToEmail}
                disabled={loading}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Change email or resend OTP
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    minLength={8}
                    className="w-full p-2 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full p-2 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading && <Loader2 className="animate-spin h-4 w-4" />}
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          )}

          {message && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 text-sm text-center font-medium">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}