"use client";
import { Tag } from "lucide-react";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { renderContent } from "../renderContent";
import Image from "next/image";
import { BlogCardList } from "./BlogCard";

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
  updated_at?: string;
  image_url: string;
  content?: string;
}

interface Props {
  post: Post;
  filteredPosts: Post[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BlogDetails({ post, filteredPosts }: Props) {
  const content = post.content ?? "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <article className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 py-4">
        <div className="mb-3 flex flex-col">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[#2563EB] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all hover:gap-3"
          >
            <IoIosArrowBack
              size={32}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="text-left">Back</span>
          </Link>
        </div>
        <div className="mt-3 mb-3 self-start inline-flex items-center px-5 py-2 rounded-full bg-linear-to-r from-blue-100 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold text-sm shadow-sm">
          {post.category}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700  leading-tight tracking-tight dark:text-[#2563EB]">
          {post.title}

          <p className="text-sm font-semibold text-gray-500 mt-2">
            By {post.author_name}
          </p>
        </h1>
        <p className="mt-2">
          Updated : {post.updated_at ? formatDate(post.updated_at) : "N/A"}
        </p>
        <p className="mt-4 text-2xl text-gray-500">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800 mt-4 mb-3">
          <Image
            src={post.image_url}
            alt={post.title}
            width={800}
            height={500}
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="rounded-md object-cover"
          />
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {renderContent(content)}
        </div>
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 font-semibold text-sm shadow-sm hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
            >
              {tag}
              <Tag size={14} />
            </span>
          ))}
        </div>
      </article>
      {filteredPosts?.length > 0 && (
        <article className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-10 py-4 justify-items-center">
          <h3 className="text-sm  text-gray-400 uppercase dark:text-zinc-50 mb-8 flex items-center gap-3">
            You might also be interested in:
          </h3>
          <BlogCardList posts={filteredPosts} />
          {/* <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {filteredPosts.slice(0, 3).map((relatedPost) => (
              <Link
                key={relatedPost.post_id}
                href={`/blog/${relatedPost.slug}`}
                className="group border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="mb-2 text-xs font-semibold uppercase text-[#2563EB]">
                  {relatedPost.category}
                </p>
                <h4 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-blue-700 dark:text-zinc-50">
                  {relatedPost.title}
                </h4>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-zinc-300">
                  {relatedPost.excerpt}
                </p>
              </Link>
            ))}
          </div> */}
        </article>
      )}
    </div>
  );
}
