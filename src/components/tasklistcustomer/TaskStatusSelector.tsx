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
      case "Open":
        return "text-emerald-700";
      case "In Progress":
        return "text-amber-700";
      case "Closed":
        return "text-slate-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn("w-[180px] font-medium", getStatusColor(value))}
      >
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Open" className="text-emerald-700">
          <span className="flex items-center gap-1">
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
