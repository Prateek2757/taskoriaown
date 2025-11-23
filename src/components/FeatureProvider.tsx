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
    <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-white">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-semibold mb-3 border border-blue-100"
          >
            <Award className="w-3.5 h-3.5" />
            Top Talent
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-2"
          >
            Featured Providers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-600 text-sm max-w-xl mx-auto mb-6"
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
                className="rounded-full px-6 py-2 text-sm font-medium border border-slate-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
              >
                View All Providers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {loading
            ? [0, 1, 2].map((i) => (
                <div
                  key={`skeleton-${i}`}
                  className="animate-pulse bg-white border border-slate-200 rounded-xl p-5 h-56"
                />
              ))
            : providers.slice(0, 3).map((p, index) => (
                <motion.div
                  key={p.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative flex-shrink-0">
                      {p.image ? (
                        <div className="w-15 h-15 rounded-full overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={56}
                            height={56}
                            className="rounded-xl object-cover border border-slate-200"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white grid place-content-center font-bold uppercase text-lg shadow-sm">
                          {p.name
                            ?.split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </div>
                      )}
                      {p.badges?.includes("Verified") && (
                        <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 shadow-md">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base mb-1.5 truncate group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-700">
                            {p.rating || "4.8"}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          ${p.hourly_rate}
                          <span className="text-xs font-normal text-slate-500">
                            /hr
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {p.services && p.services.length > 0 ? (
                        <>
                          <span className="font-medium text-slate-700">
                            Specializes:{" "}
                          </span>
                          {p.services.slice(0, 2).join(", ")}
                          {p.services.length > 2 && (
                            <span className="text-blue-600 font-medium ml-1">
                              +{p.services.length - 2}
                            </span>
                          )}
                        </>
                      ) : (
                        "Multi-disciplinary expert"
                      )}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.badges?.slice(0, 3).map((badge) => (
                      <span
                        key={`${p.user_id}-${badge}`}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          badge === "Top Rated"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : badge === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {badge === "Top Rated" && (
                          <Award className="w-2.5 h-2.5" />
                        )}
                        {badge === "Verified" && (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        )}
                        {badge}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/providerprofile/${encodeURIComponent(
                      String(p.public_id)
                    )}`}
                  >
                    <Button className="w-full h-9 text-sm font-semibold rounded-lgbg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] hover:shadow-lg text-white shadow-sm transition-all duration-300 group-hover:scale-[1.02]">
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
