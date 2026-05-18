"use client";
import {
  Suspense,
  useEffect,
  useRef,
  useCallback,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveRedirect(
  hasPendingLead: boolean,
  resumeRequest: boolean,
  next: string | null
) {
  if (hasPendingLead) return "/customer/dashboard";
  if (resumeRequest && next) return next;
  return "/provider/dashboard";
}

const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { joinAsProvider, loading: joinLoading } = useJoinAsProvider();
  const searchParams = useSearchParams();

  // Read once, stable for component lifetime
  const next = searchParams.get("next");
  const resumeRequest = searchParams.get("resume_request") === "1";

  // ── prefetch all destinations in one shot ──────────────────────────────────
  useEffect(() => {
    router.prefetch("/provider/dashboard");
    router.prefetch("/customer/dashboard");
    if (next) router.prefetch(next);
  }, [router, next]);

  // ── set viewMode once on mount ─────────────────────────────────────────────
  useEffect(() => {
    const hasPending = !!localStorage.getItem("pendingpayload");
    localStorage.setItem("viewMode", hasPending ? "customer" : "provider");
    window.dispatchEvent(new Event("viewModeChanged"));
  }, []);

  // ── handle OAuth errors — run once per error value ─────────────────────────
  const handledError = useRef<string | null>(null);
  useEffect(() => {
    const error = searchParams.get("error");
    if (!error || handledError.current === error) return;
    handledError.current = error;

    setMessage(
      error === "not_registered"
        ? "This Google account is not registered. Create an account first."
        : error === "OAuthAccountNotLinked"
          ? "This email is already linked to a different sign-in method."
          : "An error occurred. Please try again."
    );

    const base =
      resumeRequest && next
        ? `/signin?next=${encodeURIComponent(next)}&resume_request=1`
        : "/signin";
    router.replace(base, { scroll: false });
  }, [searchParams, router, next, resumeRequest]);

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Sync validation first — no async work until this passes
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

      // Fire-and-forget session token registration (non-blocking)
      fetch("/api/auth/register-session", { method: "POST" })
        .then((r) => r.json())
        .then(({ token }) => localStorage.setItem("redirect_token", token))
        .catch(() => {});

      // Handle pending lead
      let hasPendingLead = false;
      const saved = localStorage.getItem("pendingpayload");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Date.now() <= parsed.expiry) {
            // Dynamic import axios only when actually needed
            const { default: axios } = await import("axios");
            const submitRes = await axios.post("/api/leads", parsed.value);
            if (!submitRes.data.error) {
              localStorage.removeItem("pendingpayload");
              localStorage.setItem("viewMode", "customer");
              window.dispatchEvent(new Event("viewModeChanged"));
              hasPendingLead = true;
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

      router.replace(resolveRedirect(hasPendingLead, resumeRequest, next));
    },
    [email, password, resumeRequest, next, router]
  );

  // ── Google — stable, no deps ───────────────────────────────────────────────
  const handleGoogleSignIn = useCallback(() => {
    signIn("google", {
      callbackUrl: resumeRequest && next ? next : "/provider/dashboard",
    });
  }, [resumeRequest, next]);

  const togglePassword = useCallback(() => setShowPassword((p) => !p), []);

  // ─── render ───────────────────────────────────────────────────────────────
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

          {/* noValidate — we do our own validation */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
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
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
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
                  id="password"
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
                  onClick={togglePassword}
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {message && (
            <p
              role="alert"
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
            <span className="text-xs uppercase tracking-wide text-slate-400">
              or
            </span>
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
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
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

// ─── loading skeleton ─────────────────────────────────────────────────────────
function SignInLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading sign in…
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
}
