"use client";

import {
  Clock3,
  ShieldCheck,
  Star,
  Wallet,
  Users2,
} from "lucide-react";
import { BsFileEarmarkPostFill } from "react-icons/bs";

interface SubHeroSectionProps {
  serviceName: string;
  highlights?: {
    icon?: React.ReactNode;
    label: string;
    value: string;
  }[];
}

const DEFAULT_HIGHLIGHTS = (serviceName: string) => [
  {
    icon: <BsFileEarmarkPostFill className="w-8 h-8" />,
    label: "Free to post",
    value: `Get ${serviceName.toLowerCase()} quotes at zero cost`,
  },
  {
    icon: <Users2 className="w-8 h-8" />,
    label: "Multiple quotes",
    value: "Compare up to 5 verified professionals",
  },
  {
    icon: <Clock3 className="w-8 h-8" />,
    label: "Fast responses",
    value: "Pros reply within a few hours",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    label: "Vetted & insured",
    value: "Every pro is checked before joining",
  },
  {
    icon: <Star className="w-8 h-8" />,
    label: "Honest reviews",
    value: "Real ratings from real customers",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    label: "No surprise fees",
    value: "Transparent pricing, always",
  },
];

export default function WhyTaskoria({
  serviceName,
  highlights,
}: SubHeroSectionProps) {
  const items = highlights ?? DEFAULT_HIGHLIGHTS(serviceName);

  return (
    <section
      aria-label={`Why use Taskoria for ${serviceName}`}
      className="w-full border-t border-slate-100 dark:border-slate-800  dark:bg-slate-900 overflow-hidden"
    >
      {/* <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-[#2563EB] to-blue-600" /> */}

      <div className="max-w-8xl mx-auto px-6 py-5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2563EB] mb-2 text-center">
          Why customers choose Taskoria for {serviceName.toLowerCase()}
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-white mb-2 text-center">
          we keep it simple to connect with {serviceName.toLowerCase()}
        </p>
        <div className="mt-12 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-border rounded-xl overflow-hidden">
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                animationDelay: `${i * 55}ms`,
              }}
              className="service-enter group flex flex-col items-center text-center gap-3 px-4 py-6 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors duration-150 cursor-default"
            >
              <div className="w-11 h-11 flex items-center justify-center  bg-blue-50 dark:bg-blue-950/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-150 shrink-0 rounded-lg">
                <span className="flex text-blue-600 dark:text-blue-400 group-hover:opacity-80 transition-opacity">
                  {item.icon}
                </span>
              </div>

              <p className="m-0 text-[14px] font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
                {item.label}
              </p>

              <p className="m-0 text-[13px] text-slate-500 dark:text-slate-400 leading-snug">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            "No obligation",
            "Free cancellation",
            "Secure payments",
            "24/7 support",
          ].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-500"
            >
              <span className="w-1 h-1 rounded-full bg-blue-400 dark:bg-blue-500 inline-block" />
              {tag}
            </span>
          ))}
        </div> */}
      </div>
    </section>
  );
}
