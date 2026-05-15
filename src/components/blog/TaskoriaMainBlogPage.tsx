"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { PostDetail } from "./PostDetails";
import { blogPosts } from "./BlogData";
import { MdArrowDropDown } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

// const categories = ["All Posts", "For Providers", "Future of Work"];

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
  image_url: string;
};
const TaskoriaBlog = () => {
  const [currentView, setCurrentView] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  


  // const filteredPosts = useMemo(() => {
  //   let filtered =
  //     selectedCategory === "All Posts"
  //       ? posts
  //       : posts.filter((p) => p.category === selectedCategory);

  //   if (searchQuery.trim()) {
  //     const query = searchQuery.toLowerCase();
  //     filtered = filtered.filter(
  //       (post) =>
  //         post.title.toLowerCase().includes(query) ||
  //         post.excerpt.toLowerCase().includes(query) ||
  //         post.tags.some((tag) => tag.toLowerCase().includes(query)),
  //     );
  //   }
  //   return filtered;
  // }, [selectedCategory, searchQuery]);
 
 const categories = useMemo(() => {
    const category = [...new Set(posts.map((p) => p.category))];
    return ["All Posts", ...category];
  }, [posts]);
  const filteredPosts = useMemo(() => {
    let filtered =
      selectedCategory === "All Posts"
        ? posts
        : posts.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.title.toLowerCase().includes(query),
      );
    }
    return filtered;
  }, [posts, selectedCategory, searchQuery]);
  const featuredPosts = filteredPosts.filter((p) => p.is_featured);
  const regularPosts = filteredPosts.filter((p) => !p.is_featured);
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
  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }
  // const handleSelectPost = (post) => {
  //   setSelectedPost(post);
  //   setCurrentView("post");
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };
  const handleSelectPost = (post: Blog) => {
    router.push(`/blog/${post.slug}`);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (currentView === "All Post" && selectedPost) {
    const relatedPosts = blogPosts
      .filter(
        (p) => p.id !== selectedPost.id && p.category === selectedPost.category,
      )
      .slice(0, 3);

    return (
      <PostDetail
        post={selectedPost}
        relatedPosts={relatedPosts}
        onBack={handleBackToHome}
        onSelectPost={handleSelectPost}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <section className="relative overflow-hidden my-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-zinc-950 dark:to-indigo-950/20 opacity-70"></div>
        <div className=" relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-8 md:px-4">
          <div className="flex justify-between">
            <div className="text-left max-w-7xl px-4 mx-auto">
              <h1 className="text-2xl md:text-6xl  font-extrabold text-gray-900 dark:text-zinc-50 mb-6 leading-tight">
                Discover Better Ways to
                <span className="block mt-2  bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Get Things Done
                </span>
              </h1>
              <p className=" text-base md:text-lg text-gray-600 dark:text-zinc-400   leading-relaxed">
                Discover helpful resources, professional insights, and fresh
                ideas from a platform built to connect Australians with trusted
                local professionals.
              </p>
            </div>
            <div className="flex">
              <div className="flex flex-col sm:flex-row gap-5  sm:items-start">
                <div className="relative w-full sm:w-72 hidden sm:block">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full  rounded-3xl bg-gray-100  border-gray-300 
               focus:outline-none focus:border-blue-600 text-gray-400
               pl-8 py-2.5 text-base"
                  />
                  <FiSearch
                    size={22}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" px-8 pb-14 -mt-4  mb-8 rounded-sm w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <div>
              <p className="text-md font-semibold text-blue-700 mb-4">Filter</p>

              <div className="relative w-full max-w-xs" ref={dropdownRef}>
                <div
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedCategory || "Blog Categories"}
                  </span>

                  <MdArrowDropDown
                    size={26}
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <div className="mt-2 h-[2px] w-full bg-gray-300"></div>

                {isOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 shadow-lg z-50 rounded-md overflow-hidden">
                    {categories.map((category, index) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition
                  ${
                    selectedCategory === category
                      ? "bg-gray-100 font-medium"
                      : ""
                  }
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
          </div>
        </div>

        {/* Featured Section */}
        {selectedCategory === "All Posts" && searchQuery === "" && (
          <section className="mb-8 -mt-10 ">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
              <TrendingUp className="text-blue-600 dark:text-blue-400" />
              Featured Articles
            </h2>

            <div className="grid md:grid-cols-6 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard
                  key={post.post_id}
                  post={post}
                  onClick={() => handleSelectPost(post)}
                  featured={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Latest Articles */}
        <section className="-mt-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4 flex items-center gap-3">
            <Sparkles className="text-blue-600 dark:text-blue-400" />
            {selectedCategory === "All Posts"
              ? "Latest Articles"
              : selectedCategory}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <BlogCard
                key={post.post_id}
                post={post}
                onClick={() => handleSelectPost(post)}
              />
            ))}
          </div>
        </section>
      </main>
      <style>{`
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default TaskoriaBlog;
