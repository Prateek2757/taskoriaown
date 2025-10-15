"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function CustomerNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    sessionStorage.removeItem("viewRole");
    router.push("/en/signin");
  };

  const handleSwitch = () => {
    sessionStorage.setItem("viewRole", "provider");
    router.push("/en/provider/dashboard");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/en/customer/dashboard" className="font-bold text-xl text-blue-600">
          Taskoria
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/en/customer/my-requests" className="text-gray-700 hover:text-blue-600">
            My Requests
          </Link>
          <Link href="/en/discover" className="text-gray-700 hover:text-blue-600">
            Discover Providers
          </Link>
          <Link href="/en/customer/messages" className="text-gray-700 hover:text-blue-600">
            Messages
          </Link>
          <Button variant="outline" onClick={handleSwitch}>
            Switch to Provider
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}