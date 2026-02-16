"use client";

import { Button } from "../components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NewRequestModal from "./leads/RequestModal";
import CategorySearch from "./category/CategorySearch";
import { SparklesCore } from "./ui/sparkles";
import { useTheme } from "next-themes";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import { SparklesCoreLight } from "./ui/sparklesLight";
import ScrollPopularSection from "./ScrollPopularSection";
import Image from "next/image";
import { sendEmail } from "./email/helpers/sendVerificationEmail";

interface Category {
  category_id: number;
  name: string;
  slug?: string;
}

export default function HeroSection() {
  const [openModal, setOpenModal] = useState(false);
  const [slugvalue, setSlugValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { joinAsProvider } = useJoinAsProvider();

  const { theme } = useTheme();
  const handlePostJob = async () => {
    // if (!session) {
    //   toast.error("Please sign in first", {
    //     description: "Redirecting to Sign In page...",
    //     duration: 1000,
    //     style: { borderRadius: "8px" },
    //     icon: "⚠️",
    //   });
    //   setTimeout(() => router.push("/signin"));

    //   setLoading(true);
    //   return;
    // }

    //     })
    setOpenModal(true);
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setOpenModal(true);
  };

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://www.taskoria.com/#website",
      "name": "Taskoria",
      "url": "https://www.taskoria.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.taskoria.com/services/{search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.taskoria.com/#organization",
      "name": "Taskoria",
      "url": "https://www.taskoria.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.taskoria.com/taskorialogonew.png",
        "width": 250,
        "height": 60
      },
      "description": "Australia's trusted AI-powered marketplace connecting customers with verified professionals.",
      "sameAs": [
        "https://www.facebook.com/taskoria",
        "https://twitter.com/taskoria",
        "https://www.linkedin.com/company/taskoria",
        "https://www.instagram.com/taskoria"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "Australia"
      }
    }
  ];
  

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="relative text-center overflow-hidden 
  dark:bg-[radial-gradient(circle_at_right,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)] "
        aria-label="Hero section with service marketplace search"
      >
        <div className="dark:hidden bg-radial-[at_0%_100%] from-red-100 via-white/0 to-white/0 to-90% h-[100%] w-[100%] absolute left-0 top-0 right-0 bottom-0" aria-hidden="true"></div>
        <div className="dark:hidden bg-radial-[at_100%_0%] from-sky-100 via-white/0 to-white/0 to-90% h-[100%] w-[100%] absolute left-0 top-0 right-0 bottom-0" aria-hidden="true"></div>
        <div
          className="container pt-10  max-md:bg-gradient-to-r from-[#3C7DED]/25 via-[#41A6EE]/20 to-[#46CBEE]/25 
      mx-auto  pb-4  px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto  space-y-6">
            <div className="inline-flex gap-2 border bg-card dark:bg-gray-800 rounded-full px-4 py-1 text-xs text-muted-foreground mb-2" role="banner">
              <Image
                src="/flag-aus.png"
                alt="Australian flag"
                width={18}
                height={5}
                fetchPriority="high"
              />{" "}
              <span>Australia's Trusted AI Powered Marketplace</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-extrabold text-foreground dark:text-white leading-tight mb-0 md:mb-8 mt-2 md:mt-0">
              The Future of{" "}
              <span className="relative inline-block bg-[#3C7DED] bg-clip-text text-transparent">
                Service
                <span className="absolute right-0 bottom-0 translate-y-3 w-full h-5 overflow-hidden" aria-hidden="true">
                  <SparklesCore
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.7}
                    particleDensity={1100}
                    className="w-full h-full"
                    particleColor={theme === "dark" ? "#fff" : "#000"}
                  />{" "}
                  <div className="absolute inset-x-20  top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                  <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                  <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                  <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                </span>
              </span>{" "}
              <span className="bg-[#3C7DED] bg-clip-text text-transparent">
                Marketplaces
              </span>
            </h1>

            <p className="max-w-xl mx-auto mt-4 text-[15px] text-gray-400 dark:text-gray-300 hidden sm:block">
              Connect with verified professionals through our AI-powered
              platform. Experience trust, transparency, and innovation in every
              service interaction across Australia.
            </p>

            <div className="max-w-2xl mx-auto mt-6 sm:px-4">
              <div className="relative w-full max-w-3xl group flex sm:items-center max-sm:gap-2">
                <div className="relative flex-1 sm:mr-4 w-full">
                  <div className="absolute -inset-[2px] rounded-lg bg-[#3C7DED] blur-md opacity-0 group-hover:opacity-100 transition duration-500" aria-hidden="true" />
                  <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-300">
                    <CategorySearch
                      onSelect={handleSelectCategory}
                      placeholder="What service you need? (e.g. Cleaning, Web Development, Plumbing)"
                      aria-label="Search for services"
                    />
                  </div>
                </div>

                <Link
                  href={`/services/${slugvalue}`}
                  className="sm:w-auto sm:mt-0"
                  aria-label="Browse all services"
                ></Link>
              </div>

              <div className="flex items-center justify-center gap-2 mt-2 sm:mt-4 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4" aria-hidden="true" /> 
                <span>Serving 50+ cities across Australia</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-4 justify-center max-w-md mx-auto mt-6">
              <Button
                onClick={handlePostJob}
                disabled={loading}
                className="flex-1 py-5 bg-[#3C7DED] text-white"
                aria-label="Post a job to find service providers"
              >
                Post a Job <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>

              <NewRequestModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                presetCategory={selectedCategory}
              />

              {!session && (
                <Button
                  variant="outline"
                  onClick={joinAsProvider}
                  className="flex-1 py-5"
                  aria-label="Register as a service provider"
                >
                  Join as Provider
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="z-0" aria-hidden="true">
        </div>

        <ScrollPopularSection />

        <div className="mt-10 hidden lg:block relative overflow-hidden bg-gradient-to-t from-zinc-100 to-transparent dark:from-black">
          <div className="mx-auto max-w-4xl relative">
            <header className="text-center text-3xl text-white">
              <h2 className="text-slate-900 text-2xl sm:text-3xl lg:text-4xl dark:text-white font-bold leading-tight">
                Trusted by{" "}
                <span className="bg-clip-text text-transparent bg-[#3C7DED] animate-gradient">
                  Experts
                </span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Used by the leaders in Australian service marketplace.
              </p>
            </header>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto" role="list">
              {[
                {
                  value: "1K+",
                  label: "Verified Providers",
                  gradient: "from-blue-500 to-blue-700",
                  description: "Over 1000 verified service providers"
                },
                {
                  value: "5K+",
                  label: "Jobs Completed",
                  gradient: "from-cyan-500 to-cyan-700",
                  description: "More than 5000 successful jobs completed"
                },
                {
                  value: "4.5★",
                  label: "Average Rating",
                  gradient: "from-purple-500 to-purple-700",
                  description: "4.5 star average customer rating"
                },
                {
                  value: "24/7",
                  label: "AI Support",
                  gradient: "from-orange-500 to-orange-700",
                  description: "24/7 AI-powered customer support"
                },
              ].map((item, index) => (
                <div
                  key={index}
                  role="listitem"
                  className={`
                          relative text-center hover:scale-[1.04] transition-all
                          after:content-[''] after:absolute after:top-[10%] after:h-[80%] after:w-px after:bg-gray-200 dark:after:bg-gray-700
                          after:-right-3 md:after:-right-4
                          ${index % 2 !== 0 ? "after:hidden" : "after:block"}
                          ${index === 1 ? "md:after:block" : ""}
                          ${index === 3 ? "md:after:hidden" : ""}
                        `}
                  aria-label={item.description}
                >
                  <div
                    className={`text-xl sm:text-4xl font-extrabold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                  >
                    {item.value}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative -mt-32 h-96 overflow-hidden 
        mask-[radial-gradient(50%_50%,black,transparent)]  dark:mask-[radial-gradient(50%_50%,white,transparent)] 

        before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#fff,transparent_80%)] dark:before:bg-[radial-gradient(circle_at_bottom_center,#369eff,transparent_80%)] before:opacity-100 

        after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-gray-400 dark:after:border-[#7876c566] after:bg-zinc-100 dark:after:bg-zinc-900
        "
            aria-hidden="true"
          >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-size-[70px_80px]"></div>
            <SparklesCoreLight
              particleDensity={800}
              speed={1}
              maxSize={1.7}
              particleColor={theme === "dark" ? "#fff" : "#000"}
              className="absolute inset-x-0 bottom-0 h-full w-full mask-[radial-gradient(50%_50%,black,transparent_85%)] dark:mask-[radial-gradient(50%_50%,white,transparent_85%)] dark:hidden"
            />
            <SparklesCore
              particleDensity={800}
              speed={1}
              maxSize={1.7}
              particleColor={theme === "dark" ? "#fff" : "#000"}
              className="absolute inset-x-0 bottom-0 h-full w-full mask-[radial-gradient(50%_50%,black,transparent_85%)] dark:mask-[radial-gradient(50%_50%,white,transparent_85%)] hidden dark:block"
            />
          </div>

          <div className="w-full px-8 absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-3xl text-white">
            <h3 className="text-gray-600 text-lg sm:text-xl lg:text-2xl dark:text-white font-semibold leading-tight mb-2">
              Ready to Experience the Future?
            </h3>
            <p className="text-gray-500 text-sm dark:text-gray-400 mb-4">
              Join us today and transform the way you connect with services.
            </p>
            <Button
              onClick={handlePostJob}
              disabled={loading}
              className="py-5 bg-[#3C7DED] text-white"
              aria-label="Find and book services"
            >
              Find Services <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}