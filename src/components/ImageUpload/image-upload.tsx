"use client";

import { useRef, useState } from "react";
import { uploadToSupabase } from "@/lib/uploadFileToSupabase";

type UploadState = "idle" | "uploading" | "saving" | "done" | "error";

interface ImageUploadProps {
  value?: string;                    // current URL (from react-hook-form)
  onChange?: (url: string) => void;  // fires with final Supabase URL
  folder?: string;                   // storage folder, default "blog"
}

export default function ImageUpload({
  value,
  onChange,
  folder = "blog",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setError(null);
    setState("uploading");

    // Show instant local preview while uploading
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const url = await uploadToSupabase(file, folder);
      setState("saving");

      setPreview(url);
      setState("done");
      onChange?.(url);              // ← tells react-hook-form the final URL
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      setPreview(value ?? null);    // revert to original on failure
      setState("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const isLoading = state === "uploading" || state === "saving";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
  <div
    onClick={() => !isLoading && inputRef.current?.click()}
    onDrop={handleDrop}
    onDragOver={(e) => e.preventDefault()}
    className={`relative shrink-0 w-48 h-48  rounded-md border-2 border-dashed
      overflow-hidden flex items-center justify-center transition-colors
      ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
      ${preview ? "border-transparent" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400"}`}
  >
    {preview ? (
      <>
        <img src={preview} alt="Cover" className="w-full h-full object-cover" />
        {!isLoading && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-[10px] font-medium">Replace</span>
          </div>
        )}
      </>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-zinc-400" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 15l5-4 4 3.5 3-4 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )}

    {isLoading && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <svg className="animate-spin text-white" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
    )}
  </div>

  <div className="flex-1 min-w-0 space-y-1.5">
    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
      {preview ? "Cover image set" : "No image yet"}
    </p>
    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
      Click thumbnail to upload · PNG, JPG, WebP
    </p>
    <input
      type="text"
      placeholder="or paste image URL…"
      value={preview?.startsWith("blob:") ? "" : (preview ?? "")}
      onChange={(e) => {
        const url = e.target.value;
        setPreview(url || null);
        onChange?.(url);
      }}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700
        rounded-md px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100
        placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-400
        focus:border-orange-400 transition-colors"
    />
    {state === "done" && (
      <p className="text-[11px] text-green-600 dark:text-green-400 font-medium">✓ Uploaded</p>
    )}
    {error && <p className="text-[11px] text-red-500">{error}</p>}
  </div>
</div>

      {/* URL input fallback */}
      {/* <input
        type="text"
        placeholder="or paste image URL…"
        value={preview?.startsWith("blob:") ? "" : (preview ?? "")}
        onChange={(e) => {
          const url = e.target.value;
          setPreview(url || null);
          onChange?.(url);
        }}
        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700
          rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100
          placeholder-zinc-400 dark:placeholder-zinc-500
          focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-colors"
      /> */}

      {error && (
        <p className="text-[11px] text-red-500">{error}</p>
      )}

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
    </div>
  );
}