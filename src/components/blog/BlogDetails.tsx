"use client";

import {  Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

interface Post {
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
  content: string;
}

interface Props {
  post: Post;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BlogDetails({ post }: Props) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <article className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8 py-4">
        <div className="mb-3 flex flex-col">
          <button
            className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all hover:gap-3"
            onClick={() => router.back()}
          >
            <IoIosArrowBack  size={32}
              className="group-hover:-translate-x-1 transition-transform duration-300"/><span className="text-left">Back</span>
          </button>
        </div>
        <div className="mt-3 mb-3 self-start inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold text-sm shadow-sm">
          {post.category}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-zinc-50 leading-tight tracking-tight">
          {post.title}

          <p className="text-sm font-semibold text-gray-400 mt-2">
            By{"  "}
            {post.author_name}
          </p>
        </h1>
        <p className="mt-2">Updated : {formatDate(post.published_at)}</p>
        <p className="mt-4 text-2xl text-gray-400">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800 mt-4 mb-3">
          <img src={post.image_url} alt={post.author_name} />
        </div>

        <div
          className="prose prose-xl text-gray-800 leading-7 tracking-wider dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold text-sm shadow-sm hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
            >
              {tag}
              <Tag size={14} />
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
