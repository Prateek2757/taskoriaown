"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const DEFAULT_LOCATION = "en";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Please enter your password."),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const AUTH_TIMEOUT_MS = 15000;
const LEAD_SUBMIT_TIMEOUT_MS = 10000;

function isSigninPath(pathname: string) {
  return pathname === "/signin" || pathname === `/${DEFAULT_LOCATION}/signin`;
}

function withLocationPrefix(path: string, location: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return `/${location}`;
  if (path === `/${location}` || path.startsWith(`/${location}/`)) return path;

  return `/${location}${path}`;
}

function withoutDefaultLocationPrefix(path: string) {
  if (path === `/${DEFAULT_LOCATION}`) return "/";
  if (path.startsWith(`/${DEFAULT_LOCATION}/`)) {
    return path.slice(DEFAULT_LOCATION.length + 1);
  }

  return path;
}

function getSafeRedirectPath(value: string | null): string | null {
  if (!value) return null;

  if (value.startsWith("/") && !value.startsWith("//")) {
    const url = new URL(value, "http://localhost");
    if (isSigninPath(url.pathname)) return null;

    return `${url.pathname}${url.search}${url.hash}`;
  }

  if (typeof window === "undefined") return null;

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin !== window.location.origin) return null;
    if (isSigninPath(url.pathname)) return null;

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function resolveRedirect(opts: {
  hasPendingLead: boolean;
  redirectPath: string | null;
}): string {
  if (opts.hasPendingLead) {
    return "/customer/dashboard";
  }
  if (opts.redirectPath) {
    return withoutDefaultLocationPrefix(opts.redirectPath);
  }
  return "/provider/dashboard";
}

function getSignInErrorMessage(error: string | null) {
  if (error === "not_registered") {
    return "This Google account is not registered. Create an account first.";
  }
  if (error === "OAuthAccountNotLinked") {
    return "This email is already linked to a different sign-in method.";
  }
  return "";
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
) {
  let timeout: number | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = window.setTimeout(
          () => reject(new Error(timeoutMessage)),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeout) window.clearTimeout(timeout);
  }
}

async function submitPendingLead(savedLead: string) {
  const parsedData = JSON.parse(savedLead);

  if (Date.now() > parsedData.expiry) {
    localStorage.removeItem("pendingpayload");
    return false;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), LEAD_SUBMIT_TIMEOUT_MS);

  try {
    const submitRes = await axios.post("/api/leads", parsedData.value, {
      signal: controller.signal,
    });

    if (submitRes.data.error) {
      throw new Error(submitRes.data.error);
    }

    localStorage.removeItem("pendingpayload");
    localStorage.setItem("viewMode", "customer");
    window.dispatchEvent(new Event("viewModeChanged"));
    return true;
  } finally {
    window.clearTimeout(timeout);
  }
}

function navigateAfterSignIn(destination: string) {
  window.location.assign(destination);
}


function SignInForm() {
  const [message, setMessage]       = useState(() => {
    if (typeof window === "undefined") return "";
    return getSignInErrorMessage(new URLSearchParams(window.location.search).get("error"));
  });
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router                          = useRouter();
  const params                          = useParams<{ location?: string }>();
  const location                        = params.location || DEFAULT_LOCATION;
  const { joinAsProvider, loading: joinLoading } = useJoinAsProvider();
  const searchParams                    = useSearchParams();
  const next                            = searchParams.get("next");
  const callbackUrl                     = searchParams.get("callbackUrl");
  const redirectPath                    = getSafeRedirectPath(callbackUrl) ?? getSafeRedirectPath(next);
  const resumeRequest                   = searchParams.get("resume_request") === "1";
  const shouldSubmitPendingLead         = resumeRequest || !redirectPath;

  useEffect(() => {
    router.prefetch("/provider/dashboard");
    router.prefetch("/customer/dashboard");
    if (redirectPath) router.prefetch(withoutDefaultLocationPrefix(redirectPath));
  }, [router, redirectPath]);

  useEffect(() => {
    const hasPending = shouldSubmitPendingLead && !!localStorage.getItem("pendingpayload");
    localStorage.setItem("viewMode", hasPending ? "customer" : "provider");
    window.dispatchEvent(new Event("viewModeChanged"));
  }, [shouldSubmitPendingLead]);

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    const base = new URLSearchParams();
    if (redirectPath) base.set("callbackUrl", redirectPath);
    if (resumeRequest) base.set("resume_request", "1");

    const signinPath = withLocationPrefix("/signin", location);
    router.replace(base.size ? `${signinPath}?${base.toString()}` : signinPath, { scroll: false });
  }, [searchParams, router, redirectPath, resumeRequest, location]);

  const onSubmit: SubmitHandler<SignInFormValues> = useCallback(
    async ({ email, password }) => {
      setMessage("");

      try {
        const res = await withTimeout(
          signIn("credentials", {
            redirect: false,
            email,
            password,
          }),
          AUTH_TIMEOUT_MS,
          "Sign in is taking too long. Please check your connection and try again.",
        );

        if (res?.error) {
          setMessage(res.error);
          return;
        }

        fetch("/api/auth/register-session", { method: "POST" })
          .then((r) => r.json())
          .then(({ token }) => {
            if (token) localStorage.setItem("redirect_token", token);
          })
          .catch(() => {/* non-critical */});

        const savedLead = shouldSubmitPendingLead
          ? localStorage.getItem("pendingpayload")
          : null;
        let submittedPendingLead = false;

        if (savedLead) {
          try {
            submittedPendingLead = await submitPendingLead(savedLead);
          } catch (err) {
            console.error("Auto-submit failed:", err);
            setMessage(
              err instanceof Error
                ? err.message
                : "Your sign in worked, but your request could not be submitted.",
            );
            return;
          }
        }

        const destination = resolveRedirect({
          hasPendingLead: submittedPendingLead,
          redirectPath,
        });

        navigateAfterSignIn(destination);
      } catch (err) {
        console.error("Sign in failed:", err);
        setMessage(err instanceof Error ? err.message : "Unable to sign in right now. Please try again.");
      }
    },
    [redirectPath, shouldSubmitPendingLead],
  );

  const handleGoogleSignIn = useCallback(() => {
    signIn("google", {
      callbackUrl: resolveRedirect({
        hasPendingLead: false,
        redirectPath,
      }),
    });
  }, [redirectPath]);

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-900 outline-none transition
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900"
                {...register("email")}
                required
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
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
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="h-11 w-full rounded-lg border border-slate-300 px-3 pr-10 text-slate-900 outline-none transition
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900"
                  {...register("password")}
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
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="h-11 w-full bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? (
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
            <Image
              src="/images/googleicon.svg"
              alt="Google"
              width={20}
              height={20}
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
