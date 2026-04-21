"use client";
import { PiSprayBottle } from "react-icons/pi";
import { GoTools } from "react-icons/go";
import { MdElectricalServices } from "react-icons/md";
import { MdOutlineWaterDrop } from "react-icons/md";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { GiFlowerPot } from "react-icons/gi";
import { AiOutlineFormatPainter } from "react-icons/ai";
import { TbAirConditioning } from "react-icons/tb";
import { MdRoofing } from "react-icons/md";
import { TbGardenCart } from "react-icons/tb";
import { MdOutlinePets } from "react-icons/md";
import { useMemo, useState } from "react";
import usePagination from "@/hooks/usePagination";
import { useCategories } from "@/hooks/useCategories";
import { MdOutlineEventAvailable } from "react-icons/md";
import Link from "next/link";
import { BiLogoDigitalocean } from "react-icons/bi";


interface ServiceCategory {
  category_id?: string | number;
  name: string;
  main_category?: string;
  slug: string;
}
interface ServiceCategoriesProps {
  categories: ServiceCategory[];
}

const popularServicesFilters = [
  { label: "Cleaners", icon: <PiSprayBottle size={33} /> },
  { label: "Handymen", icon: <GoTools size={30} /> },
  { label: "Plumbers", icon: <MdOutlineWaterDrop size={30} /> },
  { label: "Electricians", icon: <MdElectricalServices size={32} /> },
  { label: "Lawn Mowing", icon: <GiFlowerPot size={32} /> },
  { label: "Painters", icon: <AiOutlineFormatPainter size={32} /> },
  {label:"Events & Catering" , icon:<MdOutlineEventAvailable size={32} />},
  {label: "Air Conditioning & Heating", icon: <TbAirConditioning size={32} />},
  { label: "Roofing", icon: <MdRoofing size={32} /> },
  { label: "Rubbish Removal", icon: <TbGardenCart size={32} /> },
  {label:"IT & Digital Services"  ,icon:<BiLogoDigitalocean size={32} />},
  {label: "Pet Services" ,icon:<MdOutlinePets size={32}/>}
];
const categoryMap: Record<string, string> = {
  Cleaners: "Cleaning Services",
  Handymen: "Home Improvement & Trades",
  Plumbers: "plumbing",
  Electricians: "Electrical & HVAC",
  "Lawn Mowing": "Gardening & Outdoor",
  Painters: "painting",
  "Air Conditioning & Heating": "air-conditioning",
  Roofing: "Home Improvement & Trades",
  "Rubbish Removal": "Transport & Moving",
  "Events & Catering": "Events & Catering", 
  "IT & Digital Services" :"IT & Digital Services",
  "Pet Services": "Pet Services",
}

const highlightMatch = (text: string) => text;

export default function PopularServices({
  categories,
}: ServiceCategoriesProps) {
  const [activeButton, setActiveButton] = useState<string | null>(
    popularServicesFilters[0]?.label ?? null,
  );

  const { categories: apiCategories } = useCategories();
  console.log("main:", apiCategories);

  const { paginatedData, currentPage, setCurrentPage, totalPages } =
    usePagination(popularServicesFilters, 6);

  //filteration logic
  const filteredCategories = useMemo(() => {
    
    if (!activeButton || !apiCategories) return [];
    const activeSlug = categoryMap[activeButton];
    return apiCategories.filter(
      (cat) => cat.slug === activeSlug || cat.main_category === activeSlug,
    );
  }, [activeButton, apiCategories]);
  
  console.log("apiCategories on filter:", apiCategories);
  return (
    <section className="relative py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-opacity ${
            currentPage > 1 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <SlArrowLeft size={20} />
        </button>

        <div className="flex flex-1 justify-around px-4">
          {paginatedData.map((serviceFilter) => {
            const isActive = activeButton === serviceFilter.label;
            const matchedCategory = apiCategories?.find(
              (cat) => cat.slug === categoryMap[serviceFilter.label],
            );
            console.log("data:", matchedCategory);

            return (
              <button
                key={serviceFilter.label}
                onClick={() => setActiveButton(serviceFilter.label)}
                className={`flex flex-col items-center justify-between gap-2 shrink-0 relative pb-3 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{serviceFilter.icon}</span>

                <span className="text-sm font-semibold">
                  {serviceFilter.label}
                </span>

                <span
                  className={`absolute bottom-0 left-0 w-full h-[3px] rounded-full transition-all duration-300 ${
                    isActive ? "bg-blue-600" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-opacity ${
            currentPage < totalPages
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <SlArrowRight size={20} />
        </button>
      </div>
      <div className="max-w-7xl mx-auto mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <article
              key={cat.category_id ?? cat.slug}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <Link href={`/services/${cat.slug}`} className="block">
                <div className="relative h-48 w-full overflow-hidden">
                  {(() => {
                    
                    return (
                      <div className="mt-4">
                        {/* <Image
                          src={staticImage?.url || "/images/default.webp"}
                          alt={cat.name}
                          fill
                          className="object-cover  transition duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                         
                        /> */}
                        <div
                          className={`absolute inset-0 bg-linear-to-t ${"from-black/60 to-transparent"}`}
                        />
                      </div>
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <h4 className="absolute bottom-3 left-4 right-4 text-lg font-semibold text-white">
                    {highlightMatch(cat.name)}
                  </h4>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-400 py-6">
            No categories found for{" "}
            <span className="font-medium">{activeButton}</span>.
          </p>
        )}
      </div>
    </section>
  );
}
