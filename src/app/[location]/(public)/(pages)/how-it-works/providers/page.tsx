"use client";

import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is it free to join as a tradie or professional?",
    a: "Yes — creating your profile and listing your services is completely free. We only charge a small service fee when you successfully complete a paid job through the platform.",
  },
  {
    q: "How quickly will I start receiving leads?",
    a: "Most Brisbane professionals start seeing relevant jobs within 24 hours of completing their profile. The more detailed and complete your profile, the faster and more relevant your matches.",
  },
  {
    q: "How do I get paid, and how fast?",
    a: "Once the customer confirms the job is done, funds are released to your Taskoria wallet within 24 hours. Withdraw to your Australian bank account anytime — typically 1–2 business days.",
  },
  {
    q: "Do I need a QBCC licence to join?",
    a: "For licensed trades (electrical, plumbing, building), a valid QBCC licence is mandatory. We verify your licence before activating your profile for those categories. Other service categories don't require a trade licence.",
  },
  {
    q: "Can I choose which jobs I take on?",
    a: "Absolutely. Browse and filter by category, suburb, and budget. Only quote on the jobs that suit you — there's no obligation to respond to anything.",
  },
  {
    q: "What is Top Pro and how do I earn it?",
    a: "Top Pro is awarded to professionals with a 4.8+ rating, 90%+ response rate, 95%+ completion rate, and 20+ completed jobs. Top Pros get priority placement, a badge, and reduced platform fees.",
  },
  {
    q: "Do I need to be registered as a sole trader or company?",
    a: "Taskoria is a marketplace — not your employer. You remain responsible for your own ABN, GST obligations, and insurance. We strongly recommend speaking with an accountant about your obligations under Australian law.",
  },
];

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
      <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-dashed border-blue-200 dark:border-blue-900/60 rounded-2xl pointer-events-none" />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-100 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 overflow-hidden">
        {children}
      </div>
    </div>
  );
}


function ProfileCard() {
  return (
    <Card>
      <div className="h-20 bg-gradient-to-br from-[#2563EB] to-blue-700 relative overflow-hidden flex items-center px-4">
  {/* Pattern */}
  <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage:
        "radial-gradient(circle, white 1px, transparent 1px)",
      backgroundSize: "18px 18px",
    }}
  />

  {/* Content */}
  <div className="relative flex items-center gap-3">
    {/* Avatar */}
    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg backdrop-blur">
      JK
    </div>

    {/* Text */}
    <div>
      <h2 className="text-white font-semibold text-sm">
        Welcome back 👋
      </h2>
      <p className="text-blue-100 text-xs">
        Ready to find your next job?
      </p>
    </div>
  </div>
</div>
      <div className="px-5 pt-2 pb-6">
        {/* <div className="w-14 h-14 z-50 rounded-full bg-[#2563EB] border-4 border-white dark:border-gray-800 -mt- mb-3 flex items-center justify-center text-white font-bold text-lg shadow-md">
          JK
        </div> */}
        <p className="font-bold text-gray-900 dark:text-white text-sm">
          Jake K. — Licensed Plumber
        </p>
        <p className="text-xs text-gray-400 mb-1">Brisbane, QLD · QBCC Lic. ✓</p>
        <div className="flex items-center gap-1 text-yellow-400 text-xs mb-3">
          ★★★★★{" "}
          <span className="text-gray-400 ml-0.5">4.9 (132 reviews)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {["Plumbing", "Gas Fitting", "Hot Water"].map((s) => (
            <span
              key={s}
              className="text-[11px] bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-300 px-2.5 py-1 rounded-full font-medium"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          {[["132", "Reviews"], ["98%", "Hired rate"], ["$185", "Avg job"]].map(
            ([v, l]) => (
              <div key={l} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl py-2">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{v}</p>
                <p className="text-[10px] text-gray-400">{l}</p>
              </div>
            )
          )}
        </div>
        <div className="bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded-xl text-center cursor-pointer">
          View Full Profile
        </div>
      </div>
    </Card>
  );
}

function LeadsCard() {
  const leads = [
    { name: "Blocked drain fix", loc: "Paddington, QLD", time: "2m ago", budget: "$150–$300", dot: "bg-green-400" },
    { name: "Hot water system", loc: "Chermside, QLD", time: "18m ago", budget: "$400–$700", dot: "bg-[#2563EB]" },
    { name: "Leaking tap repair", loc: "West End, QLD", time: "1h ago", budget: "$80–$150", dot: "bg-orange-400" },
  ];
  return (
    <Card>
      <div className="p-5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Live jobs near you
        </p>
        <div className="space-y-2 mb-4">
          {leads.map((l) => (
            <div
              key={l.name}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${l.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {l.name}
                </p>
                <p className="text-[11px] text-gray-400">
                  📍 {l.loc} · {l.time}
                </p>
              </div>
              <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400 whitespace-nowrap">
                {l.budget}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <p className="text-[11px] text-gray-400 mb-1">Customer request</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-0.5">
            &quot;What type of plumbing work do you need?&quot;
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Full bathroom renovation — Paddington
          </p>
          <div className="bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded-xl text-center cursor-pointer">
            Submit your details
          </div>
        </div>
      </div>
    </Card>
  );
}

function EarningsCard() {
  const bars = [40, 60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 100];
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            This month
          </p>
          <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">
            ↑ 21%
          </span>
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-0.5">
          $5,640
        </p>
        <p className="text-xs text-gray-400 mb-4">
          AUD · from 31 completed jobs
        </p>
        <div className="flex items-end gap-1 h-14 mb-5">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i === 11
                  ? "bg-[#2563EB]"
                  : "bg-blue-100 dark:bg-blue-900/40"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="space-y-2.5">
          {[
            ["Jobs completed", "31"],
            ["Avg. job value", "$182"],
            ["Response rate", "97%"],
            ["Repeat clients", "42%"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{l}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function TopProCard() {
  const reqs = [
    { label: "Rating", value: "4.9", done: true },
    { label: "Response rate", value: "97%", done: true },
    { label: "Completion rate", value: "95%", done: true },
    { label: "Jobs completed", value: "18 / 20", done: false },
  ];
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800/40">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              Top Pro Status
            </p>
            <p className="text-xs text-gray-400">Top 10% of all QLD professionals</p>
          </div>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Your progress
        </p>
        <div className="space-y-3 mb-4">
          {reqs.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">{r.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {r.value}
                </span>
                <span
                  className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    r.done
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  {r.done ? "✓" : "–"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1.5">
          <div className="bg-[#2563EB] h-1.5 rounded-full w-[85%]" />
        </div>
        <p className="text-[11px] text-gray-400 text-center">
          85% there — 2 more jobs to Top Pro!
        </p>
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

export default function HowItWorksProviders() {
      const {data:session} = useSession()
      const {joinAsProvider} =useJoinAsProvider()
     const router= useRouter()

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <main>
        <section className="text-center px-6 py-10 md:py-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400" />
            Brisbane &amp; South East Queensland
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-5 max-w-3xl mx-auto">
            Taskoria for Tradies &amp; Pros
          </h1>
          <p className="text-md text-gray-500 dark:text-gray-400 font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Taskoria connects Brisbane&apos;s best tradies and professionals with
            thousands of ready-to-hire customers across QLD — no cold calls, no
            marketing spend, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={()=> {
                if(session){
                    router.push("/provider/dashboard")
                } else{
                    joinAsProvider()
                }
              } }
              className="bg-[#2563EB] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-200 dark:shadow-blue-900/50"
            >
              Join as a Tradie or Pro — Free
            </button>
            <Link
              href="/how-it-works/customers"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
            >
              Looking for help instead? →
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {[
              "Plumbers", "Electricians", "Builders", "Painters",
              "Landscapers", "Cleaners", "Web Developers", "Photographers",
              "Pest Controllers", "Pool Technicians",
            ].map((trade) => (
              <span
                key={trade}
                className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-full"
              >
                {trade}
              </span>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        <Section
          mockup={<ProfileCard />}
          title="Build a profile that wins Brisbane customers"
          body={
            <>
              <p>
                Your Taskoria profile is your shopfront. Showcase your trade
                licence, skills, qualifications, and completed job portfolio —
                everything a Brisbane customer needs to choose you with confidence.
              </p>
              <p>
                We optimise every profile for local SEO. Customers searching for
                your trade in your suburb — whether that&apos;s Paddington, Chermside,
                or the Gold Coast — can find you on Google, at no cost to you.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Free to create in under 5 minutes",
                  "QBCC licence verification for eligible trades",
                  "Local SEO — rank in Brisbane suburb searches",
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

        <Section
          reverse
          mockup={<LeadsCard />}
          title="Brisbane customers come to you — not the other way round"
          body={
            <>
              <p>
                Every day, thousands of QLD residents and businesses post jobs on
                Taskoria. We automatically match their needs to your trade and
                service area, sending you relevant leads in real time.
              </p>
              <p>
                You receive the customer&apos;s contact details with each lead so you
                can reach out directly. Send a personalised quote and stand out from
                other tradies in your area.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Real-time job notifications in your suburb",
                  "Filter by job type, suburb & budget",
                  "Customer contact details provided with every lead",
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
          mockup={<EarningsCard />}
          title="Grow your business. Fast."
          body={
            <>
              <p>
                We take the hassle out of marketing your services. Taskoria
                tradies receive hot, live leads the moment they&apos;re posted — no
                waiting, no cold outreach, no wasted hours driving around quoting.
              </p>
              <p>
                Brisbane tradies on Taskoria earn an average of{" "}
                <strong className="text-gray-800 dark:text-white font-semibold">
                  $4,200 AUD per month
                </strong>
                . Full-time pros with strong ratings consistently earn
                $6,000–$10,000+ once established.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Low, flat service fee — no subscriptions",
                  "Secure 24-hour AUD payout on completion",
                  "No commission on your first job",
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

        <Section
          reverse
          mockup={<TopProCard />}
          title="Unlock Top Pro — our highest-tier status"
          body={
            <>
              <p>
                Top Pro is awarded to the best professionals across Queensland. It&apos;s
                not just a badge — it&apos;s a real edge that gets you more jobs and
                better-paying customers.
              </p>
              <p>
                Top Pros appear at the top of Brisbane search results, carry a
                visible verified badge, pay lower platform fees, and get access to a
                dedicated Australian support line.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Priority placement in Brisbane & QLD searches",
                  "Top Pro verified badge on your profile",
                  "Reduced platform service fees",
                  "Dedicated Australian support line",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      ★
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
              ["$0", "To join & list"],
              ["24h", "AUD payout speed"],
              ["10k+", "Active QLD jobs"],
              ["4.8★", "Avg Pro rating"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-bold tracking-tight mb-1">{v}</p>
                <p className="text-blue-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Register strip */}
        <section className="py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Register now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
              {[
                { icon: "👤", title: "Create your account in minutes", desc: "Free forever — no credit card needed" },
                { icon: "📥", title: "Start receiving leads today", desc: "Get matched to Brisbane jobs immediately" },
                { icon: "💸", title: "No commission or hidden fees", desc: "Flat fee per completed job only" },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
                    {item.icon}
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/join-pro"
                className="bg-[#2563EB] text-white font-semibold px-10 py-3.5 rounded-full hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-200 dark:shadow-blue-900/50 inline-block"
              >
                Get Started — It&apos;s Free
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="bg-gray-50 dark:bg-gray-800/50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              What Queensland tradies &amp; pros say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  init: "JK",
                  name: "Jake K.",
                  role: "Licensed Plumber",
                  suburb: "Paddington, QLD",
                  earned: "$5,640 / mo",
                  text: "I used to spend weekends quoting jobs that went nowhere. Now Taskoria sends me serious leads every morning. I&apos;m booked out three weeks ahead and earning more than ever.",
                },
                {
                  init: "SO",
                  name: "Sarah O.",
                  role: "Web Designer",
                  suburb: "South Brisbane, QLD",
                  earned: "$6,200 / mo",
                  text: "The quality of leads is far better than I expected — clients are serious, scopes are clear, and the escrow system means I always get paid on time. I&apos;ve doubled my rate in 6 months.",
                },
                {
                  init: "DM",
                  name: "Dave M.",
                  role: "Painter",
                  suburb: "Chermside, QLD",
                  earned: "$4,100 / mo",
                  text: "Went from doing mates&apos; jobs to running a proper business. Top Pro status was a game changer — I show up at the top for Brisbane painting searches now.",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full">
                      {t.earned}
                    </div>
                  </div>
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

        {/* CTA */}
        {/* <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-gray-900 dark:bg-gray-800 rounded-3xl px-8 py-16 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#2563EB] opacity-10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to start earning across Brisbane?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto font-light">
                Free to join. Profile takes less than 5 minutes. Start receiving
                QLD leads today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/join-pro"
                  className="bg-[#2563EB] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#1D4ED8] transition-colors"
                >
                  Join as a Tradie or Pro
                </Link>
                <Link
                  href="/how-it-works/customers"
                  className="border border-white/20 text-white font-medium px-8 py-3.5 rounded-full hover:border-white/50 transition-colors"
                >
                  Looking for help? →
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
            <span className="text-xs text-gray-400">
              © 2025 Taskoria Pty Ltd. ABN 00 000 000 000. All rights reserved.
            </span>
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