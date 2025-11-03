"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) setMessage(res.error);
    else {
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.push("/provider/dashboard"), 1000);
    }
  };

  const handleSignUpAsProvider = async () => {
    setSignupLoading(true);
    try {
      localStorage.removeItem("draftProviderId");

      const res = await fetch("/api/signup/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "provider" }),
      });

      const data = await res.json();
      if (data?.user?.user_id) {
        localStorage.setItem("draftProviderId", data.user.user_id);
        router.push(`/create?user_id=${data.user.user_id}`);
      } else {
        alert("Failed to create draft account.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Background glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-3xl blur-2xl opacity-20"></div>

        {/* Card */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-10 flex flex-col gap-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-cyan-200" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Sign in with email
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-200 to-blue-200" />
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
              <label className="text-gray-700 text-sm font-medium">
                Email or Username
              </label>
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition shadow-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-700 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600/60 focus:border-transparent transition shadow-sm"
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`mt-1 w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                loading
                  ? "bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2]   cursor-not-allowed"
                  : "bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2]   hover:shadow-xl hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-5" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Message */}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-sm font-medium ${
                message.includes("successful")
                  ? "text-cyan-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </motion.p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign Up as Provider */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={signupLoading}
            onClick={handleSignUpAsProvider}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
              signupLoading
                ? "bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2]   cursor-not-allowed"
                : "bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2]   hover:shadow-xl hover:scale-[1.02]"
            }`}
          >
            {signupLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Creating Account...
              </>
            ) : (
              "Sign Up as Provider"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
