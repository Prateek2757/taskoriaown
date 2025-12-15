  "use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-semibold rounded-full text-sm mb-4">
          FREQUENTLY ASKED
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Got Questions?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          We've got answers to help you get started
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all overflow-hidden"
          >
            <button
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              className="w-full text-left p-6 flex items-center justify-between gap-4"
            >
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                {faq.question}
              </span>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center transition-transform ${
                activeFaq === i ? 'rotate-90 bg-indigo-600 dark:bg-indigo-500' : ''
              }`}>
                <ArrowRight className={`w-5 h-5 ${
                  activeFaq === i ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                }`} />
              </div>
            </button>
            {activeFaq === i && (
              <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
