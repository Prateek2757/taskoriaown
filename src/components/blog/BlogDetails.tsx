"use client";

import { Tag } from "lucide-react";

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
  console.log("post", post);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <article className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8 py-4">
        <div>
          <div className="mt-3 mb-3 self-start inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold text-sm shadow-sm">
            {post.category}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-zinc-50 leading-tight tracking-tight">
          {post.title}

          <p className="text-sm font-semibold text-gray-400 mt-2">
            By{"  "}{post.author_name}
          </p>
        </h1>
        <p className="mt-2">Updated : {formatDate(post.published_at)}</p>
        <p className="mt-4 text-2xl text-gray-400">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800 mt-4 mb-3">
          <img src={post.image_url} alt={post.author_name} />
        </div>

        <div className="porse porse-lg dark:prose-invert max-w-none">
          {post.content}
        </div>
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
