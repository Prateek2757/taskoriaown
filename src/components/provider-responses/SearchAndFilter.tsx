import { Search, X } from "lucide-react";
import { ResponsesStats } from "@/types";

interface FilterButton {
  key: string;
  label: string;
  count: number;
}

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  stats: ResponsesStats;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  stats,
}: SearchAndFilterProps) {
  const filters: FilterButton[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "open", label: "Open", count: stats.open },
    { key: "in progress", label: "In Progress", count: stats.inProgress },
    { key: "completed", label: "Completed", count: stats.completed },
  ];

  return (
    <div className="flex flex-col gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, title or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === f.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {f.label}
            <span className={`ml-1.5 ${filterStatus === f.key ? "opacity-80" : "opacity-60"}`}>({f.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
