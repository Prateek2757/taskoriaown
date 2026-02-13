"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface Provider {
  user_id: number;
  name: string;
  public_id?:string;
  image: string | null;
  avg_rating: number | null;
  total_reviews: number;
  nationwide: boolean;
  company_name: string | null;
  logo_url: string | null;
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
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 h-40 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!providers.length) {
    return (
      <div className="text-center m-6 ">
      <h2 className="text-2xl font-bold mb-3">
  Professionals are coming soon to {citySlug}
</h2>
<p className="text-gray-500 max-w-xl mx-auto">
  We’re expanding quickly and trusted experts will be available in your area very soon.
</p>
        <div className="mt-8 flex justify-center gap-4">
          {/* <Link
            href={`/post-task`}
            className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Post a Task
          </Link> */}

          <Link
            href={`/services`}
            className="px-6 py-3 rounded-full border font-semibold"
          >
            Browse Popular Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-24">
      <h2 className="text-2xl font-bold mb-6">
        Top {serviceSlug.replace("-", " ")} providers in {citySlug}
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div
            key={p.user_id}
            className="group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.image || "/avatar-placeholder.png"}
                className="w-14 h-14 rounded-full object-cover"
                alt={p.name}
              />

              <div>
                <h3 className="font-bold text-lg group-hover:text-indigo-600">
                  {p.name}
                </h3>

                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {p.avg_rating || "New"} ({p.total_reviews})
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-500">
              {p.nationwide && (
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                  Nationwide Provider
                </div>
              )}

              {p.locationname && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {p.locationname}
                </div>
              )}
            </div>

            <Link
              href={`/providerprofile/${p.public_id}`}
              className="block mt-6 text-center py-2 rounded-full border font-semibold hover:bg-indigo-600 hover:text-white transition"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
