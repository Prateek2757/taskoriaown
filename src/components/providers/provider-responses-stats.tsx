import { ResponsesStats } from "@/app/(public)/(pages)/provider-responses/page";
import { 
    MessageSquare, 
    CheckCircle2, 
    Clock, 
    DollarSign,
    TrendingUp,
    Zap
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
        gradient: "from-blue-500 to-blue-600",
        bgLight: "bg-blue-50",
        bgDark: "bg-blue-950/30",
        borderColor: "border-blue-500/20",
        iconBgLight: "bg-blue-100",
        iconBgDark: "bg-blue-900/50",
        iconColor: "text-blue-600 dark:text-blue-400",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        title: "Open Tasks",
        value: stats.open,
        icon: CheckCircle2,
        gradient: "from-green-500 to-emerald-600",
        bgLight: "bg-green-50",
        bgDark: "bg-green-950/30",
        borderColor: "border-green-500/20",
        iconBgLight: "bg-green-100",
        iconBgDark: "bg-green-900/50",
        iconColor: "text-green-600 dark:text-green-400",
        textColor: "text-green-600 dark:text-green-400",
      },
      {
        title: "In Progress",
        value: stats.inProgress,
        icon: Clock,
        gradient: "from-amber-500 to-orange-600",
        bgLight: "bg-amber-50",
        bgDark: "bg-amber-950/30",
        borderColor: "border-amber-500/20",
        iconBgLight: "bg-amber-100",
        iconBgDark: "bg-amber-900/50",
        iconColor: "text-amber-600 dark:text-amber-400",
        textColor: "text-amber-600 dark:text-amber-400",
      },
      {
        title: "Completed",
        value: stats.completed,
        icon: Zap,
        gradient: "from-purple-500 to-purple-600",
        bgLight: "bg-purple-50",
        bgDark: "bg-purple-950/30",
        borderColor: "border-purple-500/20",
        iconBgLight: "bg-purple-100",
        iconBgDark: "bg-purple-900/50",
        iconColor: "text-purple-600 dark:text-purple-400",
        textColor: "text-purple-600 dark:text-purple-400",
      },
      {
        title: "Credits Spent",
        value: stats.totalCreditsSpent,
        icon: DollarSign,
        gradient: "from-rose-500 to-pink-600",
        bgLight: "bg-rose-50",
        bgDark: "bg-rose-950/30",
        borderColor: "border-rose-500/20",
        iconBgLight: "bg-rose-100",
        iconBgDark: "bg-rose-900/50",
        iconColor: "text-rose-600 dark:text-rose-400",
        textColor: "text-rose-600 dark:text-rose-400",
      },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`
              group relative overflow-hidden
              bg-white dark:bg-gray-800/50
              backdrop-blur-sm
              rounded-xl shadow-sm hover:shadow-xl
              border border-gray-200 dark:border-gray-700
              transition-all duration-300 ease-out
              hover:scale-[1.02] hover:-translate-y-1
            `}
          >
            <div className={`
              absolute inset-0 bg-gradient-to-br ${stat.gradient} 
              opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10
              transition-opacity duration-300
            `} />
            
            {/* <div className={`
              absolute top-0 right-0 w-20 h-20 
              bg-gradient-to-br ${stat.gradient}
              opacity-5 dark:opacity-10
              rounded-bl-full
              transition-all duration-300
              group-hover:scale-150
            `} /> */}

            <div className="relative p-5 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors">
                      {stat.value.toLocaleString()}
                    </p>
                    {index < 4 && stat.value > 0 && (
                      <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
                    )}
                  </div>
                </div>
                
                <div className={`
                  relative
                  ${stat.iconBgLight} dark:${stat.iconBgDark}
                  rounded-lg p-3
                  transition-transform duration-300
                  group-hover:scale-110 group-hover:rotate-6
                `}>
                  <stat.icon className={`w-6 h-6 md:w-7 md:h-7 ${stat.iconColor} transition-colors`} />
                  
                  {/* <div className={`
                    absolute inset-0 rounded-lg
                    bg-gradient-to-br ${stat.gradient}
                    opacity-0 group-hover:opacity-20
                    animate-pulse
                  `} /> */}
                </div>
              </div>

              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-500 ease-out`}
                  style={{ 
                    width: stats.total > 0 && index < 4 
                      ? `${(stat.value / stats.total) * 100}%` 
                      : '100%' 
                  }}
                />
              </div>
              
              {stats.total > 0 && index < 4 && (
                <p className={`mt-2 text-xs font-medium ${stat.textColor} transition-colors`}>
                  {((stat.value / stats.total) * 100).toFixed(1)}% of total
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }