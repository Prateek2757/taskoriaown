"use client";

import { Zap } from "lucide-react";

export function ServicesTab({ profileServices }: { profileServices: any[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {profileServices.map((svc: any, idx: number) => (
        <div
          key={svc.id}
          className="group relative p-5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-200">
              <Zap className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                {svc.title}
              </h3>
              {svc.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-3">
                  {svc.description}
                </p>
              )}
              {svc.price != null && (
                <p className="text-sm font-semibold text-blue-600 mt-2">
                  From ${svc.price}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
