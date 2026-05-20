"use client";

import { type ComponentType, Suspense, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Loader2,
 
} from "lucide-react";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveRedirect(opts: {
  hasPendingLead: boolean;
  resumeRequest: boolean;
  next: string | null;
}): string {
  if (opts.hasPendingLead) return "/customer/dashboard";
  if (opts.resumeRequest && opts.next) return opts.next;
  return "/provider/dashboard";
}


function SignInForm() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [message, setMessage]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router                          = useRouter();
  const { joinAsProvider, loading: joinLoading } = useJoinAsProvider();
  const searchParams                    = useSearchParams();
  const next                            = searchParams.get("next");
  const resumeRequest                   = searchParams.get("resume_request") === "1";

  useEffect(() => {
    router.prefetch("/provider/dashboard");
    router.prefetch("/customer/dashboard");
    if (next) router.prefetch(next);
  }, [router, next]);

  useEffect(() => {
    const hasPending = !!localStorage.getItem("pendingpayload");
    localStorage.setItem("viewMode", hasPending ? "customer" : "provider");
    window.dispatchEvent(new Event("viewModeChanged"));
  }, []);

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    if (error === "not_registered") {
      setMessage("This Google account is not registered. Create an account first.");
    } else if (error === "OAuthAccountNotLinked") {
      setMessage("This email is already linked to a different sign-in method.");
    }

    const base =
      resumeRequest && next
        ? `/signin?next=${encodeURIComponent(next)}&resume_request=1`
        : "/signin";
    router.replace(base, { scroll: false });
  }, [searchParams, router, next, resumeRequest]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!EMAIL_RE.test(email.trim())) {
        setMessage("Please enter a valid email address.");
        return;
      }

      setLoading(true);
      setMessage("");

      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        setMessage(res.error);
        setLoading(false);
        return;
      }

     
      fetch("/api/auth/register-session", { method: "POST" })
        .then((r) => r.json())
        .then(({ token }) => localStorage.setItem("redirect_token", token))
        .catch(() => {/* non-critical */});

      const savedLead = localStorage.getItem("pendingpayload");
      if (savedLead) {
        try {
          const parsedData = JSON.parse(savedLead);
          if (Date.now() <= parsedData.expiry) {
            const submitRes = await axios.post("/api/leads", parsedData.value);
            if (!submitRes.data.error) {
              localStorage.removeItem("pendingpayload");
              localStorage.setItem("viewMode", "customer");
              window.dispatchEvent(new Event("viewModeChanged"));
            } else {
              setMessage(submitRes.data.error);
              setLoading(false);
              return;
            }
          } else {
            localStorage.removeItem("pendingpayload");
          }
        } catch (err) {
          console.error("Auto-submit failed:", err);
        }
      }

      const destination = resolveRedirect({
        hasPendingLead: !!savedLead,
        resumeRequest,
        next,
      });

      router.replace(destination);
    },
    [email, password, resumeRequest, next, router],
  );

  const handleGoogleSignIn = useCallback(() => {
    signIn("google", {
      callbackUrl: resumeRequest && next ? next : "/provider/dashboard",
    });
  }, [resumeRequest, next]);

  return (
    <div className="bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="flex mx-auto items-center justify-center max-w-6xl gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Customer and provider access
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              Sign in to Taskoria
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Access your quotes, messages, and active jobs in one place.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-900 outline-none transition
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11 w-full rounded-lg border border-slate-300 px-3 pr-10 text-slate-900 outline-none transition
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="h-11 w-full bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {message && (
            <p
              className={`mt-3 text-sm ${
                message.toLowerCase().includes("signed") ||
                message.toLowerCase().includes("request")
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs uppercase tracking-wide text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="h-11 w-full"
          >
            <img
              src="/images/googleicon.svg"
              alt="Google"
              className="mr-2 h-5 w-5"
            />
            Continue with Google
          </Button>

          <Button
            type="button"
            disabled={joinLoading}
            onClick={() => joinAsProvider()}
            className="mt-3 h-11 w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
          >
            {joinLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
              </span>
            ) : (
              "Create Provider Account"
            )}
          </Button>
        </section>
      </div>
    </div>
  );
}


function ProofRow({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/70">
      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="text-xs text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}


function SignInLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading sign in...
      </div>
    </div>
  );
}


export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
}