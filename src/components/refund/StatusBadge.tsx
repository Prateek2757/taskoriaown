import type { Status } from "@/types/refunds";

const colorMap: Record<Status, string> = {
  pending:
    "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
  approved:
    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
  rejected:
    "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
};

const dotMap: Record<Status, string> = {
  pending: "bg-amber-400",
  approved: "bg-emerald-400",
  rejected: "bg-red-400",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorMap[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}