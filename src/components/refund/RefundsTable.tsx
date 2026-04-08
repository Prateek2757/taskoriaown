"use client";

import { useMemo } from "react";
import { RefundRow } from "./RefundRow";
import { Spinner } from "./spinner";
import { PAGE_SIZE, type RefundRequest } from "@/types/refunds";

const HEADERS = [
  "#", "Type", "Requester Email", "Lead / Subject",
  "Lead Email", "Reason / Topic", "Status", "Submitted", "Actions",
];

interface RefundsTableProps {
  data: RefundRequest[];
  loading: boolean;
  page: number;
  onPageChange: (p: number) => void;
  onReview: (row: RefundRequest) => void;
}

export function RefundsTable({ data, loading, page, onPageChange, onReview }: RefundsTableProps) {
  const totalPages = Math.ceil(data.length / PAGE_SIZE) || 1;
  const pagedData = useMemo(
    () => data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [data, page]
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-zinc-400 dark:text-zinc-500">
          <Spinner />
          <span className="text-sm">Loading requests…</span>
        </div>
      ) : pagedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400 dark:text-zinc-500">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm font-medium">No requests found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
              {pagedData.map((row) => (
                <RefundRow key={row.id} row={row} onReview={onReview} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={data.length}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalCount,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (p: number) => void;
}) {
  const btnBase =
    "px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) =>
    totalPages <= 5
      ? i + 1
      : Math.max(1, Math.min(page - 2, totalPages - 4)) + i
  );

  return (
    <div className="flex items-center justify-between px-3 py-4 border-t border-zinc-100 dark:border-zinc-800">
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Showing {(page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} results
      </p>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className={btnBase}>
          ← Prev
        </button>
        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
              p === page
                ? "bg-[#2563EB] text-white"
                : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className={btnBase}>
          Next →
        </button>
      </div>
    </div>
  );
}