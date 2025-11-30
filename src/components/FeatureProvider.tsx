"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Star, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { useProviders } from "@/hooks/useProvider";

export const FeatureProvider = () => {
  const { providers, loading } = useProviders(3);
  return (
    <section
      className="
        relative py-16 px-4 overflow-hidden
        bg-white
        dark:bg-[radial-gradient(circle_at_center,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_50%,rgba(0,0,0,1)_90%)]
     
        before:opacity-50 before:-z-10
      "
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-3 border border-blue-100 dark:border-blue-800"
          >
            <Award className="w-3.5 h-3.5" />
            Top Talent
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Featured Providers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-600 dark:text-gray-300 text-sm max-w-xl mx-auto mb-6"
          >
            Connect with verified professionals delivering exceptional service
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link href="/providers">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 text-sm font-medium border border-slate-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-all duration-300"
              >
                View All Providers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {loading
            ? [0, 1, 2].map((i) => (
                <div
                  key={`skeleton-${i}`}
                  className="animate-pulse bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 h-64"
                />
              ))
            : providers.slice(0, 3).map((p, index) => (
                <motion.div
                  key={p.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="
                    group relative rounded-2xl overflow-hidden
                    bg-white/40 dark:bg-gray-800/40
                    backdrop-blur-md border border-white/20 dark:border-gray-700
                    shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                    flex flex-col
                  "
                >
                  <div className="relative h-56 overflow-hidden rounded-t-2xl">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-bold text-3xl">
                        {p.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/20 mix-blend-soft-light opacity-40"></div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 truncate group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-700">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                            {p.rating || "4.8"}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          ${p.hourly_rate}
                          <span className="text-xs font-normal text-slate-500 dark:text-gray-300">
                            /hr
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 mb-3.5">
                      <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2">
                        {p.services && p.services.length > 0 ? (
                          <>
                            <span className="font-medium text-slate-700 dark:text-gray-200">
                              Specializes:{" "}
                            </span>
                            {p.services.slice(0, 2).join(", ")}
                            {p.services.length > 2 && (
                              <span className="text-blue-600 dark:text-blue-400 font-medium ml-1">
                                +{p.services.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          "Multi-disciplinary expert"
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.badges?.slice(0, 3).map((badge) => (
                        <span
                          key={`${p.user_id}-${badge}`}
                          className={`
                            inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium
                            ${
                              badge === "Top Rated"
                                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-600"
                                : badge === "Verified"
                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-600"
                                : "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700"
                            }
                          `}
                        >
                          {badge === "Top Rated" && <Award className="w-2.5 h-2.5" />}
                          {badge === "Verified" && <CheckCircle2 className="w-2.5 h-2.5" />}
                          {badge}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/providerprofile/${encodeURIComponent(String(p.public_id))}`}
                    >
                      <Button className="w-full h-9 text-sm font-semibold rounded-full bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] hover:shadow-lg text-white shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                        View Profile
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
