"use client";

import NewRequestModal from "@/components/leads/RequestModal";
import Link from "next/link";
import { useState } from "react";

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is it free to post a task?",
    a: "Absolutely free. You pay nothing to post your task and receive quotes from local tradies and professionals. You only pay when you've chosen someone and the job's done.",
  },
  {
    q: "How do I know the tradespeople are trustworthy?",
    a: "Every professional on Taskoria is identity-verified, QBCC-licence checked where required, and reference-screened before listing. All reviews come from verified, completed bookings — no anonymous or fake reviews.",
  },
  {
    q: "What if I'm not happy with the work?",
    a: "Your payment is held in secure escrow and only released when you confirm you're satisfied. If there's a dispute, our Australian-based resolution team steps in and mediates a fair outcome.",
  },
  {
    q: "How quickly will I receive quotes?",
    a: "Most Brisbane tasks receive their first quote within minutes. For common jobs like cleaning or lawn mowing, you'll typically have 3–5 quotes within the hour.",
  },
  {
    q: "Can I message a tradie or professional before booking?",
    a: "Yes — chat with anyone who has sent you a quote before you commit. Clarify the scope, share photos of the job, and agree on timing — all in-app and free.",
  },
  {
    q: "Do professionals on Taskoria hold the right licences?",
    a: "We verify QBCC licences for all applicable trades (electrical, plumbing, building) and check relevant licences and insurances as required by Queensland law.",
  },
];

// ── Layout helper ─────────────────────────────────────────────────────────────
function Section({
  reverse,
  mockup,
  title,
  body,
}: {
  reverse?: boolean;
  mockup: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex flex-col gap-14 items-center ${
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <div className="w-full md:w-1/2 flex justify-center">{mockup}</div>
          <div className="w-full md:w-1/2 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug tracking-tight mb-5">
              {title}
            </h2>
            <div className="text-gray-500 dark:text-gray-400 leading-relaxed space-y-4 text-[15px]">
              {body}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute  -bottom-3 -right-3 w-full h-full border-2 border-dashed border-blue-200 dark:border-blue-900/60 rounded-2xl pointer-events-none" />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-100 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function PostTaskCard() {
  return (
    <Card>
      <div className="p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Post a task</p>
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-[11px] text-gray-400 mb-1">What do you need done?</p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white font-medium">
              Bathroom deep clean ✦
            </div>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">When do you need it?</p>
            <div className="flex gap-2">
              {["ASAP", "This week", "Flexible"].map((opt, i) => (
                <div
                  key={opt}
                  className={`flex-1 text-center text-[11px] font-semibold py-2 rounded-xl cursor-pointer ${
                    i === 0
                      ? "bg-[#2563EB] text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Your budget</p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white">
              $80 – $160 AUD
            </div>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Suburb</p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
              📍 New Farm, QLD 4005
            </div>
          </div>
        </div>
        <div className="bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded-xl text-center cursor-pointer">
          Post Task — It&apos;s Free
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          First quote usually within minutes
        </p>
      </div>
    </Card>
  );
}

function OffersCard() {
  const pros = [
    { init: "SB", name: "Sarah B.", role: "Cleaner", rating: "4.9", reviews: "87", price: "$110", time: "Tomorrow" },
    { init: "JM", name: "Jake M.", role: "Home Pro", rating: "4.8", reviews: "54", price: "$130", time: "Today" },
    { init: "AL", name: "Amy L.", role: "Cleaner", rating: "5.0", reviews: "121", price: "$120", time: "This week" },
  ];
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quotes received</p>
          <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">
            3 new
          </span>
        </div>
        <div className="space-y-3">
          {pros.map((p, i) => (
            <div
              key={p.name}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                i === 0
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40"
                  : "bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/10"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {p.init}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p>
                <p className="text-[11px] text-gray-400">
                  ★ {p.rating} · {p.reviews} reviews · {p.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#2563EB] dark:text-blue-400">{p.price}</p>
                <p className="text-[10px] text-gray-400">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-4">
          Tap any quote to message &amp; compare
        </p>
      </div>
    </Card>
  );
}

function EscrowCard() {
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/40">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Payment protected</p>
            <p className="text-xs text-gray-400">Funds held safely until you approve</p>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          {[
            { step: "1", label: "You book & pay", status: "done", note: "Funds go to secure escrow" },
            { step: "2", label: "Tradie completes the job", status: "done", note: "Job tracked in-app" },
            { step: "3", label: "You review & approve", status: "active", note: "Your call — no pressure" },
            { step: "4", label: "Tradie gets paid", status: "pending", note: "Released within 24 hours" },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                  s.status === "done"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : s.status === "active"
                    ? "bg-[#2563EB] text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                }`}
              >
                {s.status === "done" ? "✓" : s.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</p>
                <p className="text-[11px] text-gray-400">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded-xl text-center cursor-pointer">
          Approve &amp; Release Payment
        </div>
      </div>
    </Card>
  );
}

function ReviewCard() {
  return (
    <Card>
      <div className="p-5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          Job done — leave a review
        </p>
        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold">
              SB
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Sarah B.</p>
              <p className="text-xs text-gray-400">Cleaning · Completed today · New Farm</p>
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-2xl cursor-pointer text-yellow-400">
                ★
              </span>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &quot;Absolutely spotless — best cleaner I&apos;ve ever had in Brisbane. Will definitely rebook!&quot;
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded-xl">
            Submit Review
          </button>
          <button className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold py-2.5 rounded-xl">
            Rebook Sarah
          </button>
        </div>
      </div>
    </Card>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Common questions
        </h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center gap-4 py-5 text-left group"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                  {f.q}
                </span>
                <span
                  className={`text-xs text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180 text-[#2563EB]" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {open === i && (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed pb-5">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HowItWorksCustomers() {
    const [openModal, setOpenModal] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">

      {/* Nav */}
      {/* <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            task<span className="text-[#2563EB]">oria</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link href="/how-it-works/customers" className="text-[#2563EB] dark:text-blue-400 font-semibold">
              For Customers
            </Link>
            <Link href="/how-it-works/providers" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              For Tradies &amp; Pros
            </Link>
            <Link href="/pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/post-task"
              className="bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1D4ED8] transition-colors"
            >
              Post a Task
            </Link>
          </div>
        </div>
      </nav> */}

      <main>
        {/* Hero */}
        <section className="text-center px-6 py-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400" />
            Brisbane &amp; South East Queensland
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-5 max-w-3xl mx-auto">
            Taskoria for Customers
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Find trusted, vetted tradies and professionals across Brisbane — from
            Fortitude Valley to the Sunshine Coast. Post a task for free and get
            competitive quotes fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
onClick={()=> setOpenModal(true)}
className="bg-[#2563EB] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-200 dark:shadow-blue-900/50"
            >
              Post a Task — It&apos;s Free
            </button>
            <Link
              href="/how-it-works/providers"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
            >
              Are you a tradie or pro? →
            </Link>
          </div>

          {/* Location pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["Brisbane CBD", "Southbank", "New Farm", "Fortitude Valley", "West End", "Chermside", "Carindale", "Ipswich", "Gold Coast", "Sunshine Coast"].map(
              (suburb) => (
                <span
                  key={suburb}
                  className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-full"
                >
                  {suburb}
                </span>
              )
            )}
          </div>
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Section 1 */}
        <Section
          mockup={<PostTaskCard />}
          title="Tell us what you need done"
          body={
            <>
              <p>
                We support every imaginable service across Brisbane and South East
                Queensland — home repairs, cleaning, landscaping, digital services,
                and more. Describe your job, set your budget, and we&apos;ll handle
                the rest.
              </p>
              <p>
                Smart Brisbane locals Taskoria it, not Google it. We connect you
                with verified, licenced professionals in your suburb — fast.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Free to post — no credit card required",
                  "500+ task categories across QLD",
                  "Instantly matched to tradies in your suburb",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </>
          }
        />

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Section 2 */}
        <Section
          reverse
          mockup={<OffersCard />}
          title="Local Brisbane pros reach out with quotes"
          body={
            <>
              <p>
                Verified tradies and professionals in your area see your task and
                send personalised quotes. Most Brisbane customers receive their
                first quote within minutes of posting.
              </p>
              <p>
                Compare ratings, verified reviews, pricing, and availability all in
                one place. Message any tradie directly before you commit — no
                obligation, no pressure.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Quotes from licenced local tradies",
                  "Compare ratings, reviews & pricing side by side",
                  "Message any pro directly before committing",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </>
          }
        />

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Section 3 */}
        <Section
          mockup={<EscrowCard />}
          title="Book with confidence — your money is fully protected"
          body={
            <>
              <p>
                When you book a professional on Taskoria, your payment is held in
                secure escrow. It&apos;s only released when you confirm the job is
                done to your satisfaction — not a moment earlier.
              </p>
              <p>
                If something isn&apos;t right, don&apos;t approve it. Our
                Australia-based resolution team is here to step in and make sure
                you&apos;re looked after — every time.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Secure escrow — pay only when happy",
                  "Australian-based 24/7 resolution support",
                  "Full job history &amp; tax invoices in-app",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: i }} />
                  </li>
                ))}
              </ul>
            </>
          }
        />

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Section 4 */}
        <Section
          reverse
          mockup={<ReviewCard />}
          title="Rate, review, and rebook in one tap"
          body={
            <>
              <p>
                Once your job is done, leave a verified review to help other
                Brisbane residents and reward professionals who do great work. Every
                review on Taskoria comes from a real, completed booking.
              </p>
              <p>
                Found someone brilliant? Save them to your favourites and rebook
                with a single tap — they&apos;ll already know your suburb and
                preferences.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Verified reviews from real bookings only",
                  "Save favourites & rebook instantly",
                  "Build lasting relationships with trusted local pros",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </>
          }
        />

        {/* Stats */}
        {/* <section className="bg-[#2563EB] py-14 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              ["20k+", "Queensland tasks completed"],
              ["98%", "Satisfaction rate"],
              ["3 min", "Avg. first quote"],
              ["100%", "Secure payments"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-bold tracking-tight mb-1">{v}</p>
                <p className="text-blue-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Categories */}
        {/* <section className="py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Popular Brisbane services
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-base mb-10 max-w-xl mx-auto font-light">
              From Queenslander renovations to backyard landscaping — we&apos;ve got
              every job covered across greater Brisbane.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: "🔧", label: "Plumbing & Gas", count: "340+ tradies" },
                { icon: "⚡", label: "Electrical", count: "280+ tradies" },
                { icon: "🌿", label: "Lawn & Garden", count: "420+ tradies" },
                { icon: "🧹", label: "House Cleaning", count: "510+ tradies" },
                { icon: "🏠", label: "Renovations", count: "190+ tradies" },
                { icon: "🎨", label: "Painting", count: "260+ tradies" },
                { icon: "❄️", label: "Air Conditioning", count: "180+ tradies" },
                { icon: "🐜", label: "Pest Control", count: "140+ tradies" },
                { icon: "🏊", label: "Pool Services", count: "130+ tradies" },
                { icon: "💻", label: "Web & Tech", count: "390+ pros" },
                { icon: "📐", label: "Building & Carpentry", count: "220+ tradies" },
                { icon: "🚛", label: "Removalists", count: "160+ tradies" },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  href={`/services/${cat.label.toLowerCase().replace(/[\s&]+/g, "-")}`}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:border-[#2563EB]/30 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-200"
                >
                  <span className="text-2xl mb-2">{cat.icon}</span>
                  <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-0.5">{cat.label}</p>
                  <p className="text-[10px] text-gray-400">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* Benefits */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Plus heaps of other benefits
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-base mb-12 max-w-xl mx-auto font-light">
              Every Taskoria customer account is free and comes packed with features
              designed to make your life easier.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: "🛡️",
                  title: "QBCC-verified tradies",
                  desc: "Electricians, plumbers, and builders are QBCC-licence checked. We verify the credentials required by Queensland law.",
                },
                {
                  icon: "📱",
                  title: "Manage everything on the go",
                  desc: "Track jobs, message tradies, and approve payments from the Taskoria app — anywhere across QLD.",
                },
                {
                  icon: "🔁",
                  title: "Easy rebooking",
                  desc: "Found a ripper tradie? Save them to favourites and rebook in one tap. They already know your suburb and job preferences.",
                },
                {
                  icon: "💬",
                  title: "In-app messaging",
                  desc: "Chat, share photos of the job, and agree on scope — safely stored and accessible from your dashboard anytime.",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-11 h-11 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">
                    {b.icon}
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-2">{b.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
              <NewRequestModal
                open={openModal}
                onClose={() => setOpenModal(false)}
              />

        {/* Testimonials */}
        {/* <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              What Brisbane customers say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  init: "TR",
                  name: "Tom R.",
                  role: "Homeowner",
                  suburb: "Paddington, QLD",
                  text: "Got three quotes within 20 minutes of posting. Booked an electrician for the next morning — sorted. Honestly better than calling around for days.",
                },
                {
                  init: "JL",
                  name: "Jess L.",
                  role: "Property Manager",
                  suburb: "Fortitude Valley, QLD",
                  text: "I manage multiple properties across Brisbane and use Taskoria for everything from plumbing to garden maintenance. The verification process gives me real peace of mind.",
                },
                {
                  init: "MK",
                  name: "Marcus K.",
                  role: "Busy Dad",
                  suburb: "Chermside, QLD",
                  text: "Used Taskoria for pool cleaning, lawn mowing, and a bathroom reno quote — all within a month. Every single tradie was professional and reasonably priced.",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col"
                >
                  <div className="flex text-yellow-400 text-sm mb-5">★★★★★</div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1 mb-6">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold">
                      {t.init}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-400">
                        {t.role} · {t.suburb}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <FAQ />

        {/* <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-gray-900 dark:bg-gray-800 rounded-3xl px-8 py-16 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#2563EB] opacity-10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to get your job done?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto font-light">
                Join thousands of Brisbane locals who use Taskoria to find trusted
                tradies and professionals every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/post-task"
                  className="bg-[#2563EB] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#1D4ED8] transition-colors"
                >
                  Post a Task — It&apos;s Free
                </Link>
                <Link
                  href="/how-it-works/providers"
                  className="border border-white/20 text-white font-medium px-8 py-3.5 rounded-full hover:border-white/50 transition-colors"
                >
                  Are you a tradie or pro? →
                </Link>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      {/* <footer className="border-t border-gray-100 dark:border-gray-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                task<span className="text-[#2563EB]">oria</span>
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Brisbane&apos;s trusted marketplace for getting jobs done and
                connecting with skilled local professionals.
              </p>
              <p className="text-xs text-gray-400 mt-2">🇦🇺 Brisbane, QLD, Australia</p>
            </div>
            {[
              { heading: "Customers", links: ["Post a Task", "Browse Services", "How It Works", "Safety", "Pricing"] },
              { heading: "Tradies & Pros", links: ["Join as a Pro", "How It Works", "Top Pro Programme", "Earnings", "Resources"] },
              { heading: "Company", links: ["About Us", "Careers", "Blog", "Press", "Partners"] },
              { heading: "Support", links: ["Help Centre", "Contact Us", "Privacy Policy", "Terms", "Cookie Policy"] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-gray-400">© 2025 Taskoria Pty Ltd. ABN 00 000 000 000. All rights reserved.</span>
            <div className="flex gap-5 text-xs text-gray-400">
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <Link key={l} href="#" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}