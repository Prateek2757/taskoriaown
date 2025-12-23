"use client";
import { ChevronRight, TrendingUp } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "./ui/skeleton";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const staticImages = [
  {
    url: "/images/housecleaning.avif",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    url: "/images/electrician.avif",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    url: "/images/gardening.avif",
    gradient: "from-slate-500/20 to-gray-500/20",
  },
  {
    url: "/images/plumbling.avif",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    url: "/images/weddingphoto.avif",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
];

function ScrollPopularSection() {
  const { categories, loading } = useCategories(5);
  const router = useRouter();


  if (loading) {
    return (
      <section className=" md:hidden pt-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-44 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const totalWidth = (320 + 16 ) * categories.length;

  return (
    <div className="bg-gradient-to-br block  md:hidden from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 px-4">
      <section className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp
                className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce"
                style={{ animationDuration: "2s" }}
              />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Trending Now
              </span>
            </div>
            <h2 className="text-xl text-left font-bold lg:text-3xl bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
              Popular Services
              <span className="absolute left-0 -bottom-2 h-1 w-full rounded-full bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE]" />
            </h2>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <div
            className="flex gap-4 w-max cursor-grab"
                       
          >
            {categories.map((category, index) => (
              <div
                key={`${category.category_id}`}
             
                onClick={() =>
                  router.push(`/services/${category.slug ?? category.category_id}`)
                }
                className="relative w-[320px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-[140px] cursor-pointer group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[50%] p-4 flex flex-col z-10">
                  <h3 className="text-lg text-left font-semibold text-gray-900 leading-tight dark:text-white mb-2">
                    {category.name}
                  </h3>

                  <p className="text-sm text-left text-gray-500 dark:text-gray-400">
                    Explore top-rated services
                  </p>
                </div>

                <div
                  className="absolute right-0 top-0 bottom-0 w-[65%] overflow-hidden"
                  style={{
                    clipPath: "ellipse(80% 100% at 100% 50%)",
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image 
                    fill
                      src={staticImages[index % staticImages.length]?.url}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw,
                       (max-width: 1024px) 50vw,   33vw"
                       quality={75}
                       fetchPriority="high"
                    />

                    <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/10 to-transparent" />
                  </div>
                </div>

                <ChevronRight className="absolute right-4 bottom-4 w-4 h-4 text-gray-400 group-hover:text-blue-600 transition z-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ScrollPopularSection;