"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import NewRequestModal from "@/components/leads/RequestModal";
import { Button } from "@/components/ui/button";
import ServiceHeroSection from "@/components/servicePage/ServiceHeroSection";
import PopularLocationsSection from "@/components/servicePage/PopularLocationSection";
import FAQSection from "@/components/servicePage/Faqs";
import CityProviders from "@/components/servicePage/cityProviders";
import ServiceIntro from "@/components/servicePage/IntroSection";
import Howitwork from "@/components/servicePage/HowItWorks";
import Link from "next/link";

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900/95 dark:to-indigo-950/30">
      <NewRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        presetCategory={selectedCategory}
        presetLocation={selectedLocation}
        initialStep={selectedLocation ? 2 : 1}
      />

      <article itemScope itemType="https://schema.org/Service">
        <ServiceHeroSection
          service={service}
          onLocationSelect={handleLocationSet}
          presetLocation={selectedLocation}
        />

        {citySlug && (
          <ServiceIntro
            serviceName={service.slug}
            cityName={subCitySlug ?? citySlug}
          />
        )}

        <section className="max-w-6xl mx-auto px-6 py-3">
          {!citySlug && <Howitwork servicedetails={service?.service_detail} />}

          {citySlug && (
            <CityProviders
              serviceSlug={service.slug}
              citySlug={subCitySlug ?? citySlug}
            />
          )}
   
          {citySlug &&
            !subCitySlug &&
            selectedLocation?.subcities?.length > 0 && (
              <section className="mt-14 m-4">
                <div className="mb-6 flex flex-col gap-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Popular areas in {selectedLocation.name}
                  </h2>
                  <p className="text-slate-600 max-w-2xl">
                    Find trusted {service.name.toLowerCase()} professionals in
                    nearby areas. Choose your suburb to see local providers and
                    prices.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedLocation.subcities.map((sub: any) => (
                    <Link
                      key={sub.city_id}
                      href={`/services/${service.slug}/${stateSlug}/${citySlug}/${sub.slug}`}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-700">
                          {sub.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          View local professionals
                        </p>

                        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
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

          {service.about && (
            <section className="bg-white rounded-3xl p-10 shadow-lg mb-20">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: service.about }}
              />
            </section>
          )}

          {!citySlug && service.faqs && service.faqs.length > 0 && (
            <FAQSection faqs={service.faqs} />
          )}

          <aside className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Ready to get {service.name} done?
                </h2>
                <p className="text-lg text-white/80">
                  Post your job once—receive quotes fast, compare providers, and
                  book with confidence.
                </p>
              </div>
              <Button
                onClick={handleSelectCategory}
                className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold"
                aria-label={`Get free quotes for ${service.name}`}
              >
                Get Free Quotes
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
}
