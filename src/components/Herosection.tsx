"use client";
import { Button } from "../components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Bot, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AddLeadModal from "./AddLeads";

export default function HeroSection() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="py-7 text-center   bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            {/* <div className="inline-flex items-center gap-2 border bg-card rounded-full px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5 text-green-600"/> AI‑Powered • Blockchain Secured • Community Driven
          </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] bg-clip-text text-transparent">
                {" "}
                Service{" "}
              </span>
              Marketplaces
            </h1> */}
          </div>
          <div className="inline-flex items-center gap-2 border bg-card rounded-full px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" /> AI‑Powered  • Community Driven
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            The Future of{" "}
            <span className="bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] bg-clip-text text-transparent">
              Service
            </span>{" "}
            Marketplaces
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with verified professionals through our AI-powered platform.
            Experience trust, transparency, and innovation in every service
            interaction.
          </p>
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            {/* 🔍 Floating Search Bar */}
            <div className="w-full flex justify-center mt-6 px-4 ">
              <div className="relative w-full max-w-3xl group flex items-center gap">
                {/* Gradient glow border around input */}
                <div className="relative mr-4 flex-1">
                  <div
                    className="absolute -inset-[2px] bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2]
                    rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"
                  />

                  <div
                    className="relative flex items-center bg-white border-2 border-gray-100 rounded-2xl 
                    shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <Search className="absolute left-3  text-gray-400 w-5 h-5 pointer-events-none" />

                    <input
                      type="text"
                      placeholder="What service you need?    (e.g. Plumber, Web)"
                      className="w-full pl-12 right-2 py-2    text-gray-800 placeholder-gray-400 
                   focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                {/* Search Button outside */}
                <Link href="/discover">
                  <Button
                    className="bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] text-md  text-white font-semibold 
                 rounded-xl px-7 py-5 shadow-md hover:shadow-lg hover:from-blue-700 hover:to-green-700 
                 active:scale-[0.97] transition-all duration-200"
                  >
                    Search
                  </Button>
                </Link>
              </div>
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
              className="flex-1  py-5 rounded-xl bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2]"
            >
              Post a Job
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <AddLeadModal
              open={openModal}
              onClose={() => setOpenModal(false)}
            />
            <Button
              variant="outline"
              className="flex-1 py-5 rounded-xl "
              asChild
            >
              <Link href="/become-provider">Join as Provider</Link>
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
