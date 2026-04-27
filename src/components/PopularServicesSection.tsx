"use client";
import { PiSprayBottle } from "react-icons/pi";
import { GoTools } from "react-icons/go";
import { MdElectricalServices, MdFastfood } from "react-icons/md";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { GiFlowerPot } from "react-icons/gi";
import { MdRoofing } from "react-icons/md";
import { TbGardenCart } from "react-icons/tb";
import { MdOutlinePets } from "react-icons/md";
import { BiLogoDigitalocean } from "react-icons/bi";
import { IoHeartOutline } from "react-icons/io5";
import { MdOutlineEventAvailable } from "react-icons/md";
import { useMemo, useRef } from "react";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import Image from "next/image";

interface ServiceCategory {
  category_id?: string | number;
  name: string;
  main_category?: string;
  slug: string;
  image_url?: { url: string };
}
interface ServiceCategoriesProps {
  categories: ServiceCategory[];
}

const popularServicesFilters = [
  { label: "Cleaners", icon: <PiSprayBottle size={28} /> },
  { label: "Handymen", icon: <GoTools size={26} /> },
  // { label: "Plumbers", icon: <MdOutlineWaterDrop size={26} /> },
  { label: "Electricians", icon: <MdElectricalServices size={28} /> },
  { label: "Lawn Mowing", icon: <GiFlowerPot size={28} /> },
  { label: "Events", icon: <MdOutlineEventAvailable size={28} /> },
  { label: "Roofing", icon: <MdRoofing size={28} /> },
  { label: "Rubbish Removal", icon: <TbGardenCart size={28} /> },
  { label: "IT Services", icon: <BiLogoDigitalocean size={28} /> },
  { label: "Pet Services", icon: <MdOutlinePets size={28} /> },
  { label: "Healthcare Services", icon: <IoHeartOutline size={28} /> },
  { label: "Food & Beverages", icon: <MdFastfood size={22} /> },
];

const categoryMap: Record<string, string> = {
  Cleaners: "Cleaning Services",
  Handymen: "Home Improvement & Trades",
  Electricians: "Electrical & HVAC",
  "Lawn Mowing": "Gardening & Outdoor",
  Roofing: "Home Improvement & Trades",
  "Rubbish Removal": "Transport & Moving",
  Events: "Events & Catering",
  "IT Services": "IT & Digital Services",
  "Pet Services": "Pet Services",
  "Healthcare Services": "Healthcare Services",
  "Food & Beverages": "Food & Beverages",
};

export default function PopularServices() {
  const [activeButton, setActiveButton] = useState<string>(
    popularServicesFilters[0].label
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const { categories: apiCategories , loading } = useCategories();

  const filteredCategories = useMemo(() => {
    if (!activeButton || !apiCategories) return [];
    const activeSlug = categoryMap[activeButton];
    return apiCategories.filter(
      (cat) => cat.slug === activeSlug || cat.main_category === activeSlug
    );
  }, [activeButton, apiCategories]);


  const displayedCategories = filteredCategories.slice(0, 5);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <section className="relative py-6 px-4 sm:px-6 lg:px-8">
   
      <div className="max-w-5xl mx-auto">
        <div className="relative flex items-center border-b border-gray-200 pb-1">

 
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 mr-2"
          >
            <SlArrowLeft size={14} />
          </button>

         
          <div
            ref={scrollRef}
            className="flex flex-1 gap-2 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {popularServicesFilters.map((filter) => {
              const isActive = activeButton === filter.label;
              return (
                <button
                  key={filter.label}
                  onClick={() => setActiveButton(filter.label)}
                  className={`
                    flex flex-col items-center justify-between shrink-0
                    relative pb-3 pt-1 px-2 min-w-[64px] sm:min-w-[72px]
                    transition-colors
                    ${isActive ? "text-blue-600" : "text-gray-500 hover:text-black"}
                  `}
                >
                  <span>{filter.icon}</span>
                  <span className="text-[14px]  mt-1.5 text-center leading-tight whitespace-nowrap">
                    {filter.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 ml-2"
          >
            <SlArrowRight size={14} />
          </button>
        </div>
      </div>

    <div className="max-w-5xl mx-auto mt-6">
  {loading ? (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="h-40 sm:h-52 w-full bg-gray-200" />
          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  ) : displayedCategories.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {displayedCategories.map((cat, index) => (
        <article
          key={cat.category_id ?? cat.slug}
          className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 ${
            index >= 4 ? "hidden sm:block" : ""
          }`}
        >
          <Link href={`/services/${cat.slug}`} className="block">
            <div className="relative h-42 sm:h-65 w-full overflow-hidden">
              <Image
                src={cat.image_url || "/images/default.webp"}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <h4 className="absolute bottom-3 left-3 right-3 text-sm sm:text-base font-semibold text-white leading-snug">
                {cat.name}
              </h4>
            </div>
          </Link>
        </article>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-400 py-8">
      No categories found for{" "}
      <span className="font-medium">{activeButton}</span>.
    </p>
  )}
</div>
    </section>
  );
}