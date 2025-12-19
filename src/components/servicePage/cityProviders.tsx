"use client";

import { Star, Award, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CityProvidersProps {
  cityData: any;
  serviceSlug: string;
  citySlug: string;
}

export default function CityProviders({  serviceSlug, citySlug }: CityProvidersProps) {
  // Mock providers - in production, fetch from API
  const providers =  [
    {
      id: 1,
      name: "Elite Professional Services",
      logo: "🏆",
      rating: 4.9,
      reviews: 156,
      completedJobs: 203,
      description: "Expert professionals with 10+ years experience",
      badges: ["Top Rated", "Quick Response"]
    },
    {
      id: 2,
      name: "Premium Local Experts",
      logo: "⚡",
      rating: 5.0,
      reviews: 89,
      completedJobs: 145,
      description: "Certified specialists serving your area",
      badges: ["Verified", "Same Day"]
    },
    {
      id: 3,
      name: "Quality Service Co",
      logo: "✨",
      rating: 4.8,
      reviews: 234,
      completedJobs: 312,
      description: "Trusted by hundreds of happy customers",
      badges: ["Top Rated", "Licensed"]
    }
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold rounded-full text-sm mb-4">
          POPULAR PROVIDERS
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Top-Rated Providers
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Connect with the best professionals in your area
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                {provider.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                  {provider.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">
                      {provider.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">({provider.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {provider.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {provider.badges.map((badge, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {provider.completedJobs} jobs completed
              </span>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href={`/providers`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
        >
          View All Providers
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}