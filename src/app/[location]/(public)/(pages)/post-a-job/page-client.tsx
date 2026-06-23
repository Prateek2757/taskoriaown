"use client";

import { useRouter } from "next/navigation";
import NewRequestModal from "@/components/leads/RequestModal";

export default function PostAJobClient() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] bg-background">
      <NewRequestModal open onClose={() => router.push("/")} />
    </main>
  );
}
