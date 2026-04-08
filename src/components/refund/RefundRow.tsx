import { fmtDate } from "./refund-utils";
import { StatusBadge } from "./StatusBadge";
import { TypeBadge } from "./TypeBadge";

import { REASON_LABELS, TOPIC_LABELS, type RefundRequest } from "@/types/refunds";

interface RefundRowProps {
  row: RefundRequest;
  onReview: (row: RefundRequest) => void;
}

export function RefundRow({ row, onReview }: RefundRowProps) {
  const reasonOrTopic =
    row.issue_type === "credit_return"
      ? row.reason
        ? (REASON_LABELS[row.reason] ?? row.reason)
        : "—"
      : row.support_topic
        ? (TOPIC_LABELS[row.support_topic] ?? row.support_topic)
        : "—";

  const leadOrSubject =
    row.issue_type === "credit_return"
      ? (row.lead_name ?? "—")
      : (row.subject ?? "—");

  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
      <td className="px-3 py-4 text-xs font-mono text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
        #{row.id}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <TypeBadge type={row.issue_type} />
      </td>
      <td className="px-3 py-4 text-sm text-zinc-700 dark:text-zinc-300 whitespace-nowrap max-w-45 truncate">
        {row.email}
      </td>
      <td className="px-3 py-4 max-w-40">
        <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{leadOrSubject}</p>
      </td>
      <td className="px-3 py-4 max-w-40">
        {row.issue_type === "credit_return" ? (
          row.lead_email ? (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate block" title={row.lead_email}>
              {row.lead_email}
            </span>
          ) : (
            <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
          )
        ) : (
          <span className="text-xs text-zinc-300 dark:text-zinc-600">N/A</span>
        )}
      </td>
      <td className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap max-w-45 truncate">
        {reasonOrTopic}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-3 py-4 text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
        {fmtDate(row.created_at)}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <button
          onClick={() => onReview(row)}
          className="px-3 py-1.5 text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          Review
        </button>
      </td>
    </tr>
  );
}