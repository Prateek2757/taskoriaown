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
    () => categoryTree.slice(0, 10),
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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row md:items-center gap-10">
          <div className="flex-1">
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

            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-[1.1] tracking-tight mb-5">
              Discover what you can
              <br />
              get done in <span className="text-blue-400">{stateName}</span>
            </h1>

            <p className="text-white/75 text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Find trusted professionals across {cities.length} cities in{" "}
              {stateName} — from home cleaning to graphic design.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-7 py-6 text-sm font-semibold shadow-lg shadow-blue-600/30"
              >
                Post a task in {stateName}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/25 rounded-full px-6 py-3 text-sm font-medium transition-colors"
              >
                <Grid3X3 className="w-4 h-4" />
                Browse all services
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto md:min-w-[260px]">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4"
              >
                <div className="flex items-center gap-1.5 text-white/65 text-xs mb-1">
                  {stat.icon}
                  {stat.label}
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
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
        {/* CITIES */}
        <section className="pt-14 pb-6">
          <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Cities in {stateName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {cities.length} cities — choose yours to see local professionals
              </p>
            </div>

            <div className="relative">
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

        {/* POPULAR SERVICES */}
        <section className="pt-10 pb-6 [content-visibility:auto] [contain-intrinsic-size:600px]">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Popular services in {stateName}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
            Most requested categories across {stateName}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {popularCategories.map((cat) => (
              <Link
                key={cat.category_id}
                href={`/services/${cat.slug}/${stateSlug}`}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-28 overflow-hidden">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-950/30">
                      <span className="w-11 h-11 rounded-xl bg-blue-600 text-white text-lg font-extrabold flex items-center justify-center">
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 leading-snug">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ALL CATEGORIES */}
        <section className="pt-12 pb-20 [content-visibility:auto] [contain-intrinsic-size:1200px]">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-10">
            Browse all categories in {stateName}
          </h2>

          <div className="flex gap-10 items-start">
            <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 sticky top-6 gap-5">
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

      {/* OTHER STATES */}
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
      <aside className="bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Ready to get something done in {stateName}?
            </h2>
            <p className="text-white/70 text-lg max-w-xl">
              Post your job once — receive quotes fast, compare providers, and
              book with confidence.
            </p>
          </div>

          <Button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl px-10 py-5 text-lg font-bold flex-shrink-0"
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
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-3.5">
        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0 transition-colors" />

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