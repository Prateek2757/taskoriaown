"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import ServiceHeroSection from "@/components/servicePage/ServiceHeroSection";
import PopularLocationsSection from "@/components/servicePage/PopularLocationSection";
import FAQSection from "@/components/servicePage/Faqs";
import Howitwork from "@/components/servicePage/HowItWorks";
import Link from "next/link";
import SubHeroService from "./Subheroservice";
import WhyTaskoria from "./WhyTaskoria";
import StepWiseHowItWorks from "./3stepServiceSection";
import ServiceBreadcrumb from "./Servicebreadcrumb";
import { normalizeServiceHtml } from "./normalizeServiceHtml";

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

interface ServicePageClientProps {
  service: any;
  cities: any[];
  initialLocation: any;
  citySlug: string | null;
  stateSlug: string | null;
  subCitySlug: string | null;
}

export default function ServicePageClient({
  service,
  cities,
  initialLocation,
  citySlug,
  stateSlug,
  subCitySlug,
}: ServicePageClientProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(service);

  const handleSelectCategory = () => {
    setSelectedCategory(service);
    setOpenModal(true);
  };

  const handleLocationSet = (location: any) => {
    setSelectedLocation(location);
    setSelectedCategory(service);
    setOpenModal(true);
  };

  // console.log(selectedLocation,"slecterd");
  // console.log(initialLocation);

  const cityName: string | undefined = citySlug ?? undefined;

  const subCityName: string | undefined = subCitySlug
    ? (selectedLocation?.subcities?.find((s: any) => s.slug === subCitySlug)
        ?.name ?? subCitySlug)
    : undefined;

  const stateName: string | undefined =
    selectedLocation?.state_name ?? undefined;

  const activeCityName = subCityName ?? cityName;
  const locationLabel = activeCityName ?? stateName;
  // console.log(service,stateSlug,citySlug,subCitySlug,stateName,cityName,subCityName,"citynames ");

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {openModal && (
        <NewRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          presetCategory={selectedCategory}
          presetLocation={selectedLocation}
          initialStep={selectedLocation ? 2 : 1}
        />
      )}

      <article itemScope itemType="https://schema.org/Service">
        <ServiceHeroSection
          service={service}
          onLocationSelect={handleLocationSet}
          presetLocation={selectedLocation}
          locationName={activeCityName}
        />

        <section className="max-w-6xl mx-auto px-5 md:px-6 py-3">
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
              onPostJob={handleSelectCategory}
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
                  <p className="text-slate-600 max-w-2xl">
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
          {!citySlug && <WhyTaskoria serviceName={service.slug} />}

          {service.about && (
            <section className="border border-slate-100 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900 mb-14">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: normalizeServiceHtml(service.about),
                }}
              />
            </section>
          )}

          {locationLabel && (
            <section className="bg-white dark:bg-slate-900 p-6 md:p-8 border border-slate-100 dark:border-slate-800 mb-14">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Local {service.name} help in {locationLabel}
              </h2>
              <div className="grid gap-5 md:grid-cols-3 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Taskoria matches your {service.name.toLowerCase()} request
                  with professionals who serve {locationLabel}
                  {stateName && activeCityName ? ` and nearby ${stateName} areas` : ""}.
                  Share the job details once, then compare responses before you
                  decide who to contact.
                </p>
                <p>
                  Use the city and suburb pages to narrow your search, check
                  provider availability, and request quotes that reflect the
                  work, access, timing, and materials involved in your project.
                </p>
                <p>
                  The process is free for customers: post your task, review
                  local providers, ask follow-up questions, and book when you
                  are comfortable with the scope and price.
                </p>
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
            <p className="text-lg text-white/80">
              Post your job once—receive quotes fast, compare providers, and
              book with confidence.
            </p>
          </div>
          <Button
            onClick={handleSelectCategory}
            className="inline-flex bg-[#2563EB] items-center gap-2 rounded-lg -8 py-4 text-xs text-lg font-semibold"
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
