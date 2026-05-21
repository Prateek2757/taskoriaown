"use client";

import { useRef, useState, useEffect } from "react";
import { uploadToSupabase } from "@/lib/uploadFileToSupabase";

type UploadState = "idle" | "uploading" | "saving" | "error";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "blog",
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setError(null);
    setUploadState("uploading");

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const url = await uploadToSupabase(file, folder);

      setUploadState("saving");

      setPreview(url);
      onChange(url);

      setUploadState("idle");
    } catch (err) {
      setUploadState("error");
      setPreview(value || null);

      setError(
        err instanceof Error ? err.message : "Upload failed"
      );
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (disabled || uploadState !== "idle") return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const isLoading = uploadState === "uploading" || uploadState === "saving";

  return (
    <div className="space-y-2">
      {/* DROPZONE */}
      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        
        <div
          onClick={() => {
            if (!disabled && !isLoading) {
              inputRef.current?.click();
            }
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`relative w-48 h-48 shrink-0 rounded-md border-2 border-dashed overflow-hidden flex items-center justify-center transition
            ${
              disabled || isLoading
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:border-zinc-400"
            }
            ${
              preview
                ? "border-transparent"
                : "border-zinc-300 dark:border-zinc-700"
            }`}
        >
          {/* IMAGE */}
          {preview ? (
            <>
              <img
                src={preview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />

              {!isLoading && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    Replace
                  </span>
                </div>
              )}
            </>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-zinc-400"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle
                cx="8.5"
                cy="9.5"
                r="1.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M3 15l5-4 4 3.5 3-4 5 5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          )}

          {/* LOADING */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 space-y-1.5">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {value ? "Image selected" : "No image selected"}
          </p>

          <p className="text-[11px] text-zinc-400">
            Click or drop image (PNG, JPG, WebP)
          </p>

          {/* URL INPUT */}
          <input
            type="text"
            value={value || ""}
            disabled={disabled}
            placeholder="or paste image URL..."
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700
              rounded-md px-2.5 py-1.5 text-xs
              focus:outline-none focus:ring-1 focus:ring-orange-400"
          />

          {/* STATUS */}
          {uploadState === "saving" && (
            <p className="text-[11px] text-yellow-500">Saving...</p>
          )}

          {uploadState === "error" && (
            <p className="text-[11px] text-red-500">{error}</p>
          )}
        </div>
      </div>

      {/* FILE INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}