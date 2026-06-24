"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  MapPin,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceBreadcrumb from "./Servicebreadcrumb";
import { normalizeServiceHtml } from "./normalizeServiceHtml";
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

const LOCAL_SERVICE_POINTS = [
  "Residential jobs",
  "Business jobs",
  "One-off projects",
  "Recurring work",
];

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
    desc: "Providers are based nearby and know the area well.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceSlug = service.slug ?? "";
  const serviceNameLower = service.name.toLowerCase();
  const topCityNames = cities
    .slice(0, 6)
    .map((city) => city.name)
    .filter(Boolean);
  const topCitiesText =
    topCityNames.length > 1
      ? `${topCityNames.slice(0, -1).join(", ")} and ${topCityNames.at(-1)}`
      : topCityNames[0] ?? stateName;
  const serviceDescription =
    service.description?.trim() &&
    !/across Australia/i.test(service.description.trim())
      ? service.description.trim()
      : `Find trusted ${serviceNameLower} professionals across ${stateName}. Compare local providers, request free quotes and choose the right pro for your job.`;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* {(service.faqs ?? []).length > 0 && (
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
      )} */}
      {openModal && (
        <NewRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          presetCategory={service}
          initialStep={1}
        />
      )}

      <section className="relative overflow-hidden bg-slate-950">
        {service.hero_image ? (
          <Image
            src={service.hero_image}
            alt={service.name}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-950" />
        )}
        <div className="absolute inset-0 bg-slate-950/72" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 md:px-16 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center rounded-full gap-1.5 bg-white/10 border border-white/15 text-white/80 px-3 py-1.5 text-xs font-semibold mb-5">
                <MapPin className="w-3 h-3" />
                {stateName}, Australia
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-5">
                Find trusted{" "}
                <span className="text-blue-400">{service.name}</span>
                <br />
                in {stateName}
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                {serviceDescription}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setOpenModal(true)}
                  className="inline-flex items-center rounded-xl gap-2 bg-[#2563EB] hover:bg-blue-500 text-white px-8 py-6 text-sm font-semibold shadow-none transition-colors"
                >
                  Get Free Quotes in {stateName}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Link
                  href={`/services/${serviceSlug}`}
                  className="inline-flex items-center rounded-xl gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-sm font-medium transition-colors"
                >
                  View all locations
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0 w-full md:w-auto">
              {[
                { value: `${cities.length}`, label: "Cities" },
                { value: "Free", label: "Quotes" },
                { value: "Local", label: "Providers" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/10 border border-white/15 px-5 py-4 text-center"
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
            { value: "Local pages", label: "by city" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-bold">{s.value}</span>
              <span className="text-blue-200 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <section className="py-8 md:py-12">
          {stateSlug && (
            <ServiceBreadcrumb
              service={{ name: service.name, slug: serviceSlug }}
              stateSlug={stateSlug}
              citySlug={null}
              subCitySlug={null}
              stateName={stateName}
            />
          )}
          <LocationAlphabetDirectory
            locations={cities}
            title={`${service.name} by suburb in ${stateName}`}
            eyebrow="Suburbs"
            description="Choose a suburb to find nearby providers."
            overviewHref={`/services/${serviceSlug}`}
            overviewLabel="View category overview"
            buildHref={(city) =>
              `/services/${serviceSlug}/${stateSlug}/${city.slug}`
            }
          />
        </section>

        <section className="py-12 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Compare {service.name} in {stateName}
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Taskoria helps you find {serviceNameLower} in {stateName}{" "}
                without calling around one by one. Tell us what you need, then
                compare quotes, profiles and reviews from available local
                providers.
              </p>
              <p>
                You can browse {serviceNameLower} providers across{" "}
                {topCitiesText}, or choose your city below to view a more
                specific local page.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LOCAL_SERVICE_POINTS.map((point) => (
                <div
                  key={point}
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {point}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Request {serviceNameLower} quotes in {stateName} for{" "}
                    {point.toLowerCase()}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-slate-100 dark:border-slate-800">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                What to include in your {service.name} request
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Add the property type, preferred timing, access details and
                  any important requirements so {stateName} providers can quote
                  accurately.
                </p>
                <p>
                  For larger jobs, include photos or measurements where helpful.
                  Clear details make it easier to compare prices, availability
                  and the scope each professional has included.
                </p>
              </div>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Popular {service.name.toLowerCase()} searches in {stateName}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li>{service.name} near me in {stateName}</li>
                <li>
                  Best {service.name.toLowerCase()} providers in {stateName}
                </li>
                <li>
                  Affordable {service.name.toLowerCase()} quotes in {stateName}
                </li>
                <li>
                  Local {service.name.toLowerCase()} professionals in{" "}
                  {topCitiesText}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <CityProviders
          serviceSlug={serviceSlug}
          serviceName={service.name}
          stateSlug={stateSlug}
          locationName={stateName}
          className="border-t border-slate-100 dark:border-slate-800"
        />

        <section className="py-12 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3  gap-8">
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
              <div key={s.step} className="flex gap-5 ">
                <div className="w-10 h-10 bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center rounded-full shrink-0">
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
        <section className="py-12 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
            Why choose Taskoria in {stateName}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              >
                <div className="shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {b.title === "Local to you"
                      ? `Providers are based in ${stateName} and know the area well.`
                      : b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {service.about && (
          <section className="py-14 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              About {service.name} in {stateName}
            </h2>
            <div
              className="prose dark:prose-invert max-w-none bg-white dark:bg-slate-900 p-6 md:p-8 border border-slate-100 dark:border-slate-800 prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-lg md:prose-h3:text-xl"
              dangerouslySetInnerHTML={{
                __html: normalizeServiceHtml(service.about),
              }}
            />
          </section>
        )}

        {service.faqs && service.faqs.length > 0 && (
          <section className="py-14 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {service.faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 ">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`}
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
              {service.name} in other states
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {otherStates.map((s) => (
                <Link
                  key={s.state_slug}
                  href={`/services/${serviceSlug}/${s.state_slug}`}
                  className="inline-flex items-center rounded-xl gap-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 px-4 py-2 text-sm font-medium transition-colors"
                >
                  <MapPin className="w-3 h-3 opacity-50" />
                  {s.state_name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className="bg-slate-950 text-white mt-6">
        <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to hire {service.name} in {stateName}?
            </h2>
            <p className="text-white/70 text-lg max-w-xl">
              Post your job once — receive quotes fast, compare providers, and
              book with confidence.
            </p>
          </div>
          <Button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center rounded-xl gap-2 bg-[#2563EB] hover:bg-blue-500 text-white px-10 py-5 text-lg font-bold shrink-0"
          >
            Get Free Quotes
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </aside>
    </main>
  );
}
