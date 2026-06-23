"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import { Loader2 } from "lucide-react";

function JoinContent() {
  const params = useSearchParams();
  const refCode = params.get("ref") || undefined;

  const { joinAsProvider } = useJoinAsProvider();
  const started = useRef(false);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );

  useEffect(() => {
    if (started.current) return;

    if (!refCode) {
      setStatus("error");
      return;
    }

    started.current = true;

    // Call the hook and handle success / error
    joinAsProvider(refCode)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [refCode, joinAsProvider]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          Setting up your account…
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-red-50 dark:bg-red-900">
        <p className="text-red-700 dark:text-red-300 font-semibold text-lg">
          Invalid or missing invite link.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Please check your invite link or contact support.
        </p>
      </div>
    );
  }

  // Optional: redirect on success or show a success message
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-green-50 dark:bg-green-900">
      <p className="text-green-700 dark:text-green-300 font-semibold text-lg">
        Your account has been set up!
      </p>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinContent />
    </Suspense>
  );
}