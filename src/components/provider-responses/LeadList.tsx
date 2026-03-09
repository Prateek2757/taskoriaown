import { MessageSquare } from "lucide-react";
import LeadListItem from "./LeadListItem";
import { ProviderResponse } from "@/types";

interface LeadListProps {
  responses: ProviderResponse[];
  activeId: number | null;
  onSelect: (response: ProviderResponse) => void;
  searchQuery: string;
}

export default function LeadList({ responses, activeId, onSelect, searchQuery }: LeadListProps) {
  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {searchQuery ? "No results found" : "No responses yet"}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {searchQuery ? "Try a different search" : "Start responding to tasks"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {responses.map((response) => (
        <button
          key={response.response_id}
          onClick={() => onSelect(response)}
          className="w-full"
        >
          <LeadListItem
            response={response}
            isActive={activeId === response.response_id}
            onClick={() => onSelect(response)}
          />
        </button>
      ))}
    </div>
  );
}
