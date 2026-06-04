"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TaskStatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TaskStatusSelector({
  value,
  onChange,
  disabled,
}: TaskStatusSelectorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      // case "all":
      //   return "text-gray-700";
      case "Open":
        return "text-emerald-700";
      case "Urgent":
        return "text-red-700";
      case "In Progress":
        return "text-amber-700";
      case "Closed":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn("w-full min-w-40 font-medium rounded-xl", getStatusColor(value))}
      >
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent className="">
        {/* <SelectItem value="all" className="text-gray-700">
          <span className="flex items-center gap-2">
            <span>⬤</span> All Status
          </span>
        </SelectItem> */}
        <SelectItem value="Urgent" className="text-red-700">
          <span className="flex items-center gap-2">
            <span>○</span> Urgent
          </span>
        </SelectItem>
        <SelectItem value="Open" className="text-emerald-700">
          <span className="flex items-center gap-2">
            <span>●</span> Open Quoting
          </span>
        </SelectItem>
        <SelectItem value="In Progress" className="text-amber-700">
          <span className="flex items-center gap-2">
            <span>◐</span> In Progress
          </span>
        </SelectItem>
        <SelectItem value="Closed" className="text-red-600">
          <span className="flex items-center gap-2">
            <span>○</span> Closed
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
