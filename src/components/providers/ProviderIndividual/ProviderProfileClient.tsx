"use client";

import { MapPin, Shield } from "lucide-react";
import { ProfileHero } from "./ProfileHero";
import { ProfileTabs } from "./ProfileTabs";
import { BookingPanel } from "./BookingPanel";
import { TrustSafetyCard } from "./TrustSafetyCard";

export default function ProviderProfileClient({ provider }: { provider: any }) {
  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Provider Not Found</p>
          <p className="text-sm text-gray-500">This profile may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  const photos = Array.isArray(provider.photos) ? provider.photos : [];
  const profileServices = Array.isArray(provider.profile_services) ? provider.profile_services : [];
  const reviews = Array.isArray(provider.reviews) ? provider.reviews : [];
  const accreditations = Array.isArray(provider.accreditations) ? provider.accreditations : [];
  const faqs = Array.isArray(provider.faqs) ? provider.faqs : [];
  const socialLinks = Array.isArray(provider.social_links) ? provider.social_links : [];
  const certifications = Array.isArray(provider.certifications) ? provider.certifications : [];
  const languages = Array.isArray(provider.languages) ? provider.languages : [];
  const trustIndicators = Array.isArray(provider.trustIndicators) ? provider.trustIndicators : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070d1a]">
      <ProfileHero provider={provider} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          <main className="flex-1 min-w-0 space-y-6">
            <ProfileTabs
              provider={provider}
              photos={photos}
              profileServices={profileServices}
              reviews={reviews}
              accreditations={accreditations}
              faqs={faqs}
              socialLinks={socialLinks}
              certifications={certifications}
              languages={languages}
            />
          </main>

          <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-5">
            <div className="sticky top-6 space-y-5">
              <BookingPanel provider={provider} socialLinks={socialLinks} />
              <TrustSafetyCard
                provider={provider}
                trustIndicators={trustIndicators}
                accreditations={accreditations}
              />

              <div className="bg-white dark:bg-[#0c1220] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Contact
                </p>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{provider.locationname ?? "Nationwide"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                    <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {provider.verified ? "Identity verified" : "Verification pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
