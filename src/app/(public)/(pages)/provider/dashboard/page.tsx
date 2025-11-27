"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProviderDashboard from "@/components/dashboard/ProviderDashboard";

export default function DashboardPage() {
  return (
    <div className="
      min-h-screen 
      bg-gray-50 
      dark:bg-[#0d1117] 
      transition-colors duration-300
    ">
      <div className="container mx-auto px-4 py-8">

        {/* Back Button — Hydration Safe */}
        <Link href="/" className="inline-flex mb-4">
          <Button
            variant="ghost"
            className="
              flex items-center gap-2 
              text-gray-700 
              dark:text-gray-300 
              dark:hover:bg-gray-800 
              transition-colors
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        {/* Provider Dashboard */}
        <ProviderDashboard />
      </div>
    </div>
  );
}
