"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/hooks/useProvider";

export default function AllProviders() {
  const { providers, loading } = useProviders();
  const [search, setSearch] = useState("");
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      setFilteredProviders(
        providers.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, providers, loading]);

  return (
    <section className="bg-muted/30 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            All Providers
          </h1>
          <input
            type="text"
            placeholder="Search by name..."
            className="px-4 py-2 border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-card border rounded-xl p-6 h-44"
              />
            ))
          ) : filteredProviders.length > 0 ? (
            filteredProviders.map((p) => (
              <div
                key={p.public_id}
                className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  {p.image ? (
                    <div className="  relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={56}
                        height={56}
                        className=" w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white grid place-content-center font-semibold uppercase">
                      {p.name
                        ?.split(" ")
                        .map((w: string) => w[0])
                        .join("")}
                    </div>
                  )}

                  <div>
                    <div className="font-medium text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.services && p.services.length > 0
                        ? `${p.services.slice(0, 2).join(", ")}${
                            p.services.length > 2
                              ? ` +${p.services.length - 2} more`
                              : ""
                          }`
                        : "No services"}
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="text-sm font-semibold text-foreground">
                      ${p.hourly_rate}/hr
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {p.rating || "4.7"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.badges?.slice(0, 2).map((t: string) => (
                    <span
                      key={`${p.user_id}-${t}`}
                      className="text-xs border px-2.5 py-0.5 rounded-full text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/providerprofile/${encodeURIComponent(
                    p.public_id.toString()
                  )}`}
                >
                  <Button
                    variant="outline"
                    className="w-full mt-4 text-sm hover:bg-primary hover:text-white transition rounded-full"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No providers found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
