//  "use client";

// import { useState, useEffect } from "react";
// import { Sparkles, MapPin, ArrowRight, CheckCircle2, Star, TrendingUp, Zap, Users, Clock } from "lucide-react";
// import { Button } from "./ui/button";
// import { SparklesCore } from "./ui/sparkles";
// import { useTheme } from "next-themes";
// import CategorySearch from "./category/CategorySearch";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// interface Category {
//   category_id: number;
//   name: string;
//   slug?: string;
// }
// export default function HeroSection() {
// const [openModal, setOpenModal] = useState(false);
//   const [slugvalue, setSlugValue] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//     null
//   );
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const { theme } = useTheme()

//   const stats = [
//     { value: "1K+", label: "Verified Providers", icon: CheckCircle2, color: "text-blue-600" },
//     { value: "5K+", label: "Jobs Completed", icon: TrendingUp, color: "text-cyan-600" },
//     { value: "4.5★", label: "Average Rating", icon: Star, color: "text-purple-600" },
//     { value: "24/7", label: "AI Support", icon: Sparkles, color: "text-orange-600" },
//   ];

//   const handlePostJob = async () => {
//     if (!session) {
//       toast.error("Please sign in first", {
//         description: "Redirecting to Sign In page...",
//         duration: 1000,
//         style: { borderRadius: "8px" },
//         icon: "⚠️",
//       });
//       setTimeout(() => router.push("/signin"));
//       setLoading(true);
//       return;
//     }
//     setOpenModal(true);
//   };

//   const handleSelectCategory = (cat: Category) => {
//     setSelectedCategory(cat);
//     setOpenModal(true);
//   };

//   const handleJoinAsProvider = async () => {
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
//       toast.error("Something went wrong. Please try again.");
//     }
//   };
//   return (
//     <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-[radial-gradient(circle_at_right,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)]">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-2 py-1  relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
//           <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">

//              <h1 className="text-5xl md:text-5xl font-extrabold text-foreground dark:text-white leading-tight">
//            The Future of{" "}
//            <span className="relative inline-block bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
//             Service
//             <span className="absolute right-0 bottom-0 translate-y-3 w-full h-5 overflow-hidden">
//               <SparklesCore
//                 background="transparent"
//                 minSize={0.4}
//                 maxSize={1.7}
//                 particleDensity={1100}
//                 className="w-full h-full"
//                 particleColor={theme === "dark" ? "#fff" : "#000"}
//               />
//               <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
//                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
//                 <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
//                 <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
//             </span>
//           </span>{" "}
//           <span className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
//             Marketplaces
//           </span>
//         </h1>

//             <p className="text-md lg:text-md text-gray-400 dark:text-gray-300 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//               Connect with <span className="font-semibold text-gray-900 dark:text-white">verified professionals</span> through our AI-powered platform. Get instant matches, transparent pricing, and guaranteed quality.
//             </p>
//              <div className="max-w-2xl mt-6">
//           <div className="relative w-full group flex flex-col sm:flex-row sm:items-center">
//             <div className="relative flex-1 sm:mr-4 w-full">
//               <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
//               <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
//                 <CategorySearch
//                   onSelect={handleSelectCategory}
//                   placeholder="What service you need? (e.g. Cleaning, Web)"
//                 />
//               </div>
//             </div>

//             <Link href={`/services/${slugvalue}`} className="w-full sm:w-auto mt-4 sm:mt-0">
//               <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold px-8 py-5 shadow-lg hover:shadow-xl active:scale-[0.97] transition-all duration-200">
//                 Search
//               </Button>
//             </Link>
//           </div>
//           </div>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mt-6">
//             <Button
//               onClick={handlePostJob}
//               disabled={loading}
//               className={`flex-1 py-4 sm:py-5 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.97] transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//             >
//               Post a Job <ArrowRight className="w-4 h-4 ml-2" />
//             </Button>

//             {!session && (
//               <Button
//                 variant="outline"
//                 onClick={handleJoinAsProvider}
//                 className="flex-1 py-5 rounded-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//               >
//                 Join as Provider
//               </Button>
//             )}
//           </div>

//           </div>

//           <div className="order-1 lg:order- animate-fade-in-up  " style={{ animationDelay: '0.2s' }}>
//             <div className="relative  w-full h-[500px] sm:h-[600px]  lg:h-auto group">
//               <div className="absolute -inset- bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-[3rem] blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>

//               <div className="relative h-auto bg-gradient-to-br from-white/80 items-center to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur- p-6 lg:p-8 rounded-[2.5rem] border border-white/50 dark:border-gray-700/50 shadow-2xl  group-hover:scale-[1.02] transition-transform duration-500">

//                 <div className="relative h-auto rounded-[2rem] overflow-hidden shadow-2xl">
//                   <img
//                     src="/images/collabrate.png"
//                     alt="Services Illustration"
//                     className="w-full h-full object-cover object-center"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
//                 </div>

//                <div className="absolute top-8 left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
//                       <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">1000+ Pros</div>
//                     </div>
//                   </div>
//                 </div>

//             <div className="absolute top-8 left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
//                   <div className="flex items-center gap-1">
//                     <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
//                       <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">1000+ Pros</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm" style={{ animationDelay: '1s' }}>
//                   <div className="flex items-center gap-3">
//                     <div className="flex gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                       ))}
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rating</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">4.5/5.0</div>
//                     </div>
//                   </div>
//                 </div>

//                <div className="absolute top-8 left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
//                       <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">1000+ Pros</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm" style={{ animationDelay: '1s' }}>
//                   <div className="flex items-center gap-3">
//                     <div className="flex gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                       ))}
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rating</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">4.5/5.0</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute top-8 left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
//                       <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">1000+ Pros</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm" style={{ animationDelay: '1s' }}>
//                   <div className="flex items-center gap-3">
//                     <div className="flex gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                       ))}
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rating</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">4.5/5.0</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute top-1/3 -right-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '0.5s' }}>
//                   <TrendingUp className="w-10 h-10" />
//                 </div>

//                 <div className="absolute bottom-1/3 -left-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '1.5s' }}>
//                   <Users className="w-10 h-10" />
//                 </div>

//                 <div className="absolute bottom-1/3 -left-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '1.5s' }}>
//                   <Users className="w-10 h-10" />
//                 </div>

//                 <div className="absolute bottom-1/3 -left-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '1.5s' }}>
//                   <Users className="w-10 h-10" />
//                 </div>

//                 <div className="absolute top-1/3 -right-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '0.5s' }}>
//                   <TrendingUp className="w-10 h-10" />
//                 </div>

//                 <div className="absolute bottom-1/3 -left-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '1.5s' }}>
//                   <Users className="w-10 h-10" />
//                 </div>

//                 <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 animate-float border border-gray-100 dark:border-gray-700 backdrop-blur-sm" style={{ animationDelay: '1s' }}>
//                   <div className="flex items-center gap-3">
//                     <div className="flex gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                       ))}
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rating</div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-white">4.5/5.0</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute top-1/3 -right-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '0.5s' }}>
//                   <TrendingUp className="w-10 h-10" />
//                 </div>

//                 <div className="absolute bottom-1/3 -left-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl p-5 animate-float" style={{ animationDelay: '1.5s' }}>
//                   <Users className="w-10 h-10" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-15px) rotate(2deg);
//           }
//         }

//         .animate-fade-in-up {
//           animation: fade-in-up 1s ease-out forwards;
//           opacity: 0;
//         }

//         .animate-float {
//           animation: float 4s ease-in-out infinite;
//         }

//         @media (max-width: 1024px) {
//           .animate-float {
//             animation: float 3s ease-in-out infinite;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import { Button } from "../components/ui/button";
import { Sparkles, MapPin, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NewRequestModal from "./leads/RequestModal";
import CategorySearch from "./category/CategorySearch";
import { SparklesCore } from "./ui/sparkles";
import { useTheme } from "next-themes";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import Earth from "./ui/globe";

interface Category {
  category_id: number;
  name: string;
  slug?: string;
}

export default function HeroSection() {
  const [openModal, setOpenModal] = useState(false);
  const [slugvalue, setSlugValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { joinAsProvider } = useJoinAsProvider();

  const { theme } = useTheme();
  const handlePostJob = async () => {
    // if (!session) {
    //   toast.error("Please sign in first", {
    //     description: "Redirecting to Sign In page...",
    //     duration: 1000,
    //     style: { borderRadius: "8px" },
    //     icon: "⚠️",
    //   });
    //   setTimeout(() => router.push("/signin"));
    //   setLoading(true);
    //   return;
    // }
    setOpenModal(true);
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setOpenModal(true);
  };

  return (
    <section
      className="bg-gray-50 relative py-11 text-center overflow-hidden 
  dark:bg-[radial-gradient(circle_at_right,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)] "
    >
      {/* <Earth
        mapBrightness={6}
        dark={0}
        baseColor={[1, 1, 1]}
        glowColor={[1, 1, 1]}
        className="absolute h-[800px] max-w-[900px] left-1/2 bottom-0 -translate-x-1/2 -translate-y-0 opacity-5"
      /> */}
      <img
        src="/images/bglines.png"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 border bg-card dark:bg-gray-800 rounded-full px-4 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" /> AI-Powered •
            Community Driven
          </div>
          <h1 className="text-3xl md:text-7xl font-extrabold  font- text-foreground dark:text-white leading-tight mb-0 md:mb-8 mt-2 md:mt-0">
            The Future of{" "}
            <span className="relative inline-block bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
              Service
              <span className="absolute right-0 bottom-0 translate-y-3 w-full h-5 overflow-hidden">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1.7}
                  particleDensity={1100}
                  className="w-full h-full"
                  particleColor={theme === "dark" ? "#fff" : "#000"}
                />{" "}
                <div className="absolute inset-x-20  top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
              </span>
            </span>{" "}
            <span className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
              Marketplaces
            </span>
          </h1>

          <p className="max-w-xl mx-auto mt-4 text-[15px] text-gray-400 dark:text-gray-300 hidden sm:block">
            Connect with verified professionals through our AI-powered platform.
            Experience trust, transparency, and innovation in every service
            interaction.
          </p>

          <div className="max-w-2xl mx-auto mt-6 sm:px-4">
            <div className="relative w-full max-w-3xl group flex sm:items-center max-sm:gap-2">
              <div className="relative flex-1 sm:mr-4 w-full">
                <div className="absolute -inset-[2px] rounded-lg bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative flex items-center bg-white dark:bg-gray-800    rounded-lg  hover:shadow-lg transition-all duration-300">
                  <CategorySearch
                    onSelect={handleSelectCategory}
                    placeholder="What service you need? (e.g. Cleaning, Web)"
                  />
                </div>
              </div>

              <Link
                href={`/services/${slugvalue}`}
                className="sm:w-auto sm:mt-0"
              >
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold  sm:px-7 py-5  shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 active:scale-[0.97] transition-all duration-200">
                  <span className="max-sm:hidden">Search</span>
                  <div className="sm:hidden">
                    <Search />
                  </div>
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2 sm:mt-4 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" /> Serving 50+ cities
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4 justify-center max-w-md mx-auto mt-6">
            <Button
              onClick={handlePostJob}
              disabled={loading}
              className="flex-1 py-5
                bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white "
            >
              Post a Job <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <NewRequestModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              presetCategory={selectedCategory}
            />

            {!session && (
              <Button
                variant="outline"
                onClick={joinAsProvider}
                className="flex-1 py-5"
              >
                Join as Provider
              </Button>
            )}
          </div>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto mt-6 
  bg-[rgba(255,255,255,.2)] dark:bg-white/5 backdrop-blur-[2px] 
  border dark:border-white/10 
  rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,.1)] border-[rgba(255,255,255,.3)]"
          >
            {[
              {
                value: "1K+",
                label: "Verified Providers",
                gradient: "from-blue-500 to-blue-700",
              },
              {
                value: "5K+",
                label: "Jobs Completed",
                gradient: "from-cyan-500 to-cyan-700",
              },
              {
                value: "4.5★",
                label: "Average Rating",
                gradient: "from-purple-500 to-purple-700",
              },
              {
                value: "24/7",
                label: "AI Support",
                gradient: "from-orange-500 to-orange-700",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`
        relative text-center hover:scale-[1.04] transition-all
        after:content-[''] after:absolute after:top-[10%] after:h-[80%] after:w-px after:bg-gray-200 dark:after:bg-gray-700
        after:-right-3 md:after:-right-4
        ${index % 2 !== 0 ? "after:hidden" : "after:block"}
        ${index === 1 ? "md:after:block" : ""}
        ${index === 3 ? "md:after:hidden" : ""}
      `}
              >
                <div
                  className={`text-xl sm:text-4xl font-extrabold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                >
                  {item.value}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-sm">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
