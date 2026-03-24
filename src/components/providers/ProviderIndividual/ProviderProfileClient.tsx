"use client";

import { MapPin, Shield } from "lucide-react";
import { ProfileHero } from "./ProfileHero";
import { ProfileTabs } from "./ProfileTabs";
import { BookingPanel } from "./BookingPanel";
import { TrustSafetyCard } from "./TrustSafetyCard";

export default function ProviderProfileClient({ provider }: { provider: any }) {
  if (!provider) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#070d1a] flex items-center justify-center p-6">
        <div className="bg-white dark:bg-[#1d2226] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm p-10 text-center max-w-sm w-full">
          <p className="text-base font-semibold text-gray-900 dark:text-white">Provider Not Found</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This profile may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  const photos          = Array.isArray(provider.photos)           ? provider.photos           : [];
  const profileServices = Array.isArray(provider.profile_services) ? provider.profile_services : [];
  const reviews         = Array.isArray(provider.reviews)          ? provider.reviews          : [];
  const accreditations  = Array.isArray(provider.accreditations)   ? provider.accreditations   : [];
  const faqs            = Array.isArray(provider.faqs)             ? provider.faqs             : [];
  const socialLinks     = Array.isArray(provider.social_links)     ? provider.social_links     : [];
  const certifications  = Array.isArray(provider.certifications)   ? provider.certifications   : [];
  const languages       = Array.isArray(provider.languages)        ? provider.languages        : [];
  const trustIndicators = Array.isArray(provider.trustIndicators)  ? provider.trustIndicators  : [];

  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#070d1a]">
      <div className="max-w-282 mx-auto px-0 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <ProfileHero provider={provider} />
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
          </div>

          <aside className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0">
            <div className="sticky top-6 flex flex-col gap-4">

              <BookingPanel provider={provider} socialLinks={socialLinks} />

              <TrustSafetyCard
                provider={provider}
                trustIndicators={trustIndicators}
                accreditations={accreditations}
              />

              <div className="bg-white dark:bg-[#1d2226] border border-[#e2e2e2] dark:border-white/10 rounded-xl shadow-sm p-5">
                <p className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3">
                  Contact
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{provider.locationname ?? "Nationwide"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{provider.verified ? "Identity verified" : "Verification pending"}</span>
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