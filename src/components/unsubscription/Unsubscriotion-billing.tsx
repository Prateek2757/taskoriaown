"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Subscription {
  subscription_id: string;
  status: string;
  end_date: string;
  cancel_at_period_end: boolean;
  trail_end_date?: string | null;
}

interface UnsubscribePageProps {
  professionalId: string;
  packageName?: string;
}

type Step = "idle" | "confirm" | "loading" | "done" | "error";

const REASONS = [
  "Too expensive",
  "Not using it enough",
  "Missing features I need",
  "Switching to another tool",
  "Technical issues",
  "Just taking a break",
];

export default function UnsubscribePage({
  professionalId,
  packageName = "Taskoria Pro",
}: UnsubscribePageProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("idle");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [cancelImmediately, setCancelImmediately] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [cancelAt, setCancelAt] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    try {
      const res = await fetch(
        `/api/cancel-subscription?professionalId=${professionalId}`
      );
      const data = await res.json();
      setSubscription(data.subscription);
    } catch {
      // silently fail
    } finally {
      setLoadingSubscription(false);
    }
  }

  async function handleCancel() {
    if (!subscription) return;
    setStep("loading");
    setError("");

    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId,
          subscriptionId: subscription.subscription_id,
          reason: selectedReason || "Not specified",
          cancelImmediately,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Cancellation failed");
      }

      setResultMessage(data.message);
      setCancelAt(data.cancelAt);
      setStep("done");
    } catch (err: any) {
      setError(err.message);
      setStep("error");
    }
  }

  const endDate = subscription?.end_date
    ? new Date(subscription.end_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;


  if (loadingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f11]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gray-200 dark:border-white/10 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin" />
          <p className="text-gray-400 dark:text-white/40 text-sm font-mono tracking-widest uppercase">
            Loading subscription
          </p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f11] px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-6">📭</div>
          <h2 className="text-gray-900 dark:text-white text-2xl font-semibold mb-2">
            No active subscription
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm mb-8">
            You don't have a {packageName} subscription to cancel.
          </p>
          <button
            type="button"
            onClick={() => router.push("/provider/dashboard")}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-white/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (subscription.cancel_at_period_end && step !== "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f11] px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-amber-500 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-gray-900 dark:text-white text-2xl font-semibold mb-2">
            Already scheduled
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-2">
            Your {packageName} subscription is already set to cancel.
          </p>
          {endDate && (
            <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-8">
              Access ends on {endDate}
            </p>
          )}
          <button
            type="button"
            onClick={() => router.push("/provider/dashboard")}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-white/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f11] px-4 font-sans">
        <div
          className={`text-center max-w-md transition-all duration-700 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-10 h-10 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-3">
            {cancelImmediately ? "Subscription canceled" : "We'll miss you"}
          </h1>
          {/* <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-8">
            {resultMessage}
          </p> */}
          {!cancelImmediately && cancelAt && (
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-8 text-left">
              <p className="text-gray-400 dark:text-white/40 text-xs uppercase tracking-widest mb-1 font-mono">
                Access ends
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {new Date(cancelAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => router.push("/settings/billing/taskoria_pro")}
              className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10"
            >
              Billing Settings
            </button>
            <button
              type="button"
              onClick={() => router.push("/provider/dashboard")}
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-white/90 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-[#0f0f11] flex items-center justify-center px-4 py-7">
      <div className="w-full max-w-lg">
        <div
          className={`mb-10 transition-all duration-500 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60 transition-colors text-sm mb-10 group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/15 flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6 text-red-500 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="font-serif text-4xl text-gray-900 dark:text-white mb-2">
            Cancel {packageName}
          </h1>
          <p className="text-gray-400 dark:text-white/40 text-sm">
            We're sorry to see you go. Let us know why before you leave.
          </p>
        </div>

        <div
          className={`bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5 mb-6 transition-all duration-500 delay-75 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 dark:text-white/40 text-xs uppercase tracking-widest font-mono mb-1">
                Current plan
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {packageName}
              </p>
            </div>
            {endDate && (
              <div className="text-right">
                <p className="text-gray-400 dark:text-white/40 text-xs uppercase tracking-widest font-mono mb-1">
                  Next bill
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                  {endDate}
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`mb-6 transition-all duration-500 delay-100 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-gray-500 dark:text-gray-300 text-xs uppercase tracking-widest font-mono mb-3">
            Reason for canceling
          </p>
          <div className="grid grid-cols-1 gap-2">
            {REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                className={`w-full text-left px-4 py-2.5 text-sm rounded-xl border transition-colors duration-150
          ${
            selectedReason === reason
              ? "bg-amber-50 border-amber-600 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500 dark:text-amber-400"
              : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50 dark:border-white/10 dark:text-white/50 dark:hover:border-white/20 dark:hover:text-white/80 dark:hover:bg-white/5"
          }
        `}
                onClick={() => setSelectedReason(reason)}
              >
                <span className="flex bg-transparent items-center gap-3">
                  <span
                    className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors
              ${
                selectedReason === reason
                  ? "border-black  dark:border-white"
                  : "border-gray-300 dark:border-white/20"
              }
            `}
                  >
                    {selectedReason === reason && (
                      <svg
                        className="w-2.5 h-2.5 text-[#2536EB]"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="4" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate text-black dark:text-white ">
                    {reason}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* <div
          className={`bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-2xl p-5 mb-8 transition-all duration-500 delay-150 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-11 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors duration-200 border ${
                cancelImmediately
                  ? "bg-red-500 border-red-500"
                  : "bg-black/10 border-black/10 dark:bg-white/10 dark:border-white/10"
              }`}
              onClick={() => setCancelImmediately(!cancelImmediately)}
            >
              <div
                className={`absolute top-[1px] left-[1px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  cancelImmediately ? "translate-x-[20px]" : "translate-x-0"
                }`}
              />
            </div>
            <div>
              <p className="text-gray-800 dark:text-white/80 text-sm font-medium mb-1">
                Cancel immediately
              </p>
              <p className="text-gray-400 dark:text-white/35 text-xs leading-relaxed">
                {cancelImmediately
                  ? "Your access will end right away. You will not be charged again."
                  : `Keep access until ${endDate ?? "your billing date"}, then cancel. No further charges.`}
              </p>
            </div>
          </div>
        </div> */}

        {step === "error" && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6 text-red-600 dark:text-red-300 text-sm animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

         <div
          className={`flex flex-col gap-3 transition-all duration-500 delay-200 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {step !== "confirm" ? (
            <>
              <button
                type="button"
                onClick={() => setStep("confirm")}
                className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Continue to cancel
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors border border-gray-200 dark:border-white/10"
              >
                Keep my subscription
              </button>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-white/3 border border-red-200 dark:border-red-500/20 rounded-2xl p-5 animate-in fade-in zoom-in duration-300">
              <p className="text-gray-800 dark:text-white/80 text-sm font-medium mb-1">
                Are you sure?
              </p>
              <p className="text-gray-400 dark:text-white/40 text-xs mb-5">
                {cancelImmediately
                  ? "Your access will end immediately and cannot be undone."
                  : `Your subscription will not renew after ${endDate}.`}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("idle")}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  Go back
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={step === "loading" as Step}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {step === "loading" as Step ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    "Yes, cancel"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
