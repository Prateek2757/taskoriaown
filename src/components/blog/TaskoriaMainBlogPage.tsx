"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { TrendingUp, Sparkles } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { MdArrowDropDown } from "react-icons/md";
import usePagination from "@/hooks/usePaginationblog";
import { RiArrowRightSLine } from "react-icons/ri";

type Blog = {
  post_id: number;
  slug: string;
  title: string;
  excerpt: string;
  author_name: string;
  author_role: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  views: number;
  likes: number;
  read_time: string;
  published_at: string;
  updated_at?: string;
  image_url: string;
};

const TaskoriaBlog = ({ initialPosts }: { initialPosts: Blog[] }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const category = [...new Set(initialPosts.map((p) => p.category))];
    return ["All Posts", ...category];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    let filtered =
      selectedCategory === "All Posts"
        ? initialPosts
        : initialPosts.filter((p) => p.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPosts = filteredPosts.filter((p) => p.is_featured);
  const regularPosts = filteredPosts.filter((p) => !p.is_featured);

  const displayPosts =
    searchQuery || selectedCategory !== "All Posts"
      ? filteredPosts
      : regularPosts;
  const {
    paginatedData: PaginatedDisplayPosts,
    loadMore,
    hasMore,
    hasLess,
    loadLess,
  } = usePagination(displayPosts, 3);
  const postsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 mb-4 to-white dark:from-zinc-950 dark:to-zinc-900">
      <section className="relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-zinc-950 dark:to-indigo-950/20 opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-8 md:px-4">
          <div className="flex justify-between">
            <div className="text-left max-w-7xl px-4 mx-auto">
              <h1 className="text-3xl md:text-6xl font-extrabold text-gray-900 dark:text-zinc-50 mb-6 leading-tight">
                Discover Better Ways to
                <span className="block mt-2 bg-linear-to-r from-blue-600 to-[#2563EB] dark:from-blue-400 dark:to-[#2563EB] bg-clip-text text-transparent">
                  Get Things Done
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed">
                Discover helpful resources, professional insights, and fresh
                ideas from a platform built to connect Australians with trusted
                local professionals.
              </p>
            </div>

            <div className="flex">
              <div className="relative w-full sm:w-72 hidden sm:block">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-3xl bg-gray-200 border-gray-300 focus:outline-none focus:border-blue-600 text-gray-400 pl-8 py-2.5 text-base dark:bg-zinc-900"
                />
              </div>
            </div>
          </div>
          <div className="relative w-full my-6  sm:w-72 sm:hidden dark:bg-zinc-900 ">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-3xl bg-gray-200 border-gray-300 focus:outline-none focus:border-blue-600 text-gray-400 pl-8 py-2.5 text-base"
            />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="px-8 pb-14 -mt-4 mb-8 rounded-sm w-full ">
          <p className="text-xl sm:text-3xl font-semibold text-[#2563EB] mb-4">
            Filter
          </p>

          <div className="relative w-full max-w-xs" ref={dropdownRef}>
            <div
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-lg text-gray-700 font-medium">
                {selectedCategory || "All Posts"}
              </span>
              <MdArrowDropDown
                size={26}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </div>

            <div className="mt-2 h-0.5 bg-gray-300" />

            {isOpen && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white shadow-lg z-50 rounded-sm overflow-hidden">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition  dark:text-white dark:bg-zinc-900 dark:shadow-zinc-950/50 dark:border-zinc-800 dark:hover:bg-gray-800
                      ${selectedCategory === category ? "bg-gray-100 font-medium" : ""}
                      ${index !== 0 ? "border-t border-gray-100" : ""}
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedCategory === "All Posts" &&
          searchQuery === "" &&
          featuredPosts.length > 0 && (
            <section className="mb-8 -mt-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
                <TrendingUp className="text-[#2563EB] dark:text-blue-400" />
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-6 gap-8">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.post_id} post={post} featured={true} />
                ))}
              </div>
            </section>
          )}

        {PaginatedDisplayPosts.length > 0 && (
          <section>
            <div className="flex justify-between">
              <h2 className=" text-2xl md:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4 flex items-center gap-3">
                <Sparkles className="text-[#2563EB] dark:text-blue-400" />
                {selectedCategory === "All Posts"
                  ? "Latest Articles"
                  : selectedCategory}
              </h2>
              {displayPosts.length > 3 && (hasMore || hasLess) && (
                <button
                  onClick={() => {
                    if (hasMore) {
                      loadMore();
                      setTimeout(() => {
                        postsRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "end",
                        });
                      }, 100);
                    } else {
                      loadLess();
                    }
                  }}
                  className="w-32 h-10 flex items-center justify-center rounded-xl text-white bg-[#2563EB] hover:bg-blue-600 transition-colors"
                >
                  {hasMore ? "See More" : "See Less"}
                  <RiArrowRightSLine size={22} />
                </button>
              )}
            </div>

            <div
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
              ref={postsRef}
            >
              {PaginatedDisplayPosts.map((post) => (
                <BlogCard key={post.post_id} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TaskoriaBlog;
