"use client";

import { MapPin, Clock, DollarSign, TrendingUp, Star, Users, Award } from "lucide-react";

interface CitySpecificContentProps {
  service: any;
  cityData: any;
  citySlug: string;
}

export default function CitySpecificContent({
  service,
  cityData,
  citySlug,
}: CitySpecificContentProps) {
  return (
    <div className="mb-20">
      <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:from-slate-800 dark:to-indigo-900/20 rounded-3xl p-8 md:p-10 shadow-lg border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Need to find {service.name} in {cityData.display_name}?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Local insights and verified providers
            </p>
          </div>
        </div>

        {cityData.description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {cityData.description}
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Providers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {cityData.active_providers || 150}+
                </p>
              </div>
            </div>
          </div>

          {cityData.average_price && (
            <div className="bg-white dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {cityData.average_price}
                  </p>
                </div>
              </div>
            </div>
          )}

          {cityData.response_time && (
            <div className="bg-white dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {cityData.response_time}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {cityData.top_services && cityData.top_services.length > 0 && (
          <div className="bg-white/50 dark:bg-slate-700/30 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-600/50">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Popular Services in {cityData.display_name}
            </h3>
            <div className="flex flex-wrap gap-3">
              {cityData.top_services.map((service: string, i: number) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors cursor-default"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
