"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-server"; 
import { uploadToSupabase } from "@/lib/uploadFileToSupabase";


interface ServiceCategory {
  category_id: number;
  public_id: string;
  name: string;
  slug: string | null;
  parent_category_id: number | null;
  is_active: boolean;
  image_url: string | null;
}

type UploadState = "idle" | "uploading" | "saving" | "done" | "error";


// async function uploadToSupabase(file: File, folder: string): Promise<string> {
//   const safeFileName = file.name.normalize("NFKD").replace(/[^\w.-]/g, "_");
//   const filePath = `${folder}/${Date.now()}-${safeFileName}`;

//   const { error } = await supabaseBrowser.storage
//     .from("taskoria")
//     .upload(filePath, file);

//   if (error) throw error;

//   const { data } = supabaseBrowser.storage
//     .from("taskoria")
//     .getPublicUrl(filePath);

//   return encodeURI(data.publicUrl);
// }


function CategoryRow({
  category,
  onUpdated,
}: {
  category: ServiceCategory;
  onUpdated: (id: number, url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [preview, setPreview] = useState<string | null>(category.image_url);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    setError(null);
    setState("uploading");

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const url = await uploadToSupabase(file, "service-categories");
      setState("saving");

      const { error: dbError } = await supabaseBrowser
        .from("service_categories")
        .update({ image_url: url, updated_at: new Date().toISOString() })
        .eq("category_id", category.category_id);

      if (dbError) throw dbError;

      setPreview(url);
      setState("done");
      onUpdated(category.category_id, url);
      setTimeout(() => setState("idle"), 2000);
    } catch (err: unknown) {
      setPreview(category.image_url);
      setState("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const label =
    state === "uploading"
      ? "Uploading…"
      : state === "saving"
      ? "Saving…"
      : state === "done"
      ? "Saved ✓"
      : state === "error"
      ? "Retry"
      : preview
      ? "Replace"
      : "Upload";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* image cell */}
      <td className="py-3 px-4 w-20">
        <div
          className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          title="Click or drop image here"
        >
          {preview ? (
            <img
              src={preview}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-300 text-xl select-none">+</span>
          )}
        </div>
      </td>

      {/* name / slug */}
      <td className="py-3 px-4">
        <p className="font-medium text-gray-800 text-sm leading-tight">
          {category.name}
        </p>
        {category.slug && (
          <p className="text-xs text-gray-400 mt-0.5">{category.slug}</p>
        )}
      </td>

      {/* id */}
      <td className="py-3 px-4 text-xs text-gray-400 tabular-nums">
        {category.category_id}
      </td>

      {/* status */}
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            category.is_active
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </span>
      </td>

      {/* URL preview */}
      <td className="py-3 px-4 max-w-xs hidden lg:table-cell">
        {preview ? (
          <a
            href={preview}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-500 hover:underline truncate block max-w-[200px]"
          >
            {preview}
          </a>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>

      {/* action */}
      <td className="py-3 px-4">
        <button
          disabled={state === "uploading" || state === "saving"}
          onClick={() => inputRef.current?.click()}
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
            state === "done"
              ? "border-green-300 bg-green-50 text-green-700"
              : state === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : state === "uploading" || state === "saving"
              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {label}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        {error && (
          <p className="text-xs text-red-500 mt-1 max-w-[160px]">{error}</p>
        )}
      </td>
    </tr>
  );
}

// ── main panel ────────────────────────────────────────────────────────────────

export default function CategoryImageAdmin() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabaseBrowser
        .from("service_categories")
        .select(
          "category_id, public_id, name, slug, parent_category_id, is_active, image_url"
        )
        .order("name", { ascending: true });

      if (error) {
        setFetchError(error.message);
      } else {
        setCategories(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleUpdated(id: number, url: string) {
    setCategories((prev) =>
      prev.map((c) => (c.category_id === id ? { ...c, image_url: url } : c))
    );
  }

  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && c.is_active) ||
      (filterActive === "inactive" && !c.is_active);
    return matchesSearch && matchesFilter;
  });

  const withImage = categories.filter((c) => c.image_url).length;
  const withoutImage = categories.length - withImage;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Category Images
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Click a thumbnail or the Upload button to add / replace an image.
              Drag &amp; drop onto the thumbnail also works.
            </p>
          </div>
        </div>

        {/* stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: categories.length },
            { label: "With image", value: withImage },
            { label: "Missing image", value: withoutImage },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {s.label}
              </p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterActive(f)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                  filterActive === f
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              Loading categories…
            </div>
          ) : fetchError ? (
            <div className="py-16 text-center text-sm text-red-500">
              {fetchError}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              No categories found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Image
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                      URL
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <CategoryRow
                      key={cat.category_id}
                      category={cat}
                      onUpdated={handleUpdated}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center">
          {filtered.length} of {categories.length} categories shown
        </p>
      </div>
    </div>
  );
}