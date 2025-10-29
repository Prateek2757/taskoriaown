"use client"

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useProviders } from "@/hooks/useProvider";

export const FeatureProvider = () => {

  const { providers, loading } = useProviders(3);

  return (
    <section className="bg-muted/30 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-foreground">
            Featured Providers
          </h2>
          <Link href="/providers">
            <Button
              variant="outline"
              className="rounded-full px-6 text-sm hover:bg-primary hover:text-white transition"
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-8">
          {loading
            ? [0, 1, 2].map((i) => (
                <div
                  key={`skeleton-${i}`}
                  className="animate-pulse bg-card border rounded-xl p-6 h-44"
                />
              ))
            : providers.slice(0, 3).map((p) => (
                <motion.div
                  key={p.user_id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Top Row */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white grid place-content-center font-semibold uppercase">
                        {p.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                    )}

                    {/* Info */}
                    <div>
                      <div className="font-medium text-foreground">
                        {p.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.services && p.services.length > 0 ? (
                          <>
                            {p.services.slice(0, 1).join(", ")}
                            {p.services.length > 1 &&
                              ` +${p.services.length - 2} more`}
                          </>
                        ) : (
                          "No categories"
                        )}
                      </div>
                    </div>

                    {/* Rate & Rating */}
                    <div className="ml-auto text-right">
                      <div className="text-sm font-semibold text-foreground">
                        ${p.hourly_rate}/hr
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {p.rating || "4.8"}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.badges?.slice(0, 2).map((t) => (
                      <span
                        key={`${p.user_id}-${t}`}
                        className="text-xs border px-2.5 py-0.5 rounded-full text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/providerprofile/${encodeURIComponent(
                      p.user_id.toString()
                    )}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full mt-4 text-sm hover:bg-primary hover:text-white transition rounded-full"
                    >
                      View Profile
                    </Button>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
