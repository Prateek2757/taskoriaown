"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ContactActionProps {
  icon: React.ElementType;
  label: string;
  actionLabel: string;
  href: string;
  iconBg: string;
  description?: string;
}

export default function ContactAction({
  icon: Icon,
  label,
  actionLabel,
  href,
  iconBg,
  description,
}: ContactActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
            {description && !open && (
              <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-gray-50 dark:bg-gray-800/30 space-y-2">
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
          <a
            href={href}
            className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            {actionLabel}
          </a>
        </div>
      )}
    </div>
  );
}
