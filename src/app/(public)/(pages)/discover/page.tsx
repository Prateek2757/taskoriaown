"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Star, MapPin, Clock, Filter, X } from "lucide-react";

export default function Discover() {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const providers = [
    {
      id: 1,
      name: "Sarah Johnson",
      service: "Interior Design",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 85,
      location: "San Francisco, CA",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b12b2134?w=150&h=150&fit=crop&crop=face",
      description:
        "Specializing in modern residential and commercial spaces with 8+ years experience.",
      responseTime: "1 hour",
      completedJobs: 156,
      tags: ["Modern Design", "Residential", "Commercial"],
    },
    {
      id: 2,
      name: "Mike Chen",
      service: "Plumbing",
      rating: 4.8,
      reviews: 89,
      hourlyRate: 65,
      location: "Oakland, CA",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Licensed plumber with emergency services available 24/7.",
      responseTime: "30 min",
      completedJobs: 203,
      tags: ["Emergency Service", "Licensed", "24/7"],
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      service: "Photography",
      rating: 5.0,
      reviews: 45,
      hourlyRate: 120,
      location: "San Jose, CA",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description:
        "Wedding and portrait photographer capturing your special moments.",
      responseTime: "2 hours",
      completedJobs: 89,
      tags: ["Weddings", "Portraits", "Events"],
    },
    {
      id: 4,
      name: "David Kim",
      service: "Web Development",
      rating: 4.9,
      reviews: 156,
      hourlyRate: 95,
      location: "Remote",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description:
        "Full-stack developer specializing in React and Node.js applications.",
      responseTime: "1 hour",
      completedJobs: 78,
      tags: ["React", "Node.js", "Full-stack"],
    },
    {
      id: 5,
      name: "Lisa Thompson",
      service: "House Cleaning",
      rating: 4.7,
      reviews: 234,
      hourlyRate: 35,
      location: "Palo Alto, CA",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      description: "Professional cleaning service with eco-friendly products.",
      responseTime: "15 min",
      completedJobs: 312,
      tags: ["Eco-friendly", "Insured", "Recurring"],
    },
    {
      id: 6,
      name: "James Wilson",
      service: "Tutoring",
      rating: 4.8,
      reviews: 67,
      hourlyRate: 55,
      location: "Berkeley, CA",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      description:
        "Math and Science tutor for high school and college students.",
      responseTime: "1 hour",
      completedJobs: 145,
      tags: ["Math", "Science", "Test Prep"],
    },
  ];

  const categories = [
    "All Categories",
    "Home Repair",
    "Cleaning",
    "Tutoring",
    "Design",
    "Photography",
    "Development",
    "Consulting",
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            {/* Mobile Filter Toggle */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <X /> : <Filter />}
              </Button>
            </div>

            {/* Filters */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block space-y-6`}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Search Services
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="What do you need?"
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <div className="w-full">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category.toLowerCase()}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={5}
                      className="mt-2 w-full"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Within 25 miles</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="anywhere">Anywhere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Rating
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                        <SelectItem value="4.0">4.0+ stars</SelectItem>
                        <SelectItem value="3.5">3.5+ stars</SelectItem>
                        <SelectItem value="any">Any rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {providers.length} Service Providers Available
              </h1>
              <Select defaultValue="rating">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {providers.map((provider) => (
                <Card
                  key={provider.id}
                  className="hover:shadow-lg transition-shadow w-full"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Info */}
                      <div className="flex flex-1 items-start gap-4 min-w-0">
                        <Avatar className="w-16 h-16 flex-shrink-0">
                          <AvatarImage
                            src={provider.profileImage}
                            alt={provider.name}
                          />
                          <AvatarFallback>
                            {provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold truncate">
                              {provider.name}
                            </h3>
                            {provider.verified && (
                              <Badge className="bg-cyan-100 text-cyan-800">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-blue-600 font-medium truncate">
                            {provider.service}
                          </p>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {provider.rating}
                              </span>
                              <span>({provider.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{provider.responseTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <p className="text-gray-600 break-words">
                          {provider.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {provider.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-2">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-cyan-600">
                              ${provider.hourlyRate}/hr
                            </div>
                            <div className="text-sm text-gray-500">
                              {provider.completedJobs} jobs completed
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" asChild>
                              <Link href={`/providerprofile/${provider.id}`}>
                                View Profile
                              </Link>
                            </Button>
                            <Button asChild>
                              <Link href={`/booking/${provider.id}`}>
                                Book Now
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
