"use client";

import { Tag } from "lucide-react";
import BlogNavbar from "../Blog-Navbar";

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

    if (
      text.startsWith("**") &&
      text.endsWith("**") &&
      text.length > 4 &&
      text.indexOf("**", 2) === text.length - 2
    ) {
      blocks.push(
        <p
          key={blocks.length}
          className="text-lg font-bold text-gray-900 dark:text-zinc-100 my-6"
        >
          {text.slice(2, -2)}
        </p>,
      );
    } else if (text.startsWith("**") && text.includes("**", 2)) {
      const closingIdx = text.indexOf("**", 2);
      const boldPart = text.slice(2, closingIdx);
      const restPart = text.slice(closingIdx + 2);
      blocks.push(
        <p
          key={blocks.length}
          className="text-gray-700 dark:text-zinc-300 text-lg leading-relaxed my-6"
        >
          <strong className="text-gray-900 dark:text-zinc-100">
            {boldPart}
          </strong>
          {restPart}
        </p>,
      );
    } else {
      blocks.push(
        <p
          key={blocks.length}
          className="text-gray-700 dark:text-zinc-300 text-lg leading-relaxed my-6"
        >
          {text}
        </p>,
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
          <li
            key={i}
            className="text-gray-700 dark:text-zinc-300 text-lg leading-relaxed"
          >
            {item}
          </li>
        ))}
      </ul>,
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
        <h2
          key={blocks.length}
          className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mt-12 mb-6"
        >
          {line.slice(3)}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushBullets();
      flushPara();
      blocks.push(
        <h3
          key={blocks.length}
          className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mt-8 mb-3"
        >
          {line.slice(4)}
        </h3>,
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
        <p
          key={blocks.length}
          className="text-base font-medium text-blue-700 dark:text-blue-300 my-4 pl-2 border-l-4 border-blue-400 dark:border-blue-600"
        >
          {line}
        </p>,
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

export default function BlogDetails({ post }: Props) {
  console.log("post", post);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <BlogNavbar />
      <article className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8 py-4">
        <div>
          <div className="mt-3 mb-3 self-start inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold text-sm shadow-sm">
            {post.category}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-zinc-50 leading-tight tracking-tight">
          {post.title}

          <p className="text-sm font-semibold text-gray-400 mt-2">
            By {post.author_name}
          </p>
        </h1>
        <p className="mt-2">Updated : {formatDate(post.published_at)}</p>
        <p className="mt-4 text-2xl text-gray-400">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800 mt-4 mb-3">
          <img src={post.image_url} alt={post.author_name} />
        </div>

        <div className="porse porse-lg dark:prose-invert max-w-none">
          {renderContent(post.content)}
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
