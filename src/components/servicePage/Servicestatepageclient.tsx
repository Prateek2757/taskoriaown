"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Search,
  ChevronRight,
  Building2,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NewRequestModal from "@/components/leads/RequestModal";
import ServiceBreadcrumb from "./Servicebreadcrumb";

interface City {
  city_id: number;
  name: string;
  slug: string;
  display_name: string | null;
  popularity: number;
  image_url: string | null;
  state_slug: string;
  state_name: string;
}

interface ServiceData {
  category_id: number;
  name: string;
  description?: string;
  hero_image?: string;
  about?: string;
  service_detail?: string;
  slug?: string;
  faqs?: { question: string; answer: string }[];
}

interface OtherState {
  state_slug: string;
  state_name: string;
}

interface Props {
  service: ServiceData;
  stateName: string;
  stateSlug: string;
  cities: City[];
  otherStates: OtherState[];
}

const BENEFITS = [
  {
    icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
    title: "Verified professionals",
    desc: "Every provider is background-checked and reviewed by real customers.",
  },
  {
    icon: <Star className="w-5 h-5 text-blue-600" />,
    title: "Free quotes",
    desc: "Post once and receive competitive quotes — no upfront cost, ever.",
  },
  {
    icon: <MapPin className="w-5 h-5 text-blue-600" />,
    title: "Local to you",
    desc: `Providers are based in ${""} and know the area well.`,
  },
  {
    icon: <ArrowRight className="w-5 h-5 text-blue-600" />,
    title: "Book with confidence",
    desc: "Compare, read reviews, and book directly through Taskoria.",
  },
];

export default function ServiceStatePageClient({
  service,
  stateName,
  stateSlug,
  cities,
  otherStates,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredCities = useMemo(() => {
    const q = citySearch.trim().toLowerCase();
    return q
      ? cities.filter((c) =>
          (c.display_name ?? c.name).toLowerCase().includes(q)
        )
      : cities;
  }, [cities, citySearch]);

  const serviceSlug = service.slug ?? "";

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {(service.faqs ?? []).length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: (service.faqs ?? []).map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
      <NewRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        presetCategory={service}
        initialStep={1}
      />

      <section className="relative overflow-hidden">
        {service.hero_image ? (
          <img
            src={service.hero_image}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-24">
          <div className="flex flex-col md:flex-row md:items-end gap-10">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-full px-3 py-1 text-xs font-semibold mb-5">
                <MapPin className="w-3 h-3" />
                {stateName}, Australia
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3rem] font-extrabold text-white leading-[1.1] tracking-tight mb-5">
                Find trusted{" "}
                <span className="text-blue-400">{service.name}</span>
                <br />
                in {stateName}
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                {service.description
                  ? service.description.slice(0, 150)
                  : `Compare verified ${service.name.toLowerCase()} professionals across ${stateName}. Get free quotes, read real reviews and book with confidence.`}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setOpenModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-sm font-semibold shadow-xl shadow-blue-600/30 transition-colors"
                >
                  Get Free Quotes in {stateName}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Link
                  href={`/services/${serviceSlug}`}
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/25 rounded-full px-6 py-3.5 text-sm font-medium transition-colors"
                >
                  View all locations
                </Link>
              </div>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              {[
                { value: `${cities.length}`, label: "Cities" },
                { value: "Free", label: "Quotes" },
                { value: "97%", label: "Satisfaction" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center"
                >
                  <p className="text-2xl font-extrabold text-white">
                    {s.value}
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-3 flex flex-wrap gap-x-10 gap-y-1.5 items-center text-sm">
          {[
            {
              value: `${cities.length} cities`,
              label: `covered in ${stateName}`,
            },
            { value: "Verified", label: "providers only" },
            { value: "Free quotes", label: "always" },
            { value: "< 2 hrs", label: "average response" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-bold">{s.value}</span>
              <span className="text-blue-200 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <section className=" py-3 ">
          {stateSlug && (
            <ServiceBreadcrumb
              service={service}
              stateSlug={stateSlug}
              //   citySlug={citySlug}
              //   subCitySlug={subCitySlug}
              //   stateName={stateName}
              //   cityName={cityName}
              //   subCityName={subCityName}
            />
          )}
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {service.name} near you in {stateName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                Choose your city to find local {service.name.toLowerCase()}{" "}
                professionals and prices
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder={`Search ${stateName} cities…`}
                className="pl-8 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
          </div>

          {filteredCities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCities.map((city) => (
                <Link
                  key={city.city_id}
                  href={`/services/${serviceSlug}/${stateSlug}/${city.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* {city.image_url ? (
                    <div className="h-28 overflow-hidden">
                      <img
                        src={city.image_url}
                        alt={city.display_name ?? city.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="h-28 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-blue-300 dark:text-blue-700" />
                    </div>
                  )} */}

                  <div className="p-3.5">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0 transition-colors" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 leading-snug">
                          {city.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {service.name} providers
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-slate-600 dark:text-slate-400">
                No cities match "{citySearch}"
              </p>
              <button
                onClick={() => setCitySearch("")}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* ══════ HOW IT WORKS ══════════════════════════════════════════════ */}
        <section className="py-14 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 tracking-tight">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Post your job",
                desc: `Describe what ${service.name.toLowerCase()} work you need done in ${stateName}. It's free and takes under a minute.`,
              },
              {
                step: "2",
                title: "Receive quotes",
                desc: "Verified local professionals will send you competitive quotes within hours.",
              },
              {
                step: "3",
                title: "Choose & book",
                desc: "Compare profiles, read reviews, and book the right person — all on Taskoria.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-5">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ WHY TASKORIA ═════════════════════════════════════════════ */}
        <section className="py-14 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 tracking-tight">
            Why choose Taskoria in {stateName}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {b.desc.replace("in .", `in ${stateName}.`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ ABOUT SECTION (from DB) ══════════════════════════════════ */}
        {service.about && (
          <section className="py-14 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
              About {service.name} in {stateName}
            </h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-slate-800"
              dangerouslySetInnerHTML={{ __html: service.about }}
            />
          </section>
        )}

        {service.faqs && service.faqs.length > 0 && (
          <section className="py-14 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {service.faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-900">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════ OTHER STATES ═════════════════════════════════════════════ */}
        {otherStates.length > 0 && (
          <section className="py-12 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5">
              {service.name} in other states
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {otherStates.map((s) => (
                <Link
                  key={s.state_slug}
                  href={`/services/${serviceSlug}/${s.state_slug}`}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                >
                  <MapPin className="w-3 h-3 opacity-50" />
                  {s.state_name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white mt-6">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Ready to hire {service.name} in {stateName}?
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
            Get Free Quotes
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </aside>
    </main>
  );
}
