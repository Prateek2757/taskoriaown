"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function JoinAsProviderButton({
  className = "",
  variant = "default",
  onClickExtra,
}: {
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  onClickExtra?: () => void;
}) {
  const router = useRouter();

  const handleJoin = async () => {
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
        localStorage.setItem("draftProviderPublicId", data.user.public_id);
        router.push(`/create?user_id=${data.user.public_id}`);
      }

      if (onClickExtra) onClickExtra();
    } catch (error) {
      console.error("Join as provider failed:", error);
      alert("Error creating provider account");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleJoin}
      className={`bg-[#3C7DED] 
        text-white hover:from-blue-700 hover:to-cyan-700 font-medium shadow-md ${className}`}
    >
      Join as Provider
    </Button>
  );
}
