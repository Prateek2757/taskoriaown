"use client";

import { Card } from "@/components/ui/card";
import { BarChart3, Target, Star, Users } from "lucide-react";

interface DashboardStatsProps {
  totalLeads: number | null;
}

export function DashboardStats({ totalLeads }: DashboardStatsProps) {
  const stats = [
    {
      id: "leads",
      label: "Total Leads",
      value: totalLeads ?? "—",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "projects",
      label: "Active Projects",
      value: 4,
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "success",
      label: "Success Rate",
      value: "94%",
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: "views",
      label: "Profile Views",
      value: 156,
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-in fade-in-10 duration-300">
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className="p-5 rounded-2xl shadow-lg backdrop-blur-md bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-xl transition-shadow"
        >
          <div className="p-2 rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-300 w-fit">
            {stat.icon}
          </div>
          <p className="text-3xl font-bold mt-3 text-slate-800 dark:text-white">
            {stat.value}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {stat.label}
          </p>
        </Card>
      ))}
    </div>
  );
}