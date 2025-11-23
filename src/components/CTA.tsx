// "use client";
// import Link from "next/link";
// import { Button } from "./ui/button";
// import { useSession } from "next-auth/react";

// import { Sparkles, Shield, Users, Zap } from "lucide-react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// function CTA() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const handleJoinAsProvider = async () => {
//     if (session) {
//       toast.error("You Are Already a Provider ", {
//         duration: 500,
//         style: { borderRadius: "8px" },
//         icon: "⚠️",
//       });
//       setTimeout(() => router.push("/"));
//       return;
//     }
//     try {
//       localStorage.removeItem("draftProviderId");
//       const res = await fetch("/api/signup/draft", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ role: "provider" }),
//       });

//       const data = await res.json();
//       if (data?.user?.user_id) {
//         localStorage.setItem("draftProviderId", data.user.user_id);
//         router.push(`/create?user_id=${data.user.user_id}`);
//       }
//     } catch (err) {
//       console.error("Error creating draft provider:", err);
//       alert("Something went wrong. Please try again.");
//     }
//   };
//   return (
//     <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#022024] via-[#2c2781] to-[#8A2BE2]">
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
//           <div className="text-white text-center lg:text-left space-y-8">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
//               <Sparkles className="w-4 h-4" />
//               <span>Trusted by 500+ Users Worldwide</span>
//             </div>

//             <div className="space-y-4">
//               <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
//                 Ready to Experience the Future?
//               </h2>
//               <p className="text-xl text-white/90 max-w-xl mx-auto lg:mx-0">
//                 Join thousands of satisfied customers and providers in our
//                 AI-powered, secured marketplace. Start your journey today!
//               </p>
//             </div>

//             <div className="grid grid-cols-3 gap-4 py-6">
//               <div className="text-center">
//                 <div className="flex justify-center mb-2">
//                   <Shield className="w-8 h-8" />
//                 </div>
//                 <div className="text-sm font-semibold">Secure</div>
//               </div>
//               <div className="text-center">
//                 <div className="flex justify-center mb-2">
//                   <Zap className="w-8 h-8" />
//                 </div>
//                 <div className="text-sm font-semibold">AI-Powered</div>
//               </div>
//               <div className="text-center">
//                 <div className="flex justify-center mb-2">
//                   <Users className="w-8 h-8" />
//                 </div>
//                 <div className="text-sm font-semibold">Community</div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
//               <Link href="/services">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="w-full sm:w-auto bg-white/10 backdrop-blur border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 text-lg px-8 py-6 font-semibold"
//                 >
//                   Find Services
//                 </Button>
//               </Link>

//               <Button
//                 onClick={handleJoinAsProvider}
//                 size="lg"
//                 className="w-full sm:w-auto bg-white text-purple-600 hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 font-semibold shadow-2xl"
//               >
//                 Become a Provider
//               </Button>
//             </div>
//           </div>

//           <div className="relative hidden lg:block">
//             <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="relative w-full max-w-md aspect-square">
//                   <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl"></div>
//                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 animate-float">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
//                         <Sparkles className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-white font-bold text-lg">
//                           AI Matching
//                         </div>
//                         <div className="text-white/80 text-sm">
//                           99% Accuracy
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="absolute bottom-0 right-4 translate-x-1/4 translate-y-1/4 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 animate-float-delayed">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
//                         <Shield className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-white font-bold text-lg">
//                           Secure
//                         </div>
//                         <div className="text-white/80 text-sm">End-to-End</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="absolute top-1/3 left-0 -translate-x-1/4 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 animate-float">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
//                         <Users className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-white font-bold text-lg">
//                           5K+ Users
//                         </div>
//                         <div className="text-white/80 text-sm">
//                           Growing Daily
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/40">
//                     <div className="text-center">
//                       <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <Zap className="w-10 h-10 text-white" />
//                       </div>
//                       <div className="text-white font-bold text-2xl mb-2">
//                         Join Now
//                       </div>
//                       <div className="text-white/90">Get Started Free</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-20px) rotate(2deg);
//           }
//         }

//         @keyframes float-delayed {
//           0%,
//           100% {
//             transform: translateY(0px) translateX(25%) translateX(25%)
//               rotate(0deg);
//           }
//           50% {
//             transform: translateY(-25px) translateX(25%) translateX(25%)
//               rotate(-2deg);
//           }
//         }

//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         .animate-float-delayed {
//           animation: float-delayed 7s ease-in-out infinite;
//         }

//         .delay-1000 {
//           animation-delay: 1s;
//         }
//       `}</style>
//     </section>
//   );
// }

// export default CTA;
"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

function CTA() {
  return (
    <section className="relative py-10 px-2 sm:px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-5 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-pink-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10">
        <div className="relative rounded-[1.5rem] border border-white/40 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-lg p-6 sm:p-8 shadow-xl shadow-gray-900/5 overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
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

          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-700">
                Trusted by 5,000+ users worldwide
              </span>
            </div>

            <h2 className="text-slate-900 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-2xl">
              Ready to Experience the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] animate-gradient">
                Future?
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl leading-relaxed">
              Join thousands of satisfied customers and providers in our
              AI‑powered, secure marketplace. Start your journey today!
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link href="/services">
                <Button
                  variant="outline"
                  className="bg-white/80 border-2 border-gray-300 text-slate-900 hover:bg-white hover:border-gray-400 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg px-6 py-3 text-sm sm:text-base font-semibold"
                >
                  Find Services
                </Button>
              </Link>
              <Link href="/providers/join">
                <Button className="relative overflow-hidden bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white hover:scale-105 border-0 flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 px-6 py-3 text-sm sm:text-base font-semibold group">
                  <span className="relative z-10">Become a Provider</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-4 border-t border-gray-200/50 mt-4 w-full max-w-xl">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">50K+</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">10K+</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1">Service Providers</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-blue-600">4.9/5</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1">Rating</div>
          </div>
        </div> */}

            {/* Bottom line */}
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
