"use client";

import Link from "next/link";

interface Category {
  category_id: number;
  name: string;
  slug: string;
  keywords: string[] | null;
  main_category?: string;
  image_url?: string;
}
interface Props {
  categories: Category[];
  activeFilter: string | null;
  setActiveFilter: (filter: string) => void;
  loading: boolean;
  slug: string;
}

export default function Services({ categories, loading, slug }: Props) {
  const filtered = [...new Set(categories.map((cat) => cat.main_category))];
 
  const getId = (text: string) =>
    text?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  //  skeleton
  if (loading) {
    return (
      <div className="flex flex-col gap-8 py-4">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-16 w-90 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <ul className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, j) => (
                <li
                  key={j}
                  className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  if (filtered.length === 0) {
    return <p className="text-sm text-gray-400 mt-8">No services found</p>;
  }
  return (
    <div className="flex flex-col grid-cols-2 px-3 gap-8 py-4">
      {filtered.map((filter) => (
        <div key={filter} id={getId(filter ?? "")}>
          <h2 className="text-base md:text-lg  text-blue-600 cursor-pointer dark:text-blue-500 mb-4">
            {filter}
          </h2>
          <ul className="grid grid-cols-2 gap-6">
            {categories
              .filter((cat) => cat.main_category === filter)
              .map((cat) => (
                <li
                  className=" flex gap-4 text-sm md:text-md text-black font-semibold dark:text-gray-300 cursor-pointer"
                  key={cat.main_category} 
                >
                  <Link href={`/cost-guides/${cat.slug}`}>{cat.name} Cost Guide</Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
   
  );
}
