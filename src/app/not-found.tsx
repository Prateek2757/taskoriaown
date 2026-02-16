// "use client";

import Link from "next/link";
import './globals.css'
import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Sparkles,
  Map,
  Compass,
  MessageCircle
} from "lucide-react";

export default function NotFound() {
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
    
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({
  //       x: (e.clientX / window.innerWidth) * 20 - 10,
  //       y: (e.clientY / window.innerHeight) * 20 - 10,
  //     });
  //   };

  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  const quickLinks = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Find Services", href: "/services" },
    { icon: Map, label: "How It Works", href: "/#how-it-works" },
    { icon: MessageCircle, label: "Contact", href: "/contact" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div 
          className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"
          style={{
            // transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-delayed"
          style={{
            // transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3C7DED 1px, transparent 1px),
              linear-gradient(to bottom, #3C7DED 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Particles
        {mounted && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))} */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* 404 Number with 3D Effect */}
        <div className="relative mb-8 group">
          <div 
            className="text-[12rem] md:text-[20rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 select-none"
            style={{
              fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
              textShadow: `
                2px 2px 0px rgba(60, 125, 237, 0.1),
                4px 4px 0px rgba(60, 125, 237, 0.08),
                6px 6px 0px rgba(60, 125, 237, 0.06),
                8px 8px 0px rgba(60, 125, 237, 0.04),
                10px 10px 0px rgba(60, 125, 237, 0.02)
              `,
            }}
          >
            404
          </div>
          
          {/* Floating Sparkles */}
          <Sparkles 
            className="absolute -top-8 -right-8 w-12 h-12 text-yellow-400 animate-spin-slow" 
            strokeWidth={1.5}
          />
          <Sparkles 
            className="absolute -bottom-4 -left-4 w-8 h-8 text-blue-400 animate-spin-slow-reverse" 
            strokeWidth={1.5}
          />
        </div>

        {/* Lost Compass Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-xl animate-bounce-subtle">
            <Compass className="w-12 h-12 text-blue-600 animate-spin-very-slow" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse-slow" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 animate-fade-in-up">
          Lost in the Digital Space?
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl animate-fade-in-up animation-delay-100">
          Looks like this page went on a task without leaving a note. 
          <span className="block mt-2 text-base text-slate-500">
            Don't worry — our AI can help you find your way back!
          </span>
        </p>

        {/* Search Bar Mockup
        <div className="mb-10 w-full max-w-md animate-fade-in-up animation-delay-200">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Try searching for what you need..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 hover:shadow-lg"
              onFocus={(e) => {
                e.target.placeholder = "e.g., find electrician, home cleaning...";
              }}
              onBlur={(e) => {
                e.target.placeholder = "Try searching for what you need...";
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all"
              >
                Search
              </Button>
            </div>
          </div>
        </div> */}

        {/* Quick Links */}
        <div className="mb-10 animate-fade-in-up animation-delay-300">
          <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">
            Or explore these popular pages
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="outline"
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Icon className="w-4 h-4 mr-2 group-hover:text-blue-600 transition-colors" />
                    <span className="relative z-10">{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
          <Link href="/">
            <Button 
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="relative z-10">Back to Home</span>
            </Button>
          </Link>
          
          <Link href="/services">
            <Button 
              size="lg"
              variant="outline"
              className="group px-8 py-6 rounded-2xl text-lg font-semibold border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 hover:shadow-lg transition-all duration-300"
            >
              <Search className="w-5 h-5 mr-2 group-hover:text-blue-600 transition-colors" />
              Browse Services
            </Button>
          </Link>
        </div>

        {/* Fun Stats or Message */}
        <div className="mt-16 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200 max-w-2xl animate-fade-in-up animation-delay-500">
          <p className="text-sm text-slate-600 mb-3">
            <span className="font-semibold text-slate-900">Did you know?</span> Over 5,000+ Australians use Taskoria every day to find trusted professionals.
          </p>
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-xs text-slate-500">Cities Served</div>
            </div>
            <div className="w-px h-10 bg-slate-300" />
            <div>
              <div className="text-2xl font-bold text-blue-600">1K+</div>
              <div className="text-xs text-slate-500">Verified Pros</div>
            </div>
            <div className="w-px h-10 bg-slate-300" />
            <div>
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-xs text-slate-500">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z"
            fill="url(#wave-gradient)"
            className="animate-wave"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(60, 125, 237, 0.1)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.1)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Custom Animations */}
      {/* <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }

        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10%, 90% { opacity: 0.5; }
          50% { 
            transform: translateY(-100px) translateX(50px);
            opacity: 0.8;
          }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave {
          0%, 100% { 
            d: path("M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z");
          }
          50% { 
            d: path("M0,80 C240,48 480,48 720,80 C960,112 1200,112 1440,80 L1440,120 L0,120 Z");
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 12s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 10s linear infinite;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style> */}
    </div>
  );
}