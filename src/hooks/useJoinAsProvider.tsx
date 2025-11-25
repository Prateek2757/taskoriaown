"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useJoinAsProvider() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const joinAsProvider = async () => {
    try {
      setLoading(true);

      localStorage.removeItem("draftProviderId");

      const res = await fetch("/api/signup/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "provider" }),
      });

      const data = await res.json();

      if (data?.user?.user_id) {
        localStorage.setItem("draftProviderId", data.user.user_id);
        localStorage.setItem("draftProviderPublicId", data.user.public_id);

        router.push(`/create?user_id=${data.user.public_id}`);
      }
    } catch (error) {
      console.error("Join as provider failed:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { joinAsProvider, loading };
}