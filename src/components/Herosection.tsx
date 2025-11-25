"use client";

import { Button } from "../components/ui/button";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NewRequestModal from "./leads/RequestModal";
import CategorySearch from "./category/CategorySearch";
import { SparklesCore } from "./ui/sparkles";
import { useTheme } from "next-themes";

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
const {theme} =useTheme()
  const handlePostJob = async () => {
    if (!session) {
      toast.error("Please sign in first", {
        description: "Redirecting to Sign In page...",
        duration: 1000,
        style: { borderRadius: "8px" },
        icon: "⚠️",
      });
      setTimeout(() => router.push("/signin"));
      setLoading(true);
      return;
    }
    setOpenModal(true);
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setOpenModal(true);
  };

  const handleJoinAsProvider = async () => {
    try {
      localStorage.removeItem("draftProviderId");
      const res = await fetch("/api/signup/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "provider" }),
      });

      const data = await res.json();
      if (data?.user?.user_id) {
        localStorage.setItem("draftProviderId", data.user.user_id);
        router.push(`/create?user_id=${data.user.user_id}`);
      }
    } catch (err) {
      console.error("Error creating draft provider:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative py-14 text-center overflow-hidden bg-gradient-to-b  dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
        
          <div className="inline-flex items-center gap-2 border bg-card dark:bg-gray-800 rounded-full px-4 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" /> AI-Powered •
            Community Driven
          </div>
       <h1 className="text-5xl md:text-7xl font-extrabold  font- text-foreground dark:text-white leading-tight">
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

          <p className="mt-4 text-[15px] text-gray-500 dark:text-gray-300">
            Connect with verified professionals through our AI-powered platform.
            Experience trust, transparency, and innovation in every service
            interaction.
          </p>

          <div className="max-w-2xl mx-auto mt-6 px-4">
            <div className="relative w-full max-w-3xl group flex flex-col sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:mr-4 w-full">
                <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                  <CategorySearch
                    onSelect={handleSelectCategory}
                    placeholder="What service you need? (e.g. Cleaning, Web)"
                  />
                </div>
              </div>

              <Link
                href={`/services/${slugvalue}`}
                className="w-full sm:w-auto mt-4  sm:mt-0"
              >
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold  px-7 py-5  shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 active:scale-[0.97] transition-all duration-200">
                  Search 
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" /> Serving 50+ cities
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mt-6">
            <Button
              onClick={handlePostJob}
              disabled={loading}
              className={`flex-1 py-4 sm:py-5  bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.97] transition-all duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
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
                onClick={handleJoinAsProvider}
                className="flex-1 py-5 rounded-xl border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Join as Provider
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Verified Providers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">5K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Jobs Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.5★</div>
              <div className="text-gray-600 dark:text-gray-300">
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
