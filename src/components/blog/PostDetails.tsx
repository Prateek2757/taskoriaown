import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  Eye,
  Heart,
  Bookmark,
} from "lucide-react";
import { BlogCard } from "./BlogCard";


export const PostDetail = ({ post, relatedPosts, onBack, onSelectPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const renderContent = (content) => {
    const lines = content.replace(/\r\n/g, "\n").split("\n");

    const blocks = []; 
    let paraBuffer = []; 
    let bulletBuffer = []; 

    const flushPara = () => {
      if (paraBuffer.length === 0) return;
      const text = paraBuffer.join(" ").trim();
      paraBuffer = [];
      if (!text) return;

      if (text.startsWith("**") && text.endsWith("**") && text.length > 4 && text.indexOf("**", 2) === text.length - 2) {
        blocks.push(
          <p key={blocks.length} className="text-lg font-bold text-gray-900 dark:text-zinc-100 my-6">
            {text.slice(2, -2)}
          </p>
        );
      }
      else if (text.startsWith("**") && text.includes("**", 2)) {
        const closingIdx = text.indexOf("**", 2);
        const boldPart = text.slice(2, closingIdx);
        const restPart = text.slice(closingIdx + 2);
        blocks.push(
          <p key={blocks.length} className="text-gray-700 dark:text-zinc-300 text-lg leading-relaxed my-6">
            <strong className="text-gray-900 dark:text-zinc-100">{boldPart}</strong>{restPart}
          </p>
        );
      }
      else {
        blocks.push(
          <p key={blocks.length} className="text-gray-700 dark:text-zinc-300 text-lg leading-relaxed my-6">
            {text}
          </p>
        );
      }
    };

    const flushBullets = () => {
      if (bulletBuffer.length === 0) return;
      const items = [...bulletBuffer];
      bulletBuffer = [];
      blocks.push(
        <ul key={blocks.length} className="my-6 ml-6 space-y-2 list-disc">
          {items.map((item, i) => (
            <li key={i} className="text-gray-700 dark:text-zinc-300 text-lg leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    };

    for (const raw of lines) {
      const line = raw.trim();

      if (line === "") {
        flushBullets();
        flushPara();
        continue;
      }

      if (line.startsWith("## ")) {
        flushBullets();
        flushPara();
        blocks.push(
          <h2 key={blocks.length} className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mt-12 mb-6">
            {line.slice(3)}
          </h2>
        );
        continue;
      }

      if (line.startsWith("### ")) {
        flushBullets();
        flushPara();
        blocks.push(
          <h3 key={blocks.length} className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mt-8 mb-3">
            {line.slice(4)}
          </h3>
        );
        continue;
      }

      if (line.startsWith("- ")) {
        flushPara(); 
        bulletBuffer.push(line.slice(2));
        continue;
      }

      if (/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(line)) {
        flushBullets();
        flushPara();
        blocks.push(
          <p key={blocks.length} className="text-base font-medium text-blue-700 dark:text-blue-300 my-4 pl-2 border-l-4 border-blue-400 dark:border-blue-600">
            {line}
          </p>
        );
        continue;
      }

      flushBullets();
      paraBuffer.push(line);
    }

    flushBullets();
    flushPara();

    return blocks;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-3 flex flex-col">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            Back to Blog
          </button>

          <div className="mt-3 self-start inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/20 text-blue-700 dark:text-blue-300 font-semibold text-sm shadow-sm">
            {post.category}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-zinc-50 mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800 mb-3">
          <div className="flex items-center gap-4">
            <img
              src={post.authorImage}
              alt={post.author}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50 dark:ring-blue-500/20 shadow-md"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-zinc-100 text-lg">
                {post.author}
              </p>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                {post.authorRole}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium">
                {new Date(post.publishedDate).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium">{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium">
                {post.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isLiked
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/30 dark:shadow-pink-500/20 scale-105"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            {post.likes + (isLiked ? 1 : 0)}
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isBookmarked
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 scale-105"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            <Bookmark
              size={18}
              fill={isBookmarked ? "currentColor" : "none"}
            />
            {isBookmarked ? "Saved" : "Save"}
          </button>
        </div>

        <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl dark:shadow-zinc-950/50 mb-12 group">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {renderContent(post.content)}
        </div>

        <div className="flex flex-wrap gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-zinc-800">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold text-sm shadow-sm hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
            >
              <Tag size={14} />
              {tag}
            </span>
          ))}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-gray-100 dark:bg-zinc-900/50 py-10 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-8">
              Related Articles
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((rp) => (
                <BlogCard
                  key={rp.id}
                  post={rp}
                  onClick={() => onSelectPost(rp)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};