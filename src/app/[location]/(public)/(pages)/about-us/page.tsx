import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Heart,
  Lock,
  Shield,
} from "lucide-react";
import Image from "next/image";
// export const dynamic = "force-static";

import type { Metadata } from "next";
import InternalLinkModule from "@/components/InternalLinkModule";
import {
  getPriorityCityLinks,
  getPriorityServiceLinks,
} from "@/lib/internal-links";
import { OurStory } from "./OurStory";

const BASE_URL = "https://www.taskoria.com";

export const metadata: Metadata = {
  title: { absolute: "About Taskoria | Trusted Local Services Across Australia" },
  description:
    "Taskoria helps Australians compare verified local professionals, request free quotes, and hire safely for home, business, and digital services.",

  keywords: [
    "About Taskoria",
    "trusted local services marketplace",
    "Australian service marketplace",
    "verified service providers Australia",
    "trusted local professionals",
    "home services Australia",
    "secure home services",
    "payment protection marketplace",
  ],

  authors: [{ name: "Taskoria Team" }],
  creator: "Taskoria",
  publisher: "Taskoria",
  metadataBase: new URL(BASE_URL),

  openGraph: {
    title: "About Taskoria | Trusted Local Services Across Australia",
    description:
      "See how Taskoria connects Australians with verified local professionals for safer, simpler service hiring.",
    url: `${BASE_URL}/about-us`,
    siteName: "Taskoria",
    images: [
      {
        url: "/images/providers.jpeg",
        width: 1200,
        height: 630,
        alt: "Taskoria trusted local service providers in Australia",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Taskoria | Trusted Local Services Across Australia",
    description:
      "Compare verified local professionals, request free quotes, and hire with confidence on Taskoria.",
    images: ["/images/providers.jpeg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: `${BASE_URL}/about-us`,
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Taskoria",
  url: `${BASE_URL}/about-us`,
  description:
    "Taskoria helps Australians compare verified local professionals, request free quotes, and hire safely for home, business, and digital services.",
  isPartOf: {
    "@type": "WebSite",
    name: "Taskoria",
    url: BASE_URL,
  },
  about: {
    "@type": "Organization",
    name: "Taskoria",
    url: BASE_URL,
    logo: `${BASE_URL}/taskorialogo2026.png`,
    sameAs: ["https://www.trustpilot.com/review/taskoria.com"],
  },
};
export default function AboutUs() {
  const stats = [
    { value: "50+", label: "Verified Providers" },
    { value: "99.8%", label: "Satisfaction Rate" },
    { value: "99.9%", label: "Secure Transactions" },
    { value: "24/7", label: "Customer Support" },
    ];

  const trustProof = [
    "Provider identity checks",
    "Reviews and profile history",
    "Support for job-related issues",
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust First",
      description:
        "We use verification measures that may include identity checks and qualification reviews to help build trust between customers and providers",
    },
    {
      icon: Lock,
      title: "Payment Protection",
      description:
        "Payment protection features may be available for eligible services, helping provide added security for both customers and providers.",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description:
        "We stand behind every job with our satisfaction guarantee and dedicated dispute resolution team.",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description:
        "Built for Australians, by Australians. We understand local needs and deliver neighborhood reliability.",
    },
  ];

  const timeline = [
    {
      year: "2022",
      title: "Founded",
      description:
        "Taskoria was established with the goal of creating a more transparent and trustworthy way for Australians to connect with local service professionals.",
    },
    {
      year: "2022",
      title: "The Beginning",
      description:
        "The platform officially launched, connecting customers with local service providers and laying the foundation for a growing community across Australia.",
    },
    {
      year: "2025",
      title: "Verification Launch",
      description:
        "Introduced our industry-leading verification system, setting new standards for marketplace safety.",
    },
    {
      year: "2026",
      title: "National Expansion",
      description:
        "Reached every major city across Australia, connecting communities with verified local professionals.",
    },
  ];

  const priorityServices = getPriorityServiceLinks(undefined, 6);
  const priorityCities = getPriorityCityLinks(undefined, 4);

  return (
    <div className=" from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
      <section className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] relative py-16 md:py-24 mb-8 items-center text-center md:text-left overflow-hidden px-6">
        <div className="relative text-black dark:text-white z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-6 md:justify-start justify-center">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl
          border border-white/30
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            >
              <Shield className="w-4 h-4" color="#2563EB" />
              <span className="text-sm font-medium text-[#2563EB]">
                Australian Verified & Protected
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Building Trust in
            <br />
            <span className="text-[#2563EB]">Every Connection</span>
          </h1>

          <p className="text-xl text-slate-700 dark:text-blue-200 max-w-3xl leading-relaxed">
            We&apos;re on a mission to make finding trusted service providers safe,
            simple, and secure for every Australian. Because when it comes to
            your home and family, trust isn&apos;t optional.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:justify-start">
            <Link
              href="/post-a-job"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Post a job free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-blue-500"
            >
              Browse services
            </Link>
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-3">
            {trustProof.map((item) => (
              <div
                key={item}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 md:justify-start"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <Image
              src="/images/team.svg"
              alt="Taskoria team supporting trusted local service connections"
              width={480}
              height={480}
              className="h-auto w-full bg-blue-50 p-8 dark:bg-slate-800"
              priority
            />
            <div className="grid grid-cols-2 border-t border-slate-200 dark:border-slate-700">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-slate-200 px-4 py-4 text-left odd:border-r dark:border-slate-700"
                >
                  <div className="text-2xl font-bold text-[#2563EB]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className=" relative  mx-auto w-full bg-white overflow-hidden mb-8">
        <div className="absolute top-0 left-0 right-0 h-[55%] bg-[#2563EB] " />

        <div className="  relative max-w-6xl mx-auto px-6 py-20 min-h-155 flex items-end">
          <OurStory />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <Image
              src="/images/teamwork.jpeg"
              alt="teamwork"
              width={520}
              height={520}
              className="w-105 lg:w-130 h-105 lg:h-130 rounded-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className=" text-[#2563EB] py-8 mb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-4xl font-bold mb-4 dark:text-slate-300">
              What We Stand For
            </h2>
            <p className="text-lg text-slate-700 max-w-3xl mx-auto dark:text-slate-300">
              These aren&apos;t just values on a wall. They&apos;re the principles that
              guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-md font-bold mb-2 dark:text-slate-300">
                    {value.title}
                  </h3>
                  <p className="text-slate-700 text-sm dark:text-slate-300 ">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-15  ">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-[#2563EB] dark:text-white mb-6">
            Our Journey
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From a small startup to Australia&apos;s most trusted service marketplace
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-200 via-blue-400 to-blue-600 hidden md:block"></div>

          <div className="space-y-10">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div
                  className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-14"}`}
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                    <div className="text-blue-600 font-bold text-md mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-justify">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-lg border-4 border-white z-10">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>

                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Ready to use Taskoria?
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Start with a trusted local professional
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Tell us what you need, compare responses from local providers,
              and keep the whole job easier to manage from first quote to final
              message.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/post-a-job"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Get free quotes
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/join"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              Join as a provider
            </Link>
          </div>
        </div>

        <InternalLinkModule
          className="mt-8"
          eyebrow="Popular next steps"
          title="Explore Taskoria's priority pages"
          description="Use these links to find services, learn how safer hiring works, or browse key Australian locations."
          groups={[
            {
              title: "Core pages",
              links: [
                { href: "/services", label: "Browse all services" },
                { href: "/trust-safety", label: "Trust and safety" },
                { href: "/locations", label: "Service locations" },
                { href: "/how-it-works", label: "How Taskoria works" },
              ],
            },
            {
              title: "Priority services",
              links: priorityServices,
            },
            {
              title: "Popular locations",
              links: priorityCities,
            },
          ]}
        />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
    </div>
  );
}
