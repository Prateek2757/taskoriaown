// components/sections/ReviewsSection.tsx
"use client";

import React from "react";

export default function ReviewsSection({ data }: { data?: any[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Reviews are pulled from customer feedback. You currently have{" "}
        <strong>{data?.length ?? 0}</strong>.
      </p>

      <div className="grid gap-3">
        {(data ?? []).length === 0 && (
          <div className="text-sm text-slate-500">No reviews yet — encourage customers to leave feedback.</div>
        )}

        {(data ?? []).map((r: any, idx: number) => (
          <div key={idx} className="p-3 rounded-md border bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{r.reviewer}</div>
              <div className="text-xs text-slate-500">{r.date}</div>
            </div>
            <p className="text-sm text-slate-700 mt-1">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
