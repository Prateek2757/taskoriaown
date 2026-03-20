"use client";

import Image from "next/image";
import { Shield, Clock, Award, Star, MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileHeroProps {
  provider: any;
}

export function ProfileHero({ provider }: ProfileHeroProps) {
  const services = Array.isArray(provider.services) ? provider.services : [];
  const specialBadges = Array.isArray(provider.specialBadges) ? provider.specialBadges : [];
  const rating = provider.avg_rating ?? provider.rating ?? "4.8";
  const reviewCount = provider.total_reviews ?? provider.reviewCount ?? 0;

  const initials = (provider.name ?? "")
    .split(" ")
    .map((w: string) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      {/* Cover image */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden rounded-b-none">
        {provider.image ? (
          <>
            <Image
              src={provider.image}
              alt={`${provider.name} cover`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        )}

        {/* Floating rating pill on cover */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
            <span className="text-white/60 text-xs font-normal">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Profile card floating over hero */}
      <div className="relative z-10 mx-4 sm:mx-6 lg:mx-8 -mt-16">
        <div className="bg-white dark:bg-[#0c1220] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-7">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                {provider.image ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-[#0c1220] shadow-xl">
                    <Image
                      src={provider.image}
                      alt={provider.name ?? "Provider"}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 grid place-content-center text-white text-2xl font-bold shadow-xl ring-4 ring-white dark:ring-[#0c1220]">
                    {initials}
                  </div>
                )}
                {provider.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#0c1220] rounded-full p-0.5 shadow">
                    <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Name, tags, description */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {provider.name}
                    </h1>
                    {provider.verified && (
                      <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700 text-xs font-medium">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {services.length > 0 && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                      {services.join(" · ")}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{provider.locationname ?? "Nationwide"}</span>
                  </div>
                </div>
              </div>

              {provider.description && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {provider.description}
                </p>
              )}

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap gap-3">
                {provider.responseTime && (
                  <StatPill icon={<Clock className="w-3.5 h-3.5" />} label={provider.responseTime} />
                )}
                {(provider.jobscompleted ?? provider.completedJobs) != null && (
                  <StatPill
                    icon={<Award className="w-3.5 h-3.5" />}
                    label={`${provider.jobscompleted ?? provider.completedJobs} jobs`}
                  />
                )}
                {specialBadges.map((b: string) => (
                  <StatPill key={b} icon={<CheckCircle2 className="w-3.5 h-3.5" />} label={b} highlight />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
        highlight
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
          : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
