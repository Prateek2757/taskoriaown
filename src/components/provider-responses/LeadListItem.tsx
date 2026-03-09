import { Check, Coins, MapPin } from "lucide-react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import { timeAgo } from "./helpers";
import { ProviderResponse } from "@/types";

interface LeadListItemProps {
  response: ProviderResponse;
  isActive: boolean;
  onClick: () => void;
}

export default function LeadListItem({
  response,
  isActive,
  onClick,
}: LeadListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 border-b border-gray-100 dark:border-gray-700/50 transition-colors relative
        border-l-[3px]
        ${isActive
          ? "bg-blue-50 dark:bg-blue-900/25 border-l-blue-500"
          : "border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          name={response.customer_name}
          picture={response.customer_profile_picture}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={`font-semibold text-sm truncate ${isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}
            >
              {response.customer_name}
            </span>
            <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">
              <StatusBadge status={response.status} />
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1.5">
            {response.category_name}
          </p>
          {response.location_name ? (
            <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate mb-1.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {response.location_name}
            </p>
          ) : (
            <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate mb-1.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              National Wide
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center rounded-lg sm:rounded-full px-2.5 sm:px-2 py-1.5 sm:py-0 justify-between bg-gray-50 dark:bg-gray-800 gap-1 sm:gap-0 mt-1 sm:mt-0">
            <div className="flex items-center gap-1 text-[11px] text-gray-400 sm:py-1">
              <Check size={10} className="flex-shrink-0" />
              <span className="truncate">You purchased this lead</span>
            </div>

            <span className="text-[10px] sm:text-[11px] text-gray-400 whitespace-nowrap">
              {timeAgo(response.response_created_at)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
