import {  StatusKey } from "@/types";

export const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: string;
    dot: string;
    badge: string;
    borderLeft: string;
    activeBg: string;
  }
> = {
  open: {
    label: "Open",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    borderLeft: "border-l-emerald-500",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  "in progress": {
    label: "In Progress",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    borderLeft: "border-l-amber-500",
    activeBg: "bg-amber-50 dark:bg-amber-900/20",
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    borderLeft: "border-l-blue-500",
    activeBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  closed: {
    label: "Closed",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    borderLeft: "border-l-gray-400",
    activeBg: "bg-gray-50 dark:bg-gray-800/40",
  },
};

export function getStatusConfig(status: string) {
  const key = status?.toLowerCase() as StatusKey;
  return STATUS_CONFIG[key] ?? STATUS_CONFIG["closed"];
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  return colors[(name?.charCodeAt(0) ?? 0) % colors.length];
}

export function getInitials(name: string): string {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
