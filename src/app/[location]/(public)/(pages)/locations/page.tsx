import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 84600;

export const metadata: Metadata = {
  title: "Find Services by City | Taskoria",
  description:
    "Browse local service professionals across Australia. Select your city to find trusted providers near you.",
  alternates: { canonical: "https://www.taskoria.com/locations" },
};

interface City {
  city_id: number;
  name: string;
  slug: string;
  display_name: string | null;
  popularity: number;
  image_url: string | null;
  state_slug: string;
  state_name: string;
  country_name: string;
  subcities: { city_id: number; name: string; slug: string }[];
}

interface StateGroup {
  stateName: string;
  stateSlug: string;
  cities: City[];
}

const FEATURED_CITY_LIMIT = 20;

async function getCities(): Promise<City[]> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      return [];
    }

    const res = await fetch(`${appUrl}/api/service-location`, {
      next: { revalidate: 84600 },
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

function groupCitiesByState(cities: City[]): StateGroup[] {
  const byState = new Map<string, StateGroup>();

  for (const city of cities) {
    if (!city.state_slug || !city.state_name || !city.slug || !city.name) {
      continue;
    }

    if (!byState.has(city.state_slug)) {
      byState.set(city.state_slug, {
        stateName: city.state_name,
        stateSlug: city.state_slug,
        cities: [],
      });
    }

    byState.get(city.state_slug)?.cities.push(city);
  }

  const states = Array.from(byState.values()).sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );

  for (const state of states) {
    const uniqueCities = new Map<string, City>();

    state.cities
      .sort((a, b) => {
        const popularityDiff = (b.popularity ?? 0) - (a.popularity ?? 0);

        if (popularityDiff !== 0) {
          return popularityDiff;
        }

        return a.name.localeCompare(b.name);
      })
      .forEach((city) => {
        const key = city.slug || city.name.toLowerCase();

        if (!uniqueCities.has(key)) {
          uniqueCities.set(key, city);
        }
      });

    state.cities = Array.from(uniqueCities.values());
  }

  return states;
}

export default async function CitiesIndexPage() {
  const cities = await getCities();
  const states = groupCitiesByState(cities);

  const totalCities = states.reduce((sum, state) => sum + state.cities.length, 0);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <Image
          src="/sydney-bridge.webp"
          alt="Find local services across Australia"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(59,130,246,0.18),transparent_30%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-10 ">
          <nav className="flex items-center gap-2 text-sm text-white/65 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Cities</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-blue-300" />
              Find trusted local professionals near you
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Find services in your{" "}
              <span className="text-blue-400">city</span>
            </h1>

            <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
              Browse trusted local professionals across Australia. Choose your
              state, select your city, and get connected with providers near you.
            </p>

            <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <HeroStat
                icon={<MapPin className="w-4 h-4" />}
                value={`${totalCities}+`}
                label="cities listed"
              />
              <HeroStat
                icon={<ShieldCheck className="w-4 h-4" />}
                value="Verified"
                label="local pros"
              />
              <HeroStat
                icon={<Timer className="w-4 h-4" />}
                value="Fast"
                label="free quotes"
              />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATE NAV */}
      {states.length > 0 && (
        <section className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <span className="hidden sm:inline-flex text-xs font-bold uppercase tracking-widest text-slate-400 shrink-0">
                Browse states
              </span>

              {states.map((state) => (
                <a
                  key={state.stateSlug}
                  href={`#${state.stateSlug}`}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  {state.stateName}
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-500">
                    {state.cities.length}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATES */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">
              Locations
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Browse services by state and city
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl">
              Select your location to find service professionals available in
              your area.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-bold shadow-lg shadow-blue-600/20 transition-colors"
          >
            Browse all services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {states.length > 0 ? (
          <div className="space-y-14">
            {states.map((state) => {
              const visibleCities = state.cities.slice(0, FEATURED_CITY_LIMIT);
              const hasMore = state.cities.length > FEATURED_CITY_LIMIT;

              return (
                <section
                  key={state.stateSlug}
                  id={state.stateSlug}
                  className="scroll-mt-28 [content-visibility:auto] [contain-intrinsic-size:520px]"
                >
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                          <Building2 className="w-5 h-5" />
                        </div>

                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                            {state.stateName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {state.cities.length} cities available
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/locations/${state.stateSlug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View all in {state.stateName}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {visibleCities.map((city) => (
                      <CityCard
                        key={city.city_id}
                        city={city}
                        stateSlug={state.stateSlug}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-6">
                      <Link
                        href={`/locations/${state.stateSlug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-5 py-2.5 text-sm font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                      >
                        Show {state.cities.length - FEATURED_CITY_LIMIT} more
                        cities in {state.stateName}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* CTA */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white">
              Need help choosing the right service?
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
              Post your task for free and get quotes from local professionals.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 text-sm font-bold shadow-lg shadow-blue-600/20 transition-colors"
          >
            Start now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function HeroStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border gap-2 inline-flex border-white/15 bg-white/10 backdrop-blur-md px-2 py-2">
      <div className="flex items-center gap-2 text-blue-200 mb-2">{icon}</div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-sm py-2 text-white/65">{label}</p>
    </div>
  );
}

function CityCard({ city, stateSlug }: { city: City; stateSlug: string }) {
  const cityName = city.display_name ?? city.name;

  return (
    <Link
      href={`/locations/${stateSlug}/${city.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg"
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 transition-colors">
          <MapPin className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-snug text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            {cityName}
          </h3>

          {city.subcities?.length > 0 ? (
            <p className="text-xs text-slate-400 mt-1">
              {city.subcities.length} areas
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">View professionals</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400">
        <Search className="w-6 h-6" />
      </div>

      <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
        No cities found
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Please check your service location API or try again later.
      </p>
    </div>
  );
}