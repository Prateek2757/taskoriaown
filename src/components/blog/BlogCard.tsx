import Link from "next/link";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

type Blog = {
  post_id: number;
  slug: string;
  title: string;
  excerpt: string;
  author_name: string;
  category: string;
  views: number;
  published_at: string;
  image_url: string;
  updated_at?:string;
  is_featured?: boolean;
};

export const BlogCard = ({
  post,
  featured = false,
}: {
  post: Blog;
  featured?: boolean;
  onClick?: () => void; 
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className={`group relative rounded-xl overflow-hidden
        bg-white dark:bg-zinc-900
        border border-gray-200 dark:border-zinc-800
        shadow-lg hover:shadow-2xl dark:shadow-zinc-950/50
        transition-all duration-500 block
        ${featured ? "md:col-span-2" : ""}`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image_url}
          alt={post.title}
          title={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={90}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm text-blue-600 dark:text-blue-400 shadow-lg">
            {post.category}
          </span>
        </div>

        {/* Trending badge */}
        {post.views > 3000 && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-orange-500 to-pink-500 text-white text-xs font-bold shadow-lg">
              <TrendingUp size={12} />
              Trending
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
          <span className="font-semibold text-gray-900 dark:text-zinc-100">
            {post.author_name}
          </span>
          {" · "}
          {formatDate(post.updated_at || post.published_at)}
        </p>

        <h3 className="font-bold text-md mb-1 line-clamp-2 text-gray-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {post.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-zinc-300 line-clamp-2 mb-3">
          {post.excerpt}
        </p>

        <span className="text-sm font-semibold underline text-blue-600 dark:text-blue-400">
          Read more
        </span>
      </div>
    </Link>
  );
};
