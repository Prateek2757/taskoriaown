"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type LeadingOption = {
  label: string;
  active: boolean;
  onSelect: () => void;
};

type Props = {
  availableLetters: Iterable<string>;
  activeLetter?: string | null;
  onSelect: (letter: string) => void;
  ariaLabel: string;
  label?: string;
  variant?: "grid" | "horizontal" | "rail";
  leadingOption?: LeadingOption;
  getHref?: (letter: string) => string;
  className?: string;
};

export default function AlphabetJumpFilter({
  availableLetters,
  activeLetter,
  onSelect,
  ariaLabel,
  label = "Jump to",
  variant = "grid",
  leadingOption,
  getHref,
  className,
}: Props) {
  const available = new Set(
    Array.from(availableLetters, (letter) => letter.toUpperCase())
  );

  const buttonClass = (isAvailable: boolean, isActive: boolean) =>
    cn(
      "inline-flex shrink-0 items-center justify-center rounded-lg border text-xs font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      variant === "grid" && "h-8 w-8",
      variant === "horizontal" && "h-9 w-9",
      variant === "rail" && "h-9 min-w-12 md:w-full",
      !isAvailable &&
        "cursor-not-allowed border-transparent text-slate-300 dark:text-slate-700",
      isAvailable &&
        !isActive &&
        "border-slate-200 bg-white text-slate-600 shadow-xs hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-300",
      isActive &&
        "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20"
    );

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70",
        variant === "grid" && "rounded-2xl p-4",
        variant === "horizontal" &&
          "flex items-center gap-1.5 overflow-x-auto rounded-2xl p-2.5",
        variant === "rail" &&
          "flex shrink-0 gap-1.5 overflow-x-auto rounded-2xl p-2 md:w-[88px] md:flex-col md:overflow-visible",
        className
      )}
    >
      {variant === "grid" && (
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
      )}

      <div
        className={cn(
          variant === "grid" && "grid grid-cols-6 gap-1.5",
          variant !== "grid" && "contents"
        )}
      >
        {leadingOption && (
          <button
            type="button"
            onClick={leadingOption.onSelect}
            aria-pressed={leadingOption.active}
            className={cn(
              "h-9 shrink-0 rounded-lg border px-3 text-xs font-extrabold transition-colors",
              leadingOption.active
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            )}
          >
            {leadingOption.label}
          </button>
        )}

        {ALPHABET.map((letter) => {
          const isAvailable = available.has(letter);
          const isActive = activeLetter === letter;

          if (isAvailable && getHref) {
            return (
              <Link
                key={letter}
                href={getHref(letter)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Browse entries beginning with ${letter}`}
                className={buttonClass(true, isActive)}
              >
                {letter}
              </Link>
            );
          }

          return (
            <button
              key={letter}
              type="button"
              disabled={!isAvailable}
              aria-pressed={isActive}
              aria-label={
                isAvailable
                  ? `Jump to ${letter}`
                  : `No entries beginning with ${letter}`
              }
              onClick={() => isAvailable && onSelect(letter)}
              className={buttonClass(isAvailable, isActive)}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
