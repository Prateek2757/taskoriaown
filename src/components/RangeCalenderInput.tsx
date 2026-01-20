"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

type DateRangePickerProps = {
  label?: string;
  placeholder?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
};

export default function DateRangePicker({
  label,
  placeholder = "Select date range",
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (range: DateRange | undefined) => {
    onChange?.(range);
    
    if (range?.from && range?.to && range.from !== range.to) {
      setOpen(false);
    }
  };

  const displayValue = () => {
    if (value?.from) {
      if (value.to) {
        return `${format(value.from, "MMM dd, yyyy")} - ${format(value.to, "MMM dd, yyyy")}`;
      }
      return `${format(value.from, "MMM dd, yyyy")} - Select end date`;
    }
    return placeholder;
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal transition-all hover:border-blue-400 dark:hover:border-blue-500",
              !value?.from && "text-muted-foreground",
              "bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm">{displayValue()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 z-[999999] shadow-xl border-gray-200 dark:border-gray-700" 
          align="start"
        >
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}