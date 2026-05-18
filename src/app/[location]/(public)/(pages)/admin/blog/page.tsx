"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Image,
  LoaderCircle,
  Pen,
  Plus,
  SquarePen,
  Trash,
} from "lucide-react";

export interface BlogPost {
  post_id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content?: string;
  tags: string[];
  author_role: string;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  likes: number;
  read_time: string;
  published_at: string;
  created_at: string;
  author_name: string;
  image_url?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DeleteDialog({
  post,
  open,
  onClose,
  onDeleted,
}: {
  post: BlogPost | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!post) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/blog/${post.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      toast.success("Post deleted");

      onDeleted();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>

          <DialogDescription className="leading-relaxed">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              "{post?.title}"
            </span>{" "}
            will be permanently deleted and cannot be recovered.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 ">
          <button
            onClick={onClose}
            className="h-9 px-4  rounded-md border border-zinc-200 dark:border-zinc-700
                bg-white dark:bg-zinc-900 text-sm font-medium
                hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading || !post}
            className="h-9 px-4 rounded-md bg-red-500 hover:bg-red-600
                text-white text-sm font-semibold transition-colors
                disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// function PublishToggle({
//   post,
//   onUpdated,
// }: {
//   post: BlogPost;
//   onUpdated: () => void;
// }) {
//   const [loading, setLoading] = useState(false);

//   async function toggle() {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/blog/${post.slug}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ is_published: !post.is_published }),
//       });
//       if (!res.ok) throw new Error("Failed to update");
//       toast.success(post.is_published ? "Post unpublished" : "Post published");
//       onUpdated();
//     } catch {
//       toast.error("Failed to update post");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Switch
//     checked={post.is_published}
//     onCheckedChange={toggle}
//     disabled={loading}
//     className="
//       data-[state=checked]:!bg-blue-500
//       data-[state=unchecked]:bg-zinc-200
//       dark:data-[state=unchecked]:bg-zinc-700
//     "
//   />
//   );
// }


function PostRow({
  post,
  onDelete,
  onUpdated,
}: {
  post: BlogPost;
  onDelete: (post: BlogPost) => void;
  onUpdated: () => void;
}) {
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
      <td className="py-3 px-4 w-16">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image />
            </div>
          )}
        </div>
      </td>

      <td className="py-3 px-4 min-w-0">
        <div className="flex items-start gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[320px]">
              {post.title}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-0.5 truncate max-w-[320px]">
              /blog/{post.slug}
            </p>
          </div>
          {post.is_featured && (
            <span className="shrink-0 text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded-full mt-0.5">
              Featured
            </span>
          )}
        </div>
      </td>

      <td className="py-3 px-4 hidden lg:table-cell">
        <span className="text-sm text-zinc-500 dark:text-zinc-600  px-2.5 py-1 rounded-full">
          {post.category}
        </span>
      </td>

      <td className="py-3 px-4 hidden lg:table-cell">
        <p className="text-sm text-zinc-500 dark:text-zinc-600">
          {post.author_name}
        </p>
      </td>

      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views.toLocaleString()}
          </span>
          {post.read_time && <span className="text-xs">{post.read_time}</span>}
        </div>
      </td>

      <td className="py-3 px-4 hidden lg:table-cell">
        <p className="text-sm text-zinc-600 dark:text-zinc-500">
          {post.published_at ? formatDate(post.published_at) : "—"}
        </p>
      </td>

      {/* <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <PublishToggle post={post} onUpdated={onUpdated} />
          <span className="text-[11px] text-zinc-600 dark:text-zinc-500 hidden sm:block">
            {post.is_published ? "Live" : "Draft"}
          </span>
        </div>
      </td> */}

      <td className="py-3 px-4">
        <div className="flex items-center gap-1  transition-opacity">
          <Link
            href={`/admin/blog/edit/${post.slug}`}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-600
              hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title="Edit post">

            <Pen className="w-5 h-5" />
          </Link>

          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-600
              hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title="View post"
          >
            <Eye className="w-5 h-5" />
          </a>
          <button
            onClick={() => onDelete(post)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              hover:bg-red-50 dark:hover:bg-red-950 text-zinc-500 dark:text-zinc-600
              hover:text-red-600 transition-colors"
            title="Delete post"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const { data, isLoading, error, mutate } = useSWR<{
    posts: BlogPost[];
    total: number;
  }>("/api/blog?admin=true", fetcher, { revalidateOnFocus: false });

  const posts = data?.posts ?? [];

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.author_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "published" && p.is_published) ||
      (filter === "draft" && !p.is_published);
    return matchSearch && matchFilter;
  });

  const published = posts.filter((p) => p.is_published).length;
  const drafts = posts.filter((p) => !p.is_published).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100">
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Blog posts
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-500 mt-0.5">
              {data?.total ?? 0} total · {published} published 
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg
              bg-[#2563EB] hover:bg-blue-900 text-white text-sm font-semibold
              transition-colors"
          >
            <Plus className="w-5 h-5" />
            New post
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {/* <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Total posts", value: data?.total ?? 0 },
            { label: "Published", value: published },
            // { label: "Drafts", value: drafts },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-500 uppercase tracking-wide">
                {s.label}
              </p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div> */}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Search by title, slug or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700
              rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100
              placeholder-zinc-400 dark:placeholder-zinc-500
              focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
          <div className="flex gap-2">
            {(["all", "published"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors capitalize ${
                  filter === f
                    ? "bg-zinc-200 dark:bg-zinc-400 text-[#2563EB] dark:text-zinc-900 border-zinc-900 dark:border-blue-600"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-600 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-zinc-600">
                <LoaderCircle className="w-5 h-5" />
                Loading posts…
              </div>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-sm text-red-500">
              Failed to load posts.{" "}
              <button onClick={() => mutate()} className="underline">
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-500">
                {search ? `No posts matching "${search}"` : "No posts yet."}
              </p>
              {!search && (
                <Link
                  href="/admin/blog/new"
                  className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 mt-2"
                >
                  Create your first post →
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    {[
                      "Cover",
                      "Title",
                      "Category",
                      "Author",
                      "Stats",
                      "Date",
                      // "Status",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-4 text-left text-[11px] font-semibold text-zinc-600 dark:text-zinc-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post) => (
                    <PostRow
                      key={post.post_id}
                      post={post}
                      onDelete={setDeleteTarget}
                      onUpdated={() => mutate()}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-500 text-center">
          {filtered.length} of {posts.length} posts shown
        </p>
      </div>

      <DeleteDialog
        open={!!deleteTarget}
        post={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          mutate(
            (current) => {
              if (!current) return current;
        
              return {
                ...current,
                posts: current.posts.filter(
                  (p) => p.post_id !== deleteTarget?.post_id
                ),
                total: current.total - 1,
              };
            },
            false
          );
        
          mutate();
        }}
      />
    </div>
  );
}
