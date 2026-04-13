"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface HowItWorksProps {
  serviceName: string;
  serviceSlug?: string;
  onPostJob?: () => void;
  steps?: Step[];
  cityName?: string; // e.g. "Sydney"
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

const DEFAULT_STEPS = (serviceName: string): Step[] => [
  {
    title: `What kind of ${serviceName.toLowerCase()} service do you need?`,
    description: `Tell us exactly what you're looking for — whether it's a one-off job or ongoing work. Describe your requirements and we'll match you with the right ${serviceName.toLowerCase()} professionals in your area.`,
  },
  {
    title: `Receive quotes from local ${serviceName.toLowerCase()} pros`,
    description: `Once your job is posted, qualified professionals will send you personalised quotes. You'll be notified instantly and can compare pricing, profiles, and reviews all in one place.`,
  },
  {
    title: `Hire your ${serviceName.toLowerCase()} professional`,
    description: `Review each pro's credentials, past work, and customer ratings. Message them directly, ask questions, and book with confidence knowing every professional on Taskoria is verified and insured.`,
  },
];

const CITY_STEPS = (serviceName: string, proLabel: string, city: string): Step[] => [
  {
    title: `Need ${proLabel.endsWith("s") ? "a " + proLabel.slice(0, -1).toLowerCase() : "a " + proLabel.toLowerCase()} in ${city}?`,
    description: `Choosing the right ${serviceName.toLowerCase()} professional for your home can feel overwhelming. At Taskoria, we take the hassle out of finding and contacting verified ${proLabel.toLowerCase()} across ${city}. Simply tell us what you need and we'll do the rest.`,
  },
  {
    title: `Get quotes from the best ${proLabel.toLowerCase()} in ${city}`,
    description: `Once your ${serviceName.toLowerCase()} requirements are set out, we'll quickly send you quotes from trusted professionals in your part of ${city}. You can turn on notifications to hear from a pro straight away, or simply check your messages when it suits you. It's that flexible.`,
  },
  {
    title: `Hire your local ${serviceName.toLowerCase()} pro`,
    description: `After receiving your quotes, it's time to hire. You'll have your pick of ${city}'s best ${serviceName.toLowerCase()} professionals. Compare profiles, read genuine customer reviews, and choose the perfect professional for your job.`,
  },
];

export default function StepWiseHowItWorks({
  serviceName,
  onPostJob,
  steps,
  cityName,
}: HowItWorksProps) {
  const proLabel = getBreadcrumbLabel(serviceName);

  const items =
    steps ??
    (cityName
      ? CITY_STEPS(serviceName, proLabel, cityName)
      : DEFAULT_STEPS(serviceName));

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      aria-label={`How to hire a ${serviceName} professional${cityName ? ` in ${cityName}` : ""}`}
      className="w-full bg-slate-50 dark:bg-slate-900/60 py-6 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Only show heading label on non-city pages */}
        {!cityName && (
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500 dark:text-blue-400 mb-2">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Hire a {serviceName.toLowerCase()} pro in{" "}
              <span className="text-blue-600 dark:text-blue-400">
                3 simple steps
              </span>
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {items.map((step, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.45s ease ${i * 100}ms, transform 0.45s ease ${i * 100}ms`,
              }}
              className="group relative bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 flex flex-col gap-5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100/60 dark:hover:shadow-indigo-950/40 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-500 dark:group-hover:border-blue-500 transition-all duration-300">
                {i + 1}
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {i < items.length - 1 && (
                <div
                  aria-hidden
                  className="hidden md:block absolute -right-[11px] top-[34px] z-10 w-6 h-[2px] bg-blue-200 dark:bg-blue-800"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onPostJob}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-8 py-4 text-base shadow-md shadow-blue-200 dark:shadow-blue-950 hover:shadow-lg hover:shadow-blue-300 dark:hover:shadow-blue-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label={`Get free quotes for ${serviceName}${cityName ? ` in ${cityName}` : ""}`}
          >
            {cityName
              ? `Get quotes from ${proLabel} near you`
              : `Get quotes from ${serviceName} pros near you`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}