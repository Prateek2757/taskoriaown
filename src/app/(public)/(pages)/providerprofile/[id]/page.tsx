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
  const { id } = params;
  const { providers, loading } = useProviders();

  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (!loading && providers.length > 0) {
      const found = providers.find((p) => p.user_id.toString() === id);
      setProvider(found || null);
    }
  }, [providers, id, loading]);

  if (loading || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading provider...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-64 relative">
        {provider.image ? (
          <Image
            src={provider.image}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                    {provider.image ? (
                      <AvatarImage src={provider.image} />
                    ) : (
                      <AvatarFallback>
                        {provider.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold">{provider.name}</h1>
                      {provider.verified && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Shield className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-blue-600 font-medium">
                      {provider.services?.join(", ") || "No Services"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {provider.rating || "4.8"} ({provider.reviewCount || 0}{" "}
                        reviews)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />{" "}
                        {provider.locationname || "National Wide Serving"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Responds in{" "}
                        {provider.responseTime || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" /> {provider.jobscompleted || 0}{" "}
                        jobs completed
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {provider.description || "No description provided."}
                    </p>

                    {provider.specialBadges &&
                      provider.specialBadges.length > 0 && (
                        <TrustIndicators
                          verified={provider.verified}
                          responseTime={provider.responseTime}
                          completedJobs={provider.completedJobs}
                          specialBadges={provider.specialBadges}
                        />
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="portfolio" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent
                value="portfolio"
                className="grid md:grid-cols-2 gap-6"
              >
                {provider.portfolio?.length > 0 ? (
                  provider.portfolio.map((item: any) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition"
                    >
                      {item.image && (
                        <div className="h-48 relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">
                    No portfolio items yet.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {provider.reviews?.length > 0 ? (
                  provider.reviews.map((review: any) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {review.customerName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {review.customerName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {review.serviceType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </TabsContent>

              <TabsContent value="about">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Professional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-medium">Certifications</h4>
                        <ul className="space-y-1">
                          {provider.certifications?.map((cert: string) => (
                            <li
                              key={cert}
                              className="flex items-center gap-2 text-gray-600"
                            >
                              <Award className="w-4 h-4 text-blue-600" /> {cert}
                            </li>
                          )) || (
                            <li className="text-gray-400">No certifications</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Languages</h4>
                        <div className="flex gap-2">
                          {provider.languages?.map((lang: string) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          )) || (
                            <span className="text-gray-400">
                              No languages listed
                            </span>
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
                      <p className="text-gray-600 mb-2">
                        {provider.availability || "Not specified"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Member since{" "}
                        {provider.joineddate
                          ? new Date(provider.joineddate).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "long" }
                            )
                          : "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-1/3 space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Book Service</span>
                  <span className="text-green-600 font-bold">
                    ${provider.hourlyRate || 0}/hr
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/book/${provider.user_id}`}>
                    <Calendar className="w-4 h-4 mr-2" /> Book Now
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" /> Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Bot className="w-4 h-4 mr-2" /> Get AI Quote
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" /> Trust & Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  {provider.trustIndicators?.length > 0 ? (
                    provider.trustIndicators.map((t: string) => (
                      <li
                        key={t}
                        className="flex items-center gap-2 text-green-600"
                      >
                        <span className="w-2 h-2 bg-green-600 rounded-full" />{" "}
                        {t}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full" />{" "}
                        Blockchain identity verified
                      </li>
                      <li className="flex items-center gap-2 text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full" />{" "}
                        AI background check passed
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
