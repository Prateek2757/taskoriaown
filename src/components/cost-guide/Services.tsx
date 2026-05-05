"use client";
import { useCategories } from "@/hooks/useCategories";
import FilterServices from "./FilterServices";
import { useState } from "react";

interface Category {
  category_id: number;
  name: string;
  slug: string;
  keywords: string[] | null;
  main_category?: string;
  image_url?: string;
}
interface ServicesProps {
  categories: Category[];
  activeFilter: string | null;
   setActiveFilter: (filter: string) => void;
  loading: boolean;
}
export default function Services({
  categories,
  activeFilter,
  setActiveFilter,
  loading,
}: ServicesProps) {
  const filtered = [...new Set(categories.map((cat) => cat.main_category))];

const getId = (text: string) =>
  text?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // if (loading){
  // return (
  //   <div>
  //     <div>
  //       {categories?.map((services) => (
  //         <div key={services.category_id}>
  //           <p>{services.main_category}</p>
  //         </div>
  //       ))}
  //     </div>

  //   </div>
  // );
  // }
  if (filtered.length === 0) {
    return <p className="text-sm text-gray-400 mt-8">No services found</p>;
  }
  return (
    <div className="flex flex-col gap-8 py-4">
      {filtered.map((filter) => (
        <div key={filter} id={getId(filter)}>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
            {filter}
          </h2>
          <ul className="grid grid-cols-3 gap-4">
            {categories
              .filter((cat) => cat.main_category === filter)
              .map((cat) => (
                <li
                  className=" flex gap-4 text-sm text-gray-600 dark:text-gray-300"
                  key={cat.name}
                >
                  {cat.name}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
