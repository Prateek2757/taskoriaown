"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ReviewsTab({ reviews }: { reviews: any[] }) {
  return (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <div
          key={review.id}
          className="p-5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-gray-100 dark:ring-white/10">
                {review.avatar ? (
                  <AvatarImage src={review.avatar} alt={review.customerName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-500 text-white text-sm font-semibold">
                    {(review.customerName || "U")[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {review.customerName}
                </p>
                {review.serviceType && (
                  <p className="text-xs text-gray-400 mt-0.5">{review.serviceType}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
              {review.date && (
                <p className="text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          {review.comment && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              "{review.comment}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
