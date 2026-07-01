"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = ["General", "Pricing", "Providers", "Services"] as const;
type Category = (typeof categories)[number];

const faqs: { category: Category; question: string; answer: string }[] = [
  // General
  // General
  {
    category: "General",
    question: "Is Taskoria free to use?",
    answer:
      "Yes. Customers can post a job and receive quotes for free. You only pay when you choose a professional and agree to move ahead with the work.",
  },
  {
    category: "General",
    question: "How fast will I receive quotes?",
    answer:
      "Many customers receive their first responses within minutes. Timing can vary by service, location, and job detail, but common jobs often attract multiple quotes within a few hours.",
  },
  {
    category: "General",
    question: "Where in Australia does Taskoria operate?",
    answer:
      "Taskoria supports customers across Australia, including major cities, regional centres, and surrounding suburbs. Availability can vary by service category and local provider coverage.",
  },
  {
    category: "General",
    question: "Do I need an account to post a job?",
    answer:
      "You can browse Taskoria without an account, but you'll need to sign up to post a job and receive quotes. Registration is quick, free, and only takes a few details.",
  },
  {
    category: "General",
    question: "How do I know my job details are safe?",
    answer:
      "Taskoria takes privacy seriously. Your contact details are never shared publicly — professionals can only reach you through the platform after you've reviewed their profile and chosen to connect.",
  },
  // Pricing
  {
    category: "Pricing",
    question: "How does Taskoria make money?",
    answer:
      "Taskoria charges professionals a small fee to respond to job leads. Customers are never charged a platform fee — you only pay the professional directly for work completed.",
  },
  {
    category: "Pricing",
    question: "Are there any hidden fees for customers?",
    answer:
      "No hidden fees. Posting a job, receiving quotes, and comparing professionals are all completely free for customers. The price you agree with the professional is what you pay.",
  },
  {
    category: "Pricing",
    question: "Can I get a fixed-price quote?",
    answer:
      "Yes. Many professionals on Taskoria offer fixed-price quotes for well-defined jobs. You can specify in your job post that you'd prefer a set price, and professionals will quote accordingly.",
  },
  {
    category: "Pricing",
    question: "What payment methods are accepted?",
    answer:
      "Payment is arranged directly between you and the professional. Most accept bank transfer, card, or cash. Confirm payment details with your chosen professional before the job begins.",
  },
  // Providers
  {
    category: "Providers",
    question: "Are professionals on Taskoria verified?",
    answer:
      "Taskoria asks professionals to complete verification checks before they respond to customer jobs. Profiles can also include business details, licences, accreditations, reviews, and past work so you can compare with confidence.",
  },
  {
    category: "Providers",
    question: "How do I become a professional on Taskoria?",
    answer:
      "Sign up for a professional account, complete your profile with your skills, licences, and service area, then pass the verification steps. Once approved, you'll start receiving relevant job leads in your area.",
  },
  {
    category: "Providers",
    question: "Can I control which jobs I respond to?",
    answer:
      "Yes. As a professional you choose which leads to respond to. You're never automatically matched or charged without taking action — only pay for the leads you actively want.",
  },
  {
    category: "Providers",
    question: "How do reviews work for professionals?",
    answer:
      "After a job is marked complete, customers can leave a star rating and written review on the professional's profile. Reviews are verified against real jobs and cannot be purchased or removed arbitrarily.",
  },
  // Services
  {
    category: "Services",
    question: "What services can I book on Taskoria?",
    answer:
      "You can request quotes for home cleaning, plumbing, electrical work, gardening, removals, rubbish removal, events, tutoring, digital services, design, and many other local or professional jobs.",
  },
  {
    category: "Services",
    question: "Can I post a job for something unusual or niche?",
    answer:
      "Absolutely. If you don't see your job type listed, describe it freely in your post. Taskoria's open job format means professionals across a wide range of trades and specialities can respond.",
  },
  {
    category: "Services",
    question: "Are emergency or same-day services available?",
    answer:
      "Many professionals on Taskoria offer urgent and same-day availability. Mention your timeline clearly in your job post and professionals who can meet it will indicate so in their quote.",
  },
  {
    category: "Services",
    question: "Can I arrange recurring services through Taskoria?",
    answer:
      "Yes. Once you've found someone you trust, you can arrange recurring work directly with them and rehire through your Taskoria account without needing to re-post a job.",
  },
];

export default function HomepageFAQ() {
  const [activeCategory, setActiveCategory] = useState<Category>("General");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter((f) => f.category === activeCategory);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setOpenIndex(null);
  };

  return (
    <section
      id="faq"
      aria-labelledby="homepage-faq-title"
      className="relative overflow-hidden border-y border-slate-200 bg-white py-8 dark:border-white/10 dark:bg-[radial-gradient(circle_at_left,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_90%)] sm:py-16"
    >
      <div className="section-container mx-20 relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center">
          <div className="w-full lg:max-w-170 lg:flex-1">
            <div className="mx-auto max-w-2xl text-center sm:text-left">
              <h2
                id="homepage-faq-title"
                className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl"
              >
                Frequently asked questions
              </h2>

              <p className="mx-auo mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:mx-0 sm:text-base">
                These are the most commonly asked questions about Taskoria.
                Can&apos;t find what you&apos;re looking for?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-slate-700 underline decoration-slate-400 underline-offset-4 hover:text-slate-950 dark:text-slate-200 dark:decoration-slate-500 dark:hover:text-white"
                >
                  Chat to our friendly team!
                </Link>
              </p>

              <div
                className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start"
                role="tablist"
                aria-label="FAQ categories"
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleCategoryChange(cat)}
                      className={[
                        "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-white",
                        isActive
                          ? "border-slate-950 bg-slate-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-black"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-950 hover:bg-slate-50 dark:border-white/40 dark:bg-black dark:text-white/80 dark:hover:border-white dark:hover:bg-white/10",
                      ].join(" ")}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              className="mx-auto mt-8 max-w-3xl"
              role="tabpanel"
              aria-label={`${activeCategory} questions`}
            >
              {filtered.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={`${activeCategory}-${index}`}
                    className="border-b border-slate-200/80 first:border-t dark:border-white/10"
                  >
                    <button
                      type="button"
                      className="group flex w-full items-center justify-between gap-4 px-1 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-950 dark:focus-visible:ring-white"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${activeCategory}-${index}`}
                      id={`faq-trigger-${activeCategory}-${index}`}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <span className="min-w-0 text-base font-bold leading-6 text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white sm:text-[17px]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={[
                          "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ease-out dark:text-slate-500",
                          isOpen
                            ? "rotate-180 text-blue-600 dark:text-blue-400"
                            : "",
                        ].join(" ")}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      id={`faq-answer-${activeCategory}-${index}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${activeCategory}-${index}`}
                      className={[
                        "overflow-hidden transition-[max-height,padding-bottom,opacity] duration-500 ease-in-out",
                        isOpen
                          ? "max-h-96 pb-5 opacity-100"
                          : "max-h-0 pb-0 opacity-0",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "px-1 pr-10 text-[15px] leading-7 text-slate-500 transition-transform duration-500 ease-in-out dark:text-slate-400",
                          isOpen ? "translate-y-0" : "-translate-y-2",
                        ].join(" ")}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="mx-auto w-full lg:mx-0 hidden lg:block lg:flex-none"
            style={{ maxWidth: "560px" }}
          >
            <div className="sticky top-28 w-full overflow-hidden rounded-2xl ">
              <Image
                src="https://eoicjmcyigolwgjantsl.supabase.co/storage/v1/object/public/taskoria/portfolio/1782731852649-wrechbgremovefaq.png"
                alt="Taskoria Support"
                width={3600}
                height={420}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
                style={{ height: "470px", maxHeight: "65vh" }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
