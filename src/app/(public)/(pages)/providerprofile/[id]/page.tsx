"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Award,
  MessageCircle,
  Calendar,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrustIndicators } from "@/components/TrustIndicators";
import { useProviders } from "@/hooks/useProvider";

export default function ProviderProfile() {
  const params = useParams();
  const { id } = params as { id?: string };

  const { providers, loading } = useProviders();

  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (!loading && providers?.length) {
      const found = providers.find((p: any) => String(p.public_id) === String(id));
      setProvider(found ?? null);
    }
  }, [providers, id, loading]);

  if (loading || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-[#05060a] dark:to-[#07080c]">
        <div className="text-center">
          <div className="animate-pulse h-20 w-20 rounded-full bg-gradient-to-br from-[#3C7DED]/20 to-[#46CBEE]/20 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading provider...</p>
        </div>
      </div>
    );
  }

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
                        alt={provider.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] grid place-content-center text-white text-lg font-semibold">
                      {provider.name
                        ?.split(" ")
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
                      <p className="text-sm text-cyan-600 font-medium">
                        {Array.isArray(provider.services) && provider.services.length
                          ? provider.services.slice(0, 4).join(", ")
                          : "No services listed"}
                      </p>
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-sm text-slate-500 dark:text-slate-300">
                          <span className="font-semibold text-2xl text-slate-900 dark:text-white">
                            {provider.rating ?? "4.8"}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({provider.reviewCount ?? 0})
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <MapPin className="inline w-3 h-3 mr-1" />
                          {provider.locationname ?? "Nationwide"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {provider.description ?? "No description provided."}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-black/40 px-3 py-1 rounded-full border border-white/30">
                      <Clock className="w-4 h-4" />
                      <span>{provider.responseTime ?? "Varies"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-black/40 px-3 py-1 rounded-full border border-white/30">
                      <Award className="w-4 h-4" />
                      <span>{provider.jobscompleted ?? 0} jobs completed</span>
                    </div>

                    {provider.specialBadges?.map((b: string) => (
                      <Badge key={b} variant="secondary" className="bg-white/10 border-white/20">
                        {b}
                      </Badge>
                    ))}
                  </div>

                  {provider.specialBadges && provider.specialBadges.length > 0 && (
                    <div className="mt-4">
                      <TrustIndicators
                        verified={provider.verified}
                        responseTime={provider.responseTime}
                        completedJobs={provider.completedJobs}
                        specialBadges={provider.specialBadges}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 shadow-md backdrop-blur-md bg-white/70 dark:bg-black/50 border border-white/30">
              <Tabs defaultValue="portfolio" className="space-y-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="portfolio" className="grid md:grid-cols-2 gap-6 pt-2">
                  {provider.portfolio?.length > 0 ? (
                    provider.portfolio.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition">
                        {item.image ? (
                          <div className="h-44 relative">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-44 bg-gray-100 dark:bg-[#0C0D10]" />
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">No portfolio items yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4 pt-2">
                  {provider.reviews?.length > 0 ? (
                    provider.reviews.map((review: any) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                {review.avatar ? (
                                  <AvatarImage src={review.avatar} alt={review.customerName} />
                                ) : (
                                  <AvatarFallback>{(review.customerName || "U")[0]}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">{review.customerName}</p>
                                <p className="text-xs text-gray-500">{review.serviceType}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                          </div>

                          <p className="mt-3 text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="about" className="pt-2">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium">Certifications</h4>
                          <ul className="space-y-1 mt-2">
                            {provider.certifications?.length ? (
                              provider.certifications.map((cert: string) => (
                                <li key={cert} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                  <Award className="w-4 h-4 text-cyan-600" />
                                  {cert}
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-400">No certifications</li>
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium">Languages</h4>
                          <div className="flex gap-2 mt-2">
                            {provider.languages?.length ? (
                              provider.languages.map((lang: string) => (
                                <Badge key={lang} variant="outline">{lang}</Badge>
                              ))
                            ) : (
                              <span className="text-gray-400">No languages listed</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Availability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{provider.availability ?? "Not specified"}</p>
                        <p className="text-sm text-gray-500">
                          Member since{" "}
                          {provider.joineddate
                            ? new Date(provider.joineddate).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                            : "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>

          <aside className="lg:w-1/3 space-y-6">
            <div className="sticky top-24 rounded-2xl p-4 shadow-lg backdrop-blur-md bg-white/80 dark:bg-black/60 border border-white/30">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Book Service</h3>
                <div className="text-cyan-600 font-bold">${provider.hourlyRate ?? 0}/hr</div>
              </div>

              <div className="mt-4 grid gap-3">
                <Button asChild className="w-full">
                  <Link href={`/book/${provider.user_id}`}>
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
            </div>

            <div className="rounded-2xl p-4 shadow-md backdrop-blur-md bg-white/70 dark:bg-black/50 border border-white/30">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900 dark:text-white">Trust & Safety</h4>
              </div>

              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                <ul className="space-y-2">
                  {provider.trustIndicators?.length ? (
                    provider.trustIndicators.map((t: string) => (
                      <li key={t} className="flex items-center gap-2 text-cyan-600">
                        <span className="w-2 h-2 bg-cyan-600 rounded-full" />
                        {t}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-2 text-cyan-600">
                      <span className="w-2 h-2 bg-cyan-600 rounded-full" /> AI background check passed
                    </li>
                  )}
                </ul>
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
                <span>{provider.verified ? "Identity verified" : "Verification pending"}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
