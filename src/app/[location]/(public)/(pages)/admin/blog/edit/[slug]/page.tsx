"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import CkEditor from "@/components/Ck_editor_5/ck_editor_5";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload/image-upload";
import { fetcher } from "@/lib/fetcher";
import { BlogPost } from "../../page";
import { Circle, Eye, Save } from "lucide-react";


interface FormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_role: string;
  author_image: string;
  image_url: string;
  category: string;
  tagInput: string;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
}


const CATEGORIES = [
  "Tips & Guides",
  "Technology",
  "Business",
  "News",
  "Case Studies",
  "Local Services",
];



function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function calcReadTime(html: string) {
  const plain = html.replace(/<[^>]+>/g, " ");
  const words = plain.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function calcWordCount(html: string) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}


const inputCls =
  "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 " +
  "rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 " +
  "placeholder-zinc-400 dark:placeholder-zinc-500 " +
  "focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-colors";


function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
      {children}
    </p>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline gap-1.5 mb-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {children}
      </span>
      {hint && (
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 normal-case tracking-normal font-normal">
          {hint}
        </span>
      )}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] text-red-500 mt-1">{message}</p>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 ${className}`}>
      {children}
    </div>
  );
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg ${className}`} />
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#111111]">
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 h-14 flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_300px] gap-0">
        <div className="p-6 space-y-4 border-r border-zinc-200 dark:border-zinc-800">
          <Card>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-20 w-full" />
          </Card>
          <Card>
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const originalSlug = params.slug as string;

  const { data: post, isLoading, error } = useSWR<BlogPost>(
    originalSlug ? `/api/blog/${originalSlug}` : null,
    fetcher
  );

  

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author_name: "",
      author_role: "",
      author_image: "",
      image_url: "",
      category: "",
      tagInput: "",
      tags: [],
      is_featured: false,
      is_published: false,
      published_at: "",
    },
  });

  useEffect(() => {
    if (!post) return;
    reset({
      title: post.title ?? "",
      slug: post.slug ?? "",
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      author_name: post.author_name ?? "",
      author_role: post.author_role ?? "",
    //   author_image: post.author_image ?? "",
      image_url: post.image_url ?? "",
      category: post.category ?? "",
      tagInput: "",
      tags: post.tags ?? [],
      is_featured: post.is_featured ?? false,
      is_published: post.is_published ?? false,
      published_at: post.published_at
        ? new Date(post.published_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
  }, [post, reset]);

  
  const tags = watch("tags");
  const content = watch("content");
  const slug = watch("slug");
  const excerpt = watch("excerpt");
  const isPublished = watch("is_published");

  const readTime = content ? calcReadTime(content) : "—";
  const wordCount = content ? calcWordCount(content) : 0;

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue("title", val, { shouldValidate: true, shouldDirty: true });
      setValue("slug", toSlug(val), { shouldDirty: true });
    },
    [setValue]
  );

  function addTag() {
    const raw = getValues("tagInput").trim();
    if (!raw) return;
    const current = getValues("tags");
    if (!current.includes(raw)) {
      setValue("tags", [...current, raw], { shouldDirty: true });
    }
    setValue("tagInput", "");
  }

  function removeTag(tag: string) {
    setValue("tags", getValues("tags").filter((t) => t !== tag), { shouldDirty: true });
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const slugChanged = data.slug !== originalSlug;

      const res = await fetch(`/api/blog/${originalSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          author_name: data.author_name,
          author_role: data.author_role,
          author_image: data.author_image,
          image_url: data.image_url,
          category: data.category,
          tags: data.tags,
          is_featured: data.is_featured,
          is_published: data.is_published,
          published_at: data.published_at,
          read_time: data.content ? calcReadTime(data.content) : null,
          // only send new_slug if it actually changed
          ...(slugChanged ? { new_slug: data.slug } : {}),
        }),
      });

      if (res.status === 409) {
        toast.error("Slug already exists — change it.");
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to update");
      }

      toast.success("Post updated!");

      // If slug changed, redirect to new slug
      if (slugChanged) {
        router.push(`/admin/blog/edit/${data.slug}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  if (isLoading) return <PageSkeleton />;

  if (error || !post) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-3">Post not found.</p>
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            ← Back to posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 transition-colors">

      <header className="sticky top-13 z-20 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4 px-6 h-14">

          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/admin/blog")}
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg
                border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400
                hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[16px] font-semibold text-zinc-900 dark:text-white truncate max-w-[300px]">
                  {post.title}
                </h1>
                <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isPublished
                    ? "bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                    : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                }`}>
                  {isPublished ? "Published" : "Draft"}
                </span>
                {isDirty && (
                  <span className="shrink-0 text-[11px] text-orange-500 font-medium">
                    • Unsaved changes
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                /blog/{slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/blog/${originalSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg
                border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800
                text-sm font-medium text-zinc-600 dark:text-zinc-400
                hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
             <Eye className="h-5 w-5"/>
              Preview
            </a>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg
                bg-[#2563EB] hover:bg-blue-900 text-sm font-semibold text-white
                disabled:opacity-40 transition-colors"
            >
              {isSubmitting ? (
                <>
                 <Circle className="h-5 w-5" />
                  Saving…
                </>
              ) : (
                <>
                 
                  <Save/>
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="grid  ">

        <div className="p-6 space-y-4 border-r border-zinc-200 dark:border-zinc-800 min-h-[calc(100vh-56px)]">

          <Card>
            <div>
              <FieldLabel>Title</FieldLabel>
              <input
                {...register("title", { required: "Title is required" })}
                onChange={handleTitleChange}
                placeholder="Post title…"
                className={inputCls}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <FieldLabel>Slug</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">/blog/</span>
                <input
                  {...register("slug")}
                  placeholder="post-slug"
                  className={inputCls}
                />
              </div>
              {watch("slug") !== originalSlug && (
                <p className="text-[11px] text-amber-500 mt-1">
                  ⚠ Slug changed — old URL will break. Make sure to redirect{" "}
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
                    /blog/{originalSlug}
                  </code>{" "}
                  → <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/blog/{watch("slug")}</code>
                </p>
              )}
            </div>

            <div>
              <FieldLabel hint="(shown in card previews)">Excerpt</FieldLabel>
              <textarea
                {...register("excerpt")}
                rows={3}
                maxLength={160}
                placeholder="Short description…"
                className={`${inputCls} resize-none`}
              />
              <p className="text-right text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                {excerpt?.length ?? 0}/160
              </p>
            </div>
          </Card>

          <Card className="!p-0 overflow-visible">
            <div className="px-4 pt-4">
              <SectionLabel>Content</SectionLabel>
            </div>
            <div className="px-4 pb-4 pt-2">
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <CkEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError message={errors.content?.message} />
            </div>
          </Card>
        </div>

        <div className="p-4 space-y-3 bg-zinc-50 dark:bg-[#111111]">

          <Card>
            <SectionLabel>Publish settings</SectionLabel>
            <Controller
              name="is_published"
              control={control}
              render={({ field }) => (
                <ToggleRow
                  title="Published"
                  subtitle="Visible to public"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="is_featured"
              control={control}
              render={({ field }) => (
                <ToggleRow
                  title="Featured"
                  subtitle="Show on homepage"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="pt-1">
              <FieldLabel>Publish date</FieldLabel>
              <input
                type="date"
                {...register("published_at")}
                className={inputCls}
              />
            </div>
          </Card>

          <Card>
            <SectionLabel>Author</SectionLabel>
            <div>
              <FieldLabel>Name</FieldLabel>
              <input
                {...register("author_name")}
                placeholder="e.g. Patrick"
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel>Role</FieldLabel>
              <input
                {...register("author_role")}
                placeholder="e.g. Head of Product Innovation"
                className={inputCls}
              />
            </div>
          </Card>

          <Card>
            <SectionLabel>Categorisation</SectionLabel>
            <div>
              <FieldLabel>Category</FieldLabel>
              <select
                {...register("category", { required: "Category is required" })}
                className={inputCls}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <FieldError message={errors.category?.message} />
            </div>

            <div>
              <FieldLabel>Tags</FieldLabel>
              <div className="flex gap-2">
                <input
                  {...register("tagInput")}
                  placeholder="Add a tag…"
                  className={`${inputCls} flex-1`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addTag(); }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="h-[38px] px-3 shrink-0 rounded-lg text-sm font-medium
                    bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600
                    text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 text-xs
                        bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700
                        text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-full"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <SectionLabel>Cover image</SectionLabel>
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="blog-post-image-url"
                />
              )}
            />
          </Card>

          <Card>
            <SectionLabel>Stats</SectionLabel>
            {(
              [
                ["Estimated read time", readTime],
                ["Word count", wordCount.toLocaleString()],
                ["Views", (post.views ?? 0).toLocaleString()],
                ["Likes", (post.likes ?? 0).toLocaleString()],
              ] as [string, string][]
            ).map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 text-sm
                  border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{val}</span>
              </div>
            ))}
          </Card>

          {/* Post URL */}
          <Card>
            <SectionLabel>Post URL</SectionLabel>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed break-all">
              taskoria.com/blog/
              <span className="text-orange-500 font-medium">{slug || "your-slug"}</span>
            </p>
          </Card>

          {/* Danger zone */}
          <Card>
            <SectionLabel>Danger zone</SectionLabel>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
              Permanently delete this post. This cannot be undone.
            </p>
            <button
              type="button"
              onClick={async () => {
                if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
                const res = await fetch(`/api/blog/${originalSlug}`, { method: "DELETE" });
                if (res.ok) {
                  toast.success("Post deleted");
                  router.push("/admin/blog");
                } else {
                  toast.error("Failed to delete post");
                }
              }}
              className="w-full h-9 rounded-lg border border-red-200 dark:border-red-900
                text-red-600 dark:text-red-400 text-sm font-medium
                hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              Delete post
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}