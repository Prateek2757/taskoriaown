import { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Find Services by City | Taskoria",
  description:
    "Browse local service professionals across Australia. Select your city to find trusted providers near you.",
  alternates: { canonical: "https://www.taskoria.com/cities" },
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

export default async function CitiesIndexPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`,
    { next: { revalidate: 3600 } }
  );
  const cities: City[] = res.ok ? await res.json() : [];

  const byState: Record<string, { stateName: string; stateSlug: string; cities: City[] }> = {};
  for (const city of cities) {
    if (!byState[city.state_slug]) {
      byState[city.state_slug] = {
        stateName: city.state_name,
        stateSlug: city.state_slug,
        cities: [],
      };
    }
    byState[city.state_slug].cities.push(city);
  }

  const states = Object.values(byState).sort((a, b) =>
    (a.stateName ?? "").localeCompare(b.stateName ?? "")
  );
  for (const state of states) {
    state.cities.sort((a, b) => b.popularity - a.popularity);
  
    const uniqueMap = new Map<string, City>();
  
    for (const city of state.cities) {
      if (!uniqueMap.has(city.name)) {
        uniqueMap.set(city.name, city);
      }
    }
  
    state.cities = Array.from(uniqueMap.values());
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-300 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Cities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Find services in your city
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Browse trusted local professionals across Australia. Choose your
            city to see available services and providers near you.
          </p>
        </div>
      </section>

      {/* Cities by state */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 space-y-14">
        {states.map((state) => (
          <section key={state.stateSlug}>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 border-b-2 border-slate-100 dark:border-slate-800 pb-3">
              {state.stateName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {state.cities.map((city) => (
                <Link
                  key={city.city_id}
                  href={`/cities/${state.stateSlug}/${city.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {city.image_url && (
                    <div className="h-24 overflow-hidden">
                      <img
                        src={city.image_url}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0 transition-colors" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">
                          { city.name}
                        </h3>
                        {city.subcities.length > 0 && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {city.subcities.length} areas
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}