"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Award,
  MessageCircle,
  Calendar,
  Bot,
  ExternalLink,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrustIndicators } from "@/components/TrustIndicators";
import { FaDiscord, FaGithub, FaPinterest, FaWhatsapp } from "react-icons/fa";

function SocialIcon({ platform }: { platform: string }) {
  const p = (platform ?? "").toLowerCase();
  if (p.includes("twitter") || p.includes("x.com") || p === "x")
    return <Twitter className="w-4 h-4" />;
  if (p.includes("instagram")) return <Instagram className="w-4 h-4" />;
  if (p.includes("facebook")) return <Facebook className="w-4 h-4" />;
  if (p.includes("linkedin")) return <Linkedin className="w-4 h-4" />;
  if (p.includes("whatsapp")) return <FaWhatsapp className="w-4 h-4" />;
  if (p.includes("pinterest")) return <FaPinterest className="w-4 h-4" />;
  if (p.includes("discord")) return <FaDiscord className="w-4 h-4" />;
  if (p.includes("github")) return <FaGithub className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

function platformLabel(platform: string): string {
  const map: Record<string, string> = {
    website: "WebSite",
    whatsapp: "WhatsApp",
    pinterest: "Pinterest",
    twitter: "Twitter / X",
    discord: "Discord",
    github: "Github",
    x: "Twitter / X",
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    youtube: "YouTube",
  };
  return map[(platform ?? "").toLowerCase()] ?? platform;
}

function FAQItem({ faq }: { faq: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/20 dark:border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/30 dark:hover:bg-white/5 transition"
      >
        <span className="font-medium text-slate-900 dark:text-white text-sm">
          {faq.question}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 shrink-0 text-cyan-600" />
        ) : (
          <ChevronDown className="w-4 h-4 shrink-0 text-cyan-600" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-white/10 pt-3">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function ProviderProfileClient({ provider }: { provider: any }) {
  if (!provider) {
    return <div className="p-10 text-center">Provider Not Found</div>;
  }

  const photos = Array.isArray(provider.photos) ? provider.photos : [];
  const profileServices = Array.isArray(provider.profile_services)
    ? provider.profile_services
    : [];
  const reviews = Array.isArray(provider.reviews) ? provider.reviews : [];
  const accreditations = Array.isArray(provider.accreditations)
    ? provider.accreditations
    : [];
  const faqs = Array.isArray(provider.faqs) ? provider.faqs : [];
  const socialLinks = Array.isArray(provider.social_links)
    ? provider.social_links
    : [];
  const certifications = Array.isArray(provider.certifications)
    ? provider.certifications
    : [];
  const languages = Array.isArray(provider.languages) ? provider.languages : [];
  const specialBadges = Array.isArray(provider.specialBadges)
    ? provider.specialBadges
    : [];
  const services = Array.isArray(provider.services) ? provider.services : [];
  const trustIndicators = Array.isArray(provider.trustIndicators)
    ? provider.trustIndicators
    : [];

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

  const activeFlags = [
    hasPhotos,
    hasServices,
    hasReviews,
    hasAbout,
    hasFAQs,
    hasSocial,
  ];
  const tabCount = activeFlags.filter(Boolean).length;
  const colClass = GRID_COLS[tabCount] ?? "grid-cols-3";

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

  const rating = provider.avg_rating ?? provider.rating ?? "4.8";
  const reviewCount = provider.total_reviews ?? provider.reviewCount ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#05060a] dark:to-[#071028]">
      <div className="relative h-64 w-full">
        {provider.image ? (
          <div className="absolute inset-0">
            <Image
              src={provider.image}
              alt={`${provider.name} cover`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#071022] dark:to-[#081226]" />
        )}
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="lg:w-2/3 space-y-6">
            <div
              className="rounded-2xl p-6 shadow-lg backdrop-blur-md bg-white/70 dark:bg-black/50 border border-white/40 dark:border-black/20"
              style={{ boxShadow: "0 10px 30px rgba(16,24,40,0.08)" }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {provider.image ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/60 dark:ring-black/40">
                      <Image
                        src={provider.image}
                        alt={provider.name ?? "Provider"}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] grid place-content-center text-white text-lg font-semibold">
                      {(provider.name ?? "")
                        .split(" ")
                        .map((w: string) => w[0] ?? "")
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                          {provider.name}
                        </h1>
                        {provider.verified && (
                          <Badge className="bg-white/10 text-cyan-600 border border-white/20">
                            <Shield className="w-3 h-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                      {services.length > 0 && (
                        <p className="text-sm text-cyan-600 font-medium">
                          {services.join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-sm text-slate-500 dark:text-slate-300">
                          <span className="font-semibold text-2xl text-slate-900 dark:text-white">
                            {rating}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({reviewCount})
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <MapPin className="inline w-3 h-3 mr-1" />
                          {provider.locationname ?? "Nationwide"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {provider.description && (
                    <div className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {provider.description}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {provider.responseTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-black/40 px-3 py-1 rounded-full border border-white/30">
                        <Clock className="w-4 h-4" />
                        <span>{provider.responseTime}</span>
                      </div>
                    )}
                    {(provider.jobscompleted ?? provider.completedJobs) !=
                      null && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-black/40 px-3 py-1 rounded-full border border-white/30">
                        <Award className="w-4 h-4" />
                        <span>
                          {provider.jobscompleted ?? provider.completedJobs}{" "}
                          jobs completed
                        </span>
                      </div>
                    )}
                    {specialBadges.map((b: string) => (
                      <Badge
                        key={b}
                        variant="secondary"
                        className="bg-white/10 border-white/20"
                      >
                        {b}
                      </Badge>
                    ))}
                  </div>

                  {specialBadges.length > 0 && (
                    <div className="mt-4">
                      <TrustIndicators
                        verified={provider.verified}
                        responseTime={provider.responseTime}
                        completedJobs={provider.completedJobs}
                        specialBadges={specialBadges}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {tabCount > 0 && (
              <div className="rounded-2xl p-4 shadow-md backdrop-blur-md bg-white/70 dark:bg-black/50 border border-white/30">
                <Tabs defaultValue={defaultTab} className="space-y-4">
                  <TabsList className={`grid w-full ${colClass}`}>
                    {hasPhotos && (
                      <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    )}
                    {hasServices && (
                      <TabsTrigger value="services">Services</TabsTrigger>
                    )}
                    {hasReviews && (
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    )}
                    {hasAbout && <TabsTrigger value="about">About</TabsTrigger>}
                    {hasFAQs && <TabsTrigger value="faq">Q&amp;A</TabsTrigger>}
                    {hasSocial && (
                      <TabsTrigger value="social">Social</TabsTrigger>
                    )}
                  </TabsList>

                  {hasPhotos && (
                    <TabsContent
                      value="portfolio"
                      className="grid md:grid-cols-2 gap-6 pt-2"
                    >
                      {[...photos]
                        .sort(
                          (a: any, b: any) =>
                            (a.display_order ?? 0) - (b.display_order ?? 0)
                        )
                        .map((photo: any) => (
                          <Card
                            key={photo.id}
                            className={`overflow-hidden hover:shadow-lg transition group ${photo.is_featured ? "md:col-span-2" : ""}`}
                          >
                            {photo.photo_url ? (
                              <div
                                className={`relative ${photo.is_featured ? "h-64" : "h-44"}`}
                              >
                                <Image
                                  src={photo.photo_url}
                                  alt={photo.title ?? "Portfolio photo"}
                                  fill
                                  className="object-cover group-hover:scale-105 transition duration-500"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                {photo.is_featured && (
                                  <div className="absolute top-2 left-2">
                                    <Badge className="bg-cyan-600 text-white text-xs">
                                      Featured
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-44 bg-gray-100 dark:bg-[#0C0D10]" />
                            )}
                            {(photo.title || photo.description) && (
                              <CardContent className="p-4">
                                {photo.title && (
                                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                                    {photo.title}
                                  </h3>
                                )}
                                {photo.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {photo.description}
                                  </p>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        ))}
                    </TabsContent>
                  )}

                  {hasServices && (
                    <TabsContent
                      value="services"
                      className="grid md:grid-cols-2 gap-6 pt-2"
                    >
                      {profileServices.map((svc: any) => (
                        <Card
                          key={svc.id}
                          className="overflow-hidden hover:shadow-lg transition"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
                                <Award className="w-4 h-4 text-cyan-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                                  {svc.title}
                                </h3>
                                {svc.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {svc.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  )}

                  {hasReviews && (
                    <TabsContent value="reviews" className="space-y-4 pt-2">
                      {reviews.map((review: any) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  {review.avatar ? (
                                    <AvatarImage
                                      src={review.avatar}
                                      alt={review.customerName}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {(review.customerName || "U")[0]}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">
                                    {review.customerName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {review.serviceType}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-3 text-gray-700 dark:text-gray-300">
                              {review.comment}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  )}

                  {hasAbout && (
                    <TabsContent value="about" className="pt-2">
                      <div className="grid md:grid-cols-2 gap-6">
                        {(certifications.length > 0 ||
                          languages.length > 0) && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Professional Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {certifications.length > 0 && (
                                <div>
                                  <h4 className="font-medium">
                                    Certifications
                                  </h4>
                                  <ul className="space-y-1 mt-2">
                                    {certifications.map((cert: string) => (
                                      <li
                                        key={cert}
                                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                                      >
                                        <Award className="w-4 h-4 text-cyan-600" />
                                        {cert}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {languages.length > 0 && (
                                <div>
                                  <h4 className="font-medium">Languages</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {languages.map((lang: string) => (
                                      <Badge key={lang} variant="outline">
                                        {lang}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {accreditations.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Accreditations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {[...accreditations]
                                .sort(
                                  (a: any, b: any) =>
                                    (a.display_order ?? 0) -
                                    (b.display_order ?? 0)
                                )
                                .map((acc: any) => (
                                  <div
                                    key={acc.id}
                                    className="flex items-start gap-2"
                                  >
                                    <Shield className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {acc.name}
                                      </p>
                                      {acc.issuing_organization && (
                                        <p className="text-xs text-gray-500">
                                          {acc.issuing_organization}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </CardContent>
                          </Card>
                        )}

                        {(provider.availability || provider.joineddate) && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Availability</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {provider.availability && (
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                  {provider.availability}
                                </p>
                              )}
                              {provider.joineddate && (
                                <p className="text-sm text-gray-500">
                                  Member since{" "}
                                  {new Date(
                                    provider.joineddate
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                  })}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>
                  )}

                  {hasFAQs && (
                    <TabsContent value="faq" className="space-y-3 pt-2">
                      {(() => {
                        const sorted = [...faqs].sort(
                          (a: any, b: any) =>
                            (a.display_order ?? 0) - (b.display_order ?? 0)
                        );
                        const categories = [
                          ...new Set(
                            sorted.map((f: any) => f.category).filter(Boolean)
                          ),
                        ] as string[];

                        if (categories.length > 0) {
                          return categories.map((cat) => (
                            <div key={cat} className="space-y-2">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
                                {cat}
                              </h4>
                              {sorted
                                .filter((f: any) => f.category === cat)
                                .map((faq: any) => (
                                  <FAQItem key={faq.id} faq={faq} />
                                ))}
                            </div>
                          ));
                        }

                        return sorted.map((faq: any) => (
                          <FAQItem key={faq.id} faq={faq} />
                        ));
                      })()}
                    </TabsContent>
                  )}

                  {hasSocial && (
                    <TabsContent
                      value="social"
                      className="grid md:grid-cols-2 gap-4 pt-2"
                    >
                      {[...socialLinks]
                        .sort(
                          (a: any, b: any) =>
                            (a.display_order ?? 0) - (b.display_order ?? 0)
                        )
                        .map((link: any, idx: number) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl border border-white/20 bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition group"
                          >
                            <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600">
                              <SocialIcon platform={link.platform} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {platformLabel(link.platform)}
                              </p>
                              {link.username && (
                                <p className="text-xs text-gray-500 truncate">
                                  @{link.username}
                                </p>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition shrink-0" />
                          </a>
                        ))}
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}
          </main>

          <aside className="lg:w-1/3 space-y-6">
            <div className="sticky top-24 rounded-2xl p-4 shadow-lg backdrop-blur-md bg-white/80 dark:bg-black/60 border border-white/30">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Book Service
                </h3>
                {provider.hourlyRate != null && (
                  <div className="text-cyan-600 font-bold">
                    ${provider.hourlyRate}/hr
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                <Button asChild className="w-full">
                  <Link href="/">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> Book Now
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Send Message
                  </div>
                </Button>
                <Button variant="outline" className="w-full">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" /> Get AI Quote
                  </div>
                </Button>
              </div>

              {hasSocial && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-gray-500 mb-2">Find us on</p>
                  <div className="flex gap-2 flex-wrap">
                    {socialLinks.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={platformLabel(link.platform)}
                        className="p-2 rounded-lg bg-white/50 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-gray-500 hover:text-cyan-600 border border-white/20 transition"
                      >
                        <SocialIcon platform={link.platform} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl p-4 shadow-md backdrop-blur-md bg-white/70 dark:bg-black/50 border border-white/30">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Trust &amp; Safety
              </h4>
              <div className="mt-3 text-sm">
                <ul className="space-y-2">
                  {trustIndicators.length > 0 ? (
                    trustIndicators.map((t: string) => (
                      <li
                        key={t}
                        className="flex items-center gap-2 text-cyan-600"
                      >
                        <span className="w-2 h-2 bg-cyan-600 rounded-full" />
                        {t}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-2 text-cyan-600">
                      <span className="w-2 h-2 bg-cyan-600 rounded-full" /> AI
                      background check passed
                    </li>
                  )}
                </ul>

                {accreditations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                    {accreditations.slice(0, 3).map((acc: any) => (
                      <div
                        key={acc.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Shield className="w-4 h-4 text-cyan-600 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {acc.name}
                        </span>
                      </div>
                    ))}
                    {accreditations.length > 3 && (
                      <p className="text-xs text-gray-400 pl-6">
                        +{accreditations.length - 3} more accreditations
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl p-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="mb-2 font-medium">Contact</div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>{provider.locationname ?? "Nationwide"}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-cyan-600" />
                <span>
                  {provider.verified
                    ? "Identity verified"
                    : "Verification pending"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
