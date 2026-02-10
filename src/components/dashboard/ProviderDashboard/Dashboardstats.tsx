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
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "projects",
      label: "Active Projects",
      value: 4,
      icon: <Target className="w-5 h-5" />,
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "success",
      label: "Success Rate",
      value: "94%",
      icon: <Star className="w-5 h-5" />,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "views",
      label: "Profile Views",
      value: 156,
      icon: <Users className="w-5 h-5" />,
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/30",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className={`p-5 rounded-2xl shadow-lg bg-gradient-to-br ${stat.bgGradient} border-2 border-gray-200 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
        >
          <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor} w-fit group-hover:scale-110 transition-transform duration-300`}>
            {stat.icon}
          </div>
          <p className="text-3xl font-bold mt-3 text-gray-900 dark:text-white">
            {stat.value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {stat.label}
          </p>
        </Card>
      ))}
    </div>
  );
}