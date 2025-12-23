"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NewRequestModal from "@/components/leads/RequestModal";
import { Button } from "@/components/ui/button";
import HowItWorksSection from "@/components/servicePage/HowItWorks";
import ServiceHeroSection from "@/components/servicePage/ServiceHeroSection";
import PopularLocationsSection from "@/components/servicePage/PopularLocationSection";
import FAQSection from "@/components/servicePage/Faqs";
import CityProviders from "@/components/servicePage/cityProviders";
import ServiceIntro from "@/components/servicePage/IntroSection";

interface ServicePageClientProps {
  service: any;
  cities: any[];
  initialLocation: any;
  citySlug: string | null;
}

export default function ServicePageClient({
  service,
  cities,
  initialLocation,
  citySlug,
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
          <ServiceIntro serviceName={service.slug} cityName={citySlug} />
        )}

        <section className="max-w-6xl mx-auto px-6 py-10">
          {!citySlug && <HowItWorksSection />}

          {citySlug && (
            <CityProviders serviceSlug={service.slug} citySlug={citySlug} />
          )}

          {!citySlug && (
            <PopularLocationsSection serviceSlug={service.slug} cities={cities} />
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