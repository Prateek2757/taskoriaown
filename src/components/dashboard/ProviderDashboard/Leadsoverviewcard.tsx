"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronRight } from "lucide-react";

interface LeadsOverviewCardProps {
  totalLeads: number | null;
}

export function LeadsOverviewCard({ totalLeads }: LeadsOverviewCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="relative h-36 bg-[#3C7DED] flex flex-col justify-between p-5">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-white/70">
              Leads Overview
            </p>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Total Received
            </h3>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="relative flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-white tracking-tight">
              {totalLeads ?? "—"}
            </p>
            <p className="text-xs text-white/60 mt-0.5">Total leads</p>
          </div>
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 text-xs px-3 h-7 rounded-lg"
            onClick={() => router.push("/provider/leads")}
          >
            View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}