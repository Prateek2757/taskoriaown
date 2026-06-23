"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { useState, useRef, useCallback } from "react";

interface PopularLocationsSectionProps {
  cities: City[];
  serviceSlug: string;
  currentCity?: string | null;
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
  slug?: string;
  state_slug?: string;
  state_name?: string;
  name?: string;
  image?: string;
  image_url?: string | null;
  providers?: CityProvider[];
  activeProviders?: number;
  description?: string;
  city_description?: string | null;
}

export default function PopularLocationsSection({
  cities,
  serviceSlug,
  currentCity,
}: PopularLocationsSectionProps) {
  const validCities = cities.filter((city) => city.slug && city.state_slug);
  const displayCities = validCities.slice(0, 30);
  const additionalCities = validCities.slice(30, 40);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const totalPages = Math.ceil(displayCities.length / 3);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      if (!displayCities.length) return;

      const cardWidth = container.scrollWidth / displayCities.length;
      const scrollPosition = index * cardWidth * 3;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    },
    [displayCities.length]
  );

  const handlePrevious = () => {
    if (totalPages <= 1) return;

    const newIndex = currentIndex === 0 ? totalPages - 1 : currentIndex - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    if (totalPages <= 1) return;

    const newIndex = currentIndex === totalPages - 1 ? 0 : currentIndex + 1;
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current || isDragging) return;

    const container = scrollContainerRef.current;
    if (!displayCities.length) return;

    const cardWidth = container.scrollWidth / displayCities.length;
    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth * 3));

    if (newIndex !== currentIndex) {
      setCurrentIndex(Math.min(newIndex, totalPages - 1));
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="mb-8 mt-5 max-w-7xl mx-auto relative ">
      <div className="text-center mb-8">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          POPULAR LOCATIONS
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-[#2563EB] mb-2">
          Find Providers Near You
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Thousands of verified professionals across Australia
        </p>
      </div>

      <div className="relative group lg:-mx-14  lg:px-12">
        <button
          onClick={handlePrevious}
          className="absolute -left-2 top-1/2  max-lg:hidden -translate-y-10 z-10 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center opacity-100 hover:bg-gray-50 dark:hover:bg-slate-700 -translate-x-1/2 border border-gray-200 dark:border-slate-600"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleNext}
          className="absolute max-lg:hidden right-0 top-1/2 -translate-y-10 z-10 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-slate-700 translate-x-1/2 border border-gray-200 dark:border-slate-600"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            className="flex gap-5 pb-1 mx-4 "
            style={{ width: "max-content" }}
          >
            {displayCities.map((city) => {
              const citySlug =
                city.slug ?? city.name?.toLowerCase().replace(/\s+/g, "-");
              const isCurrentCity = currentCity === citySlug;
              return (
                <Link
                  href={`/services/${serviceSlug}/${city.state_slug}/${city.slug}`}
                  key={`${city.state_slug}-${city.slug}`}
                  className="snap-start shrink-0"
                  style={{
                    width: "calc((100vw - 8rem) / 3)",
                    minWidth: "300px",
                    maxWidth: "330px",
                  }}
                >
                  <article
                    className={`h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border ${
                      isCurrentCity
                        ? "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
                        : "border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700"
                    } hover:translate-y-1`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        title="Location Image"
                        fill
                        src={city.image_url || "/location.jpg"}
                        alt={`${city.name ?? "Location"} service location`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      {isCurrentCity && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                          Current
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 pr-11">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {city.name}
                        </h3>
                        <p className="line-clamp-2 text-xs text-slate-200">
                          {city.city_description ||
                            `Find trusted local providers in ${city.name}.`}
                        </p>

                        <div className="h-8 w-8 rounded-full bg-[#2563EB] absolute bottom-0 -translate-y-1 right-1">
                          <FaArrowRightLong
                            className="absolute bottom-0 -translate-y-2 right-2"
                            color="white"
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                scrollToIndex(index);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-blue-600 dark:bg-blue-500"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {additionalCities.length > 0 && (
        <div className="mt-7 rounded-xl  p-4  dark:border-slate-700 dark:bg-slate-900 sm:p-5">
          <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                More service areas
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Explore nearby locations
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick links to more city pages for this service.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {additionalCities.map((city, index) => {
              const isCurrentCity = currentCity === city.slug;
              const imageUrl = city.image_url || "/location.jpg";

              return (
                <>
                  <Link
                    key={`${city.state_slug}-${city.slug}-more-link`}
                    href={`/services/${serviceSlug}/${city.state_slug}/${city.slug}`}
                    className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-colors hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      isCurrentCity
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

                    <div className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {city.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {city.state_name}
                      </span>
                    </div>
                  </Link>
                </>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
