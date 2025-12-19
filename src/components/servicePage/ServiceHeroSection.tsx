"use client";

import { MapPin, BadgeCheck, Users, Star } from "lucide-react";
import LocationSearch from "@/components/Location/locationsearch";

interface HeroSectionProps {
  service: any;
  cityData: any;
  citySlug: string | null;
  onLocationSelect: (location: any) => void;
}

export default function ServiceHeroSection({ 
  service, 
  cityData, 
  citySlug, 
  onLocationSelect 
}: HeroSectionProps) {
  const title = citySlug 
    ? `${service.name} in ${cityData?.display_name || citySlug}`
    : service.name;

  const description = cityData?.description || service.description;

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#03070d] via-[#16364e] to-[#13404c] dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 opacity-95"></div>
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 dark:opacity-20"
        style={{ backgroundImage: `url(${service.hero_image})` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-15 md:py-14">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent drop-shadow-lg">
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
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-4 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-500 dark:from-indigo-500 dark:to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-xl">Get Started Now</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Free quotes in minutes • No commitment
                </p>
              </div>
            </div>
            <LocationSearch onSelect={onLocationSelect} />
          </div> 
        </div>
      </div>
    </section>
  );
}