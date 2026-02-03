"use client";

import Link from "next/link";
import { TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

interface PopularLocationsSectionProps {
  cities: any[];
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
  slug?:string
  name?: string;
  image?: string;
  providers?: CityProvider[];
  activeProviders?: number;
}

const popularCityImages = [
  "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1609036394821-b63e8168dc64?q=80&w=1548&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1702252212983-db7e428cc3cf?q=80&w=1880&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574471101497-d958f6e3ebd4?q=80&w=1548&auto=format&fit=crop"
];

const popularCities: City[] = [
  {
    name: "Sydney",
    image: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800&h=600&fit=crop",
    activeProviders: 248,
    providers: [
      { name: "Elite Home Services", rating: 4.9, logo: "🏆", completedJobs: 156 },
      { name: "Pro Solutions Co", rating: 4.8, logo: "⚡", completedJobs: 203 },
      { name: "Premium Care", rating: 5.0, logo: "✨", completedJobs: 189 }
    ]
  },
  {
    name: "Melbourne",
    image: "https://images.unsplash.com/photo-1609036394821-b63e8168dc64?q=80&w=1548&auto=format&fit=crop",
    activeProviders: 192,
    providers: [
      { name: "Expert Hands", rating: 4.9, logo: "🎯", completedJobs: 178 },
      { name: "Quality First", rating: 4.7, logo: "💼", completedJobs: 145 },
      { name: "Master Services", rating: 5.0, logo: "🌟", completedJobs: 201 }
    ]
  },
  {
    name: "Adelaide",
    image: "https://images.unsplash.com/photo-1702252212983-db7e428cc3cf?q=80&w=1880&auto=format&fit=crop",
    activeProviders: 156,
    providers: [
      { name: "Top Tier Pros", rating: 4.8, logo: "🔥", completedJobs: 134 },
      { name: "Swift Solutions", rating: 4.9, logo: "⚙️", completedJobs: 167 },
      { name: "Premier Group", rating: 4.7, logo: "💎", completedJobs: 142 }
    ]
  },
  {
    name: "Perth",
    image: "https://images.unsplash.com/photo-1574471101497-d958f6e3ebd4?q=80&w=1548&auto=format&fit=crop",
    activeProviders: 134,
    providers: [
      { name: "Ocean City Services", rating: 4.9, logo: "🌊", completedJobs: 112 },
      { name: "Sunrise Experts", rating: 4.8, logo: "☀️", completedJobs: 98 },
      { name: "West Coast Pros", rating: 5.0, logo: "🏖️", completedJobs: 156 }
    ]
  }
];

export default function PopularLocationsSection({ 
  cities, 
  serviceSlug, 
  currentCity 
}: PopularLocationsSectionProps) {
  const displayCities = cities.slice(0, 30);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalPages = Math.ceil(displayCities.length / 3);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.scrollWidth / displayCities.length;
    const scrollPosition = index * cardWidth * 3;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  }, [displayCities.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    const newIndex = currentIndex === 0 ? totalPages - 1 : currentIndex - 1;
    scrollToIndex(newIndex); 
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    const newIndex = currentIndex === totalPages - 1 ? 0 : currentIndex + 1;
    scrollToIndex(newIndex);
  };

  // useEffect(() => {
  //   if (!isAutoPlaying) return;

  //   autoPlayRef.current = setInterval(() => {
  //     setCurrentIndex(prev => {
  //       const newIndex = prev === totalPages - 1 ? 0 : prev + 1;
  //       scrollToIndex(newIndex);
  //       return newIndex;
  //     });
  //   }, 5000);

  //   return () => {
  //     if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  //   };
  // }, [isAutoPlaying, totalPages, scrollToIndex]);

  const handleScroll = () => {
    if (!scrollContainerRef.current || isDragging) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.scrollWidth / displayCities.length;
    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth * 3));
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(Math.min(newIndex, totalPages - 1));
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="mb-20 relative">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold rounded-full text-sm mb-4">
          POPULAR LOCATIONS
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Find Providers Near You
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Thousands of verified professionals across Australia
        </p>
      </div>

      <div className="relative group">
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center opacity-100 hover:bg-gray-50 dark:hover:bg-slate-700 -translate-x-1/2 border border-gray-200 dark:border-slate-600"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-slate-700 translate-x-1/2 border border-gray-200 dark:border-slate-600"
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
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-6 px-1 pb-2" style={{ width: 'max-content' }}>
            {displayCities.map((city, index) => {
              const citySlug = city.city_name.toLowerCase().replace(/\s+/g, '-');
              const isCurrentCity = currentCity === citySlug;
              
              return (
                <div
                  key={city.display_name}
                  className="snap-start flex-shrink-0"
                  style={{ width: 'calc((100vw - 8rem) / 3)', minWidth: '300px', maxWidth: '350px' }}
                >
                  <Link
                    href={`/services/${serviceSlug}/${citySlug}`}
                    className={`block h-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border ${
                      isCurrentCity 
                        ? 'border-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700' 
                        : 'border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700'
                    } hover:-translate-y-2`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        fill
                        src={popularCities[index % popularCities.length]?.image}
                        alt={city.city_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      {isCurrentCity && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                          Current
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{city.city_name}</h3>
                        {/* <div className="flex items-center gap-2 text-white/90 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>{popularCities[index % popularCities.length]?.activeProviders || 150}+ Active Providers</span>
                        </div> */}
                      </div>
                    </div>
                  
                    <div className="p-6">
                      <div className="space-y-3 mb-5"> 
                        {popularCities[index % popularCities.length]?.providers?.slice(0, 3).map((provider, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                              {provider.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{provider.name}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">{provider.rating}</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{provider.completedJobs} jobs</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                        
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/services/${serviceSlug}/${city.state_slug}/${city.slug}`);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-blue-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all"
                      >
                        Search {city.city_name}
                      </Button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                scrollToIndex(index);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-indigo-600 dark:bg-indigo-500'
                  : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}