"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ProviderNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    sessionStorage.removeItem("viewRole");
    router.push("/signin");
  };

  const handleSwitch = () => {
    sessionStorage.setItem("viewRole", "customer");
    router.push("/customer/dashboard");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/provider/dashboard" className="font-bold text-xl text-blue-600">
          Taskoria
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/provider/leads" className="text-gray-700 hover:text-blue-600">
            Leads
          </Link>
          <Link href="/provider/message" className="text-gray-700 hover:text-blue-600">
            Messages
          </Link>
          <Link href="/provider/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>
          <Button variant="outline" onClick={handleSwitch}>
            Switch to Customer
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}