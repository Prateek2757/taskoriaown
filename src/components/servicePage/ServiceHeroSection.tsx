"use client";

import { ChevronRight, MapPin, Users } from "lucide-react";
import LocationSearch from "@/components/Location/locationsearch";
import Link from "next/link";

interface HeroSectionProps {
  service: any;
  cityData?: any;
  citySlug?: string | null;
  onLocationSelect: (location: any) => void;
  presetLocation: any;
}

export default function ServiceHeroSection({
  service,
  cityData,
  citySlug,
  onLocationSelect,
  presetLocation,
}: HeroSectionProps) {
  const title = citySlug
    ? `${service.name} in ${cityData?.display_name || citySlug}`
    : service.name;

  const description = cityData?.description || service.description;

  return (
    <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 dark:opacity-20"
        style={{ backgroundImage: `url(${service.hero_image})` }}
      /> */}
      
      <nav className="flex items-center gap-2 text-xs text-white/50 mb-7 flex-wrap">
            <Link  href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/services" className="hover:text-white/80 transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            {/* <Link href={`/services/${serviceSlug}`} className="hover:text-white/80 transition-colors">
              {service.name}
            </Link> */}
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            {/* <span className="text-white/80 font-medium">{stateName}</span> */}
          </nav>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-10">
      {/* <nav className="flex items-center gap-2 text-xs text-white/50 mb-7 flex-wrap">
            <Link  href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/services" className="hover:text-white/80 transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href={`/services/${service.slug}`} className="hover:text-white/80 transition-colors">
              {service.name}
            </Link>
          </nav> */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="bg-[#3C7DED] bg-clip-text text-transparent drop-shadow-lg">
              {title}
            </span>
            <span className="block mt-3 text-2xl md:text-2xl font-medium text-white/90">
              Made Simple & Fast
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/80 leading-relaxed">
            {description}
          </p>

          {cityData && (
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">
                  {cityData.activeProviders || 150}+ Local Providers
                </span>
              </div>
              {cityData.average_price && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-sm font-medium text-white">
                    Avg: {cityData.average_price}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-3xl shadow-2xl p-4 md:p-3 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-blue-500 dark:from-indigo-500 dark:to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                  Get Started Now
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Free quotes in minutes • No commitment
                </p>
              </div>
            </div>
            <LocationSearch
              onSelect={onLocationSelect}
              presetLocation={presetLocation}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
