"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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


// Mock provider data
const provider = {
  id: 1,
  name: "Sarah Johnson",
  service: "Interior Design",
  rating: 4.9,
  reviewCount: 127,
  hourlyRate: 85,
  location: "San Francisco, CA",
  verified: true,
  joinedDate: "2022-03-15",
  profileImage:
    "https://images.unsplash.com/photo-1494790108755-2616b12b2134?w=150&h=150&fit=crop&crop=face",
  coverImage:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop",
  description:
    "Passionate interior designer with 8+ years of experience transforming spaces. Specialized in modern, minimalist designs that maximize functionality while staying beautiful.",
  responseTime: "1 hour",
  completedJobs: 156,
  tags: [
    "Modern Design",
    "Residential",
    "Commercial",
    "Space Planning",
    "Color Consultation",
  ],
  certifications: [
    "Certified Interior Designer",
    "LEED Green Associate",
    "NCIDQ Certificate",
  ],
  languages: ["English", "Spanish"],
  availability: "Mon-Fri: 9AM-6PM",
  specialBadges: ["Eco-Friendly", "Fast Responder", "Top Rated"],
  blockchainScore: 94,
  aiRecommendationScore: 98,
  portfolio: [
    {
      id: 1,
      title: "Modern Living Room Makeover",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      description:
        "Complete transformation of a 500 sq ft living space using sustainable materials",
    },
    {
      id: 2,
      title: "Corporate Office Design",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      description: "Modern office space with AI-optimized layout",
    },
    {
      id: 3,
      title: "Luxury Bedroom Suite",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=400&fit=crop",
      description: "Elegant master bedroom with smart home integration",
    },
  ],
};

const reviewsData = [
  {
    id: 1,
    customerName: "Mike R.",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Sarah transformed our outdated living room into a modern masterpiece. Highly recommended!",
    serviceType: "Living Room Design",
    verified: true,
  },
  {
    id: 2,
    customerName: "Jennifer L.",
    rating: 5,
    date: "2024-01-10",
    comment:
      "Professional, punctual, and incredibly talented. Our office redesign boosted productivity!",
    serviceType: "Office Design",
    verified: true,
  },
  {
    id: 3,
    customerName: "David K.",
    rating: 4,
    date: "2024-01-05",
    comment:
      "Great work on our kitchen renovation. Excellent suggestions and within budget. Slight delay though.",
    serviceType: "Kitchen Design",
    verified: true,
  },
];

export default function ProviderProfile() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="h-64 relative">
        <Image
          src={provider.coverImage}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                    <AvatarImage src={provider.profileImage} />
                    <AvatarFallback>
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
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
                      {provider.service}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {provider.rating} ({provider.reviewCount} reviews)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {provider.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Responds in{" "}
                        {provider.responseTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" /> {provider.completedJobs}{" "}
                        jobs completed
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {provider.description}
                    </p>

                    <TrustIndicators
                      verified={provider.verified}
                      responseTime={provider.responseTime}
                      completedJobs={provider.completedJobs}
                      specialBadges={provider.specialBadges}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="portfolio" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              {/* Portfolio */}
              <TabsContent value="portfolio" className="grid md:grid-cols-2 gap-6">
                {provider.portfolio.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="h-48 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="space-y-4">
                {reviewsData.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.customerName}</p>
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
                ))}
              </TabsContent>

              {/* About */}
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
                          {provider.certifications.map((cert) => (
                            <li
                              key={cert}
                              className="flex items-center gap-2 text-gray-600"
                            >
                              <Award className="w-4 h-4 text-blue-600" />
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Languages</h4>
                        <div className="flex gap-2">
                          {provider.languages.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
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
                        {provider.availability}
                      </p>
                      <p className="text-sm text-gray-500">
                        Member since{" "}
                        {new Date(provider.joinedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Booking */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Book Service</span>
                  <span className="text-green-600 font-bold">
                    ${provider.hourlyRate}/hr
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/en/book/${provider.id}`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Bot className="w-4 h-4 mr-2" />
                  Get AI Quote
                </Button>
              </CardContent>
            </Card>

            {/* Trust & Safety */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Trust & Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    Blockchain identity verified
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    AI background check passed
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    Escrow payment protection
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    24/7 AI support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}