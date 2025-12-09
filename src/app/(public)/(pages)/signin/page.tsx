"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import axios from "axios";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  const { joinAsProvider, loading: joinLoading } = useJoinAsProvider();

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



    const savedLead = localStorage.getItem("pendingpayload");
    if (savedLead) {
      try {
        const payload = JSON.parse(savedLead);

        const submitRes = await axios.post("/api/leads", payload);
        if (!submitRes.data.error) {
          localStorage.removeItem("pendingpayload")
          localStorage.setItem("viewMode" , "customer")
          window.dispatchEvent(new Event("viewModeChanged"))
        }
        setMessage("Request Submit Sucessfully!Redirecting...")
        setTimeout(() => router.push("/customer/dashboard"))
       return;
      } catch (error) {
        console.error("Auto Submit Failed", error)
      }
    }


    setMessage("Login successful! Redirecting...");
    setTimeout(() => router.push("/provider/dashboard"));


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
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-gray-700 dark:to-gray-600" />
            <span className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide">
              Sign in with email
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-gray-600 dark:to-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
              <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Email or Username
              </label>
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent shadow-sm transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-transparent shadow-sm transition"
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`mt-1 w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white shadow-lg transition-all ${loading
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 opacity-80"
                  : "bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 hover:shadow-xl hover:scale-[1.02]"
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

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-sm font-medium ${message.includes("successful")
                  ? "text-cyan-500"
                  : "text-red-500"
                }`}
            >
              {message}
            </motion.p>
          )}

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Or
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
<button
  onClick={() => signIn("google", { callbackUrl: "/provider/dashboard" })}
  className="mt-2 w-full flex items-center justify-center p-3 dark:text-gray-300 dark:bg-black rounded-xl
  bg-white border border-gray-500 shadow-sm hover:bg-gray-100"
>
  <img src="/images/googleicon.svg" className="w-5 h-5 mr-2" />
  Sign in with Google
</button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={joinLoading}
            onClick={joinAsProvider}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white shadow-lg transition-all ${joinLoading
                ? "bg-gradient-to-r from-blue-400 to-cyan-400 opacity-80"
                : "bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 hover:shadow-xl hover:scale-[1.02]"
              }`}
          >
            {joinLoading ? (
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
