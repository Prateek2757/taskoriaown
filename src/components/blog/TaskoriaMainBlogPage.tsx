"use client";
import  { useState, useMemo } from "react";
import { TrendingUp, Sparkles } from "lucide-react";
import { blogPosts } from "./BlogData";
import { BlogCard } from "./BlogCard";
import { PostDetail } from "./PostDetails";

const categories = ["All Posts", "For Providers", "Future of Work"];

const TaskoriaBlog = () => {
  const [currentView, setCurrentView] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let posts =
      selectedCategory === "All Posts"
        ? blogPosts
        : blogPosts.filter((p) => p.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return posts;
  }, [selectedCategory, searchQuery]);

  const featuredPosts = blogPosts.filter((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setCurrentView("post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- POST DETAIL VIEW ---
  if (currentView === "post" && selectedPost) {
    const relatedPosts = blogPosts
      .filter(
        (p) => p.id !== selectedPost.id && p.category === selectedPost.category
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-zinc-950 dark:to-indigo-950/20 opacity-70"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl italic font-extrabold text-gray-900 dark:text-zinc-50 mb-6 leading-tight">
              Insights & Innovation
              <span className="block mt-2 italic bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                from Taskoria
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-zinc-400 italic mb-8 leading-relaxed">
              Expert advice, industry insights, and success stories to help you
              navigate the future of service marketplaces in Australia.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
              Browse Topics
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory === "All Posts" && searchQuery === "" && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
              <TrendingUp className="text-blue-600 dark:text-blue-400" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-6 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onClick={() => handleSelectPost(post)}
                  featured={true}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
            <Sparkles className="text-blue-600 dark:text-blue-400" />
            {selectedCategory === "All Posts"
              ? "Latest Articles"
              : selectedCategory}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <BlogCard
                key={post.id}
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