"use client";
import { ChevronRight, TrendingUp } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import Image from "next/image";

const staticImages = [
  {
    url: "/images/homecleaning.avif",
    accent: "#ef4444",
  },
  {
    url: "/images/handymann.png",
    accent: "#f97316",
  },
  {
    url: "/images/electrician.webp",
    accent: "#64748b",
  },
  {
    url: "/images/plumbers.webp",
    accent: "#3b82f6",
  },
  {
    url: "/images/gardening.avif",
    accent: "#a855f7",
  },
];

function ScrollPopularSection() {
  const { categories, loading } = useCategories(5);
  const router = useRouter();

  if (loading) {
    return (
      <section className="md:hidden pt-6 pb-2">
        <div className="px-4 space-y-3">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-37 w-full rounded-3xl" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="block md:hidden bg-white dark:bg-gray-950 py-5">
      <section className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 px-4 mb-4">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30">
            <TrendingUp
              className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce"
              style={{ animationDuration: "2s" }}
            />{" "}
          </div>
          <h2 className="text-xl text-left font-bold lg:text-3xl bg-[#3C7DED] bg-clip-text text-transparent">
            Popular Services
            <span className="absolute left-0 -bottom-2 h-1 w-full rounded-full bg-[#3C7DED]" />
          </h2>
        </div>

        <div className="overflow-x-auto scrollbar-none pl-4">
          <div className="flex gap-3 w-max pr-4">
            {categories.map((category, index) => {
              const img = staticImages[index % staticImages.length];
              return (
                <div
                  key={category.category_id}
                  onClick={() =>
                    router.push(
                      `/services/${category.slug ?? category.category_id}`
                    )
                  }
                  className="relative w-65 shrink-0 rounded-2xl overflow-hidden h-35 cursor-pointer group shadow-sm hover:shadow-lg transition-shadow duration-300 bg-gray-100 dark:bg-gray-800"
                >
                  <Image
                    fill
                    src={img.url}
                    alt={category.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="280px"
                    quality={75}
                    priority
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-4 pr-10">
                    <h3 className="text-[15px] font-bold text-white leading-snug drop-shadow-sm line-clamp-2">
                      {category.name}
                    </h3>
                  </div>

                  <div className="absolute bottom-3.5 right-3.5 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors duration-200">
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </div>

                  {/* <div
                    className="absolute top-0 left-0 right-0 h-[3px] opacity-80"
                    style={{ background: img.accent }}
                  /> */}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ScrollPopularSection;
