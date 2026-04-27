"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Search,
  TrendingUp,
  Grid3X3,
  ChevronRight,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NewRequestModal from "@/components/leads/RequestModal";
import { CategoryWithSubs, City } from "@/app/[location]/(public)/(pages)/cities/[...slug]/page";


interface Props {
  city: City;
  categoryTree: CategoryWithSubs[];
  nearbyCities: City[];      
  sameStateCities: City[];     
  stateSlug: string;
}

const ACCENT: Record<string, string> = {
  Cleaning: "#7c3aed",
  Removals: "#1d4ed8",
  "Garden & Outdoor": "#15803d",
  Plumbing: "#0e7490",
  Electrical: "#b45309",
  Painting: "#be185d",
  Carpentry: "#9a3412",
  "Computer & Tech": "#1e40af",
  Admin: "#6d28d9",
  Accounting: "#065f46",
};

const DEFAULT_ACCENT = "#1d4ed8";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function CityPageClient({
  city,
  categoryTree,
  nearbyCities,
  sameStateCities,
  stateSlug,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const cityName =  city.name;

  const popularCategories = useMemo(() => categoryTree.slice(0, 5), [categoryTree]);
  const trendingCategories = useMemo(() => categoryTree.slice(5, 10), [categoryTree]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categoryTree;
    return categoryTree.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.subcategories.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [categoryTree, searchQuery]);

  const alphabetGroups = useMemo(() => {
    const map: Record<string, CategoryWithSubs[]> = {};
    for (const cat of filteredCategories) {
      const letter = cat.name[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(cat);
    }
    return map;
  }, [filteredCategories]);

  const availableLetters = Object.keys(alphabetGroups).sort();

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    categoryRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <NewRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        presetLocation={city}
        initialStep={1}
      />

      <section className="relative py-4 h-full md:h-full  overflow-hidden">
        {city.image_url ? (
          <img
            src={city.image_url}
            alt={cityName}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/55 mb-6">
            <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/cities" className="hover:text-white/90 transition-colors">Cities</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/cities/${stateSlug}`} className="hover:text-white/90 transition-colors">
              {city.state_name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 font-medium">{cityName}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] max-w-3xl mb-4 tracking-tight">
            Discover what you can<br />
            get done in{" "}
            <span className="text-blue-400">{cityName}</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-md mb-8 leading-relaxed">
            Find all kinds of services available in {cityName} — from home cleaning to graphic design.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
            variant="default"
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-7 py-5 text-sm font-semibold shadow-lg shadow-blue-600/30 transition-colors"
            >
              Post a task in {cityName}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/25 rounded-full px-6 py-2 text-sm font-medium transition-colors"
            >
              <Grid3X3 className="w-4 h-4" />
              Browse all services
            </Link>
          </div>
        </div>

        {/* Coordinates badge */}
        {/* {city.latitude && city.longitude && (
          <div className="absolute bottom-5 left-6 md:left-16 flex items-center gap-1.5 text-white/55 text-xs">
            <Navigation className="w-3 h-3" />
            <span>
              {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)} · {city.state_name}
            </span>
          </div>
        )} */}
      </section>

      {/* ══════ STATS STRIP ══════════════════════════════════════════════════ */}
      {/* <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-3.5 flex flex-wrap gap-x-10 gap-y-1.5 items-center text-sm">
          {[
            { value: "3,200+", label: "verified professionals" },
            { value: `${categoryTree.reduce((n, c) => n + c.subcategories.length + 1, 0)}+`, label: "services available" },
            { value: "50,000+", label: "tasks completed" },
            { value: "< 2 hrs", label: "average response" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-bold">{s.value}</span>
              <span className="text-blue-200 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* ══════ POPULAR SERVICES ══════════════════════════════════════════ */}
        <section className="pt-14 pb-2">
          <SectionHeader
            title={`Popular services in ${cityName}`}
            subtitle="Categories with the highest number of tasks posted in the last 30 days"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-7">
            {popularCategories.map((cat, i) => (
              <CategoryCard
                key={cat.category_id}
                cat={cat}
                citySlug={city.slug}
                stateSlug={stateSlug}
                rank={i + 1}
              />
            ))}
          </div>
        </section>

        {/* ══════ TRENDING SERVICES ════════════════════════════════════════ */}
        {trendingCategories.length > 0 && (
          <section className="pt-10 pb-2">
            <SectionHeader
              title={`Trending services in ${cityName}`}
              subtitle="Categories with the biggest increase in tasks compared to the previous 30 day period"
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-7">
              {trendingCategories.map((cat) => (
                <CategoryCard
                  key={cat.category_id}
                  cat={cat}
                  citySlug={city.slug}
                  stateSlug={stateSlug}
                  showTrend
                />
              ))}
            </div>
          </section>
        )}

        {/* ══════ NEARBY CITIES (distance-sorted) ══════════════════════════ */}
        {nearbyCities.length > 0 && (
          <section className="pt-12 pb-2">
            <SectionHeader
              title={`Cities near ${cityName}`}
              subtitle="Find service providers in nearby cities too"
              icon={<Navigation className="w-4 h-4 text-blue-500" />}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-7">
              {nearbyCities.map((nc) => (
                <NearbyCity
                  key={nc.city_id}
                  city={nc}
                  stateSlug={nc.state_slug}
                />
              ))}
            </div>
          </section>
        )}

        {sameStateCities.length > 0 && (
          <section className="pt-10 pb-2">
            <SectionHeader
              title={`Other cities in ${city.state_name}`}
              subtitle={`Browse services available across ${city.state_name}`}
            />
            <div className="flex flex-wrap gap-2.5 mt-6">
              {sameStateCities.map((sc) => (
                <Link
                  key={sc.city_id}
                  href={`/cities/${stateSlug}/${sc.slug}`}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 rounded-full px-4 py-2 text-sm font-medium transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <MapPin className="w-3 h-3 opacity-50" />
                  {sc.display_name ?? sc.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="pt-14 pb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-10">
            Browse all categories
          </h2>

          <div className="flex gap-10 items-start">

            <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 sticky top-6 gap-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Jump to
                </p>
                <div className="flex flex-wrap gap-0.5">
                  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => {
                    const active = availableLetters.includes(l);
                    return (
                      <button
                        key={l}
                        onClick={() => active && scrollToLetter(l)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                          !active
                            ? "text-slate-300 dark:text-slate-700 cursor-default"
                            : activeLetter === l
                            ? "bg-blue-600 text-white"
                            : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                        }`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <nav className="space-y-0.5 max-h-72 overflow-y-auto">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.category_id}
                    onClick={() => scrollToLetter(cat.name[0].toUpperCase())}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {availableLetters.map((letter) => (
                <div
                  key={letter}
                  ref={(el) => { categoryRefs.current[letter] = el; }}
                  className="scroll-mt-6 space-y-10"
                >
                  {alphabetGroups[letter].map((cat) => (
                    <div key={cat.category_id}>
                      <div className="flex items-center gap-3 mb-5 border-b-2 border-slate-100 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {cat.name}
                        </h3>
                        {cat.subcategories.length > 0 && (
                          <span className="text-xs text-slate-400 font-medium">
                            {cat.subcategories.length} services
                          </span>
                        )}
                        <Link
                          href={`/services/${cat.slug}/${stateSlug}/${city.slug}`}
                          className="ml-auto inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          All in {cityName}
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {cat.subcategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1.5">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.category_id}
                              href={`/services/${sub.slug}/${stateSlug}/${city.slug}`}
                              className="group flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 py-0.5 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 group-hover:bg-blue-600 flex-shrink-0 transition-colors" />
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          href={`/services/${cat.slug}/${stateSlug}/${city.slug}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Find {cat.name} professionals in {cityName} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="font-medium text-slate-600 dark:text-slate-400">
                    No categories found for "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <aside className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Ready to get something done in {cityName}?
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


function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm md:text-[0.9rem]">
        {subtitle}
      </p>
    </div>
  );
}

function CategoryCard({
  cat,
  citySlug,
  stateSlug,
  rank,
  showTrend,
}: {
  cat: CategoryWithSubs;
  citySlug: string;
  stateSlug: string;
  rank?: number;
  showTrend?: boolean;
}) {
  const accent = ACCENT[cat.name] ?? DEFAULT_ACCENT;

  return (
    <Link
      href={`/services/${cat.slug}/${stateSlug}/${citySlug}`}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image or colour block */}
      <div className="relative h-32 overflow-hidden">
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${accent}14` }}
          >
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-extrabold"
              style={{ background: accent }}
            >
              {cat.name[0]}
            </span>
          </div>
        )}

        {rank && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center shadow-sm">
            {rank}
          </div>
        )}

        {showTrend && (
          <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            trending
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 leading-snug">
          {cat.name}
        </h3>
        {cat.subcategories.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {cat.subcategories.length} services
          </p>
        )}
      </div>
    </Link>
  );
}

function NearbyCity({ city, stateSlug }: { city: City; stateSlug: string }) {
  return (
    <Link
      href={`/cities/${stateSlug}/${city.slug}`}
      className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      {city.image_url && (
        <div className="h-20 overflow-hidden">
          <img
            src={city.image_url}
            alt={city.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="px-3 py-2.5 flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-slate-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate">
          {city.display_name ?? city.name}
        </span>
      </div>
    </Link>
  );
}