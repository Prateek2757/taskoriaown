import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceBreadcrumbs from "@/components/services/ServicesBreadcrumbs";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "How Taskoria Works | Customers & Providers" },
  description:
    "Learn how Taskoria connects customers with local providers. Post jobs, compare quotes, respond to leads, and grow with one trusted service marketplace.",
  alternates: {
    canonical: "https://www.taskoria.com/how-it-works",
  },
};

const customerSteps = [
  {
    title: "Post what you need",
    description:
      "Tell Taskoria the service, location, timing, budget, and details providers need to quote accurately.",
    icon: ClipboardList,
  },
  {
    title: "Compare responses",
    description:
      "Review quotes, profiles, ratings, previous work, and availability before you choose who to message.",
    icon: SearchCheck,
  },
  {
    title: "Hire with confidence",
    description:
      "Agree on scope, timing, and price with the provider that best fits your job.",
    icon: ShieldCheck,
  },
];

const providerSteps = [
  {
    title: "Create your profile",
    description:
      "Add your services, locations, business details, photos, licences, and proof that helps customers trust you.",
    icon: BadgeCheck,
  },
  {
    title: "Receive local leads",
    description:
      "See jobs that match your services and coverage area, then decide which opportunities are worth quoting.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Win more work",
    description:
      "Send clear responses, chat with customers, manage bookings, and build a reputation on Taskoria.",
    icon: WalletCards,
  },
];

const platformHighlights = [
  "Free for customers to post a job",
  "Detailed requests help providers quote properly",
  "Profiles, badges, and reviews support better decisions",
  "Messaging keeps scope, timing, and expectations clear",
];

const faqs = [
  {
    question: "Is this page for customers or providers?",
    answer:
      "Both. This overview explains the full Taskoria marketplace, then links to dedicated pages for customers and providers.",
  },
  {
    question: "Do customers pay to post a job?",
    answer:
      "No. Customers can post a job and receive responses for free before deciding who to hire.",
  },
  {
    question: "How do providers get work?",
    answer:
      "Providers create a profile, choose their service areas, review matching leads, and respond to jobs that fit their business.",
  },
  {
    question: "Can I read the detailed steps separately?",
    answer:
      "Yes. Use the customer and provider links on this page to open the dedicated how-it-works guides.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "How Taskoria Works",
  url: "https://www.taskoria.com/how-it-works",
  description:
    "A combined guide explaining how Taskoria works for customers and providers.",
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="bg-white text-slate-950  dark:bg-slate-950 dark:text-white max-w-6xl  mx-auto">
        <section className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
          <div className="mx-auto grid  gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <div className="mb-8">
                <ServiceBreadcrumbs currentPage="how It Works" />
              </div>

              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-400/30 dark:bg-white/5 dark:text-blue-200">
                <Sparkles className="size-4" aria-hidden="true" />
                One marketplace for getting work done
              </div>

              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-950 sm:text-4xl  dark:text-white">
                How Taskoria works for customers and providers
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600  dark:text-slate-300">
                Customers post clear service requests. Providers respond with
                relevant quotes. Taskoria keeps both sides moving from first
                request to final hire with simple tools and transparent profiles.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="sm" className="h-11 rounded-xl">
                  <Link href="/post-a-job">
                    Post a job free
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-11 rounded-xl">
                  <Link href="/join">
                    Join as a provider
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Free", "to post"],
                  ["Local", "providers"],
                  ["Clear", "quotes"],
                  ["Direct", "messages"],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="text-lg font-bold text-slate-950 dark:text-white">
                      {value}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 self-center sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="relative aspect-4/3 bg-slate-100">
                  <Image
                    src="/images/jobpost.png"
                    alt="Customer posting a job request on Taskoria"
                    fill
                    sizes="(min-width: 1280px) 280px, (min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-200">
                    <UsersRound className="size-4" aria-hidden="true" />
                    For customers
                  </div>
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                    Find the right help faster
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Post once, compare provider responses, then choose the fit
                    that works for your budget and timing.
                  </p>
                  <Link
                    href="/how-it-works/customers"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-100"
                  >
                    View customer guide
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>

              <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src="/images/providers.jpeg"
                    alt="Service provider reviewing customer leads on Taskoria"
                    fill
                    sizes="(min-width: 1280px) 280px, (min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                    <BriefcaseBusiness className="size-4" aria-hidden="true" />
                    For providers
                  </div>
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                    Turn local demand into jobs
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Build a trusted profile, receive relevant leads, and respond
                    only when a job is right for your business.
                  </p>
                  <Link
                    href="/how-it-works/providers"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-200 dark:hover:text-emerald-100"
                  >
                    View provider guide
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                Two simple journeys
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                Built for both sides of the job
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                Customers and providers use different tools, but the goal is the
                same: clear requests, better conversations, and confident hiring.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <JourneyPanel
                label="Customer flow"
                title="From request to hired provider"
                description="A focused flow for people who need work completed."
                href="/how-it-works/customers"
                linkLabel="See how it works for customers"
                steps={customerSteps}
                tone="blue"
              />
              <JourneyPanel
                label="Provider flow"
                title="From profile to local work"
                description="A practical flow for professionals who want better leads."
                href="/how-it-works/providers"
                linkLabel="See how it works for providers"
                steps={providerSteps}
                tone="emerald"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">
                Why it feels easier
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                Less chasing, more useful information
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Taskoria is designed around the details that usually slow jobs
                down: unclear scope, missed messages, uncertain trust, and
                mismatched expectations.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/services">Browse services</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/trust-safety">Trust and safety</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {platformHighlights.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950"
                >
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-300"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                  What happens next
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                  Pick your path
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                  Use the detailed guide for your role, or jump straight into
                  the action when you are ready.
                </p>
              </div>

              <ActionCard
                icon={<MessageSquareText className="size-5" aria-hidden="true" />}
                title="I need a provider"
                description="Create a job request and start receiving responses from local professionals."
                primaryHref="/post-a-job"
                primaryLabel="Post a job"
                secondaryHref="/how-it-works/customers"
                secondaryLabel="Customer guide"
              />
              <ActionCard
                icon={<Star className="size-5" aria-hidden="true" />}
                title="I provide services"
                description="Create your provider profile and start finding local jobs that match your services."
                primaryHref="/join"
                primaryLabel="Join Taskoria"
                secondaryHref="/how-it-works/providers"
                secondaryLabel="Provider guide"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 px-4 py-14 sm:px-6 lg:px-8 dark:border-white/10">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                Common questions
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                How-it-works FAQs
              </h2>
            </div>

            <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
              {faqs.map((item) => (
                <article key={item.question} className="p-5 sm:p-6">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function JourneyPanel({
  label,
  title,
  description,
  href,
  linkLabel,
  steps,
  tone,
}: {
  label: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  steps: typeof customerSteps;
  tone: "blue" | "emerald";
}) {
  const toneClasses =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-200"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/5">
      <div
        className={`mb-4 inline-flex rounded-md border px-3 py-1.5 text-sm font-semibold ${toneClasses}`}
      >
        {label}
      </div>
      <h3 className="text-xl font-bold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex size-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                {index < steps.length - 1 && (
                  <div className="my-2 h-8 w-px bg-slate-200 dark:bg-white/10" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Step {index + 1}
                </p>
                <h4 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                  {step.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href={href}
        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-100"
      >
        {linkLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function ActionCard({
  icon,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
        <Button asChild className="w-full sm:w-auto lg:w-full xl:w-auto">
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto lg:w-full xl:w-auto"
        >
          <Link href={secondaryHref}>{secondaryLabel}</Link>
        </Button>
      </div>
    </article>
  );
}
