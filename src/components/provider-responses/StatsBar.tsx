import { ResponsesStats } from "@/types";
import { Coins, CheckCircle, Clock, Circle, MessageSquare } from "lucide-react";

interface StatsBarProps {
  stats: ResponsesStats;
}

const STAT_ITEMS = [
  {
    key: "total" as keyof ResponsesStats,
    label: "Total",
    icon: MessageSquare,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    key: "open" as keyof ResponsesStats,
    label: "Open",
    icon: Circle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    key: "inProgress" as keyof ResponsesStats,
    label: "In Progress",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    key: "completed" as keyof ResponsesStats,
    label: "Completed",
    icon: CheckCircle,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/30",
  },
  {
    key: "totalCreditsSpent" as keyof ResponsesStats,
    label: "Credits Spent",
    icon: Coins,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/30",
  },
];

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {STAT_ITEMS.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mb-0.5">{label}</p>
            <p className={`text-xl font-bold ${color} leading-none`}>{stats[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
