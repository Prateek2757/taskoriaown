"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Star,
  Wallet,
  Users2,
} from "lucide-react";

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
    icon: <CheckCircle2 className="w-5 h-5" />,
    label: "Free to post",
    value: `Get ${serviceName.toLowerCase()} quotes at zero cost`,
  },
  {
    icon: <Users2 className="w-5 h-5" />,
    label: "Multiple quotes",
    value: "Compare up to 5 verified professionals",
  },
  {
    icon: <Clock3 className="w-5 h-5" />,
    label: "Fast responses",
    value: "Pros reply within a few hours",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    label: "Vetted & insured",
    value: "Every pro is checked before joining",
  },
  {
    icon: <Star className="w-5 h-5" />,
    label: "Honest reviews",
    value: "Real ratings from real customers",
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    label: "No surprise fees",
    value: "Transparent pricing, always",
  },
];

export default function WhyTaskoria({
  serviceName,
  highlights,
}: SubHeroSectionProps) {
  const items = highlights ?? DEFAULT_HIGHLIGHTS(serviceName);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={ref}
      aria-label={`Why use Taskoria for ${serviceName}`}
      className="w-full border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-[#2563EB] to-blue-600" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className=" text-[16px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-6 text-center">
          Why customers choose Taskoria for {serviceName.toLowerCase()}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
              }}
              className="group flex flex-col items-start gap-2 bg-white dark:bg-slate-900 px-5 py-5 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-colors duration-200 cursor-default"
            >
              <span className="text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">
                {item.icon}
              </span>

              <p className="text-[13px font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {item.label}
              </p>

              <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
              <span className="w-1 h-1 rounded-full bg-indigo-400 dark:bg-indigo-500 inline-block" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}