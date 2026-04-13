"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";

interface ServiceHeroSectionProps {
  service: {
    name: string;
    slug: string;
    short_description?: string;
    description?: string;
  };
  onLocationSelect?: (location: any) => void;
  onPostJob?: () => void;
  presetLocation?: any;
  cityName?: string; // e.g. "Sydney" or "Liverpool"
}

function getBreadcrumbLabel(name: string) {
  const irregulars: Record<string, string> = {
    "House Cleaning": "Cleaners",
    Plumbing: "Plumbers",
    Electrician: "Electricians",
    "Lawn Mowing": "Lawn Mowers",
    Carpentry: "Carpenters",
    Painting: "Painters",
    "Pest Control": "Pest Controllers",
    Roofing: "Roofers",
    Tiling: "Tilers",
    Plastering: "Plasterers",
  };
  return irregulars[name] ?? `${name} Professionals`;
}

function getArticle(name: string) {
  return /^[aeiou]/i.test(name) ? "an" : "a";
}

// Generic (no city) content
function getDefaultParagraphs(name: string, proLabel: string) {
  return {
    lead: `You can find the best ${proLabel} on Taskoria. Start your search and get free quotes now!`,
    body: `First time looking for ${getArticle(name)} ${name.toLowerCase()} professional and not sure where to start? Tell us about your job and we'll send you a list of verified ${proLabel.toLowerCase()} to review. There's no pressure to hire, so you can compare profiles, read previous reviews and ask for more information before you make your decision.`,
    highlight: `Best of all — it's completely free!`,
  };
}

// City-specific content
function getCityParagraphs(name: string, proLabel: string, city: string) {
  const article = getArticle(proLabel);
  return [
    `We'll connect you with the best ${proLabel} in ${city} in minutes. Start your search and get free quotes today!`,
    `Whether you're looking for quotes or you're ready to hire, or if you'd like to speak with some ${city}-based ${proLabel}, we can help.`,
    `First time looking for ${article} ${name.toLowerCase()} and not sure where to start? Let us do the legwork for you. Tell us about your project and we'll send you a list of ${proLabel} in ${city} to review.`,
    `There's no pressure to hire, so you can compare profiles, read previous reviews and ask for more information before you make your decision.`,
    `Best of all — it's completely free!`,
  ];
}

export default function SubHeroService({
  service,
  onLocationSelect,
  onPostJob,
  presetLocation,
  cityName,
}: ServiceHeroSectionProps) {
  const proLabel = getBreadcrumbLabel(service.name);
  const paragraphs = getDefaultParagraphs(service.name, proLabel);
  const article = getArticle(proLabel);
  const cityParagraphs = cityName
    ? getCityParagraphs(service.name, proLabel, cityName)
    : null;

  if (cityName) {
    return (
      <section
        aria-label={`Find ${proLabel} in ${cityName} on Taskoria`}
        className="w-full bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/60"
      >
        <div className="max-w-6xl mx-auto py-10 md:py-8 px-0">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Need to find {article}{" "}
            <span className="text-[#2563eb] dark:text-[#60a5fa]">
              {proLabel.endsWith("s") ? proLabel.slice(0, -1) : proLabel}
            </span>{" "}
            in {cityName}?
          </h1>

          {/* Paragraphs */}
          <div className="flex flex-col gap-3 mb-6 max-w-2xl">
            {cityParagraphs!.slice(0, -1).map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed"
                    : "text-base text-slate-500 dark:text-slate-400 leading-relaxed"
                }
              >
                {p}
              </p>
            ))}

            {/* "Best of all" highlight */}
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
              {cityParagraphs![cityParagraphs!.length - 1]}
            </p>
          </div>

          {/* CTA button */}
          <div className="pt-1">
            <button
              onClick={onPostJob}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-base px-7 py-4 shadow-lg shadow-blue-200 dark:shadow-blue-950 hover:shadow-xl hover:shadow-blue-300 dark:hover:shadow-blue-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label={`Find ${article} ${service.name} professional in ${cityName} today`}
            >
              Find {article} {proLabel.endsWith("s") ? proLabel.slice(0, -1).toLowerCase() : proLabel.toLowerCase()} in {cityName} today!
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── DEFAULT (NO CITY) LAYOUT ──────────────────────────────────────────────────
  return (
    <section
      aria-label={`Find ${proLabel} on Taskoria`}
      className="w-full bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/60"
    >
      <div className="max-w-6xl mx-auto py-10 md:py-5">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 mb-8"
        >
          <Link
            href="/services"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {service.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Need help finding{" "}
              {getArticle(proLabel)}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#2563eb] dark:text-[#60a5fa]">
                  {proLabel.endsWith("s") ? proLabel : proLabel + "?"}
                </span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-[#2563eb]/20 dark:bg-[#60a5fa]/20"
                />
              </span>
              {!proLabel.endsWith("?") && "?"}
            </h1>

            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {service.short_description ?? paragraphs.lead}
            </p>

            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              {service.description ?? paragraphs.body}
            </p>

            <p className="inline-flex items-center gap-2 text-base font-semibold text-[#2563eb] dark:text-[#60a5fa]">
              <span className="w-2 h-2 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] shrink-0" />
              {paragraphs.highlight}
            </p>

            <div className="pt-1">
              <button
                onClick={onPostJob}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-base px-7 py-4 shadow-lg shadow-blue-200 dark:shadow-blue-950 hover:shadow-xl hover:shadow-blue-300 dark:hover:shadow-blue-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label={`Find ${getArticle(proLabel)} ${service.name} professional today`}
              >
                Find {getArticle(proLabel)} {service.name.toLowerCase()} today
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "480+", label: "Verified pros" },
                { val: "4.8★", label: "Avg. rating" },
                { val: "Free", label: "No cost to post" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center text-center rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 p-2 gap-1"
                >
                  <span className="text-2xl font-extrabold text-[#2563eb] dark:text-[#60a5fa] tracking-tight">
                    {s.val}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {[
                { n: "1", text: `Describe your ${service.name.toLowerCase()} job` },
                { n: "2", text: "Receive quotes from local verified pros" },
                { n: "3", text: "Compare, review & hire with confidence" },
              ].map((step) => (
                <div key={step.n} className="flex items-center gap-4 px-5 py-4">
                  <span className="w-7 h-7 rounded-full bg-[#2563eb]/10 dark:bg-[#2563eb]/20 text-[#2563eb] dark:text-[#60a5fa] text-xs font-bold flex items-center justify-center shrink-0">
                    {step.n}
                  </span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            {presetLocation && (
              <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 px-1">
                <MapPin className="w-4 h-4 shrink-0 text-[#2563eb] dark:text-[#60a5fa]" />
                Showing results near{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {presetLocation.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}