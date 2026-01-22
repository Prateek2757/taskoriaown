"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post("/api/auth/forget-password/send-reset-code", {
        email: email.trim().toLowerCase(),
      });

      if (res.data.success) {
        setStep(2);
        setMessage("6-digit code sent to your email!");
      } else {
        setError(res.data.message || "Failed to send code");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

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
      const res = await axios.post("/api/auth/forget-password/verify-reset-code", {
        email: email.trim().toLowerCase(),
        code: code.trim(),
        newPassword,
      });

      if (res.data.success) {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => router.push("/signin"),400);
      } else {
        setError(res.data.message || "Invalid code or failed to reset");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 dark:opacity-30"></div>

        <div className="relative bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-white/10 p-10 flex flex-col gap-6 transition-colors">
          <Link
            href="/signin"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
              {step === 1 ? (
                <Mail className="w-8 h-8 text-white" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {step === 1
                ? "Enter your email to receive a 6-digit code"
                : "Enter the code and your new password"}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-5">
              <div className="space-y-1">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent shadow-sm transition"
                  required
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                type="submit"
                className={`mt-1 w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  loading
                    ? "bg-gradient-to-r from-blue-400 to-cyan-400 opacity-80"
                    : "bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 hover:shadow-xl hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-5" />
                    Sending Code...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </motion.button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-blue-700 dark:text-blue-300 text-sm text-center">
                  Code sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  6-Digit Code
                </label>
                <input
                  type="text"
                  placeholder="123654"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent shadow-sm transition text-center text-xl tracking-widest font-mono"
                  required
                  maxLength={6}
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent shadow-sm transition"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-transparent shadow-sm transition"
                  required
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                type="submit"
                className={`mt-1 w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  loading
                    ? "bg-gradient-to-r from-blue-400 to-cyan-400 opacity-80"
                    : "bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 hover:shadow-xl hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-5" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCode("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setMessage("");
                  setError("");
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
              >
                Didn't receive code? Try again
              </button>
            </form>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <p className="text-green-700 dark:text-green-300 text-sm text-center font-medium">
                {message}
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}