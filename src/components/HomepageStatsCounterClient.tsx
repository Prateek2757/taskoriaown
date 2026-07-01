"use client";

import { NumberTicker } from "./ui/number-ticker";

export type HomepageCounterStat = {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  durationMs?: number;
};

type StatTone = {
  suffixClassName: string;
};

const STAT_TONES: StatTone[] = [
  {
    suffixClassName: "text-blue-600 dark:text-blue-300",
  },
  {
    suffixClassName: "text-amber-500 dark:text-amber-300",
  },
  {
    suffixClassName: "text-emerald-600 dark:text-emerald-300",
  },
  {
    suffixClassName: "text-red-600 dark:text-red-300",
  },
];

function formatStatLabel(stat: HomepageCounterStat) {
  const value = stat.value.toLocaleString("en-AU", {
    minimumFractionDigits: stat.decimals ?? 0,
    maximumFractionDigits: stat.decimals ?? 0,
  });

  return `${stat.prefix ?? ""}${value}${stat.suffix ?? ""} ${stat.label}`;
}

export default function HomepageStatsCounterClient({
  stats,
}: {
  stats: HomepageCounterStat[];
}) {
  return (
    <section
      aria-label="Taskoria platform statistics"
      className="bg-[#ecf0f7] py-5 mb-4 dark:bg-slate-950/70 lg:py-5"
    >
      <div className="section-container">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const tone = STAT_TONES[index % STAT_TONES.length];

            return (
              <article
                key={stat.label}
                aria-label={formatStatLabel(stat)}
                className="min-w-0 rounded-lg   px-4 py-4 text-center  transition-colors dark:bg-black3"
              >
                <p className="font-display text-3xl font-bold leading-none tracking-normal text-slate-950 tabular-nums dark:text-white">
                  <span>{stat.prefix}</span>
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimals ?? 0}
                    className="tracking-normal text-inherit"
                  />
                  <span className={tone.suffixClassName}>
                    {stat.suffix}{" "}
                  </span>
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                  {stat.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
