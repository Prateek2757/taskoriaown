"use client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AddLeadModal from "./AddLeads";

export default function HeroSection() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="py-10 text-center   bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-2 text-lg  rounded-full font-medium flex flex-wrap items-center justify-center text-center mx-auto">
              <Bot className="w-7 h-7  flex-shrink-0" />
              <span className="whitespace-normal ">
                AI-Powered • Blockchain Secured • Community Driven
              </span>
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                Service{" "}
              </span>
              Marketplaces
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with verified professionals through our AI-powered
              platform. Experience trust, transparency, and innovation in every
              service interaction.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                className="pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 shadow-lg"
                placeholder="What service do you need?"
              />
              <Button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl px-6"
                asChild
              >
                <Link href="/en/discover">Search</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>Serving 50+ cities worldwide</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={() => setOpenModal(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
    
            >
              Post a Job
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <AddLeadModal
              open={openModal}
              onClose={() => setOpenModal(false)}
            />
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/en/become-provider">Join as Provider</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Verified Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50K+</div>
              <div className="text-gray-600">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
