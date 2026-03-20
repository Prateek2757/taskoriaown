"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioTab } from "./PortfolioTab";
import { ServicesTab } from "./ServicesTab";
import { ReviewsTab } from "./ReviewsTab";
import { AboutTab } from "./AboutTab";
import { FAQTab } from "./FAQTab";
import { SocialTab } from "./SocialTab";

interface ProfileTabsProps {
  provider: any;
  photos: any[];
  profileServices: any[];
  reviews: any[];
  accreditations: any[];
  faqs: any[];
  socialLinks: any[];
  certifications: string[];
  languages: string[];
}

export function ProfileTabs({
  provider,
  photos,
  profileServices,
  reviews,
  accreditations,
  faqs,
  socialLinks,
  certifications,
  languages,
}: ProfileTabsProps) {
  const hasPhotos = photos.length > 0;
  const hasServices = profileServices.length > 0;
  const hasReviews = reviews.length > 0;
  const hasAbout =
    certifications.length > 0 ||
    languages.length > 0 ||
    accreditations.length > 0 ||
    !!provider.availability ||
    !!provider.joineddate;
  const hasFAQs = faqs.length > 0;
  const hasSocial = socialLinks.length > 0;

  const defaultTab = hasPhotos
    ? "portfolio"
    : hasServices
      ? "services"
      : hasReviews
        ? "reviews"
        : hasAbout
          ? "about"
          : hasFAQs
            ? "faq"
            : hasSocial
              ? "social"
              : "about";

  const hasTabs = hasPhotos || hasServices || hasReviews || hasAbout || hasFAQs || hasSocial;
  if (!hasTabs) return null;

  return (
    <div className="bg-white dark:bg-[#0c1220] border-0 rounded-2xl shadow-sm overflow-hidden">
      <Tabs className="border-0"  defaultValue={defaultTab}>
        <div className=" px-2 border-0 overflow-x-auto">
          <TabsList className="h-auto  bg-transparent rounded-full  gap-0 p-0 border-0 flex w-max min-w-full">
            {hasPhotos && <TabItem  value="portfolio" label="Portfolio" />}
            {hasServices && <TabItem value="services" label="Services" />}
            {hasReviews && <TabItem value="reviews" label="Reviews" />}
            {hasAbout && <TabItem value="about" label="About" />}
            {hasFAQs && <TabItem value="faq" label="Q&A" />}
            {hasSocial && <TabItem value="social" label="Social" />}
          </TabsList>
        </div>

        <div className="p-5 sm:p-6">
          {hasPhotos && (
            <TabsContent value="portfolio" className="mt-0">
              <PortfolioTab photos={photos} />
            </TabsContent>
          )}
          {hasServices && (
            <TabsContent value="services" className="mt-0">
              <ServicesTab profileServices={profileServices} />
            </TabsContent>
          )}
          {hasReviews && (
            <TabsContent value="reviews" className="mt-0">
              <ReviewsTab reviews={reviews} />
            </TabsContent>
          )}
          {hasAbout && (
            <TabsContent value="about" className="mt-0">
              <AboutTab
                certifications={certifications}
                languages={languages}
                accreditations={accreditations}
                provider={provider}
              />
            </TabsContent>
          )}
          {hasFAQs && (
            <TabsContent value="faq" className="mt-0">
              <FAQTab faqs={faqs} />
            </TabsContent>
          )}
          {hasSocial && (
            <TabsContent value="social" className="mt-0">
              <SocialTab socialLinks={socialLinks} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}

function TabItem({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="relative px-4 py-3.5 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap"
    >
      {label}
    </TabsTrigger>
  );
}
