"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useSocialLinks } from "@/hooks/useSociallinks";
import {
  POPULAR_PLATFORMS,
  SOCIAL_PLATFORMS,
  validateAndFormatUrl,
} from "@/lib/Socialplatforms";
import { toast } from "sonner";

export default function SocialLinksSection() {
  const {
    socialLinks,
    isLoading,
    isError,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
  } = useSocialLinks();

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const usedPlatforms = socialLinks.map((link) => link.platform);
  const availablePlatforms = POPULAR_PLATFORMS.filter(
    (platform) => !usedPlatforms.includes(platform)
  );

  const handleAdd = async () => {
    if (!selectedPlatform || !inputValue.trim()) {
      setValidationError("Please select a platform and enter a URL");
      return;
    }

    const validation = validateAndFormatUrl(selectedPlatform, inputValue);

    if (!validation.valid) {
      setValidationError(validation.error || "Invalid URL");
      return;
    }

    setAdding(true);
    setValidationError("");

    try {
      await createSocialLink(
        selectedPlatform,
        validation.url!,
        validation.username || undefined
      );

      setSelectedPlatform("");
      setInputValue("");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || "Failed to add link";
      setValidationError(errorMessage);
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (link: any) => {
    setEditingId(link.id);
    setEditValue(link.url);
    setEditError("");
  };

  const saveEdit = async (id: string, platform: string) => {
    const validation = validateAndFormatUrl(platform, editValue);

    if (!validation.valid) {
      setEditError(validation.error || "Invalid URL");
      return;
    }

    try {
      await updateSocialLink(
        id,
        validation.url!,
        validation.username || undefined
      );
      setEditingId(null);
      setEditValue("");
      setEditError("");
    } catch (error) {
      setEditError("Failed to update link");
    }
  };

  const confirmDelete = (id: string) => {
    setLinkToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;

    setDeleting(true);
    try {
      await deleteSocialLink(linkToDelete);
      setLinkToDelete(null);
    } catch (error) {
      alert("Failed to delete link");
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link Copied");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading social links...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">
          Failed to load social links. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {socialLinks.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          {socialLinks.map((link) => {
            const platform = SOCIAL_PLATFORMS[link.platform];
            const isEditing = editingId === link.id;

            return (
              <div
                key={link.id}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 sm:p-4 transition-all duration-200 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl text-xl sm:text-2xl shadow-sm"
                    style={{ backgroundColor: `${platform?.color}15` }}
                  >
                    {platform?.icon ? <platform.icon /> : "🔗"}
                  </div>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => {
                            setEditValue(e.target.value);
                            setEditError("");
                          }}
                          placeholder={platform?.placeholder}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white
                           dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100
                            placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500
                             dark:focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20
                              dark:focus:ring-amber-400/20 transition-colors"
                        />
                        {editError && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {editError}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(link.id, link.platform)}
                            className="flex-1 sm:flex-initial rounded-lg bg-blue-500 dark:bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 dark:hover:bg-blue-700 active:bg-blue-700 dark:active:bg-blue-800 transition-colors shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditValue("");
                              setEditError("");
                            }}
                            className="flex-1 sm:flex-initial rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                            {platform?.name || link.platform}
                          </h3>
                          {link.username && (
                            <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                              @{link.username}
                            </span>
                          )}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 break-all transition-colors"
                        >
                          {link.url}
                        </a>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex flex-col sm:flex-row gap-1">
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="rounded-lg p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 active:bg-slate-200 dark:active:bg-slate-600 transition-colors"
                        title="Copy link"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => startEdit(link)}
                        className="rounded-lg p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700
                         hover:text-slate-600 dark:hover:text-slate-300 active:bg-slate-200
                          dark:active:bg-slate-600 transition-colors"
                        title="Edit"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(link.id)}
                        className="rounded-lg p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 active:bg-red-100 dark:active:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {availablePlatforms.length > 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 p-4 sm:p-6 backdrop-blur-sm">
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            Add Social Link
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  setValidationError("");
                }}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 transition-colors appearance-none cursor-pointer shadow-sm"
              >
                <option value="" className="dark:bg-slate-900">
                  Select a platform
                </option>
                {availablePlatforms.map((platformId) => {
                  const platform = SOCIAL_PLATFORMS[platformId];
                  return (
                    <option
                      key={platformId}
                      value={platformId}
                      className="dark:bg-slate-900"
                    >
                      {platform.name}
                    </option>
                  );
                })}
              </select>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                {selectedPlatform && (
                  <div className="text-slate-500 dark:text-slate-400">
                    {(() => {
                      const Icon = SOCIAL_PLATFORMS[selectedPlatform]?.icon;
                      return Icon ? <Icon size={16} /> : null;
                    })()}
                  </div>
                )}
                <svg
                  className="h-4 w-4 text-slate-400 dark:text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {selectedPlatform && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {SOCIAL_PLATFORMS[selectedPlatform]?.name} URL or Username
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setValidationError("");
                  }}
                  placeholder={SOCIAL_PLATFORMS[selectedPlatform]?.placeholder}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 transition-colors shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAdd();
                    }
                  }}
                />
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Enter your username or full URL
                </p>
              </div>
            )}

            {validationError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {validationError}
                </p>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={adding || !selectedPlatform || !inputValue.trim()}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 active:from-blue-700 active:to-blue-800 dark:active:from-blue-800 dark:active:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Social Link"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 p-4 sm:p-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You've added all available platforms! 🎉
          </p>
        </div>
      )}

      {socialLinks.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 py-8 sm:py-12 text-center px-4">
          <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 shadow-inner">
            <svg
              className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400 dark:text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="mb-1 text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            No social links yet
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Add your first social link to get started
          </p>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Social Link"
        description="Are you sure you want to delete this social link? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}
