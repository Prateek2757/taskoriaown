"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/refund/spinner";
import { RefundsContent } from "@/components/refund/RefundsContent";


export default function AdminRefundsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    if (session?.user.adminrole !== "admin") {
      router.replace("/provider/dashboard");
    }
  }, [authStatus, session, router]);

  const isReady =
    authStatus === "authenticated" && session?.user.adminrole === "admin";

  if (!isReady) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
          <Spinner />
          <span className="text-sm">Checking permissions…</span>
        </div>
      </div>
    );
  }

  return <RefundsContent />;
}