"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { MapPin, ArrowRight, Shield, Zap, Award, Star, Sparkles, TrendingUp, Clock, Check, Users, BadgeCheck } from "lucide-react";
import { useLeadProfile } from "@/hooks/useLeadProfile";
import LocationSearch from "@/components/Location/locationsearch";
import NewRequestModal from "@/components/leads/RequestModal";
import { Button } from "@/components/ui/button";
export const dynamic = "force-dynamic";

interface ServiceData {
  category_id: number;
  name: string;
  description?: string;
  hero_image?: string;
  about?: string;
  whats_included?: string[];
  add_ons?: string[];
  faqs?: { question: string; answer: string }[];
  slug?: string;
}

interface CityProvider {
  name: string;
  rating: number;
  logo: string;
  completedJobs: number;
}

interface City {
  city_id?: number;
  display_name?: string;
  city?: string;
  name?: string;
  image?: string;
  providers?: CityProvider[];
  activeProviders?: number;
}

export default function ServicePage() {
  const { cities, loading: citiesLoading } = useLeadProfile();

  const [openModal, setOpenModal] = useState(false);

  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug || "";
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<City | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceData | null>(null);
  
  const popularCities: City[] = [
    {
      name: "Sydney",
      image: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800&h=600&fit=crop",
      activeProviders: 248,
      providers: [
        { name: "Elite Home Services", rating: 4.9, logo: "🏆", completedJobs: 156 },
        { name: "Pro Solutions Co", rating: 4.8, logo: "⚡", completedJobs: 203 },
        { name: "Premium Care", rating: 5.0, logo: "✨", completedJobs: 189 }
      ]
    },
    {
      name: "Melbourne",
      image: "https://images.unsplash.com/photo-1609036394821-b63e8168dc64?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      activeProviders: 192,
      providers: [
        { name: "Expert Hands", rating: 4.9, logo: "🎯", completedJobs: 178 },
        { name: "Quality First", rating: 4.7, logo: "💼", completedJobs: 145 },
        { name: "Master Services", rating: 5.0, logo: "🌟", completedJobs: 201 }
      ]
    },
    {
      name: "Adelaide",
      image: "https://images.unsplash.com/photo-1702252212983-db7e428cc3cf?q=80&w=1880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      activeProviders: 156,
      providers: [
        { name: "Top Tier Pros", rating: 4.8, logo: "🔥", completedJobs: 134 },
        { name: "Swift Solutions", rating: 4.9, logo: "⚙️", completedJobs: 167 },
        { name: "Premier Group", rating: 4.7, logo: "💎", completedJobs: 142 }
      ]
    },
    {
      name: "Perth",
      image: "https://images.unsplash.com/photo-1574471101497-d958f6e3ebd4?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      activeProviders: 134,
      providers: [
        { name: "Ocean City Services", rating: 4.9, logo: "🌊", completedJobs: 112 },
        { name: "Sunrise Experts", rating: 4.8, logo: "☀️", completedJobs: 98 },
        { name: "West Coast Pros", rating: 5.0, logo: "🏖️", completedJobs: 156 }
      ]
    }
  ];

  const handleSelectCategory = () => {
    setSelectedCategory(service)
    setOpenModal(true)
  }

  const handleLocationSet = (location: City) => {
    setSelectedLocation(location)
    setSelectedCategory(service)
    setOpenModal(true)
  }

  useEffect(() => {
    async function fetchService() {
      setLoading(true);
      const res = await fetch(`/api/categories/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setService(data);
      } else {
        setService(null);
      }
      setLoading(false);
    }
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading amazing service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Oops! Service Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We couldn't find what you're looking for.</p>
          <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105">
            Explore All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    provider: { "@type": "Organization", name: "Taskoria" },
    areaServed: "AU",
    description: service.description,
    serviceType: service.name,
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
    url: `/services/${service.slug}`,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900/95 dark:to-indigo-950/30">
      <section className="relative ">
        <div className="absolute inset-0 bg-gradient-to-br from-[#03070d] via-[#16364e] to-[#13404c] dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 opacity-95"></div>
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 dark:opacity-20"
          style={{ backgroundImage: `url(${service.hero_image})` }}
        />
        
     

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-15 md:py-14">
          <div className="text-center mb-10">
            {/* <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-white">Verified Providers</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-white">10k+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-white">4.9 Average Rating</span>
              </div>
            </div> */}

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
                {service.name}
              </span>
              <span className="block mt-3 text-2xl md:text-2xl font-medium text-white/90">
                Made Simple & Fast
              </span>
            </h1>

            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/80 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-4 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-500 dark:from-indigo-500 dark:to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl">Get Started Now</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Free quotes in minutes • No commitment</p>
                </div>
              </div>
              <LocationSearch onSelect={handleLocationSet} />
              <NewRequestModal 
                open={openModal} 
                onClose={() => { setOpenModal(false) }} 
                presetCategory={selectedCategory} 
                presetLocation={selectedLocation}  
                initialStep={selectedLocation ? 2 : 1} 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        

        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold rounded-full text-sm mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Getting the help you need has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">

            {[
              {
                num: "1",
                title: "Tell Us What You Need",
                desc: "Share your requirements in just a few clicks. The more details, the better the matches!",
                gradient: "from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500",
                bg: "from-indigo-50 to-indigo-100/50 dark:from-indigo-950/50 dark:to-indigo-900/30",
                border: "border-indigo-200 dark:border-indigo-800"
              },
              {
                num: "2",
                title: "Get Free Quotes",
                desc: "Receive competitive quotes from verified professionals. Compare and choose the best fit.",
                gradient: "from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500",
                bg: "from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30",
                border: "border-purple-200 dark:border-purple-800"
              },
              {
                num: "3",
                title: "Hire with Confidence",
                desc: "Review profiles, check ratings, and hire the perfect provider for your needs.",
                gradient: "from-pink-600 to-red-600 dark:from-pink-500 dark:to-red-500",
                bg: "from-pink-50 to-pink-100/50 dark:from-pink-950/50 dark:to-pink-900/30",
                border: "border-pink-200 dark:border-pink-800"
              }
            ].map((step, i) => (
              <div key={i} className={`relative bg-gradient-to-br ${step.bg} rounded-3xl p-8 border-2 ${step.border} hover:shadow-xl transition-all hover:-translate-y-1`}>
                <div className={`absolute -top-6 left-8 w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl`}>
                  {step.num}
                </div>
                <div className="pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Locations */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold rounded-full text-sm mb-4">
              POPULAR LOCATIONS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Find Providers Near You
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Thousands of verified professionals across Australia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.slice(0, 4).map((city, index) => (
              <div
                key={city.name}
                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:-translate-y-2"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={popularCities[index]?.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{popularCities[index]?.activeProviders} Active Providers</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-5">
                    {popularCities[index].providers.slice(0, 3).map((provider, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                          {provider.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{provider.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">{provider.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{provider.completedJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/providers?service=${service.slug}&city=${city.name.toLowerCase()}`}
                    className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-center font-semibold rounded-2xl hover:shadow-lg transition-all group-hover:scale-105"
                  >
                    View All in {city.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        {service.about && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 md:p-12 shadow-lg mb-20 border border-gray-100 dark:border-slate-700">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-headings:font-bold"
              dangerouslySetInnerHTML={{ __html: service.about }}
            />
          </div>
        )}

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-semibold rounded-full text-sm mb-4">
                FREQUENTLY ASKED
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Got Questions?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                We've got answers to help you get started
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {service.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                  >
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{faq.question}</span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center transition-transform ${activeFaq === i ? 'rotate-90 bg-indigo-600 dark:bg-indigo-500' : ''}`}>
                      <ArrowRight className={`w-5 h-5 ${activeFaq === i ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    </div>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-800 dark:via-indigo-800 dark:to-slate-800 text-white p-8 md:p-12 shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Ready to get {service.name} done?</h3>
              <p className="text-lg text-white/80">Post your job once—receive quotes fast, compare providers, and book with confidence.</p>
            </div>
            <Button 
              onClick={handleSelectCategory} 
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold bg-white text-slate-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105 whitespace-nowrap"
            >
              Get Free Quotes
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Script
        id="json-ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}