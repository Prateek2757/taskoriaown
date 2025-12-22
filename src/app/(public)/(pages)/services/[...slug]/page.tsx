"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLeadProfile } from "@/hooks/useLeadProfile";
import NewRequestModal from "@/components/leads/RequestModal";
import { Button } from "@/components/ui/button";
import HowItWorksSection from "@/components/servicePage/HowItWorks";
import ServiceHeroSection from "@/components/servicePage/ServiceHeroSection";
import PopularLocationsSection from "@/components/servicePage/PopularLocationSection";
import FAQSection from "@/components/servicePage/Faqs";
import CityProviders from "@/components/servicePage/cityProviders";
import CityStats from "@/components/servicePage/cityStats";
import ServiceIntro from "@/components/servicePage/IntroSection";

type Props = {
  params: { slug: string[] };
};



interface ServiceData {
  category_id: number;
  name: string;
  description?: string;
  hero_image?: string;
  about?: string;
  whats_included?: string[];
  add_ons?: string[];
  faqs?: { question: string; answer: string }[];
  slug?: string;
}

interface CityProvider {
  name: string;
  rating: number;
  logo: string;
  completedJobs: number;
}

interface City {
  city_id?: number;
  display_name?: string;
  city?: string;
  name?: string;
  image?: string;
  providers?: CityProvider[];
  activeProviders?: number;
}



export default function ServicePage() {
  const { cities, loading: citiesLoading } = useLeadProfile();
  const [openModal, setOpenModal] = useState(false);

  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug || ""];
  const serviceSlug = slug[0];
  const citySlug = slug[1] || null;
  
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<City | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceData | null>(null);

  useEffect(() => {
    async function fetchCityData() {
      if (!citySlug || citiesLoading) return;

      try {
        const matchedCity = cities?.find(
          (city) => 
            city.name?.toLowerCase().replace(/\s+/g, '-') === citySlug.toLowerCase() 
        );

        if (matchedCity) {
          setSelectedLocation(matchedCity);
          return;
        }

       
      } catch (error) {
        console.error("Failed to fetch city data:", error);
      }
    }

    fetchCityData();
  }, [citySlug, cities, citiesLoading]);

  useEffect(() => {
    async function fetchService() {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories/${serviceSlug}`);
        if (res.ok) {
          const data = await res.json();
          setService(data);
        } else {
          setService(null);
        }
      } catch (error) {
        console.error("Failed to fetch service:", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    
    if (serviceSlug) {
      fetchService();
    }
  }, [serviceSlug]);

  const handleSelectCategory = () => {
    setSelectedCategory(service);
    setOpenModal(true);
  };

  const handleLocationSet = (location: City) => {
    setSelectedLocation(location);
    setSelectedCategory(service);
    setOpenModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Loading amazing service...
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Oops! Service Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We couldn't find what you're looking for.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105"
          >
            Explore All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    title:service.name,
    provider: { "@type": "Organization", name: "Taskoria" },
    areaServed: citySlug ? selectedLocation?.city || "AU" : "AU",
    description: service.description,
    serviceType: service.name,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
    url: `/services/${service.slug}${citySlug ? `/${citySlug}` : ''}`,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900/95 dark:to-indigo-950/30">
      <NewRequestModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        presetCategory={selectedCategory}
        presetLocation={selectedLocation}
        initialStep={selectedLocation ? 2 : 1}
      />
      <ServiceHeroSection
        service={service}
        onLocationSelect={handleLocationSet}
        presetLocation={selectedLocation}
      />
      {citySlug && (
        <ServiceIntro serviceName={serviceSlug} cityName={citySlug} />
      )}

      <section className="max-w-6xl mx-auto px-6 py-10">
        {!citySlug && <HowItWorksSection />}
        
        {citySlug && (
          <>
            {/* <CityStats serviceName={service.name} /> */}
            <CityProviders serviceSlug={serviceSlug} citySlug={citySlug} />
          </>
        )}
        
        {!citySlug && (
          <PopularLocationsSection serviceSlug={serviceSlug} cities={cities} />
        )}

        {service.about && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 md:p-12 shadow-lg mb-20 border border-gray-100 dark:border-slate-700">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-headings:font-bold"
              dangerouslySetInnerHTML={{ __html: service.about }}
            />
          </div>
        )}

        {!citySlug && service.faqs && service.faqs.length > 0 && (
          <FAQSection faqs={service.faqs} />
        )}

        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-800 dark:via-indigo-800 dark:to-slate-800 text-white p-8 md:p-12 shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">
                Ready to get {service.name} done?
              </h3>
              <p className="text-lg text-white/80">
                Post your job once—receive quotes fast, compare providers, and
                book with confidence.
              </p>
            </div>
            <Button
              onClick={handleSelectCategory}
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold bg-white text-slate-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105 whitespace-nowrap"
            >
              Get Free Quotes
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Script
        id="json-ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}