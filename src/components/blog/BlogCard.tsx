"use client";
import { Calendar, Clock, ArrowRight, Eye, Heart, TrendingUp } from "lucide-react";


export const BlogCard = ({ post, onClick, featured = false }) => {
  return (
    <article
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer
        bg-white dark:bg-zinc-900
        border border-gray-200 dark:border-zinc-800
        shadow-lg hover:shadow-2xl dark:shadow-zinc-950/50
        transition-all duration-500
        ${featured ? "md:col-span-2" : ""}`}
    >
      <div className={`relative overflow-hidden ${featured ? "h-80" : "h-56"}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm text-blue-600 dark:text-blue-400 shadow-lg">
            {post.category}
          </span>
        </div>

        {/* {featured && (
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-sm text-white">
            <div className="flex items-center gap-1.5 bg-black/50 dark:bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              <Eye size={14} />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/50 dark:bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              <Heart size={14} />
              <span>{post.likes}</span>
            </div>
          </div>
        )} */}
      </div>

      <div className={`p-6 ${featured ? "md:p-8" : ""}`}>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-zinc-400 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3
          className={`font-bold italic mb-3 line-clamp-2
            text-gray-900 dark:text-zinc-50
            group-hover:text-blue-600 dark:group-hover:text-blue-400
            transition-colors duration-300
            ${featured ? "text-2xl" : "text-xl"}`}
        >
          {post.title}
        </h3>

        <p
          className={`mb-4 text-gray-700 dark:text-zinc-300 ${
            featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
          }`}
        >
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
            >
              #{tag.replace(/\s+/g, "")}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <img
              src={post.authorImage}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-500/30"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                {post.author}
              </p>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                {post.authorRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
            Read More
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {post.views > 3000 && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold shadow-lg">
            <TrendingUp size={12} />
            Trending
          </div>
        </div>
      )}
    </article>
  );
};