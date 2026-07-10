"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import ServiceHeroSection from "@/components/servicePage/ServiceHeroSection";
import Link from "next/link";
import SubHeroService from "./Subheroservice";
import ServiceBreadcrumb from "./Servicebreadcrumb";
import { normalizeServiceHtml } from "./normalizeServiceHtml";
import {
  getRankedCityServiceLinks,
  getRankedServiceLinks,
} from "@/lib/internal-links";


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

const PopularLocationsSection = dynamic(
  () => import("@/components/servicePage/PopularLocationSection"),
  {
    loading: () => null,
  }
);

const FAQSection = dynamic(() => import("@/components/servicePage/Faqs"), {
  loading: () => null,
});

const Howitwork = dynamic(
  () => import("@/components/servicePage/HowItWorks"),
  {
    loading: () => null,
  }
);

const WhyTaskoria = dynamic(
  () => import("@/components/servicePage/WhyTaskoria"),
  {
    loading: () => null,
  }
);

const StepWiseHowItWorks = dynamic(
  () => import("@/components/servicePage/3stepServiceSection"),
  {
    loading: () => null,
  }
);
const WhyBookByTaskoria = dynamic(
  () => import("@/components/servicePage/WhyBookByTaskoria"),
  {
    loading: () => null,
  }
)

const InternalLinkModule = dynamic(
  () => import("@/components/InternalLinkModule"),
  {
    loading: () => null,
  }
);

function toTitleCase(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getReadableLocationName(location: any, fallback?: string | null) {
  return (
    location?.name ??
    location?.display_name ??
    (fallback ? toTitleCase(fallback) : undefined)
  );
}

function getServiceDescription(
  service: any,
  serviceName: string,
  location?: string
) {
  const rawDescription = String(service.description ?? "").trim();

  if (rawDescription && !/across Australia/i.test(rawDescription)) {
    return rawDescription;
  }

  return location
    ? `Find trusted ${serviceName.toLowerCase()} professionals in ${location}. Compare local providers, request free quotes and choose the right pro for your job.`
    : `Find trusted ${serviceName.toLowerCase()} professionals across Australia. Compare providers, request free quotes and choose the right pro for your job.`;
}

interface ServicePageClientProps {
  service: any;
  cities: any[];
  rankedCategories?: {
    slug: string | null;
    name: string | null;
    rank: number | null;
    image_url?: string | null;
  }[];
  initialLocation: any;
  citySlug: string | null;
  stateSlug: string | null;
  subCitySlug: string | null;
}

export default function ServicePageClient({
  service,
  cities,
  rankedCategories,
  initialLocation,
  citySlug,
  stateSlug,
  subCitySlug,
}: ServicePageClientProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const handleSelectCategory = () => {
    setOpenModal(true);
  };

  const handleLocationSet = (location: any) => {
    setSelectedLocation(location);
    setOpenModal(true);
  };

  const cityName: string | undefined = getReadableLocationName(
    selectedLocation,
    citySlug
  );

  const subCityName: string | undefined = subCitySlug
    ? getReadableLocationName(
      selectedLocation?.subcities?.find((s: any) => s.slug === subCitySlug),
      subCitySlug
    )
    : undefined;

  const stateName: string | undefined =
    selectedLocation?.state_name ?? undefined;

  const activeCityName = subCityName ?? cityName;
  const locationLabel = activeCityName ?? stateName;
  const serviceNameLower = service.name.toLowerCase();
  const heroDescription = getServiceDescription(
    service,
    service.name,
    locationLabel
  );
  const relatedServiceLinks = useMemo(
    () =>
      citySlug
        ? getRankedCityServiceLinks(
          stateSlug ?? selectedLocation?.state_slug,
          subCitySlug ?? citySlug,
          rankedCategories,
          8,
          service.slug
        )
        : getRankedServiceLinks(rankedCategories, 8, service.slug),
    [
      citySlug,
      rankedCategories,
      selectedLocation?.state_slug,
      service.slug,
      stateSlug,
      subCitySlug,
    ]
  );
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {openModal && (
        <NewRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          presetCategory={service}
          presetLocation={selectedLocation}
          initialStep={selectedLocation ? 2 : 1}
        />
      )}

      <article itemScope itemType="https://schema.org/Service">
        <ServiceHeroSection
          service={{ ...service, description: heroDescription }}
          onLocationSelect={handleLocationSet}
          presetLocation={selectedLocation}
          locationName={activeCityName}
        />

        <section className="service-content-visibility max-w-6xl mx-auto px-5 md:px-6 py-3">
          {citySlug && (
            <ServiceBreadcrumb
              service={service}
              stateSlug={stateSlug}
              citySlug={citySlug}
              subCitySlug={subCitySlug}
              stateName={stateName}
              cityName={cityName}
              subCityName={subCityName}
            />
          )}
          {!citySlug && (
            <SubHeroService
              service={service}
              onPostJob={handleSelectCategory}
            />
          )}

          {!citySlug && (
            <StepWiseHowItWorks
              serviceName={service.name}
              serviceDetail={service.service_detail}
              onPostJob={handleSelectCategory}
            />
          )}
          {!citySlug && (
            <WhyBookByTaskoria
              serviceName={service.name}
              seo_service_details={service.seo_service_details}
            />
          )}
          {!citySlug && !stateSlug && (
            <CityProviders serviceSlug={service.slug} serviceName={service.name} />
          )}

          {citySlug && (
            <>
              <SubHeroService
                service={service}
                onPostJob={handleSelectCategory}
                presetLocation={selectedLocation}
                cityName={activeCityName}
              />

              <StepWiseHowItWorks
                serviceName={service.name}
                onPostJob={handleSelectCategory}
                cityName={activeCityName}
              />

              <CityProviders
                serviceSlug={service.slug}
                serviceName={service.name}
                stateSlug={stateSlug}
                citySlug={subCitySlug ?? citySlug}
                locationName={activeCityName}
              />


            </>
          )}

          {citySlug &&
            !subCitySlug &&
            selectedLocation?.subcities?.length > 0 && (
              <section className="mt-12">
                <div className="mb-6 flex flex-col gap-2">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white ">
                    Popular areas in {selectedLocation.name}
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                    Find trusted {service.name.toLowerCase()} professionals in
                    nearby areas. Choose your suburb to see local providers and
                    prices.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedLocation.subcities.map((sub: any) => (
                    <Link
                      key={sub.city_id}
                      href={`/services/${service.slug}/${stateSlug}/${citySlug}/${sub.slug}`}
                      className="group relative overflow-hidden border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="relative z-10">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white">
                          {sub.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          View local professionals
                        </p>
                        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                          Explore
                          <svg
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          {!citySlug && (
            <PopularLocationsSection
              serviceSlug={service.slug}
              cities={cities}
            />
          )}

          <InternalLinkModule
            eyebrow="Related pages"
            title={
              locationLabel
                ? `Explore services in ${locationLabel}`
                : "Related services"
            }
            description={
              locationLabel
                ? `Find other priority services available near ${locationLabel}.`
                : "Browse other popular service categories on Taskoria."
            }
            groups={[
              {
                title: locationLabel
                  ? `Related services in ${locationLabel}`
                  : "Related priority services",
                links: relatedServiceLinks,
                variant: "service-cards",
              },
            ]}
          />

          {!citySlug && <WhyTaskoria serviceName={service.slug} />}

          {service.about && (
            <section className="border border-slate-100 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900 mb-14">
              <div
                className="prose max-w-none prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-lg md:prose-h3:text-xl"
                dangerouslySetInnerHTML={{
                  __html: normalizeServiceHtml(service.about),
                }}
              />
            </section>
          )}

          {locationLabel && (
            <section className="bg-white dark:bg-slate-900 p-6 md:p-8 border border-slate-100 dark:border-slate-800 mb-14">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Compare {service.name} in {locationLabel}
              </h2>
              <div className="space-y-5 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Taskoria helps customers find {serviceNameLower} in{" "}
                  {locationLabel}
                  {stateName && activeCityName
                    ? ` and nearby ${stateName}.`
                    : "."}{" "}
                  Share the job once and compare responses from professionals who
                  can handle the work in your area.
                </p>
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Local availability
                    </h3>
                    <p className="mt-2">
                      Check which {serviceNameLower} providers service{" "}
                      {locationLabel}, compare profiles and see who is available
                      for your timing.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Clear quotes
                    </h3>
                    <p className="mt-2">
                      Request quotes that reflect the job size, access, timing,
                      materials and any special requirements before you book.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Free to compare
                    </h3>
                    <p className="mt-2">
                      Post your task for free, ask follow-up questions and
                      choose the {serviceNameLower} professional that fits your
                      job.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!citySlug && (
            <Howitwork
              servicedetails={service?.service_detail}
              onpostjob={handleSelectCategory}
            />
          )}
          {service.faqs && service.faqs.length > 0 && (
            <FAQSection faqs={service.faqs} />
          )}
        </section>
      </article>
      <aside className="bg-slate-950 text-white p-8">
        <div className="flex max-w-7xl mx-auto flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Ready to get {service.name} done
              {activeCityName ? ` in ${activeCityName}` : ""}?
            </h2>
            <p className="text-base md:text-lg text-white/80">
              Post your job once—receive quotes fast, compare providers, and
              book with confidence.
            </p>
          </div>
          <Button
            onClick={handleSelectCategory}
            className="inline-flex bg-[#2563EB] items-center gap-2 rounded-lg px-8 py-4 text-sm md:text-base font-semibold"
            aria-label={`Get free quotes for ${service.name}`}
          >
            Get Free Quotes
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </aside>
    </main>
  );
}
