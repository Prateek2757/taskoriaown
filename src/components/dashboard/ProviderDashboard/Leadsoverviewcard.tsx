"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronRight, TrendingUp } from "lucide-react";

interface LeadsOverviewCardProps {
  totalLeads: number | null;
  totalNewCount:number |null;
}

export function LeadsOverviewCard({ totalLeads , totalNewCount}: LeadsOverviewCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-40 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex flex-col justify-between p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-200" />
              <p className="text-xs font-semibold text-blue-100">
                Leads Overview
              </p>
            </div>
            <h3 className="text-base font-bold text-white">
              Total Received
            </h3>
          </div>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="relative flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-white tracking-tight mb-1">
              {totalLeads ?? "—"}
            </p>
            <p className="text-xs text-blue-100">Total leads received</p>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 text-sm px-4 h-9 rounded-lg font-medium backdrop-blur-sm border border-white/20 transition-all"
            onClick={() => router.push("/provider/leads")}
          >
            View All 
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{(totalNewCount ?? 0) > 0 ? totalNewCount : "0"}</span> this week
            </span>
          </div>
          {/* <div className="text-gray-500 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400 font-semibold">+12%</span> vs last month
          </div> */}
        </div>
      </div>
    </div>
  );
}