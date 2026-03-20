"use client";

import { ExternalLink } from "lucide-react";
import { SocialIcon, platformLabel } from "./SocialIcon";

export function SocialTab({ socialLinks }: { socialLinks: any[] }) {
  const sorted = [...socialLinks].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {sorted.map((link: any, idx: number) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            <SocialIcon platform={link.platform} className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {platformLabel(link.platform)}
            </p>
            {link.username && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                @{link.username}
              </p>
            )}
            {link.url && !link.username && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{link.url}</p>
            )}
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors shrink-0" />
        </a>
      ))}
    </div>
  );
}
