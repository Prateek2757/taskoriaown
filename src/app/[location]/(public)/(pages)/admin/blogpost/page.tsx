"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import CkEditor from "@/components/Ck_editor_5/ck_editor_5";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload/image-upload";

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

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Tips & Guides",
  "Technology",
  "Business",
  "News",
  "Case Studies",
  "Local Services",
];

const today = new Date().toISOString().split("T")[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  return html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 " +
  "rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 " +
  "placeholder-zinc-400 dark:placeholder-zinc-500 " +
  "focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-colors";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
      {children}
    </p>
  );
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
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

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 " +
        className
      }
    >
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        background: checked ? "#f97316" : "#2563EB",
      }}
      className={`relative shrink-0 w-10 h-[2px]  rounded-full transition-all duration-200
        focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2
        focus-visible:outline-orange-500
        ${checked ? "" : "bg-zinc-900 dark:bg-zinc-700"}`}
    >
      <span
        style={{
          transform: checked ? "translateX(18px)" : "translateX(0px)",
          transition: "transform 200ms ease",
          position: "absolute",
          bottom: "3px",
          left: "3px",
          width: "16px",
          height: "16px",
          background: "white",
          borderRadius: "50%",
          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          display: "block",
        }}
      />
    </button>
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
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {title}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function NewBlogPostPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
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
      published_at: today,
    },
  });

  const tags = watch("tags");
  const content = watch("content");
  const slug = watch("slug");
  const excerpt = watch("excerpt");
  const isPublished = watch("is_published");

  const readTime = content ? calcReadTime(content) : "—";
  const wordCount = content ? calcWordCount(content) : 0;

  // Auto-slug on title change
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue("title", val, { shouldValidate: true });
      setValue("slug", toSlug(val));
    },
    [setValue]
  );

  function addTag() {
    const raw = getValues("tagInput").trim();
    if (!raw) return;
    const current = getValues("tags");
    if (!current.includes(raw)) {
      setValue("tags", [...current, raw]);
    }
    setValue("tagInput", "");
  }

  function removeTag(tag: string) {
    setValue(
      "tags",
      getValues("tags").filter((t) => t !== tag)
    );
  }

  // Core submit — called by both Save draft and Publish
  const onSubmit = useCallback(
    async (data: FormValues, publish: boolean) => {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.slug,
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
          is_published: publish,
          published_at: publish ? data.published_at : null,
          read_time: data.content ? calcReadTime(data.content) : null,
        }),
      });

      if (res.status === 409) {
        toast.error("Slug already exists — edit the slug field.");
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to save");
      }

      toast.success(publish ? "Post published!" : "Draft saved!");
      router.push("/admin/blog");
    },
    [router]
  );

  const handleSaveDraft: SubmitHandler<FormValues> = async (data) => {
    try {
      await onSubmit(data, false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save draft");
    }
  };

  const handlePublish: SubmitHandler<FormValues> = async (data) => {
    try {
      await onSubmit(data, true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish");
    }
  };

  return (
    <div className="min-h-screen  text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="sticky top-0 z-20  backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4 px-6 h-14">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[17px] font-semibold text-zinc-900 dark:text-white truncate">
              New post
            </h1>
            <span
              className={`shrink-0 inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isPublished
                  ? "bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                  : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSubmit(handleSaveDraft)}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5
                h-9 px-4 rounded-lg text-sm font-medium
                bg-white dark:bg-zinc-800
                border border-zinc-200 dark:border-zinc-700
                text-zinc-700 dark:text-zinc-300
                hover:bg-zinc-50 dark:hover:bg-zinc-700
                disabled:opacity-40 transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="11"
                  height="11"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M3.5 1v3.5h6V1M3.5 7.5h6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Save draft
            </button>

            <button
              type="button"
              onClick={handleSubmit(handlePublish)}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5
                h-9 px-4 rounded-lg text-sm font-semibold
                bg-orange-500 hover:bg-orange-600
                text-white
                disabled:opacity-40 transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9L5 6l2.5 2.5 2.5-3.5L12 7"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isSubmitting ? "Saving…" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        <div className="p-6  space-y-4 border-r border-zinc-200 dark:border-zinc-800 min-h-[calc(100vh-56px)]">
          <Card>
            <div>
              <FieldLabel>Title</FieldLabel>
              <input
                {...register("title", { required: "Title is required" })}
                onChange={handleTitleChange}
                placeholder="Enter post title…"
                className={inputCls}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <FieldLabel>Slug</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0 select-none">
                  /blog/
                </span>
                <input
                  {...register("slug")}
                  placeholder="auto-generated-from-title"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <FieldLabel hint="(shown in card previews)">Excerpt</FieldLabel>
              <textarea
                {...register("excerpt")}
                rows={3}
                maxLength={160}
                placeholder="Short description shown on listing pages…"
                className={`${inputCls} resize-none`}
              />
              <p className="text-right text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                {excerpt?.length ?? 0}/160
              </p>
            </div>
          </Card>

          {/* CKEditor card */}
          <Card className="!p-0 overflow-visible">
            <div className="px-4 pt-4">
              <SectionLabel>Content</SectionLabel>
            </div>
            <div className="px-4 pb-4 pt-3">
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <CkEditor value={field.value} onChange={field.onChange} />
                )}
              />
              <FieldError message={errors.content?.message} />
            </div>
          </Card>
        </div>

        <div className="p-4 space-y-3  border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800">
          <Card>
            <SectionLabel>Publish settings</SectionLabel>

            <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Published
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Visible to public
                </p>
              </div>
              <Controller
                name="is_published"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center  justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Featured
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Show on homepage
                </p>
              </div>
              <Controller
                name="is_featured"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="pt-1">
              <FieldLabel>Publish date</FieldLabel>
              <input
                type="date"
                {...register("published_at")}
                className={inputCls}
              />
            </div>
          </Card>

          {/* Author */}
          <Card>
            <SectionLabel>Author</SectionLabel>
            <input
              {...register("author_name")}
              placeholder="e.g. Patrick"
              className={inputCls}
            />
            <input
              {...register("author_role")}
              placeholder="e.g. Head of Product Innovation"
              className={inputCls}
            />
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
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="h-[38px] px-3 shrink-0 rounded-lg text-sm font-medium
                    bg-zinc-100 dark:bg-zinc-700
                    hover:bg-zinc-200 dark:hover:bg-zinc-600
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
                        bg-zinc-100 dark:bg-zinc-800
                        border border-zinc-200 dark:border-zinc-700
                        text-zinc-600 dark:text-zinc-300
                        px-2.5 py-1 rounded-full"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 leading-none"
                        aria-label={`Remove tag ${t}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Cover image */}
          {/* <Card>
            <SectionLabel>Cover image</SectionLabel>
            <div
              className="border border-dashed border-zinc-300 dark:border-zinc-700
                rounded-lg p-5 text-center cursor-pointer
                hover:border-zinc-400 dark:hover:border-zinc-500
                hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="mx-auto mb-2 text-zinc-400 dark:text-zinc-600"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <circle
                  cx="7"
                  cy="8"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M2 13l4-3 3 2.5 3-3 4 4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Click to upload or paste a URL
              </p>
            </div>
            <input
              {...register("image_url")}
              placeholder="or paste image URL…"
              className={inputCls}
            />
          </Card> */}

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
          {/* Stats */}
          <Card>
            <SectionLabel>Stats</SectionLabel>
            {(
              [
                ["Estimated read time", readTime],
                ["Word count", wordCount.toLocaleString()],
                ["Views", "0"],
                ["Likes", "0"],
              ] as [string, string][]
            ).map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 text-sm
                  border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <span className="text-zinc-500 dark:text-zinc-400">
                  {label}
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {val}
                </span>
              </div>
            ))}
          </Card>

          {/* Live URL preview */}
          <Card>
            <SectionLabel>Post URL</SectionLabel>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed break-all">
              taskoria.com/blog/
              <span className="text-orange-500 font-medium">
                {slug || "your-slug"}
              </span>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
