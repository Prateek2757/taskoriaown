"use client";

import { useState, useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";
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

export default function ServiceCategories() {
  const { categories, loading } = useCategories();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Mark first 9 categories as popular
  const categoriesWithPopularity = useMemo(() => {
    return categories.map((cat, index) => ({
      ...cat,
      popular: index < 9,
    }));
  }, [categories]);

  // Filter categories by search query (popular + non-popular)
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesWithPopularity;

    const query = searchQuery.toLowerCase();
    return categoriesWithPopularity.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query)
    );
  }, [categoriesWithPopularity, searchQuery]);

  // Split popular and remaining categories
  const popularCategories = useMemo(() => {
    return filteredCategories.filter((cat) => cat.popular).slice(0, 9);
  }, [filteredCategories]);

  const remainingCategories = useMemo(() => {
    const popularIds = new Set(popularCategories.map((cat) => cat.category_id));
    return filteredCategories.filter((cat) => !popularIds.has(cat.category_id));
  }, [filteredCategories, popularCategories]);

  const hasSearchResults = searchQuery.trim() !== "";

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  const clearSearch = () => {
    setSearchQuery("");
    setShowAll(false);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#f8fafc] via-white to-[#eef2ff] relative overflow-hidden">
      {/* Soft gradient glows */}
      <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore{" "}
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2] bg-clip-text text-transparent">
              Service Categories
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Discover skilled professionals across diverse categories – from
            creative design to expert development.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div
              className={`relative transition-all duration-300 ${
                isFocused ? "scale-105" : "scale-100"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2] rounded-full blur-xl opacity-0 transition-opacity duration-300 ${
                  isFocused ? "opacity-25" : ""
                }`}
              />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-blue-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {hasSearchResults && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>
                  Found {filteredCategories.length}{" "}
                  {filteredCategories.length === 1 ? "category" : "categories"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {hasSearchResults && filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-8">
              Try another keyword or explore all available categories.
            </p>
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2] text-white font-medium rounded-full hover:opacity-90 transition-all duration-200 shadow-md"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Popular Services */}
        {popularCategories.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Flame className="text-orange-500 w-6 h-6" />
              <h3 className="text-3xl font-bold text-gray-900">
                {hasSearchResults ? "Popular Matches" : "Popular Services"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCategories.map((category, index) => (
                <Link
                  key={category.category_id}
                  href={`/services/${category.slug}`}
                  className="group relative bg-gradient-to-br from-[#00E5FF]/10 via-[#6C63FF]/10 to-[#8A2BE2]/10 border border-transparent hover:border-blue-300 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{
                    animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xl font-bold text-white">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {highlightMatch(category.name, searchQuery)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Explore top-rated services
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Remaining Categories */}
        {remainingCategories.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {hasSearchResults ? "More Results" : "All Categories"}
              </h3>
              {remainingCategories.length > 12 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors duration-200"
                >
                  {showAll
                    ? "Show Less"
                    : `View All (${remainingCategories.length})`}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showAll ? "rotate-90" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-500 ${
                !showAll && remainingCategories.length > 12
                  ? "max-h-74 overflow-hidden"
                  : "max-h-[4500px]"
              }`}
            >
              {(showAll || remainingCategories.length <= 12
                ? remainingCategories
                : remainingCategories.slice(0, 12)
              ).map((category) => (
                <Link
                  key={category.category_id}
                  href={`/services/${category.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-full hover:bg-gradient-to-r from-blue-50 to-purple-50 transition-all duration-300"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-sm font-medium text-blue-700 group-hover:scale-110 transition-transform duration-200">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200 truncate">
                    {highlightMatch(category.name, searchQuery)}
                  </span>
                </Link>
              ))}
            </div>

            {!showAll && remainingCategories.length > 12 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2] text-white font-medium rounded-full hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
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

// Highlight search matches
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-blue-300 text-gray-900 rounded px-1">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
