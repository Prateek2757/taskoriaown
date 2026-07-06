
"use client";

import { useMemo, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const popularServicesFilters = [
  {
    label: "Cleaning Services",
    description: "House, office & deep cleans",
    mainCategory: "Cleaning Services",
  },
  {
    label: "Home Improvement & Trades",
    description: "Repairs, assembly & installs",
    mainCategory: "Home Improvement & Trades",
  },
  {
    label: "Electrical & HVAC",
    description: "Wiring, faults & fit-outs",
    mainCategory: "Electrical & HVAC",
  },
  {
    label: "Gardening & Outdoor",
    description: "Mowing, edging & garden care",
    mainCategory: "Gardening & Outdoor",
  },
  {
    label: "Events & Catering",
    description: "Planning, styling & staffing",
    mainCategory: "Events & Catering",
  },
  {
    label: "Transport & Moving",
    description: "Junk, green waste & skip bins",
    mainCategory: "Transport & Moving",
  },
  {
    label: "IT & Digital Services",
    description: "Support, networking & more",
    mainCategory: "IT & Digital Services",
  },
  {
    label: "Pet Services",
    description: "Walking, grooming & sitting",
    mainCategory: "Pet Services",
  },
  {
    label: "Healthcare Services",
    description: "Nursing, physio & aged care",
    mainCategory: "Healthcare Services",
  },
  {
    label: "Other Services",
    description: "Other available services",
    mainCategory: "Other Services",
  },
];

export default function PopularServices() {
  const router = useRouter();
  const { categories: apiCategories, loading } = useCategories();

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const sections = useMemo(() => {
    if (!apiCategories) return [];

    return popularServicesFilters.map((filter) => ({
      ...filter,
      categories: apiCategories.filter(
        (cat) =>
          cat.slug === filter.mainCategory ||
          cat.main_category === filter.mainCategory,
      ),
    }));
  }, [apiCategories]);

  if (loading) {
    return (
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-8 w-40 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="animate-pulse rounded-2xl bg-white w-72 h-48"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="mx-auto max-w-7xl space-y-12 justify-center">
        {sections.map((section) =>
          section.categories.length === 0 ? null : (
            <div key={section.label}>
              <div className="flex items-center justify-between  gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-[#2563EB]">
                  {section.label}
                </h2>
                {section.categories.length > 4 && (
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="text-sm md:text-md text-blue-600  hover:underline whitespace-nowrap shrink-0"
                  >
                    {expandedSections[section.label]
                      ? "See Less"
                      : `See More (${section.categories.length})`}
                  </button>
                )}
              </div>

              <div
                className={
                  expandedSections[section.label]
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-2"
                    : "grid grid-cols-2 sm:flex sm:flex-row gap-3 overflow-x-auto pb-2"
                }
              >
                {(expandedSections[section.label]
                  ? section.categories
                  : section.categories.slice(0, 4)
                ).map((category, index) => (
                  <div
                    key={category.category_id}
                    onClick={() =>
                      router.push(
                        `/services/${category.slug ?? category.category_id}`,
                      )
                    }
                    className="relative sm:w-78 sm:shrink-0 rounded-2xl overflow-hidden h-36 sm:h-48 cursor-pointer group shadow-sm hover:shadow-lg transition-shadow duration-300 bg-gray-100 dark:bg-gray-800"
                  >
                    <Image
                      title="popular categories"
                      fill
                      src={category.image_url ?? ""}
                      alt={category.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 288px"
                      priority={index === 0}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-3 sm:p-4 pr-8 sm:pr-10">
                      <h3 className="text-[13px] sm:text-[15px] font-bold text-white leading-snug line-clamp-2">
                        {category.name}
                      </h3>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors duration-200">
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
