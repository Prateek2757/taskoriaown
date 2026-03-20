"use client";

import { FAQItem } from "./FAQItem";

export function FAQTab({ faqs }: { faqs: any[] }) {
  const sorted = [...faqs].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  const categories = [
    ...new Set(sorted.map((f: any) => f.category).filter(Boolean)),
  ] as string[];

  if (categories.length > 0) {
    return (
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
              {cat}
            </p>
            <div className="space-y-2">
              {sorted
                .filter((f: any) => f.category === cat)
                .map((faq: any) => (
                  <FAQItem key={faq.id} faq={faq} />
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((faq: any) => (
        <FAQItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
}
