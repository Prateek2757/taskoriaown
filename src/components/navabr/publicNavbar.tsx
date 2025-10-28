"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function PublicNavbar() {
  const router = useRouter();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] bg-clip-text text-transparent">
            Taskoria
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/discover"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Discover
          </Link>
          <Link
            href="/community"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Community
          </Link>
          <Button variant="outline" onClick={() => router.push("/en/signin")}>
            Sign In
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => router.push("/create-account")}
          >
            Join as Provider
          </Button>
        </nav>
      </div>
    </header>
  );
}
