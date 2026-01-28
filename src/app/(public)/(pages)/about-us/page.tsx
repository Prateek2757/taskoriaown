import { Shield, Lock, Award, Heart } from 'lucide-react';
import Image from 'next/image';


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Taskoria | Building a Trusted Local Services Marketplace",
  description:
    "Taskoria is on a mission to make hiring local professionals simple, transparent, and reliable through technology and community trust.",
  keywords: [
    "Taskoria",
    "About Taskoria",
    "Australian service marketplace",
    "verified service providers Australia",
    "secure home services",
    "trusted local professionals",
    "payment protection marketplace",
    "home services Australia"
  ],
  authors: [{ name: "Taskoria Team" }],
  creator: "Taskoria",
  publisher: "Taskoria",
  metadataBase: new URL("https://www.taskoria.com"),

  openGraph: {
    title: "About Taskoria | Building a Trusted Local Services Marketplace",
    description:
      "Taskoria is on a mission to make hiring local professionals simple, transparent, and reliable through technology and community trust",
    url: "https://www.taskoria.com/about-us",
    siteName: "Taskoria",
    images: [
      {
        url: "/images/providers.jpeg",
        width: 1200,
        height: 630,
        alt: "Taskoria verified service providers",
      },
    ],
    type: "website",
  },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "About Taskoria – Trusted & Verified Services",
  //   description:
  //     "Discover how Taskoria makes finding trusted service providers safe, simple, and secure across Australia.",
  //   images: ["/images/providers.jpeg"],
  //   creator: "@taskoria",
  // },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://www.taskoria.com/about-us",
  },
};

export default function AboutUs() {
  const stats = [
    { value: '50K+', label: 'Verified Providers' },
    { value: '500K+', label: 'Jobs Completed' },
    { value: '99.8%', label: 'Satisfaction Rate' },
    { value: '$50M+', label: 'Protected Payments' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust First',
      description: 'Every provider undergoes rigorous verification including background checks, qualification validation, and identity authentication.'
    },
    {
      icon: Lock,
      title: 'Payment Protection',
      description: 'Your money stays secure until the job is done right. Our escrow system ensures both parties are protected.'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'We stand behind every job with our satisfaction guarantee and dedicated dispute resolution team.'
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Built for Australians, by Australians. We understand local needs and deliver neighborhood reliability.'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Founded with a vision to make finding trusted service providers safe and simple for every Australian household.'
    },
    {
      year: '2021',
      title: 'Verification Launch',
      description: 'Introduced our industry-leading verification system, setting new standards for marketplace safety.'
    },
    {
      year: '2023',
      title: 'National Expansion',
      description: 'Reached every major city across Australia, connecting communities with verified local professionals.'
    },
    {
      year: '2024',
      title: 'Leading Innovation',
      description: 'Australia\'s most trusted service marketplace with advanced payment protection and AI-powered matching.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
      
      <section className="relative h-screen flex items-center justify-center text-center md:text-left overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/providers.jpeg"
            alt="Providers Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-white z-10">
          <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Australian Verified & Protected</span>
            </div>
          </div>
          
          <div className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Building Trust in<br />
            <span className="text-blue-200 dark:text-blue-300">Every Connection</span>
          </div>
          
          <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 max-w-3xl leading-relaxed">
            We're on a mission to make finding trusted service providers safe, simple, and secure for every Australian. Because when it comes to your home and family, trust isn't optional.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white m-6 text-center">Our Story</h2>
        <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl mx-auto">
          <p>
            Taskoria was born from a simple frustration: finding someone trustworthy to help with home tasks shouldn't feel like a gamble. Too many Australians had stories of unreliable tradespeople, unclear pricing, or worse—safety concerns inviting strangers into their homes.
          </p>
          <p>
            We knew there had to be a better way. A marketplace where every provider is thoroughly verified, every payment is protected, and every customer feels secure. Not just another platform, but a community built on genuine trust.
          </p>
          <p>
            Today, we're proud to be Australia's most secure service marketplace, connecting hundreds of thousands of homeowners with verified professionals who treat every job with the care it deserves.
          </p>
        </div>
      </section>

      

    
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-24 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Stand For</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              These aren't just values on a wall. They're the principles that guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-slate-300 text-lg leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-15  ">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Our Journey</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From a small startup to Australia's most trusted service marketplace
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 hidden md:block"></div>
          
          <div className="space-y-10">
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                    <div className="text-blue-600 font-bold text-lg mb-2">{item.year}</div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg border-4 border-white z-10">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

