"use client";

import { MapPin, Users } from "lucide-react";
import LocationSearch from "@/components/Location/locationsearch";
import Image from "next/image";
import { ServicesBadges } from "./ServicesBagdes";
import { TrustBadges } from "../TrustBadges";

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
    <section className="relative max-w-6xl mx-auto py-6  ">
      <section className="relative overflow-hidden max-h-175 bg-slate-950  rounded-2xl ">
        <Image
          src={service.service_image_url}
          alt={service.name}
          fill
          priority
          className="absolute inset-0 object-cover  "
        />
        <div className="absolute inset-0 bg-linear-to-r  from-black/40 to-transparent  " />

        {/* <nav className="flex items-center gap-2 text-xs text-white/50 mb-7 flex-wrap">
        <Link href="/" className="hover:text-white/80 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link
          href="/services"
          className="hover:text-white/80 transition-colors"
        >
          Services
        </Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link href={`/services/${serviceSlug}`} className="hover:text-white/80 transition-colors">
              {service.name}
            </Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="text-white/80 font-medium">{stateName}</span>
      </nav> */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12  ">
          {/* <nav className="flex items-center gap-2 text-xs text-white/50 mb-7 flex-wrap">
            <Link  href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/services" className="hover:text-white/80 transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href={`/services/${service.slug}`} className="hover:text-white/80 transition-colors">
              {service.name}
            </Link>
          </nav> */}
          <div className="text-left mb-4">
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
              <span className="text-white bg-clip-text  drop-shadow-lg">
                {title}
              </span>
              <span className="block text-xl md:text-2xl font-medium text-white mt-3">
                Made Simple & Fast
              </span>
            </h1>

            <p className=" text-sm md:text-base max-w-3xl text-white/80 leading-relaxed text-left">
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

          <div className="max-w-xl mb-4">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-3xl shadow-2xl p-4 md:p-3 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2563EB] dark:text-white text-xl">
                    Get Started Now
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Free quotes in minutes • No commitment
                  </p>
                </div>
              </div>
              <div className="z-50">
              <LocationSearch
                onSelect={onLocationSelect}
                presetLocation={presetLocation}
              />
              </div>
             
            </div>
          </div>
          {/* <div className="absolute bottom-0 right-0 hidden md:block">
            <ServicesBadges />
          </div> */}
        </div>
      </section>
    </section>
  );
}
