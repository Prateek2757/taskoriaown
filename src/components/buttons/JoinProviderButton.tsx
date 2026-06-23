"use client";

import { Button } from "@/components/ui/button";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";

export default function JoinAsProviderButton({
  className = "",
  variant = "default",
  onClickExtra,
}: {
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  onClickExtra?: () => void;
}) {
  const { joinAsProvider } = useJoinAsProvider();

  const handleJoin = async () => {
    onClickExtra?.();
    await joinAsProvider();
  };

  return (
    <Button
      variant="outline"
      onClick={handleJoin}
      className={`bg-[#2563EB] 
        text-white hover:from-blue-700 hover:to-cyan-700 font-medium shadow-md ${className}`}
    >
      Join as Provider
    </Button>
  );
}
