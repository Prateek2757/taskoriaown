"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function parseDate(str: string) {
  const date = new Date(str);
  return isNaN(date.getTime()) ? undefined : date;
}

export default function CalendarInput({
  label,
  value,
  onChange,
  minDate,
}: {
  label?: string;
  value: Date | undefined;
  onChange: (v: Date | undefined) => void;
  minDate?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(value);
  const [inputValue, setInputValue] = React.useState(formatDate(value));

  React.useEffect(() => {
    setInputValue(formatDate(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <Label className="px-1">{label}</Label>

      <div className="relative flex gap-2">
        <Input
          value={inputValue}
          placeholder="Select date"
          className="bg-background pr-10"
          onChange={(e) => {
            const d = parseDate(e.target.value);
            setInputValue(e.target.value);
            if (d) {
              onChange(d);
              setMonth(d);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              toYear={2030}
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                if (minDate && d && d < minDate) return; // prevent invalid selection
                onChange(d);
                setOpen(false);
              }}
              disabled={(d) => (minDate ? d < minDate : false)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}