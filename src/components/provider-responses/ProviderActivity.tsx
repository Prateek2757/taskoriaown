"use client";

import useSWR from "swr";
import {
  DollarSign,
  Mail,
  MessageSquare,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { ProviderResponse } from "@/types";
import { timeAgo, formatDate } from "./helpers";


type ActivityType = "email_sent" | "estimate_sent" | "response_sent";

interface Activity {
  activity_id: number;
  activity_type: ActivityType;
  metadata: Record<string, string | number>;
  created_at: string;
}

interface EstimateActivityProps {
  response: ProviderResponse;
}


const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });


const ACTIVITY_CONFIG = {
  email_sent: {
    icon: Mail,
    iconClass: "text-purple-500",
    dotClass: "bg-purple-400",
    label: "You sent an email",
    renderDetail: (meta: Record<string, string | number>) => (
      <div className="space-y-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-600 dark:text-gray-300">To: </span>
          {String(meta.to)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-600 dark:text-gray-300">Subject: </span>
          {String(meta.subject ?? "Project Discussion")}
        </p>
        {meta.message_preview && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic line-clamp-2 mt-1">
            &ldquo;{String(meta.message_preview)}{String(meta.message_preview).length >= 120 ? "…" : ""}&rdquo;
          </p>
        )}
      </div>
    ),
  },
  estimate_sent: {
    icon: DollarSign,
    iconClass: "text-green-500",
    dotClass: "bg-green-500",
    label: "You sent an estimate",
    renderDetail: (meta: Record<string, string | number>) => (
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-lg border border-green-100 dark:border-green-800/40">
          <DollarSign className="w-3 h-3" />
          A$ {Number(meta.price).toLocaleString()}
          <span className="text-green-500 font-normal">/ {String(meta.unit)}</span>
        </div>
        {meta.message_preview && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic line-clamp-2">
            &ldquo;{String(meta.message_preview)}{String(meta.message_preview).length >= 120 ? "…" : ""}&rdquo;
          </p>
        )}
      </div>
    ),
  },
  response_sent: {
    icon: MessageSquare,
    iconClass: "text-blue-500",
    dotClass: "bg-blue-400",
    label: "You responded to this task",
    renderDetail: (meta: Record<string, string | number>) => (
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
        {String(meta.message ?? "")}
      </p>
    ),
  },
} as const;


function ActivityCard({ activity }: { activity: Activity }) {
  const config = ACTIVITY_CONFIG[activity.activity_type];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className="relative flex gap-4">
      <div className={`absolute -left-[13px] top-3.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0d1117] z-10 ${config.dotClass}`} />
      <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Icon className={`w-3.5 h-3.5 ${config.iconClass}`} />
            {config.label}
          </span>
          <span className="text-[11px] text-gray-400 shrink-0 ml-2">
            {timeAgo(activity.created_at)}
          </span>
        </div>
        {config.renderDetail(activity.metadata)}
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      ))}
    </div>
  );
}

function ResponseCard({ response }: { response: ProviderResponse }) {
  return (
    <div className="relative flex gap-4">
      <div className="absolute -left-[13px] top-3.5 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-white dark:border-[#0d1117] z-10" />
      <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            You responded to this task
          </span>
          <span className="text-[11px] text-gray-400">{timeAgo(response.response_created_at)}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {response.response_message}
        </p>
      </div>
    </div>
  );
}

function TaskPostedCard({ response }: { response: ProviderResponse }) {
  return (
    <div className="relative flex gap-4">
      <div className="absolute -left-[13px] top-3.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#0d1117] z-10" />
      <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            {response.customer_name}
          </span>
          <span className="text-[11px] text-gray-400">{timeAgo(response.task_created_at)}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Looking for a <span className="font-medium">{response.category_name}</span> professional
        </p>
      </div>
    </div>
  );
}


export default function EstimateActivity({ response }: EstimateActivityProps) {
  const { data, error, isLoading } = useSWR<{ activities: Activity[] }>(
    response.task_id ? `/api/provider_estimates?task_id=${response.task_id}` : null,
    fetcher,
    { revalidateOnFocus: false }
);

  const activities = data?.activities ?? [];
  
  const estimateCount = activities.filter((a) => a.activity_type === "estimate_sent").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400 font-medium px-2">
          {formatDate(response.response_created_at)}
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="relative pl-6 space-y-6">
        <div className="absolute left-4 top-2 bottom-4 w-px bg-gray-200 dark:bg-gray-700" />

        {isLoading ? (
          <ActivitySkeleton />
        ) : error ? (
          <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2.5 rounded-xl border border-red-100 dark:border-red-800/40">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Failed to load activity. Will retry automatically.
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard key={activity.activity_id} activity={activity} />
          ))
        )}

        <ResponseCard response={response} />
        <TaskPostedCard response={response} />
      </div>
{/* 
      {!isLoading && !error && (
        <div className="flex items-center justify-end">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            estimateCount >= 2
              ? "bg-red-50 dark:bg-red-900/20 text-red-500"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
          }`}>
            {estimateCount >= 2
              ? "Estimate limit reached"
              : `${2 - estimateCount} estimate${2 - estimateCount === 1 ? "" : "s"} remaining`}
          </span>
        </div>
      )} */}
    </div>
  );
}