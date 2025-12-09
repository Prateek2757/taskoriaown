"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { MapPin, ArrowRight, Shield, Zap, Award, Star, Sparkles, TrendingUp, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface ServiceData {
  category_id: number;
  name: string;
  description: string;
  hero_image: string;
  about: string;
  whats_included: string[];
  add_ons: string[];
  faqs: { question: string; answer: string }[];
  slug: string;
}

interface CityProvider {
  name: string;
  rating: number;
  logo: string;
  completedJobs: number;
}

interface City {
  name: string;
  image: string;
  providers: CityProvider[];
  activeProviders: number;
}

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug?.join("/") || "";
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const popularCities: City[] = [
    {
      name: "Sydney",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
      activeProviders: 248,
      providers: [
        { name: "Elite Home Services", rating: 4.9, logo: "🏆", completedJobs: 156 },
        { name: "Pro Solutions Co", rating: 4.8, logo: "⚡", completedJobs: 203 },
        { name: "Premium Care", rating: 5.0, logo: "✨", completedJobs: 189 }
      ]
    },
    {
      name: "Melbourne",
      image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&h=600&fit=crop",
      activeProviders: 192,
      providers: [
        { name: "Expert Hands", rating: 4.9, logo: "🎯", completedJobs: 178 },
        { name: "Quality First", rating: 4.7, logo: "💼", completedJobs: 145 },
        { name: "Master Services", rating: 5.0, logo: "🌟", completedJobs: 201 }
      ]
    },
    {
      name: "Brisbane",
      image: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800&h=600&fit=crop",
      activeProviders: 156,
      providers: [
        { name: "Top Tier Pros", rating: 4.8, logo: "🔥", completedJobs: 134 },
        { name: "Swift Solutions", rating: 4.9, logo: "⚙️", completedJobs: 167 },
        { name: "Premier Group", rating: 4.7, logo: "💎", completedJobs: 142 }
      ]
    },
    {
      name: "Perth",
      image: "https://images.unsplash.com/photo-1583783121357-8a9a2a3f3f89?w=800&h=600&fit=crop",
      activeProviders: 134,
      providers: [
        { name: "Ocean City Services", rating: 4.9, logo: "🌊", completedJobs: 112 },
        { name: "Sunrise Experts", rating: 4.8, logo: "☀️", completedJobs: 98 },
        { name: "West Coast Pros", rating: 5.0, logo: "🏖️", completedJobs: 156 }
      ]
    }
  ];

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

  const handleSearch = () => {
    if (location.trim()) {
      window.location.href = `/providers?service=${slug}&location=${encodeURIComponent(location)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 text-lg font-medium">Loading amazing service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Oops! Service Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find what you're looking for.</p>
          <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105">
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
    <main className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] opacity-95"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40"
          style={{ backgroundImage: `url(${service.hero_image})` }}
        />
        
      

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-15 md:py-15">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              {service.name}
              <span className="block text-3xl md:text-3xl font-medium text-indigo-100 mt-4">
                Made Simple & Fast
              </span>
            </h1>
            <p className="text-xl md:text-xl text-indigo-100 max-w-3xl mx-auto">
              {service.description}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3C7DED]  to-[#41A6EE] rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Get Started Now</h3>
                  <p className="text-sm text-gray-600">Free quotes in minutes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your suburb or postcode"
                  className="flex-1 px-5 py-2 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="px-8 py-1 bg-gradient-to-r from-[#3C7DED] to-[#41A6EE] text-white font-bold rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Search
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      <section className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Value Props */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group hover:border-indigo-200">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant matches with qualified providers in your area. No waiting, no hassle.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group hover:border-purple-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Verified</h3>
            <p className="text-gray-600 leading-relaxed">
              Every provider is background checked and reviewed by real customers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group hover:border-pink-200">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Best Quality</h3>
            <p className="text-gray-600 leading-relaxed">
              Only top-rated professionals with proven track records. Excellence guaranteed.
            </p>
          </div>
        </div> */}

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-full text-sm mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting the help you need has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            
            <div className="relative bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-3xl p-8 border-2 border-indigo-200">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tell Us What You Need</h3>
                <p className="text-gray-700 leading-relaxed">
                  Share your requirements in just a few clicks. The more details, the better the matches!
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-8 border-2 border-purple-200">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Free Quotes</h3>
                <p className="text-gray-700 leading-relaxed">
                  Receive competitive quotes from verified professionals. Compare and choose the best fit.
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-3xl p-8 border-2 border-pink-200">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Hire with Confidence</h3>
                <p className="text-gray-700 leading-relaxed">
                  Review profiles, check ratings, and hire the perfect provider for your needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-full text-sm mb-4">
              POPULAR LOCATIONS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Providers Near You
            </h2>
            <p className="text-xl text-gray-600">
              Thousands of verified professionals across Australia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCities.map((city) => (
              <div
                key={city.name}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-indigo-200 hover:-translate-y-2"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{city.activeProviders} Active Providers</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-5">
                    {city.providers.slice(0, 3).map((provider, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
                          {provider.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{provider.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-gray-700 ml-1">{provider.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{provider.completedJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    href={`/providers?service=${service.slug}&city=${city.name.toLowerCase()}`}
                    className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-semibold rounded-2xl hover:shadow-lg transition-all group-hover:scale-105"
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
          <div className="bg-white rounded-3xl p-10 md:p-12 shadow-lg mb-20 border border-gray-100">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-headings:font-bold"
              dangerouslySetInnerHTML={{ __html: service.about }}
            />
          </div>
        )}

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 font-semibold rounded-full text-sm mb-4">
                FREQUENTLY ASKED
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Got Questions?
              </h2>
              <p className="text-xl text-gray-600">
                We've got answers to help you get started
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {service.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                  >
                    <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center transition-transform ${activeFaq === i ? 'rotate-90 bg-indigo-600' : ''}`}>
                      <ArrowRight className={`w-5 h-5 ${activeFaq === i ? 'text-white' : 'text-indigo-600'}`} />
                    </div>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="rounded-2xl bg-slate-900 text-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold">Ready to get {service.name} done?</h3>
              <p className="opacity-90">Post your job once—receive quotes fast, compare providers, and book with confidence.</p>
            </div>
            <a href={`/quote?service=${service.slug}`} className="inline-flex items-center rounded-2xl px-5 py-3 font-semibold bg-white text-slate-900 hover:bg-slate-100">Get free quotes</a>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <Script
        id="json-ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}