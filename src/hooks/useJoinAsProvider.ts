"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useJoinAsProvider() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/create");
  }, [router]);

  const joinAsProvider = useCallback(async (referralCode?: string) => {
    try {
      setLoading(true);
      localStorage.removeItem("draftProviderId");
      localStorage.removeItem("draftProviderPublicId");

      const url = new URL("/create", window.location.origin);
      if (referralCode) url.searchParams.set("ref", referralCode);

      router.push(url.pathname + url.search);
    } catch (error) {
      console.error("Join as provider failed:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { joinAsProvider, loading };
}
