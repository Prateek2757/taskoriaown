"use client";

import { Award, BadgeCheck,Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AboutTabProps {
  certifications: string[];
  languages: string[];
  accreditations: any[];
  provider: any;
}

export function AboutTab({ certifications, languages, accreditations, provider }: AboutTabProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {(certifications.length > 0 || languages.length > 0) && (
        <div className="p-5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Professional Details
          </h3>

          {certifications.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Certifications
              </p>
              <ul className="space-y-2">
                {certifications.map((cert: string) => (
                  <li key={cert} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang: string) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="text-xs border-gray-200 dark:border-white/15 text-slate-700 dark:text-slate-300"
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {accreditations.length > 0 && (
        <div className="p-3 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-blue-600" />
            Accreditations
          </h3>
          <div className="space-y-3">
            {[...accreditations]
              .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
              .map((acc: any) => (
                <div key={acc.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                      {acc.name}
                    </p>
                    {acc.issuing_organization && (
                      <p className="text-xs text-gray-400 mt-0.5">{acc.issuing_organization}</p>
                    )}
                    {acc.year && (
                      <p className="text-xs text-gray-400">{acc.year}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {(provider.availability || provider.joineddate) && (
        <div className="p-3 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Availability
          </h3>
          {provider.availability && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {provider.availability}
            </p>
          )}
          {provider.joineddate && (
            <p className="text-xs text-gray-400">
              Member since{" "}
              {new Date(provider.joineddate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
