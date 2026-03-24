"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function PortfolioTab({ photos }: { photos: any[] }) {
  const sorted = [...photos].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  return (
    <div className="grid p-2 sm:grid-cols-2 gap-4">
      {sorted.map((photo: any) => (
        <div
          key={photo.id}
          className={`group relative overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-lg hover:shadow-black/10 transition-all duration-300 ${
            photo.is_featured ? "sm:col-span-2" : ""
          }`}
        >
          {photo.photo_url ? (
            <div className={`relative ${photo.is_featured ? "h-64 sm:h-80" : "h-52"}`}>
              <Image
                src={photo.photo_url}
                alt={photo.title ?? "Portfolio photo"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {photo.is_featured && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-600 text-white text-xs border-0 shadow">
                    Featured
                  </Badge>
                </div>
              )}
              {(photo.title || photo.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {photo.title && (
                    <p className="text-white font-semibold text-sm">{photo.title}</p>
                  )}
                  {photo.description && (
                    <p className="text-white/80 text-xs mt-0.5 line-clamp-2">{photo.description}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={`${photo.is_featured ? "h-64 sm:h-80" : "h-52"} bg-gray-100 dark:bg-white/5 flex items-center justify-center`}>
              <span className="text-gray-300 dark:text-gray-600 text-sm">No image</span>
            </div>
          )}

          {/* Title below image (non-hover fallback) */}
          {(photo.title || photo.description) && (
            <div className="p-4 border-t border-gray-100 dark:border-white/10 sm:hidden">
              {photo.title && (
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{photo.title}</p>
              )}
              {photo.description && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{photo.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
