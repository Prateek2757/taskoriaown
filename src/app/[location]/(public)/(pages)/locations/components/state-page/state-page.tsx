"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin, Grid3X3, ChevronRight, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import InternalLinkModule from "@/components/InternalLinkModule";
import { CategoryWithSubs, City } from "../../[...slug]/page";
import LocationAlphabetDirectory from "@/components/Location/LocationAlphabetDirectory";

const NewRequestModal = dynamic(
  () => import("@/components/leads/RequestModal"),
  {
    ssr: false,
    loading: () => null,
  }
);

const CityProviders = dynamic(
  () => import("@/components/servicePage/cityProviders"),
  {
    ssr: false,
    loading: () => null,
  }
);

interface OtherState {
  state_slug: string;
  state_name: string;
}

interface Props {
  stateSlug: string;
  stateName: string;
  countryName: string;
  cities: City[];
  cityCount?: number;
  categoryTree: CategoryWithSubs[];
  otherStates: OtherState[];
}

const Static_State_Image: Record<string, string> = {
  nsw: "/nsw-sydney.jpg",
  act: "/act.jpg",
  nt: "/northern-territory.png",
  qld: "/queensland.jpg",
  sa: "/south-australia.jpg",
  tas: "/tasmania.jpg",
  wa: "/western-australia.webp",
  vic: "/victoria.jpg",
  "new-south-wales": "/nsw-sydney.jpg",
  "australian-capital-territory": "/act.jpg",
  "norfolk-island": "/Norfolk_Island.avif",
  "northern-territory": "/northern-territory.png",
  queensland: "/queensland.jpg",
  "south-australia": "/south-australia.jpg",
  tasmania: "/tasmania.jpg",
  "western-australia": "/western-australia.jpg",
  victoria: "/victoria.jpg",
};

const POPULAR_CATEGORY_LIMIT = 8;

export default function StatePageClient({
  stateSlug,
  stateName,
  countryName,
  cities,
  cityCount,
  categoryTree,
  otherStates,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const bgImage = Static_State_Image[stateSlug];
  const locationCount = cityCount ?? cities.length;

  const popularCategories = useMemo(
    () => categoryTree.slice(0, POPULAR_CATEGORY_LIMIT),
    [categoryTree]
  );

  const popularServiceLinks = useMemo(
    () =>
      popularCategories.map((cat) => ({
        href: `/services/${cat.slug}/${stateSlug}`,
        label: cat.name,
        imageUrl: cat.image_url ?? null,
      })),
    [popularCategories, stateSlug]
  );

  // const heroStats = useMemo(
  //   () => [
  //     {
  //       label: "Cities",
  //       value: cities.length,
  //       icon: <Building2 className="w-4 h-4" />,
  //     },
  //     {
  //       label: "Services",
  //       value: `${categoryTree.length}+`,
  //       icon: <Grid3X3 className="w-4 h-4" />,
  //     },
  //     {
  //       label: "Professionals",
  //       value: "50+",
  //       icon: <MapPin className="w-4 h-4" />,
  //     }
  //   ],
  //   [cities.length, categoryTree.length]
  // );

  const trustStats = useMemo(
    () => [
      {
        value: locationCount.toString(),
        label: `cities in ${stateName}`,
      },
      { value: "Verified", label: "professionals only" },
      { value: "Free", label: "quotes always" },
      { value: "< 2 hrs", label: "average response time" },
    ],
    [locationCount, stateName]
  );

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {openModal && (
        <NewRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          initialStep={1}
        />
      )}

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900">
        {bgImage ? (
          <Image
            src={bgImage}
            alt={`${stateName}, ${countryName}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700" />
        )}

        <div className="absolute inset-0 bg-slate-950/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-14">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-xs text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                href="/locations"
                className="hover:text-white transition-colors"
              >
                Cities
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium">{stateName}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-5">
              Local services in {stateName}
            </h1>

            <p className="text-white/78 text-base md:text-lg max-w-2xl mb-7 leading-relaxed">
              Browse {locationCount} cities and compare trusted professionals
              for home, business, event, and personal jobs across {stateName}.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-7 py-6 text-sm font-semibold shadow-lg shadow-blue-600/30"
              >
                Post a task in {stateName}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/25 rounded-xl px-6 py-3 text-sm font-medium transition-colors"
              >
                <Grid3X3 className="w-4 h-4" />
                Browse all services
              </Link>
            </div>
            {/* <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border rounded-xl border-white/15 bg-white/10 px-4 py-1.5"
                >
                  <div className="flex items-center gap-1.5 text-white/65 text-xs mb-1">
                    {stat.icon}
                    {stat.label}
                  </div>
                  <p className="text-xl font-extrabold text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-3 flex flex-wrap gap-x-10 gap-y-1.5 items-center text-sm">
          {trustStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="font-bold">{stat.value}</span>
              <span className="text-blue-200 text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <section className="py-10 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl  font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Local services across {stateName}
          </h2>
          <div className="grid gap-5 md:grid-cols-3 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Browse {locationCount} {stateName} locations and compare service
              categories that customers commonly request, from home maintenance
              and cleaning to business, events, and personal support.
            </p>
            <p>
              Each city page narrows the directory to local professionals and
              nearby areas, so customers can start with the place where the job
              needs to happen instead of searching through a generic national
              list.
            </p>
            <p>
              Choose a category to post your task, describe the timing and
              details, then review quotes from providers who can service your
              part of {stateName}.
            </p>
          </div>
        </section>

        <CityProviders
          stateSlug={stateSlug}
          locationName={stateName}
          className="border-b border-slate-100 dark:border-slate-800"
        />
        <InternalLinkModule
          eyebrow="Popular local pages"
          title={`Popular services in ${stateName}`}
          description={`Most requested categories across ${stateName}`}
          className="pt-10 pb-6 [content-visibility:auto] [contain-intrinsic-size:360px]"
          groups={[
            {
              title: `Popular services in ${stateName}`,
              links: popularServiceLinks,
              variant: "service-cards",
            },
          ]}
        />
        <section className="py-6">
          <LocationAlphabetDirectory
            locations={cities}
            totalCount={locationCount}
            title={`Browse locations in ${stateName}`}
            eyebrow="Cities and suburbs"
            description="Choose your location to see local professionals and services."
            overviewHref="/locations"
            overviewLabel="All Australian locations"
            buildHref={(city) => `/locations/${stateSlug}/${city.slug}`}
          />
        </section>

        {/* Category directory temporarily hidden while the location directory is primary. */}
      </div>

      {otherStates.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 [content-visibility:auto] [contain-intrinsic-size:400px]">
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-5">
              Explore other states
            </h2>

            <div className="flex flex-wrap gap-2.5">
              {otherStates.map((state) => (
                <Link
                  key={state.state_slug}
                  href={`/locations/${state.state_slug}`}
                  className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                >
                  <Map className="w-3 h-3 opacity-50" />
                  {state.state_name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
      <aside className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-2xl  font-bold mb-3">
              Ready to get something done in {stateName}?
            </h2>
            <p className="text-white/70 text-lg max-w-xl">
              Post your job once — receive quotes fast, compare providers, and
              book with confidence.
            </p>
          </div>

          <Button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl px-10 py-5 text-lg font-bold shrink-0"
          >
            Post a task for free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </aside>
    </main>
  );
}
