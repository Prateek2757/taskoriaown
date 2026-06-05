import { Shield, Lock, Award, Heart } from "lucide-react";
import Image from "next/image";
export const dynamic = "force-static";

import type { Metadata } from "next";
import { OurStory } from "./OurStory";

export const metadata: Metadata = {
  title: "About us | Taskoria",
  description:
    "Taskoria is on a mission to make hiring local professionals simple, transparent, and reliable through technology and community trust.",
  keywords: [
    "Taskoria",
    "About Taskoria",
    "Australian service marketplace",
    "verified service providers Australia",
    "secure home services",
    "trusted local professionals",
    "payment protection marketplace",
    "home services Australia",
  ],
  authors: [{ name: "Taskoria Team" }],
  creator: "Taskoria",
  publisher: "Taskoria",
  metadataBase: new URL("https://www.taskoria.com"),

  openGraph: {
    title: "About Taskoria | Building a Trusted Local Services Marketplace",
    description:
      "Taskoria is on a mission to make hiring local professionals simple, transparent, and reliable through technology and community trust",
    url: "https://www.taskoria.com/about-us",
    siteName: "Taskoria",
    images: [
      {
        url: "/images/providers.jpeg",
        width: 1200,
        height: 630,
        alt: "Taskoria verified service providers",
      },
    ],
    type: "website",
  },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "About Taskoria – Trusted & Verified Services",
  //   description:
  //     "Discover how Taskoria makes finding trusted service providers safe, simple, and secure across Australia.",
  //   images: ["/images/providers.jpeg"],
  //   creator: "@taskoria",
  // },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://www.taskoria.com/about-us",
  },
};

export default function AboutUs() {
  const stats = [
    { value: "500+", label: "Verified Providers" },
    { value: "5K+", label: "Jobs Completed" },
    { value: "99.8%", label: "Satisfaction Rate" },
    { value: "$5M+", label: "Protected Payments" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust First",
      description:
        "Every provider undergoes rigorous verification including background checks, qualification validation, and identity authentication.",
    },
    {
      icon: Lock,
      title: "Payment Protection",
      description:
        "Your money stays secure until the job is done right. Our escrow system ensures both parties are protected.",
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
      year: "2016",
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

  return (
    <div className=" from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
      <section className="max-w-7xl mx-auto flex justify-between relative py-24 mb-8 items-center text-center md:text-left overflow-hidden px-6">
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
            We're on a mission to make finding trusted service providers safe,
            simple, and secure for every Australian. Because when it comes to
            your home and family, trust isn't optional.
          </p>
        </div>

        <div className="shrink-0 hidden md:flex items-center">
          <Image
            src="/images/team.svg"
            alt="team image"
            width={480}
            height={480}
            className="w-[320px] lg:w-120 h-auto"
          />
        </div>
      </section>
      <section className=" relative  mx-auto w-full bg-white overflow-hidden mb-8">
        <div className="absolute top-0 left-0 right-0 h-[55%] bg-[#2563EB] " />

        <div className="  relative max-w-6xl mx-auto px-6 py-20 min-h-155 flex items-end">
          <OurStory />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
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
              These aren't just values on a wall. They're the principles that
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
            From a small startup to Australia's most trusted service marketplace
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
    </div>
  );
}
