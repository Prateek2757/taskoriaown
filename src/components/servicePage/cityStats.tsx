"use client";

import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";

interface CityStatsProps {
  cityData: any;
  serviceName: string;
}

export default function CityStats({ cityData, serviceName }: CityStatsProps) {
  const stats = [
    {
      icon: TrendingUp,
      label: "Active Providers",
      value: `${cityData.activeProviders || 150}+`,
      color: "from-emerald-600 to-green-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      icon: DollarSign,
      label: "Average Price",
      value: cityData.average_price || "$100-200/hr",
      color: "from-blue-600 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Clock,
      label: "Response Time",
      value: cityData.response_time || "Within 24hrs",
      color: "from-purple-600 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: `${cityData.completedJobs || 500}+`,
      color: "from-orange-600 to-red-500",
      bg: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="mb-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} rounded-3xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all hover:-translate-y-1`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}