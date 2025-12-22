"use client";

import Link from "next/link";
import { TrendingUp, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      image: "https://images.unsplash.com/photo-1609036394821-b63e8168dc64?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      activeProviders: 192,
      providers: [
        { name: "Expert Hands", rating: 4.9, logo: "🎯", completedJobs: 178 },
        { name: "Quality First", rating: 4.7, logo: "💼", completedJobs: 145 },
        { name: "Master Services", rating: 5.0, logo: "🌟", completedJobs: 201 }
      ]
    },
    {
      name: "Adelaide",
      image: "https://images.unsplash.com/photo-1702252212983-db7e428cc3cf?q=80&w=1880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      activeProviders: 156,
      providers: [
        { name: "Top Tier Pros", rating: 4.8, logo: "🔥", completedJobs: 134 },
        { name: "Swift Solutions", rating: 4.9, logo: "⚙️", completedJobs: 167 },
        { name: "Premier Group", rating: 4.7, logo: "💎", completedJobs: 142 }
      ]
    },
    {
      name: "Perth",
      image: "https://images.unsplash.com/photo-1574471101497-d958f6e3ebd4?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  const displayCities = cities.slice(0, 4);

  const router =useRouter();



  return (
    <div className="mb-20">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCities.map((city, index) => {
          const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
          const isCurrentCity = currentCity === citySlug;
          
          return (
            <Link
              key={city.name}
              href={`/services/${serviceSlug}/${citySlug}`}
              className={`group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border ${
                isCurrentCity 
                  ? 'border-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700' 
                  : 'border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700'
              } hover:-translate-y-2`}
            >
              <div className="relative h-52 overflow-hidden">
                <Image
              fill
                  src={popularCities[index]?.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                {isCurrentCity && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                    Current
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>{popularCities[index]?.activeProviders || 150}+ Active Providers</span>
                  </div>
                </div>
              </div>
            
            
              <div className="p-6">
              <div className="space-y-3 mb-5"> 
                    {popularCities[index]?.providers?.slice(0, 3).map((provider, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
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
                    
                <Button onClick={()=>router.push(`/${serviceSlug}/${city.name}`)} className="flex items-center justify-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-center font-semibold rounded-2xl group-hover:shadow-lg transition-all">
                  Search  {city.name}
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}