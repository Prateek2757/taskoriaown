"use client";

import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Share2,
  CheckCircle,
  Zap,
  Globe,
  Headphones,
  BarChart3,
  PenSquare,
  Megaphone,
  MonitorSmartphone,
  Building2,
} from "lucide-react";

const FAQS = [
  {
    q: "What is Taskoria?",
    a: "Taskoria is Australia's leading marketplace that connects customers who need services with verified local professionals. With hundreds of service categories — from house cleaning to legal advice — we help customers find the right pro fast, and help professionals grow their business.",
  },
  {
    q: "What is the Taskoria Affiliate Programme?",
    a: "Our Affiliate Programme pays you a commission for every qualified job request placed on Taskoria that came from one of your affiliate links. As long as the lead is verified and gets at least one quote from a professional, you earn. It's that simple.",
  },
  {
    q: "How do I sign up?",
    a: "Click 'Join as an Affiliate' and fill in your details. Our team reviews every application within 2 business days. Once approved, you'll receive your unique affiliate links and a welcome guide to get started.",
  },
  {
    q: "How do I promote Taskoria?",
    a: "You can embed your affiliate links in blog posts, YouTube videos, newsletters, social media, paid campaigns — anywhere you create content. We provide regularly refreshed creative assets, banners, and copy to make promotion easy.",
  },
  {
    q: "Is there a minimum payout threshold?",
    a: "No minimum — you get paid from your very first dollar earned. Commissions are processed twice monthly, around the 10th and 20th, once leads have been verified.",
  },
  {
    q: "How are leads attributed?",
    a: "We use a 30-day cookie window. Any customer who clicks your link and posts a job on Taskoria within 30 days — and hasn't come from another affiliate source — is attributed to you.",
  },
  {
    q: "What makes a lead 'verified'?",
    a: "A verified lead has a valid name, email, phone number, and location, and receives at least one quote from a professional within 7 days of posting. Once verified, your commission is locked in.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-medium text-slate-800 dark:text-slate-100">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pb-5">
          {a}
        </p>
      )}
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  cta,
  last,
}: {
  n: number;
  title: string;
  desc: string;
  cta?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 border-blue-600 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0 bg-white dark:bg-slate-900">
          {n}
        </div>
        {!last && (
          <div className="w-px flex-1 bg-blue-100 dark:bg-blue-900/40 my-2" />
        )}
      </div>
      <div className="pb-10">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {desc}
        </p>
        {cta}
      </div>
    </div>
  );
}

function WhoCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600/60 hover:shadow-md transition-all duration-200">
      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
          {title}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function AffiliatesPage() {
  return (
    <main className="bg-white dark:bg-slate-950 transition-colors duration-200">
      <section className="relative overflow-hidden bg-linear-to-t from-white via-blue-50 to-white dark:from-slate-950 dark:via-blue-950/2 dark:to-slate-950">
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-blue-100 dark:border-white/5"
        />
        <div
          aria-hidden
          className="absolute -top-16 -right-16 w-[320px] h-[320px] rounded-full border border-blue-100 dark:border-white/5"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-1/4 w-[200px] h-[200px] rounded-full bg-blue-200/40 dark:bg-blue-500/20 blur-3xl"
        />

        <div className="max-w-5xl mx-auto px-6 pt-10 text-center relative">
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-white/10 text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-200">
            Taskoria Affiliate Programme
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08] text-slate-900 dark:text-white">
            Turn your audience into
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-300 dark:to-sky-300">
              passive income
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-blue-200 max-w-xl mx-auto mb-10 leading-relaxed">
            Refer people who need services — or professionals ready to grow —
            and earn commissions every time. No caps, no fuss.
          </p>
          {/* <a
            href="#apply"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-blue-50 text-white dark:text-blue-900 font-bold px-8 py-4 rounded-2xl transition-colors text-base shadow-xl shadow-blue-200 dark:shadow-black/20"
          >
            Join as an Affiliate
            <ArrowRight className="w-4 h-4" />
          </a> */}
        </div>
      </section>

      <section className=" py-10 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6">
          {/* <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 text-center mb-3">
            Two ways to earn
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
            Pick your path
          </h2> */}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative bg-white dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div
                aria-hidden
                className="absolute top-0 right-0 w-22 h-22 bg-blue-50 dark:bg-blue-950/40 rounded-bl-full opacity-60"
              />
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                Option 1
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                Send us{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  customers
                </span>{" "}
                looking for services
              </h3>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                Up to{" "}
                <span className="text-blue-600 dark:text-blue-400">A$100</span>{" "}
                per job
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Earn commission for every verified job request placed on
                Taskoria from a customer who clicked your affiliate link — even
                if they never actually book a professional.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Commission varies by service category. Lead must receive at
                least one quote within 7 days.
              </p>
            </div>

            <div className="relative bg-white dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div
                aria-hidden
                className="absolute top-0 right-0 w-22 h-22 bg-sky-50 dark:bg-sky-950/40 rounded-bl-full opacity-60"
              />
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold">
                Option 2
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                Send us{" "}
                <span className="text-sky-600 dark:text-sky-400">
                  professionals
                </span>{" "}
                providing services
              </h3>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                {/* <span className="text-sky-600 dark:text-sky-400">A$1</span>{" "}
                sign-up +{" "} */}
                <span className="text-sky-600 dark:text-sky-400">20%</span> for
                12 months
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                20% of all revenue they generate on Taskoria for their first
                full 12 months.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Professional revenue share begins from first credit purchase and
                continues for 12 months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THREE STEPS ──────────────────────────────────────────────────── */}
      <section className="py-10 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
              Getting started is simple
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-10">
              Three steps to
              <br />
              earning commissions
            </h2>

            <div>
  <Step
    n={1}
    title="Join via Affiliate Hub"
    desc="Get started instantly — access your personal affiliate dashboard where you can find your unique referral links, track clicks, and monitor your performance in real-time."
    cta={
      <a
        href="/affiliate-dashboard-portal"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
      >
        Go to Affiliate Hub <ArrowRight className="w-3.5 h-3.5" />
      </a>
    }
  />
  <Step
    n={2}
    title="Share your unique links with your audience"
    desc="Use your referral links from the Affiliate Hub and share them in your blog posts, YouTube descriptions, email newsletters, or social media — wherever your audience engages most."
  />
  <Step
    n={3}
    title="Earn commission automatically"
    desc="When someone signs up or posts a job through your link, your commission is tracked instantly. You can monitor everything directly from your dashboard, with payouts processed twice a month."
    last
  />
</div>
          </div>

          <div className="sticky top-6">
            <div className="rounded-3xl bg-gradient-to-br from-blue-950 to-blue-800 dark:from-slate-900 dark:to-blue-950 text-white p-6 border border-blue-800/30 dark:border-blue-900/60">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
                Example earnings
              </p>

              {[
                { label: "House Cleaning lead", amount: "A$45" },
                { label: "Electrician lead", amount: "A$80" },
                // { label: "Pro sign-up bonus", amount: "A$1" },
                { label: "Pro 12-month rev share", amount: "20%" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-3 border-b border-white/10 last:border-0"
                >
                  <span className="text-sm text-blue-200">{row.label}</span>
                  <span className="font-bold text-white">{row.amount}</span>
                </div>
              ))}

              <div className="mt-6 p-4 rounded-xl bg-white/10">
                <p className="text-xs text-blue-200 mb-1">
                  100 leads/month × avg. $35 commission
                </p>
                <p className="text-2xl font-extrabold">$3,500 / month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900 py-10 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
            The platform you're promoting
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-8">
            How Taskoria works
          </h2>
          <div className="text-left space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              Taskoria connects Australians who need help with everyday tasks —
              house cleaning, electrical work, plumbing, gardening, photography,
              and hundreds more — with verified local professionals ready to
              quote.
            </p>
            <p>
              Customers post a job for free and receive up to 5 personalised
              quotes from nearby professionals. They compare profiles, reviews,
              and prices, then hire the best fit — all in one place.
            </p>
            <p>
              On the other side, professionals pay for access to leads (job
              requests) in their service area. They only pay for leads they're
              interested in — no subscription lock-in, no wasted spend. This
              credit-based model means there's a constant supply of
              professionals actively seeking high-quality leads.
            </p>
            <p>
              As an affiliate, you sit at the top of this funnel — sending us
              the customers and professionals that keep the engine running.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
              Getting paid
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
              How affiliates get paid
            </h2>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                We pay commission for every verified lead or professional
                sign-up that can be attributed to one of your affiliate links,
                provided:
              </p>
              <ul className="space-y-2">
                {[
                  "The customer hasn't come from another affiliate source within the last 30 days",
                  "The job receives at least one quote from a professional within 7 days",
                  "The lead passes our verification checks (valid contact details, real request)",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2">
                Commission rates vary by service category, with our top
                categories paying up to{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  A$100 per verified lead
                </strong>
                . Payments are processed twice monthly — around the 10th and
                20th — direct to your nominated account.
              </p>
            </div>
          </div>

          {/* Payment timeline */}
          <div className="space-y-4">
            {[
              {
                icon: Share2,
                title: "Customer clicks your link",
                desc: "30-day cookie window starts",
              },
              {
                icon: CheckCircle,
                title: "Job is posted & verified",
                desc: "Lead receives at least 1 quote",
              },
              {
                icon: BarChart3,
                title: "Commission is recorded",
                desc: "Tracked in your affiliate dashboard",
              },
              {
                icon: DollarSign,
                title: "Payment processed",
                desc: "Twice monthly — 10th & 20th",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900 py-10 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 text-center mb-3">
            Why affiliates love us
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
            Benefits of the Taskoria programme
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Earn up to A$100 per lead",
                desc: "Top categories pay some of the highest commission rates in the affiliate industry.",
              },
              {
                icon: Zap,
                title: "No minimum payout",
                desc: "Get paid from your very first dollar — no threshold to hit before you see money.",
              },
              {
                icon: TrendingUp,
                title: "Year-round demand",
                desc: "Home services, trades, and professional categories see consistent demand every single month.",
              },
              {
                icon: Headphones,
                title: "Dedicated support team",
                desc: "A real person to answer your questions, review your strategy, and help you maximise earnings.",
              },
              {
                icon: Globe,
                title: "Fresh creative assets",
                desc: "Regularly refreshed banners, copy, and promotional assets so your content never looks stale.",
              },
              {
                icon: BarChart3,
                title: "Real-time dashboard",
                desc: "Track clicks, conversions, and commissions in real time with transparent reporting.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-200 dark:hover:border-blue-700/60 hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    {title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 max-w-5xl mx-auto px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 text-center mb-3">
          Is this for you?
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
          Who makes a great affiliate?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WhoCard
            icon={PenSquare}
            title="Content creators"
            desc="Bloggers, YouTubers, and podcasters who produce content on home, lifestyle, or business topics."
          />
          <WhoCard
            icon={Megaphone}
            title="Social influencers"
            desc="Creators with engaged communities on Instagram, TikTok, or Facebook who trust your recommendations."
          />
          <WhoCard
            icon={MonitorSmartphone}
            title="Digital brands"
            desc="Online businesses or apps where Taskoria services complement what your users already do."
          />
          <WhoCard
            icon={Building2}
            title="Marketers & agencies"
            desc="Performance marketers and agencies that can drive qualified traffic through paid or organic channels."
          />
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900 py-10 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 text-center mb-3">
            Common questions
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-4">
            FAQ
          </h2>
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60 divide-y divide-slate-100 dark:divide-slate-700/60 px-6">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
