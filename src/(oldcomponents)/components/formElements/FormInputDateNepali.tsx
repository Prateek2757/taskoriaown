"use client";
import { useEffect } from "react";
import DatePickerNP, { getTodayBSDate } from "date-picker-np";
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  form: UseFormReturn<T>;
  onChange?: (date: string) => void;
  required?: boolean;
  disabled?: boolean;
  futureDate?: boolean;
};

function FormInputDateNepali<T extends FieldValues>({
  name,
  label,
  form,
  onChange,
  required,
  disabled = false,
  futureDate = false,
  placeholder = "YYYY-MM-DD",
}: InputProps<T>) {
  const todayBS = getTodayBSDate();
  const [todayYear, todayMonth, todayDay] = todayBS.split("-").map(Number);

  useEffect(() => {
    const interval = setInterval(() => {
      const monthYearElement = document.querySelector(
        ".date-picker-calendar-header-dropdown-text"
      );

      if (!monthYearElement) return;

      const displayText = monthYearElement.textContent?.trim() || "";
      const yearMatch = displayText.match(/(\d{4})/);
      const currentDisplayYear = yearMatch ? parseInt(yearMatch[1], 10) : null;

      const monthNames = {
        Baisakh: 1,
        Jestha: 2,
        Ashadh: 3,
        Shrawan: 4,
        Bhadra: 5,
        Ashwin: 6,
        Kartik: 7,
        Mangsir: 8,
        Poush: 9,
        Magh: 10,
        Falgun: 11,
        Chaitra: 12,
      };

      let currentDisplayMonth = null;
      Object.entries(monthNames).forEach(([monthName, monthNum]) => {
        if (displayText.includes(monthName)) {
          currentDisplayMonth = monthNum;
        }
      });

      const isCurrentMonthYear =
        currentDisplayYear === todayYear && currentDisplayMonth === todayMonth;

      const allCalendarDates = document.querySelectorAll(
        ".date-picker-dates-container > div"
      );

      const currentMonthDates = document.querySelectorAll(
        ".date-picker-dates-container > div:not(.next-month-days)"
      );

      const nextMonthDates = document.querySelectorAll(
        ".date-picker-dates-container > div.next-month-days"
      );

      allCalendarDates.forEach((div) => {
        div.classList.remove("highlight-today");
        if (div.style) {
          div.style.backgroundColor = "";
          div.style.color = "";
          div.style.borderRadius = "";
          div.style.fontWeight = "";
        }
      });

      nextMonthDates.forEach((div) => {
        const dayText = div.textContent?.trim();
        if (dayText && parseInt(dayText, 10) === todayDay) {
          if (div.style) {
            div.style.color = "#9ca3af";
            div.style.fontWeight = "normal";
          }
        }
      });
      if (isCurrentMonthYear) {
        currentMonthDates.forEach((div) => {
          const dayText = div.textContent?.trim();
          if (dayText && parseInt(dayText, 10) === todayDay) {
            div.classList.add("highlight-today");
            if (div.style) {
              div.style.backgroundColor = "#3b82f6";
              div.style.color = "white";
              div.style.borderRadius = "50%";
              div.style.fontWeight = "bold";
            }
          }
        });
      }
    }, 150);

    return () => clearInterval(interval);
  }, [todayYear, todayMonth, todayDay]);

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <>
          {label && (
            <label
              htmlFor={name}
              className="flex items-center text-gray-700 text-sm"
            >
              {label}
              {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <DatePickerNP
            value={field.value}
            onChange={(date: string) => {
              field.onChange(date);
              onChange?.(date);
            }}
            placeholder={placeholder}
            max={futureDate ? undefined : todayBS}
            disabled={disabled}
            inputContainerStyles={{
              height: 35,
              border: "1px solid var(--input)",
              borderRadius: "calc(var(--radius) - 2px)",
              background: "hsl(var(--background))",
              fontSize: "14px",
              color: "hsl(var(--foreground))",
              width: "100%",
              lineHeight: "1.4",
            }}
            calendarStyles={{
              dates: {
                hoverBackgroundColor: "hsl(var(--accent))",
                activeBackgroundColor: "hsl(var(--primary))",
                activeTextColor: "hsl(var(--primary-foreground))",
              },
            }}
          />
        </>
      )}
    />
  );
}

export default FormInputDateNepali;
