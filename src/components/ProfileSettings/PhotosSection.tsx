"use client";

import React, { useState, useRef, useCallback } from "react";
import { useProfilePhotos } from "@/hooks/useProfilePhotos";
import Image from "next/image";
import ConfirmDialog from "@/components/ConfirmDialog";
import { uploadToSupabase } from "@/lib/uploadFileToSupabase";

export default function PhotosSection() {
  const {
    photos,
    isLoading,
    isError,
    createPhoto,
    updatePhoto,
    deletePhoto,
  } = useProfilePhotos();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    setUploading(true);
    setUploadProgress(0);

    try {
      const photoUrl = await uploadToSupabase(file, "portfolio");

      await createPhoto(photoUrl);

      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const startEdit = (photo: any) => {
    setEditingPhoto(photo.id);
    setEditTitle(photo.title || "");
    setEditDesc(photo.description || "");
  };

  const saveEdit = async (id: string) => {
    try {
      await updatePhoto(id, editTitle, editDesc);
      setEditingPhoto(null);
      setEditTitle("");
      setEditDesc("");
    } catch (error) {
      alert("Failed to update photo");
    }
  };

  const confirmDelete = (id: string) => {
    setPhotoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!photoToDelete) return;

    setDeleting(true);
    try {
      await deletePhoto(photoToDelete);
      setPhotoToDelete(null);
    } catch (error) {
      alert("Failed to delete photo");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading photos...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">Failed to load photos. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`relative rounded-lg border-2 border-dashed p-7 text-center transition-all  ${
          dragActive
            ? "border-amber-500 bg-amber-50"
            : "border-slate-300 bg-slate-50 hover:border-amber-400 dark:bg-gray-900 hover:bg-blue-50/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700">
              Uploading... {Math.round(uploadProgress)}%
            </div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Choose Photo
              </button>
              <p className="mt-2 text-sm text-slate-500">or drag and drop</p>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              PNG, JPG, WebP or GIF up to 5MB
            </p>
          </>
        )}
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-slate-100 "
            >
              <Image
                src={photo.photo_url}
                alt={photo.title || "Portfolio photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/60">
                <div className="flex h-full flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => setSelectedPhoto(photo.id)}
                    className="rounded bg-white px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-100"
                  >
                    View
                  </button>
                  <button
                    onClick={() => startEdit(photo)}
                    className="rounded bg-white px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(photo.id)}
                    className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {photo.is_featured && (
                <div className="absolute left-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 py-12 text-center">
          <p className="text-slate-500">
            No photos yet. Upload your first photo above.
          </p>
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-slate-900 hover:bg-slate-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={photos.find((p) => p.id === selectedPhoto)?.photo_url || ""}
              alt="Full size"
              width={1200}
              height={800}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {editingPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingPhoto(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold">Edit Photo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Photo title (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Photo description (optional)"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(editingPhoto)}
                  className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Photo"
        description="Are you sure you want to delete this photo? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}
