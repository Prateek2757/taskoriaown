"use client";

import type { Status, IssueType } from "@/types/refunds";

const selectCls =
  "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all appearance-none cursor-pointer pr-8";

const inputCls =
  "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all";

function ChevronDown() {
  return (
    <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

interface RefundFiltersProps {
  search: string;
  statusFilter: "" | Status;
  typeFilter: "" | IssueType;
  resultCount: number;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: "" | Status) => void;
  onTypeChange: (v: "" | IssueType) => void;
  onClear: () => void;
}

export function RefundFilters({
  search,
  statusFilter,
  typeFilter,
  resultCount,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onClear,
}: RefundFiltersProps) {
  const hasFilters = !!(search || statusFilter || typeFilter);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="relative flex-1 min-w-48">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search email, lead name, lead email, subject…"
          className={`${inputCls} pl-10 w-full`}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as "" | Status)}
          className={selectCls}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown />
        </div>
      </div>

      {/* Type filter */}
      <div className="relative">
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as "" | IssueType)}
          className={selectCls}
        >
          <option value="">All types</option>
          <option value="credit_return">Credit Return</option>
          <option value="something_else">Support</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown />
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear · {resultCount} result{resultCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}