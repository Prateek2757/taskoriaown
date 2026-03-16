"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

type Props = {
  serviceName: string;
  cityName: string;
};

export default function ServiceIntro({ serviceName, cityName }: Props) {
  const displayCity = cityName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <section className="py-14 bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">

        {/* Left — Description */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
            Find trusted{" "}
            <span className="text-[#3C7DED]">{serviceName.replace(/-/g, " ")}</span>{" "}
            professionals in {displayCity}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6">
            Searching for reliable {serviceName.replace(/-/g, " ")} professionals doesn't have to
            be difficult. We help you connect with experienced local professionals
            who match your needs — quickly and at no cost.
          </p>

          <ul className="space-y-3 mb-8">
            {[
              "Receive multiple quotes from vetted providers",
              "View ratings, past work, and customer feedback",
              "Choose only when you're confident — no commitment",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-[#3C7DED] flex-shrink-0 mt-0.5" />
                <span className="text-[15px]">{item}</span>
              </li>
            ))}
          </ul>

          <Button className="bg-[#3C7DED] hover:bg-[#2b6ad9] text-white font-semibold rounded-lg px-6 h-11">
            Find {serviceName.replace(/-/g, " ")} in {displayCity} today!
          </Button>
        </div>

        {/* Right — How it works mini-card */}
        <div className="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-7 border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
            How it works
          </h3>

          <ol className="space-y-5">
            {[
              "Tell us what you're looking for and your requirements.",
              `We match you with suitable ${serviceName.replace(/-/g, " ")} professionals in ${displayCity}.`,
              "Compare responses, ask questions, and decide in your own time.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full border-2 border-[#3C7DED] text-[#3C7DED] flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-600 dark:text-gray-300 text-[15px] pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
            It's fast, transparent, and completely free to use.
          </p>
        </div>
      </div>
    </section>
  );
}