import Image from "next/image";
import ScrollPopularSection from "../ScrollPopularSection";
import HeroInteractive from "./HeroInteractive";
import SparklesThemed from "./SparklesThemed";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.taskoria.com/#website",
    name: "Taskoria",
    url: "https://www.taskoria.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.taskoria.com/services/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.taskoria.com/#organization",
    name: "Taskoria",
    url: "https://www.taskoria.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.taskoria.com/taskorialogonew.png",
      width: 250,
      height: 60,
    },
    description:
      "Australia's trusted AI-powered marketplace connecting customers with verified professionals.",
    sameAs: [
      "https://www.facebook.com/taskoria",
      "https://twitter.com/taskoria",
      "https://www.linkedin.com/company/taskoria",
      "https://www.instagram.com/taskoria",
    ],
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
  },
];

export default function HeroSection() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="relative text-center overflow-hidden
          dark:bg-[radial-gradient(circle_at_left,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_30%,rgba(0,0,0,1)_100%)]"
        aria-label="Hero section with service marketplace search"
      >
        <div
          className="dark:hidden z-[-9] bg-radial-[at_0%_100%] from-blue-100 via-white/0 to-white/0 to-90%
            h-full w-full absolute left-0 top-0 right-0 bottom-0"
          aria-hidden="true"
        />

        <div
          className="container md:pt-10 pt-6 max-md:bg-linear-to-r from-[#3C7DED]/25 via-[#41A6EE]/20
            to-[#46CBEE]/25 mx-auto md:px-4 relative z-10"
        >
          <div
            className="inline-flex items-center gap-1 border bg-card dark:bg-gray-800
              rounded-full px-1 py-1 text-xs text-muted-foreground mb-2"
            role="banner"
          >
            <Image
              src="/flag-aus.png"
              alt="Australian flag"
              width={18}
              height={5}
              fetchPriority="high"
            />
            <span>Australia-first marketplace • Get free quotes • Local pros</span>
          </div>

          <div className="max-w-auto mx-auto px-4 space-y-6">
            <h1
              className="text-4xl md:text-6xl leading-tight mb-0 md:mb-8 mt-2 md:mt-0"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
              }}
            >
              <span className="text-foreground dark:text-white">
                Australia’s best
              </span>{" "}
              <span className="relative inline-block">
                <span
                  className="bg-[#2563EB] bg-clip-text text-transparent"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  professionals,{" "}
                </span>

                <span
                  className="absolute right-0 bottom-0 translate-y-3 w-full h-5 overflow-hidden"
                  aria-hidden="true"
                >
                  <SparklesThemed
                    variant="underline"
                    particleDensity={1100}
                    minSize={0.4}
                    maxSize={1.7}
                  />
                  <div className="absolute inset-x-20 top-0 bg-linear-to-r from-transparent via-indigo-500 to-transparent h-0.5 w-3/4 blur-sm" />
                  <div className="absolute inset-x-20 top-0 bg-linear-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                  <div className="absolute inset-x-60 top-0 bg-linear-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                  <div className="absolute inset-x-60 top-0 bg-linear-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                </span>
              </span>{" "}
              <span
                className="block bg-[#2563EB] bg-clip-text text-transparent"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                }}
              >
                all in one place.{" "}
              </span>
            </h1>

            <HeroInteractive />

            <div className="flex items-center justify-center gap-2 pb-2 sm:mt-4 text-sm text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Serving 50+ cities across Australia</span>
            </div>
          </div>
        </div>

        <ScrollPopularSection />

        <div className="mt-5 hidden lg:block relative overflow-hidden bg-linear-to-t from-zinc-100 to-transparent dark:from-black">
          <div className="mx-auto max-w-4xl relative" />

          <div
            className="relative -mt-32 h-76 overflow-hidden
              mask-[radial-gradient(50%_50%,black,transparent)]
              dark:mask-[radial-gradient(50%_50%,white,transparent)]
              before:absolute before:inset-0
              before:bg-[radial-gradient(circle_at_bottom_center,#fff,transparent_80%)]
              dark:before:bg-[radial-gradient(circle_at_left_center,#000,transparent_100%)]
              before:opacity-100
              after:absolute after:-left-1/2 after:top-4/6 after:aspect-[1/0.7]
              after:w-[200%] after:rounded-[100%] after:border-t
              after:border-gray-400 dark:after:border-[#7876c566]
              after:bg-zinc-100 dark:after:bg-zinc-900"
            aria-hidden="true"
          >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-size-[70px_80px]" />

            <SparklesThemed
              variant="fullbleed"
              particleDensity={800}
              speed={1}
              maxSize={1.7}
            />
          </div>

          <div className="w-full px-8 absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-3xl text-white">
            <h3 className="text-gray-600 text-lg sm:text-xl lg:text-2xl dark:text-white font-semibold leading-tight mb-2">
              Need a provider fast?
            </h3>
            <p className="text-gray-500 text-sm dark:text-gray-400 mb-4">
              Get free quotes and receive responses from trusted local
              professionals, with clearer quotes and safer hiring support.
            </p>
          </div>
        </div>

        <section
          aria-label="Trust and safety highlights"
          className="bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800"
        >
          <div className="container mx-auto px-4 py-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
              Background-checked profiles, clear quotes, direct communication,
              and safer hiring support.&nbsp;
              <a
                href="/trust-safety"
                className="font-semibold text-blue-600 hover:underline"
              >
                Learn how Taskoria keeps you safe
              </a>
            </p>
          </div>
        </section>
      </section>
    </>
  );
}
