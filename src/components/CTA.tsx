
"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

function CTA() {
  return (
    <section className="relative py-10 px-2 sm:px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:bg-[radial-gradient(circle_at_center_bottom,_rgba(76,112,255,0.18)_0%,_rgba(0,0,0,1)_70%)] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-5 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-pink-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10">
        <div className="relative rounded-[1.5rem] border border-white/40 bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:bg-[radial-gradient(circle_at_top,_rgba(76,112,255,0.18)_0%,_rgba(0,0,0,1)_70%)] backdrop-blur-lg p-6 sm:p-8 shadow-xl shadow-gray-900/5 overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
          <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>

          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gradient-to-br from-blue-400 to-purple-400 rounded-tl-[1.5rem] opacity-60 transition-all duration-300 group-hover:w-16 group-hover:h-16"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gradient-to-bl from-purple-400 to-pink-400 rounded-tr-[1.5rem] opacity-60 transition-all duration-300 group-hover:w-16 group-hover:h-16"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gradient-to-tr from-pink-400 to-blue-400 rounded-bl-[1.5rem] opacity-60 transition-all duration-300 group-hover:w-16 group-hover:h-16"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gradient-to-tl from-blue-400 to-purple-400 rounded-br-[1.5rem] opacity-60 transition-all duration-300 group-hover:w-16 group-hover:h-16"></div>

          <div className="absolute top-5 right-10 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div
            className="absolute bottom-8 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/3 right-5 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="relative z-10 flex flex-col items-center  text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium dark:text-white text-slate-700">
                Trusted by 5,000+ users worldwide
              </span>
            </div>

            <h2 className="text-slate-900 text-2xl sm:text-3xl lg:text-4xl dark:text-white font-bold leading-tight max-w-2xl">
              Ready to Experience the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] animate-gradient">
                Future?
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl leading-relaxed">
              Join thousands of satisfied customers and providers in our
              AI‑powered, secure marketplace. Start your journey today!
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link href="/services">
                <Button
                  variant="outline"
                  className="bg-white/80 border-2 border-gray-300 text-slate-900 dark:text-white hover:bg-white hover:border-gray-400 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg px-6 py-3 text-sm sm:text-base font-semibold"
                >
                  Find Services
                </Button>
              </Link>
              <Link href="/providers">
                <Button className="relative overflow-hidden bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white hover:scale-105 border-0 flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 px-6 py-3 text-sm sm:text-base font-semibold group">
                  <span className="relative z-10">Become a Provider</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
            </div>

         
            <div className="pt-3">
              <div className="h-1 w-16 bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] rounded-full shadow-lg shadow-purple-500/50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}

export default CTA;
