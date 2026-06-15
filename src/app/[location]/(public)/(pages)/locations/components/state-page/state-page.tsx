"use client";

import { useState, useMemo, useRef, useDeferredValue, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  MapPin,
  Search,
  Grid3X3,
  ChevronRight,
  Building2,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryWithSubs, City } from "../../[...slug]/page";

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
  categoryTree: CategoryWithSubs[];
  otherStates: OtherState[];
}

const Static_State_Image: Record<string, string> = {
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

const INITIAL_CITY_LIMIT = 40;
const POPULAR_CATEGORY_LIMIT = 8;

export default function StatePageClient({
  stateSlug,
  stateName,
  countryName,
  cities,
  categoryTree,
  otherStates,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [showAllCities, setShowAllCities] = useState(false);

  const catRefs = useRef<Record<string, HTMLElement | null>>({});

  const deferredCitySearch = useDeferredValue(citySearch);
  const deferredCatSearch = useDeferredValue(catSearch);

  const bgImage = Static_State_Image[stateSlug];

  const filteredCities = useMemo(() => {
    const q = deferredCitySearch.trim().toLowerCase();

    if (!q) return cities;

    return cities.filter((city) =>
      (city.display_name ?? city.name).toLowerCase().includes(q)
    );
  }, [cities, deferredCitySearch]);

  const visibleCities = useMemo(() => {
    if (showAllCities || deferredCitySearch.trim()) {
      return filteredCities;
    }

    return filteredCities.slice(0, INITIAL_CITY_LIMIT);
  }, [filteredCities, showAllCities, deferredCitySearch]);

  const filteredCats = useMemo(() => {
    const q = deferredCatSearch.trim().toLowerCase();

    if (!q) return categoryTree;

    return categoryTree.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [categoryTree, deferredCatSearch]);

  const alphaGroups = useMemo(() => {
    const map: Record<string, CategoryWithSubs[]> = {};

    for (const cat of filteredCats) {
      const firstLetter = cat.name.charAt(0).toUpperCase();

      if (!map[firstLetter]) {
        map[firstLetter] = [];
      }

      map[firstLetter].push(cat);
    }

    return map;
  }, [filteredCats]);

  const letters = useMemo(() => Object.keys(alphaGroups).sort(), [alphaGroups]);

  const popularCategories = useMemo(
    () => categoryTree.slice(0, POPULAR_CATEGORY_LIMIT),
    [categoryTree]
  );

  const heroStats = useMemo(
    () => [
      {
        label: "Cities",
        value: cities.length,
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        label: "Services",
        value: `${categoryTree.length}+`,
        icon: <Grid3X3 className="w-4 h-4" />,
      },
      {
        label: "Professionals",
        value: "50+",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        label: "Tasks done",
        value: "500+",
        icon: <Map className="w-4 h-4" />,
      },
    ],
    [cities.length, categoryTree.length]
  );

  const trustStats = useMemo(
    () => [
      {
        value: cities.length.toString(),
        label: `cities in ${stateName}`,
      },
      { value: "Verified", label: "professionals only" },
      { value: "Free", label: "quotes always" },
      { value: "< 2 hrs", label: "average response time" },
    ],
    [cities.length, stateName]
  );

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);

    catRefs.current[letter]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
              Browse {cities.length} cities and compare trusted professionals
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
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
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
            </div>
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
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Local services across {stateName}
          </h2>
          <div className="grid gap-5 md:grid-cols-3 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Browse {cities.length} {stateName} locations and compare service
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

        <section className="pt-12 pb-6">
          <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Cities in {stateName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {cities.length} cities — choose yours to see local professionals
              </p>
            </div>

            <div className="relative ">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setShowAllCities(false);
                }}
                placeholder={`Search ${stateName} cities…`}
                className="pl-8 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
              />
            </div>
          </div>

          {filteredCities.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {visibleCities.map((city) => (
                  <CityCard
                    key={city.city_id}
                    city={city}
                    stateSlug={stateSlug}
                  />
                ))}
              </div>

              {!showAllCities &&
                !deferredCitySearch.trim() &&
                filteredCities.length > INITIAL_CITY_LIMIT && (
                  <div className="mt-8 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAllCities(true)}
                      className="rounded-full px-6"
                    >
                      Show all {filteredCities.length} cities
                    </Button>
                  </div>
                )}
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No cities match "{citySearch}"</p>
              <button
                type="button"
                onClick={() => setCitySearch("")}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        <section className="pt-10 pb-6 [content-visibility:auto] [contain-intrinsic-size:360px]">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Popular services in {stateName}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
            Most requested categories across {stateName}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularCategories.map((cat) => (
              <Link
                key={cat.category_id}
                href={`/services/${cat.slug}/${stateSlug}`}
                className="group flex items-center gap-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  {cat.name.charAt(0)}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 leading-snug">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-12 pb-20 [content-visibility:auto] [contain-intrinsic-size:1200px]">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Browse all categories in {stateName}
          </h2>

          <div className="flex gap-10 items-start">
            <aside className="hidden lg:flex flex-col w-52 shrink-0 sticky top-6 gap-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Jump to
                </p>

                <div className="flex flex-wrap gap-0.5">
                  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                    const hasLetter = letters.includes(letter);

                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => hasLetter && scrollToLetter(letter)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                          !hasLetter
                            ? "text-slate-300 dark:text-slate-700 cursor-default"
                            : activeLetter === letter
                              ? "bg-blue-600 text-white"
                              : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              <nav className="space-y-0.5 max-h-72 overflow-y-auto">
                {filteredCats.map((cat) => (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() => scrollToLetter(cat.name.charAt(0).toUpperCase())}
                    className="block w-full text-left px-2 py-1.5 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="flex-1 min-w-0 space-y-12">
              <div className="relative lg:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {letters.map((letter) => (
                <div
                  key={letter}
                  ref={(el) => {
                    catRefs.current[letter] = el;
                  }}
                  className="scroll-mt-6 space-y-10"
                >
                  {alphaGroups[letter].map((cat) => (
                    <div key={cat.category_id}>
                      <div className="flex items-center gap-3 mb-5 border-b-2 border-slate-100 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {cat.name}
                        </h3>

                        <Link
                          href={`/services/${cat.slug}/${stateSlug}`}
                          className="ml-auto inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          All in {stateName}
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <Link
                        href={`/services/${cat.slug}/${stateSlug}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Find {cat.name} professionals in {stateName} →
                      </Link>
                    </div>
                  ))}
                </div>
              ))}

              {filteredCats.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    No categories match "{catSearch}"
                  </p>
                  <button
                    type="button"
                    onClick={() => setCatSearch("")}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {otherStates.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 [content-visibility:auto] [contain-intrinsic-size:400px]">
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-5">
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
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
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

const CityCard = memo(function CityCard({
  city,
  stateSlug,
}: {
  city: City;
  stateSlug: string;
}) {
  const cityName = city.display_name ?? city.name;

  return (
    <Link
      href={`/locations/${stateSlug}/${city.slug}`}
      className="group relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors rounded-xl "
    >
      <div className="p-3.5">
        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 mt-0.5 shrink-0 transition-colors" />

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 leading-snug">
              {cityName}
            </h3>

            <p className="text-[11px] text-slate-400 mt-0.5">
              View professionals
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
});
