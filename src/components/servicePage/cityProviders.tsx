"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Provider {
  user_id: number;
  name: string;
  public_id?: string;
  image: string | null;
  avg_rating: number | null;
  total_reviews: number;
  nationwide: boolean;
  company_name: string | null;
  logo_url: string | null;
  company_slug?:string | null;
  locationname: string | null;
}

interface Props {
  serviceSlug: string;
  citySlug: string;
}

export default function CityProviders({ serviceSlug, citySlug }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/service-city-providers/${serviceSlug}/${citySlug}`)
      .then((res) => res.json())
      .then(setProviders)
      .finally(() => setLoading(false));
  }, [serviceSlug, citySlug]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-slate-800 h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!providers.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Professionals are coming soon to {citySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          We're expanding quickly and trusted experts will be available in your area very soon.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-slate-600 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
        >
          Browse Popular Services
        </Link>
      </div>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Top {serviceSlug.replace(/-/g, " ")} providers in{" "}
        {citySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </h2>

      <div className="grid md:grid-cols-3 gap-5">
        {providers.map((p) => (
          <div
            key={p.user_id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow"
          >
            {/* Provider header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={p.image || "/avatar-placeholder.png"}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-slate-600"
                alt={p.name}
              />
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
                  {p.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {p.avg_rating ? Number(p.avg_rating).toFixed(1) : "New"}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({p.total_reviews} {p.total_reviews === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-2 mb-4">
              {p.nationwide && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-medium">Nationwide Provider</span>
                </div>
              )}
              {p.locationname && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{p.locationname}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              href={`/providerprofile/${p.company_slug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#3C7DED] hover:bg-[#2b6ad9] text-white font-semibold rounded-lg text-sm transition-colors"
            >
              View Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
