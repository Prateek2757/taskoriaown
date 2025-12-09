"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  Loader2,
  Search,
  X,
  TrendingUp,
  FolderOpen,
  Flame,
} from "lucide-react";
import Link from "next/link";

interface ServiceCategoriesProps {
  categories: Array<{
    category_id: string;
    name: string;
    slug: string;
  }>;
}

export default function ServiceCategoriesClient({ categories }: ServiceCategoriesProps) {
    
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const categoriesWithPopularity = useMemo(() => {
    return categories.map((cat, index) => ({
      ...cat,
      popular: index < 9,
    }));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesWithPopularity;
    const query = searchQuery.toLowerCase();
    return categoriesWithPopularity.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query)
    );
  }, [categoriesWithPopularity, searchQuery]);

  const popularCategories = useMemo(() => {
    return filteredCategories.filter((cat) => cat.popular).slice(0, 9);
  }, [filteredCategories]);

  const remainingCategories = useMemo(() => {
    const popularIds = new Set(popularCategories.map((cat) => cat.category_id));
    return filteredCategories.filter((cat) => !popularIds.has(cat.category_id));
  }, [filteredCategories, popularCategories]);

  const hasSearchResults = searchQuery.trim() !== "";

  if (!categories) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </section>
    );
  }

  const clearSearch = () => {
    setSearchQuery("");
    setShowAll(false);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#f8fafc] via-white to-[#eef2ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-blue-100 dark:bg-blue-800 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-100 dark:bg-purple-800 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Explore{" "}
            <span className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
              Service Categories
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Discover skilled professionals across diverse categories – from creative design to expert development.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className={`relative transition-transform duration-300 ${isFocused ? "scale-95" : "scale-90"}`}>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {hasSearchResults && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <TrendingUp className="w-4 h-4" />
                <span>
                  Found {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}
                </span>
              </div>
            )}
          </div>
        </div>

        {hasSearchResults && filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Try another keyword or explore all available categories.
            </p>
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-medium rounded-full hover:opacity-90 transition-all shadow-md"
            >
              Clear Search
            </button>
          </div>
        )}

        {popularCategories.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Flame className="text-orange-500 w-6 h-6" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {hasSearchResults ? "Popular Matches" : "Popular Services"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCategories.map((category, index) => (
                <Link
                  key={category.category_id}
                  href={`/services/${category.slug}`}
                  className="group relative bg-white dark:bg-gray-800 border border-transparent hover:border-blue-300 dark:hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xl font-bold text-white">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {highlightMatch(category.name, searchQuery)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Explore top-rated services
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {remainingCategories.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {hasSearchResults ? "More Results" : "All Categories"}
              </h3>
              {remainingCategories.length > 12 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2 transition-colors duration-200"
                >
                  {showAll ? "Show Less" : `View All (${remainingCategories.length})`}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-90" : ""}`}
                  />
                </button>
              )}
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-500 ${
                !showAll && remainingCategories.length > 12 ? "max-h-72 overflow-hidden" : "max-h-[4500px]"
              }`}
            >
              {(showAll || remainingCategories.length <= 12
                ? remainingCategories
                : remainingCategories.slice(0, 12)
              ).map((category) => (
                <Link
                  key={category.category_id}
                  href={`/services/${category.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300 group-hover:scale-110 transition-transform duration-200">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                    {highlightMatch(category.name, searchQuery)}
                  </span>
                </Link>
              ))}
            </div>

            {!showAll && remainingCategories.length > 12 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-medium rounded-full hover:opacity-90 transition-shadow shadow-md hover:shadow-lg"
                >
                  Show All {remainingCategories.length} Categories
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-blue-300 dark:bg-blue-600 text-gray-900 dark:text-gray-100 rounded px-1">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}