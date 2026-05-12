"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CkEditor from "@/components/Ck_editor_5/ck_editor_5";

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_role: string;
  author_image: string;
  image_url: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  read_time: string;
}

const CATEGORIES = [
  "Tips & Guides",
  "Technology",
  "Business",
  "News",
  "Case Studies",
  "Local Services",
];

const today = new Date().toISOString().split("T")[0];

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function calcReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function calcWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}


function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
      {children}
    </p>
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
      className={`relative w-10 h-5 rounded-full transition-colors ${
        checked ? "bg-orange-500" : "bg-zinc-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author_name: "",
    author_role: "",
    author_image: "",
    image_url: "",
    category: "",
    tags: [],
    is_featured: false,
    is_published: false,
    published_at: today,
    read_time: "",
  });

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        // Auto-slug from title
        if (key === "title") {
          next.slug = toSlug(value as string);
        }
        // Auto read time from content
        if (key === "content") {
          next.read_time = calcReadTime(value as string);
        }
        return next;
      });
    },
    []
  );

  function addTag() {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t)) return;
    set("tags", [...form.tags, t]);
    setTagInput("");
  }

  function removeTag(t: string) {
    set(
      "tags",
      form.tags.filter((x) => x !== t)
    );
  }

  // async function submit(publish: boolean) {
  //   if (!form.title || !form.content || !form.category) {
  //     toast.error("Title, content and category are required.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/admin/blog/write-mdx", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...form,
  //         is_published: publish,
  //         published_at: publish ? form.published_at : undefined,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (res.status === 409) {
  //       toast.error("Slug already exists — edit the slug field.");
  //       return;
  //     }
  //     if (!res.ok) throw new Error(data.message);

  //     toast.success(
  //       publish
  //         ? `Published → content/blog/${form.slug}.mdx`
  //         : `Draft saved → content/blog/${form.slug}.mdx`
  //     );
  //     router.push("/admin/blog");
  //   } catch (err) {
  //     toast.error(err instanceof Error ? err.message : "Failed to save");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function submit(publish: boolean) {
    if (!form.title || !form.content || !form.category) {
      toast.error("Title, content and category are required.");
      return;
    }

    const plainText = form.content.replace(/<[^>]+>/g, " ");
    const words = plainText.split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.round(words / 200))} min read`;

    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          read_time: readTime,
          is_published: publish,
        }),
      });

      if (res.status === 409) {
        toast.error("Slug already exists.");
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      toast.success(publish ? "Post published!" : "Draft saved!");
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const wordCount = calcWordCount(form.content);
  const isDraft = !form.is_published;

  return (
    <div className="min-h-screen bg-[#111111] text-zinc-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-semibold text-white">New post</h1>
          <span className="text-xs px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 font-medium">
            {isDraft ? "Draft" : "Published"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => submit(false)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2h8l2 2v8a1 1 0 01-1 1H3a1 1 0 01-1-1V2z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4 2v4h6V2M4 8h6"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            Save draft
          </button>
          <button
            onClick={() => submit(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-semibold hover:bg-white transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2h8l2 2v8a1 1 0 01-1 1H3a1 1 0 01-1-1V2z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            {loading ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-0 h-[calc(100vh-57px)]">
        <div className="overflow-y-auto p-6 space-y-4 border-r border-zinc-800">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-4">
            <div>
              <Label>Title</Label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Enter post title…"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <Label>Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 shrink-0">/blog/</span>
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
            <div>
              <Label>
                Excerpt{" "}
                <span className="normal-case text-zinc-500 tracking-normal font-normal">
                  (shown in card previews)
                </span>
              </Label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="Short description shown on listing pages…"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
              />
              <p className="text-right text-xs text-zinc-600 mt-1">
                {form.excerpt.length}/160
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 relative overflow-y-auto rounded-xl border border-zinc-800 p-5">
            <CkEditor
              value={form.content}
              onChange={(html) => set("content", html)}
            />
            {/* <div className="flex gap-0 border-b border-zinc-800 mb-4">
              {(["write", "preview"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "text-white border-white"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div> */}

            {/* {activeTab === "write" ? (
              <textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                rows={22}
                placeholder={`Write your post in Markdown…\n\n## Heading\n\nParagraph text here.\n\n- List item\n- Another item`}
                className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none font-mono leading-relaxed"
              />
            ) : (
              <div className="min-h-[300px] text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">
                {form.content || (
                  <span className="text-zinc-600 italic">
                    Nothing to preview yet.
                  </span>
                )}
              </div>
            )} */}
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <Label>Publish settings</Label>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <div>
                  <p className="text-sm text-zinc-200 font-medium">Published</p>
                  <p className="text-xs text-zinc-500">Visible to public</p>
                </div>
                <Toggle
                  checked={form.is_published}
                  onChange={(v) => set("is_published", v)}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <div>
                  <p className="text-sm text-zinc-200 font-medium">Featured</p>
                  <p className="text-xs text-zinc-500">Show on homepage</p>
                </div>
                <Toggle
                  checked={form.is_featured}
                  onChange={(v) => set("is_featured", v)}
                />
              </div>
              <div className="pt-3">
                <p className="text-xs text-zinc-400 mb-1.5">Publish date</p>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => set("published_at", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <Label>Author</Label>
            <div className="space-y-2">
              <input
                value={form.author_name}
                onChange={(e) => set("author_name", e.target.value)}
                placeholder="e.g. Patrick"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              <input
                value={form.author_role}
                onChange={(e) => set("author_role", e.target.value)}
                placeholder="e.g. Head of Product Innovation"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <Label>Categorisation</Label>
            <div className="space-y-3">
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div>
                <p className="text-xs text-zinc-400 mb-1.5">Tags</p>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag…"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-sm text-zinc-200 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full"
                      >
                        {t}
                        <button
                          onClick={() => removeTag(t)}
                          className="text-zinc-500 hover:text-zinc-200 leading-none"
                          aria-label={`Remove tag ${t}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <Label>Cover image</Label>
            <div className="border border-dashed border-zinc-700 rounded-lg p-5 text-center mb-2 cursor-pointer hover:border-zinc-500 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="mx-auto mb-2 text-zinc-600"
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
              <p className="text-xs text-zinc-500">
                Click to upload or paste a URL
              </p>
            </div>
            <input
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="or paste image URL…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Stats */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <Label>Stats</Label>
            <div className="space-y-0">
              {[
                ["Estimated read time", form.read_time || "—"],
                ["Word count", wordCount.toLocaleString()],
                ["Views", "0"],
                ["Likes", "0"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-zinc-800 last:border-0 text-sm"
                >
                  <span className="text-zinc-400">{label}</span>
                  <span className="text-zinc-200 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MDX output preview */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <Label>MDX file output</Label>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Saves to{" "}
              <code className="text-orange-400 bg-zinc-800 px-1 py-0.5 rounded text-[11px]">
                content/blog/{form.slug || "your-slug"}.mdx
              </code>
              . Picked up by{" "}
              <code className="text-zinc-400 text-[11px]">getAllPosts()</code>{" "}
              automatically on next request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
