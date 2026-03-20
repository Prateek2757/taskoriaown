"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQItem({ faq }: { faq: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all duration-200 ${
        open
          ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20"
          : "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium text-slate-900 dark:text-white text-sm leading-relaxed">
          {faq.question}
        </span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            open
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-white/10 text-gray-500"
          }`}
        >
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-blue-100 dark:border-blue-900/30 pt-4">
          {faq.answer}
        </div>
      )}
    </div>
  );
}
