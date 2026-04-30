"use client";

import { useEffect, useRef } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";


const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("fetch-error");
    return r.json();
  });


interface ReviewData {
  ratings: number;
  totalRatings: number;
}


function StarRow({
  rating,
  max = 5,
  size = 14,
  color = "#f59e0b",
}: {
  rating: number;
  max?: number;
  size?: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        const pct = partial ? Math.round((rating % 1) * 100) : 0;
        const id = `star-partial-${i}-${Math.random().toString(36).slice(2, 7)}`;

        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {partial && (
              <defs>
                <linearGradient id={id}>
                  <stop offset={`${pct}%`} stopColor={color} />
                  <stop offset={`${pct}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={
                filled
                  ? color
                  : partial
                  ? `url(#${id})`
                  : "none"
              }
              stroke={color}
              strokeWidth={filled || partial ? 0 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={filled || partial ? 1 : 0.3}
            />
          </svg>
        );
      })}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

function Divider() {
  return (
    <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700 self-center" />
  );
}


function GoogleBadge({ data }: { data: ReviewData | null }) {
  const isLoading = data === null;

  return (
    <a
      href="https://www.google.com/search?q=taskoria+reviews"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
      aria-label="See our Google reviews"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>

      <div className="flex flex-col gap-0.5">
        {isLoading ? (
          <>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-16" />
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="google-data"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <StarRow rating={data.ratings} color="#f59e0b" size={13} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 tabular-nums">
                  {data.ratings.toFixed(1)}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 leading-none">
                {data.totalRatings.toLocaleString()} Google reviews
              </span>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </a>
  );
}


function TrustpilotBadge() {
  const trustpilotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as Record<string, unknown>).Trustpilot
    ) {
      const tp = (window as unknown as Record<string, unknown>).Trustpilot as {
        loadFromElement: (el: HTMLElement) => void;
      };
      if (trustpilotRef.current) {
        tp.loadFromElement(trustpilotRef.current);
      }
    }
  }, []);

  return (
    <a
      href="https://www.trustpilot.com/review/taskoria.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
      aria-label="See our Trustpilot reviews"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="24" height="24" rx="3" fill="#00b67a" />
        <path
          d="M12 4.5l2.32 4.7 5.18.75-3.75 3.65.89 5.18L12 16.3l-4.64 2.48.89-5.18L4.5 9.95l5.18-.75L12 4.5z"
          fill="white"
        />
      </svg>

      <div className="flex flex-col gap-0.5">
        <div
          ref={trustpilotRef}
          className="trustpilot-widget"
          data-locale="en-au"
          data-template-id="5419b6ffb0d04a076446a9af"
          data-businessunit-id="69832356c5b7f0ff5cd3d39d"
          data-style-height="20px"
          data-style-width="100%"
          data-theme="light"
          data-stars="4,5"
          data-schema-type="Organization"
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-[13px] h-[13px] fill-[#00b67a] text-[#00b67a]"
                  aria-hidden="true"
                />
              ))}
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                4.8
              </span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 leading-none">
              Excellent on Trustpilot
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}


interface TrustBadgesProps {
  label?: string | null;
  className?: string;
}

export function TrustBadges({
  label = "Trusted by customers worldwide",
  className = "",
}: TrustBadgesProps) {
  const { data: googleData, error: fetchError } = useSWR<ReviewData>(
    "/api/google-reviews",
    fetcher,
    {
     
      revalidateOnFocus: false,       
      revalidateOnReconnect: false,    
      dedupingInterval: 86_400_000,    
      errorRetryCount: 2,              
      errorRetryInterval: 5_000,       
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`mt-2 ${className}`}
    >
      {label && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      )}

      <div className="inline-flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Google Reviews */}
        {!fetchError && <GoogleBadge data={googleData ?? null} />}

        {/* Divider — only show when both badges are visible */}
        {/* {!fetchError && <Divider />} */}

        {/* Trustpilot */}
        {/* <TrustpilotBadge /> */}
      </div>
    </motion.div>
  );
}