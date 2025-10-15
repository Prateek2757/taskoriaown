

import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {  Star } from "lucide-react";

const providers = [
    {
      id: 1,
      name: "Sarah Johnson",
      service: "Interior Design",
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1494790108755-2616b12b2134?w=100&h=100&fit=crop&crop=face",
      hourlyRate: 85,
      badges: ["Eco-Friendly", "Top Rated", "Fast Response"]
    },
    {
      id: 2,
      name: "Michael Chen",
      service: "Web Development",
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      hourlyRate: 95,
      badges: ["AI Expert", "Blockchain Verified"]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      service: "Marketing Consultant",
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      hourlyRate: 75,
      badges: ["Growth Specialist", "Community Leader"]
    }
  ];

export const FeatureProvider = () => {
  return (
    <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Providers</h2>
          <p className="text-gray-600">Meet some of our top-rated, blockchain-verified professionals</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/en/discover">View All Providers</Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={provider.image} 
                  alt={provider.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{provider.name}</h3>
                  <p className="text-blue-600 font-medium">{provider.service}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                    <span className="text-sm text-gray-500">({provider.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${provider.hourlyRate}/hr</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.badges.map((badge) => (
                  <span key={badge} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                    {badge}
                  </span>
                ))}
              </div>
              
              <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-green-600 transition-all" asChild>
                <Link href={`/en/providerprofile/${provider.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
  )
}
