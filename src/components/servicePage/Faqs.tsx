"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Got questions? We've got answers.
        </p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-slate-700 border-t border-b border-gray-200 dark:border-slate-700">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              className="w-full text-left py-5 px-1 flex items-center justify-between gap-4 group"
            >
              <span className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-[#3C7DED] transition-colors">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  activeFaq === i ? "rotate-180 text-[#3C7DED]" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                activeFaq === i ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed px-1">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
