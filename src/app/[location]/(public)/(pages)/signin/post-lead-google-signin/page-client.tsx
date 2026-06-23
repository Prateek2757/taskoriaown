"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";

export const dynamic = "force-dynamic";

function PostLoginHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing your sign-in…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const raw = localStorage.getItem("pendingpayload");

      if (raw) {
        try {
          setStatus("Submitting your request…");
          const payload = JSON.parse(raw);
          const res = await axios.post("/api/leads", payload);

          if (!cancelled) {
            if (!res.data.error) {
              localStorage.removeItem("pendingpayload");
              localStorage.setItem("viewMode", "customer");
              window.dispatchEvent(new Event("viewModeChanged"));
            }

            setStatus("Request submitted! Taking you to your dashboard…");
            router.replace("/customer/dashboard");
          }
        } catch (err) {
          console.error("Post-login lead submission failed", err);
          if (!cancelled) {
            setStatus("Redirecting…");
            router.replace("/customer/dashboard");
          }
        }
        return;
      }

      const resumeRequest = searchParams.get("resume_request") === "1";
      const next = searchParams.get("next");

      if (resumeRequest && next) {
        if (!cancelled) {
          setStatus("Returning to your request…");
          router.replace(next);
        }
        return;
      }

      if (!cancelled) {
        localStorage.setItem("viewMode", "provider");
        window.dispatchEvent(new Event("viewModeChanged"));
        setStatus("Redirecting to your dashboard…");
        router.replace("/provider/dashboard");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950">
      <Loader2 className="h-7 w-7 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>
    </div>
  );
}

export default function PostLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      }
    >
      <PostLoginHandler />
    </Suspense>
  );
}
