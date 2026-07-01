import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const cities = [
  {
    name: "Sydney",
    state: "NSW",
    href: "/locations/nsw/sydney",
  },
  {
    name: "Melbourne",
    state: "VIC",
    href: "/locations/vic/melbourne",
  },
  {
    name: "Brisbane",
    state: "QLD",
    href: "/locations/qld/brisbane",
  },
  {
    name: "Perth",
    state: "WA",
    href: "/locations/wa/perth",
  },
  {
    name: "Adelaide",
    state: "SA",
    href: "/locations/sa/adelaide",
  },
  {
    name: "Newcastle",
    state: "NSW",
    href: "/locations/nsw/newcastle",
  },
  {
    name: "Gold Coast",
    state: "QLD",
    href: "/locations/qld",
  },
  {
    name: "Canberra",
    state: "ACT",
    href: "/locations/act/canberra",
  },
];

export default function HomepageCityCoverage() {
  return (
    <section
      aria-labelledby="homepage-city-coverage-title"
      className="relative overflow-hidden border-y border-[#eee7db] bg-[#ecf0f7] py-8 sm:py-10 dark:border-white/10 dark:bg-[radial-gradient(circle_at_right,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_90%)]"
    >
      <div className="section-container">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-[#dce3ee] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-800 ring-1 ring-black/5 dark:bg-white/10 dark:text-white dark:ring-white/10">
                Australia-wide coverage
              </span>

              <h2
                id="homepage-city-coverage-title"
                className="mt-3 text-2xl font-bold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-3xl"
              >
                Find pros in your city.
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <Link
                key={`${city.state}-${city.name}`}
                href={city.href}
                className="group flex h-auto items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3ec] dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-400"
                aria-label={`Find professionals in ${city.name}, ${city.state}`}
              >
                <span className="min-w-0 text-base font-semibold leading-6 text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                  {city.name}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs  text-slate-500 dark:text-slate-300">
                  {city.state}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
