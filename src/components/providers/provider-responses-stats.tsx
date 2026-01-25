import { ResponsesStats } from "@/app/(public)/(pages)/provider-responses/page";
import { 
    MessageSquare, 
    CheckCircle2, 
    Clock, 
    DollarSign 
  } from "lucide-react";
  
  interface StatsProps {
    stats: ResponsesStats;
  }
  
  export default function ResponseStats({ stats }: StatsProps) {
    const statCards = [
      {
        title: "Total Responses",
        value: stats.total,
        icon: MessageSquare,
        color: "blue",
        borderColor: "border-blue-500",
        iconColor: "text-blue-500",
      },
      {
        title: "Open Tasks",
        value: stats.open,
        icon: CheckCircle2,
        color: "green",
        borderColor: "border-green-500",
        iconColor: "text-green-500",
      },
      {
        title: "In Progress",
        value: stats.inProgress,
        icon: Clock,
        color: "yellow",
        borderColor: "border-yellow-500",
        iconColor: "text-yellow-500",
      },
      {
        title: "Completed",
        value: stats.completed,
        icon: CheckCircle2,
        color: "gray",
        borderColor: "border-gray-500",
        iconColor: "text-gray-500",
      },
      {
        title: "Credits Spent",
        value: stats.totalCreditsSpent,
        icon: DollarSign,
        color: "purple",
        borderColor: "border-purple-500",
        iconColor: "text-purple-500",
      },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow p-4 md:p-6 border-l-4 ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }