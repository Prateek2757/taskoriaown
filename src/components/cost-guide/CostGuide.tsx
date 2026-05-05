"use client";
import FilterServices from "@/components/cost-guide/FilterServices";
import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import Services from "./Services";

export default function CostGuides() {
  const { categories, loading } = useCategories();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const getId = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const handleScroll = (filter: string) => {
    setActiveFilter(filter);

    const section = document.getElementById(getId(filter));

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div
      className="relative max-w-7xl mx-auto h-full overflow-hidden sm:pt-14 pt-8
        dark:bg-[radial-gradient(circle_at_bottom,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)]
        dark:text-white text-gray-600 "
    >
      <div>
        <div>
          <h1 className="text-2xl text-blue-500 font-semibold">
            Explore Our Pricing Resources
          </h1>
        </div>
        <div className="mt-6">
          <p className="text-sm text-black mt-2">
            Not sure what a service should cost? Browse our comprehensive
            pricing guides covering everything from home renovations and
            maintenance to cleaning, gardening, pet care, fitness, and beyond —
            all tailored for Australians.
          </p>
        </div>
      </div>
      <div className="flex mt-6">
        {/* left */}
        <div className="w-1/4 shrink-0 hidden sm:block ">
          <FilterServices
            filterData={activeFilter || ""}
            onChangeFilterData={handleScroll}
          />
        </div>
        {/* right */}
        <div>
          <Services
            categories={categories ?? []}
            activeFilter={activeFilter}
            loading={loading}
            setActiveFilter={setActiveFilter}
          />
        </div>
      </div>
    </div>
  );
}
