"use client";

import { Shield, CheckCircle2, BadgeCheck } from "lucide-react";

interface TrustSafetyCardProps {
  provider: any;
  trustIndicators: string[];
  accreditations: any[];
}

export function TrustSafetyCard({ provider, trustIndicators, accreditations }: TrustSafetyCardProps) {
  const items =
    trustIndicators.length > 0
      ? trustIndicators
      : ["AI background check passed"];

  return (
    <div className="bg-white dark:bg-[#0c1220] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-blue-600" />
        </div>
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
          Trust &amp; Safety
        </h4>
      </div>

      <div className="p-5 space-y-2.5">
        {items.map((t: string) => (
          <div key={t} className="flex items-center gap-2.5 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">{t}</span>
          </div>
        ))}

        {provider.verified && (
          <div className="flex items-center gap-2.5 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">Identity verified</span>
          </div>
        )}

        {accreditations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 space-y-2">
            {accreditations.slice(0, 3).map((acc: any) => (
              <div key={acc.id} className="flex items-start gap-2.5 text-sm">
                <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-tight">
                    {acc.name}
                  </p>
                  {acc.issuing_organization && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {acc.issuing_organization}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {accreditations.length > 3 && (
              <p className="text-xs text-gray-400 pl-6">
                +{accreditations.length - 3} more accreditations
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
