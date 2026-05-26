"use client";

import { uploadToSupabase } from "@/lib/uploadFileToSupabase";
import Image from "next/image";
import React, { useEffect, useRef, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  data?: {
    display_name?: string;
    profile_image_url?: string;
  };
  companydata?: {
    company_name?: string;
    logo_url?: string;
    company_size?: string;
    years_in_business?: string;
    contact_email?: string;
    contact_phone?: string;
    website?: string;
    about?: string;
  };
  onSave?: (payload: any) => Promise<void>;
};

interface FormValues {
  name: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  companySize: string;
  yearsInBusiness: string;
  description: string;
  // Stored as a DataTransfer-safe FileList so RHF can track dirtiness,
  // but we also keep a separate preview URL via a ref/state pair.
  avatarFile: FileList | null;
  companyLogoFile: FileList | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COMPANY_SIZES = ["Sole-Trader", "2-10", "10-20", "30-50"] as const;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safely revokes an object URL only if it was created by us (blob:). */
function revokeIfBlob(url: string | null) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

// ─── Sub-component: ImageUploader ────────────────────────────────────────────

interface ImageUploaderProps {
  label: string;
  ariaLabel: string;
  preview: string;         // current preview URL (remote or blob)
  hasNewFile: boolean;     // shows the green "staged" badge
  onFileChange: (file: File) => void;
}

function ImageUploader({
  label,
  ariaLabel,
  preview,
  hasNewFile,
  onFileChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${label} must be under 5 MB.`);
        // Reset the native input so the same file can be re-selected after
        // the user picks a valid one without the browser blocking the onChange.
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      onFileChange(file);
      // Don't reset the input value here — we need it for RHF's FileList tracking.
    },
    [label, onFileChange]
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:border-blue-500 dark:group-hover:border-blue-400">
          {preview ? (
            <Image
              height={96}
              width={96}
              src={preview}
              alt={ariaLabel}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
          )}
        </div>

        {hasNewFile && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <label className="mt-3 cursor-pointer">
        <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200">
          Upload new picture
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          aria-label={ariaLabel}
        />
      </label>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

/** Returns extra Tailwind classes to highlight an input/select/textarea in error state. */
function errCls(hasError: boolean) {
  return hasError
    ? "border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500 focus:border-red-400 dark:focus:border-red-500"
    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AboutSection({ companydata, data, onSave }: Props) {
  // Track preview URLs separately from RHF so we can revoke blob: URLs cleanly.
  // These are NOT part of the form values — they're display-only.
  const avatarPreviewRef = useRef<string>(data?.profile_image_url ?? "");
  const logoPreviewRef = useRef<string>(companydata?.logo_url ?? "");

  // Force re-renders when preview URLs change (useRef alone won't trigger them).
  const [avatarPreview, setAvatarPreview] = React.useState(avatarPreviewRef.current);
  const [logoPreview, setLogoPreview] = React.useState(logoPreviewRef.current);

  const [saving, setSaving] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const defaultValues: FormValues = {
    name: data?.display_name ?? "",
    companyName: companydata?.company_name ?? "",
    contactEmail: companydata?.contact_email ?? "",
    contactPhone: companydata?.contact_phone ?? "",
    website: companydata?.website ?? "",
    companySize: companydata?.company_size ?? "",
    yearsInBusiness: companydata?.years_in_business ?? "",
    description: companydata?.about ?? "",
    avatarFile: null,
    companyLogoFile: null,
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues,
    formState: { isDirty, errors },
  } = useForm<FormValues>({ defaultValues, mode: "onTouched" });

  const description = watch("description");
  const avatarFileList = watch("avatarFile");
  const logoFileList = watch("companyLogoFile");

  // Sync preview + defaults when parent props change (e.g. after first load).
  useEffect(() => {
    const nextDefaults: FormValues = {
      name: data?.display_name ?? "",
      companyName: companydata?.company_name ?? "",
      contactEmail: companydata?.contact_email ?? "",
      contactPhone: companydata?.contact_phone ?? "",
      website: companydata?.website ?? "",
      companySize: companydata?.company_size ?? "",
      yearsInBusiness: companydata?.years_in_business ?? "",
      description: companydata?.about ?? "",
      avatarFile: null,
      companyLogoFile: null,
    };
    reset(nextDefaults);

    // Revoke any blob we were showing, then switch to the new remote URL.
    revokeIfBlob(avatarPreviewRef.current);
    revokeIfBlob(logoPreviewRef.current);
    avatarPreviewRef.current = data?.profile_image_url ?? "";
    logoPreviewRef.current = companydata?.logo_url ?? "";
    setAvatarPreview(avatarPreviewRef.current);
    setLogoPreview(logoPreviewRef.current);
  }, [data, companydata, reset]);

  // Clean up blob URLs on unmount.
  useEffect(() => {
    return () => {
      revokeIfBlob(avatarPreviewRef.current);
      revokeIfBlob(logoPreviewRef.current);
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAvatarFile = useCallback(
    (file: File) => {
      // Revoke the previous blob preview (if any) before creating a new one.
      revokeIfBlob(avatarPreviewRef.current);
      const blobUrl = URL.createObjectURL(file);
      avatarPreviewRef.current = blobUrl;
      setAvatarPreview(blobUrl);

      // Push the file into a synthetic FileList so RHF marks the field dirty.
      const dt = new DataTransfer();
      dt.items.add(file);
      setValue("avatarFile", dt.files, { shouldDirty: true });
    },
    [setValue]
  );

  const handleLogoFile = useCallback(
    (file: File) => {
      revokeIfBlob(logoPreviewRef.current);
      const blobUrl = URL.createObjectURL(file);
      logoPreviewRef.current = blobUrl;
      setLogoPreview(blobUrl);

      const dt = new DataTransfer();
      dt.items.add(file);
      setValue("companyLogoFile", dt.files, { shouldDirty: true });
    },
    [setValue]
  );

  const handleCancel = useCallback(() => {
    // Revoke staged blobs, revert previews to the last saved remote URLs.
    revokeIfBlob(avatarPreviewRef.current);
    revokeIfBlob(logoPreviewRef.current);

    const savedAvatar = data?.profile_image_url ?? "";
    const savedLogo = companydata?.logo_url ?? "";
    avatarPreviewRef.current = savedAvatar;
    logoPreviewRef.current = savedLogo;
    setAvatarPreview(savedAvatar);
    setLogoPreview(savedLogo);

    reset(); // restores all RHF fields to defaultValues, clears dirty state
    setStatusMsg("Changes canceled");
    setTimeout(() => setStatusMsg(null), 2000);
  }, [data, companydata, reset]);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    setStatusMsg(null);

    try {
      // ── Upload avatar if a new file was staged ──
      let finalAvatarUrl = data?.profile_image_url ?? "";
      const avatarFile = values.avatarFile?.[0];
      if (avatarFile) {
        finalAvatarUrl = await uploadToSupabase(avatarFile, "profilepicture");
        // Revoke the blob and point the preview to the now-persisted remote URL.
        revokeIfBlob(avatarPreviewRef.current);
        avatarPreviewRef.current = finalAvatarUrl;
        setAvatarPreview(finalAvatarUrl);
      }

      // ── Upload company logo if a new file was staged ──
      let finalLogoUrl = companydata?.logo_url ?? "";
      const logoFile = values.companyLogoFile?.[0];
      if (logoFile) {
        finalLogoUrl = await uploadToSupabase(logoFile, "companyProfile");
        revokeIfBlob(logoPreviewRef.current);
        logoPreviewRef.current = finalLogoUrl;
        setLogoPreview(finalLogoUrl);
      }

      const payload = {
        display_name: values.name,
        avatarUrl: finalAvatarUrl,
        company_name: values.companyName,
        companyLogoUrl: finalLogoUrl,
        contact_email: values.contactEmail,
        contact_phone: values.contactPhone,
        company_size: values.companySize,
        years_in_business: values.yearsInBusiness,
        website: values.website,
        description: values.description,
      };

      await onSave?.(payload);

      // Reset the form to the new saved state so isDirty becomes false.
      reset({
        ...values,
        avatarFile: null,
        companyLogoFile: null,
      });

      setStatusMsg("Saved successfully!");
    } catch (err: any) {
      const serverMsg: string = err?.response?.data?.message ?? "";
      toast.error(
        serverMsg.includes("about")
          ? "Company description must be at least 30 characters long."
          : serverMsg || "Failed to save changes."
      );
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 2500);
    }
  };

  // ── Derived UI state ───────────────────────────────────────────────────────

  const descriptionLength = description?.length ?? 0;
  const isDescriptionValid = descriptionLength >= 30 || descriptionLength === 0;
  const hasNewAvatar = !!avatarFileList?.[0];
  const hasNewLogo = !!logoFileList?.[0];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm dark:shadow-gray-900/50 p-8 space-y-10 transition-colors duration-200">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Personal name & avatar ── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Personal name &amp; logo
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This is the first thing customers will see when searching for a professional.
              <br />
              As a sole-trader, you can just enter your name.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
            <ImageUploader
              label="Profile picture"
              ariaLabel="Upload personal avatar"
              preview={avatarPreview}
              hasNewFile={hasNewAvatar}
              onFileChange={handleAvatarFile}
            />

            <div className="flex-1">
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                Personal name
              </label>
              <input
                type="text"
                placeholder="Your name"
                {...register("name", {
                  required: "Personal name is required.",
                  minLength: { value: 2, message: "Name must be at least 2 characters." },
                  maxLength: { value: 80, message: "Name must be under 80 characters." },
                })}
                className={`w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 text-sm transition-colors duration-200 ${errCls(!!errors.name)}`}
              />
              <FieldError message={errors.name?.message} />
            </div>
          </div>
        </section>

        {/* ── Company name & logo ── */}
        <section className="space-y-4 mt-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Company name &amp; logo
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This is the first thing customers will see when searching for a professional.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
            <ImageUploader
              label="Company logo"
              ariaLabel="Upload company logo"
              preview={logoPreview}
              hasNewFile={hasNewLogo}
              onFileChange={handleLogoFile}
            />

            <div className="flex-1">
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                Company name
              </label>
              <input
                type="text"
                placeholder="Your company name"
                {...register("companyName", {
                  maxLength: { value: 100, message: "Company name must be under 100 characters." },
                })}
                className={`w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 text-sm transition-colors duration-200 ${errCls(!!errors.companyName)}`}
              />
              <FieldError message={errors.companyName?.message} />
            </div>
          </div>
        </section>

        {/* ── Contact info ── */}
        <section className="space-y-4 mt-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Company Contact details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              These will be visible to customers once you're live.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company email address
              </label>
              <input
                type="email"
                placeholder="e.g. contact@yourcompany.com"
                {...register("contactEmail", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                className={`w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${errCls(!!errors.contactEmail)}`}
              />
              <FieldError message={errors.contactEmail?.message} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company phone number
              </label>
              <input
                type="tel"
                placeholder="e.g. +1 234 567 890"
                {...register("contactPhone", {
                  pattern: {
                    value: /^[+\d][\d\s\-().]{6,19}$/,
                    message: "Enter a valid phone number.",
                  },
                })}
                className={`w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${errCls(!!errors.contactPhone)}`}
              />
              <FieldError message={errors.contactPhone?.message} />
            </div>

            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company website
              </label>
              <input
                type="text"
                placeholder="e.g. https://www.yourcompany.com"
                {...register("website", {
                  pattern: {
                    value: /^https?:\/\/.+\..+/,
                    message: "Enter a valid URL starting with http:// or https://",
                  },
                })}
                className={`w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${errCls(!!errors.website)}`}
              />
              <FieldError message={errors.website?.message} />
            </div>
          </div>
        </section>

        {/* ── About the company ── */}
        <section className="space-y-4 mt-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              About the company
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Introduce your company to your customers.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company size
                </label>
                <select
                  {...register("companySize")}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                >
                  <option value="">Select company size</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} {size !== "Sole-Trader" ? "employees" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years in business
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  min="0"
                  {...register("yearsInBusiness", {
                    min: { value: 0, message: "Years can't be negative." },
                    max: { value: 999, message: "That's a lot of years…" },
                  })}
                  className={`w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${errCls(!!errors.yearsInBusiness)}`}
                />
                <FieldError message={errors.yearsInBusiness?.message} />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company description
              </label>
              <textarea
                placeholder="Describe your company (minimum 50 characters)"
                rows={4}
                {...register("description", {
                  validate: (val) => {
                    const companyName = getValues("companyName").trim();
                    if (companyName && val.trim().length > 0 && val.trim().length < 50) {
                      return "Company description must be at least 50 characters.";
                    }
                    if (companyName && val.trim().length === 0) {
                      return "Please add a description for your company.";
                    }
                    return true;
                  },
                })}
                className={`w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-colors duration-200 resize-none ${errCls(!!errors.description)}`}
              />
              <div className="flex items-center justify-between mt-1">
                <p
                  className={`text-xs ${
                    isDescriptionValid
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-amber-600 dark:text-amber-500"
                  }`}
                >
                  {descriptionLength}/50 characters
                </p>
                {descriptionLength >= 30 && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Valid
                  </span>
                )}
              </div>
              <FieldError message={errors.description?.message} />
            </div>
          </div>
        </section>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty || saving}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md shadow-sm border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {statusMsg && (
              <span
                className={`text-sm font-medium flex items-center gap-2 animate-fade-in ${
                  statusMsg.includes("Saved") || statusMsg.includes("success")
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {(statusMsg.includes("Saved") || statusMsg.includes("success")) && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {statusMsg}
              </span>
            )}

            <button
              type="submit"
              disabled={!isDirty || saving}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}