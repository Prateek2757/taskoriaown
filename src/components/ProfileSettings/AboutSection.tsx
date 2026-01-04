"use client";

import { uploadToSupabase } from "@/lib/uploadFileToSupabase";
import Image from "next/image";
import React, { useState, ChangeEvent, useEffect, useMemo } from "react";

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

const COMPANY_SIZES = ["Sole-Trader", "2-10", "10-20", "30-50"];

interface FormState {
  name: string;
  avatarFile: File | null;
  avatarPreview: string;
  companyName: string;
  companyLogoFile: File | null;
  companyLogoPreview: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  companySize: string;
  yearsInBusiness: string;
  description: string;
}

export default function AboutSection({ companydata, data, onSave }: Props) {
  const initialState: FormState = useMemo(
    () => ({
      name: data?.display_name ?? "",
      avatarFile: null,
      avatarPreview: data?.profile_image_url ?? "",
      companyName: companydata?.company_name ?? "",
      companyLogoFile: null,
      companyLogoPreview: companydata?.logo_url ?? "",
      contactEmail: companydata?.contact_email ?? "",
      contactPhone: companydata?.contact_phone ?? "",
      website: companydata?.website ?? "",
      companySize: companydata?.company_size ?? "",
      yearsInBusiness: companydata?.years_in_business ?? "",
      description: companydata?.about ?? "",
    }),
    [data, companydata]
  );

  const [formState, setFormState] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormState(initialState);
  }, [initialState]);

  const hasChanges = useMemo(() => {
    return (
      formState.name !== initialState.name ||
      formState.avatarFile !== null ||
      formState.companyName !== initialState.companyName ||
      formState.companyLogoFile !== null ||
      formState.contactEmail !== initialState.contactEmail ||
      formState.contactPhone !== initialState.contactPhone ||
      formState.website !== initialState.website ||
      formState.companySize !== initialState.companySize ||
      formState.yearsInBusiness !== initialState.yearsInBusiness ||
      formState.description !== initialState.description
    );
  }, [formState, initialState]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormState((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCompanyLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormState((prev) => ({
        ...prev,
        companyLogoFile: file,
        companyLogoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCancel = () => {
    setFormState(initialState);
    setError(null);
    setMsg("Changes canceled");
    setTimeout(() => setMsg(null), 2000);
  };

  const save = async () => {
    const companyFieldFilled = formState.companyName.trim();
    if (companyFieldFilled && formState.description.trim().length < 30) {
      setError("Company description must be at least 30 characters long.");
      return;
    }

    setSaving(true);
    setMsg(null);
    setError(null);

    try {
      let avatarUrl = formState.avatarPreview;
      if (formState.avatarFile) {
        const uploadedUrl = await uploadToSupabase(formState.avatarFile, "profilepicture");
        avatarUrl = uploadedUrl;
      }

      let companyUrl = formState.companyLogoPreview;
      if (formState.companyLogoFile) {
        const uploadedCompanyurl = await uploadToSupabase(formState.companyLogoFile, "companyProfile");
        companyUrl = uploadedCompanyurl;
      }

      const payload = {
        display_name: formState.name,
        avatarUrl: avatarUrl,
        company_name: formState.companyName,
        companyLogoUrl: companyUrl,
        contact_email: formState.contactEmail,
        contact_phone: formState.contactPhone,
        company_size: formState.companySize,
        years_in_business: formState.yearsInBusiness,
        website: formState.website,
        description: formState.description,
      };

      await onSave?.(payload);
      setMsg("Saved successfully!");

      setFormState((prev) => ({
        ...prev,
        avatarFile: null,
        companyLogoFile: null,
        avatarPreview: avatarUrl,
        companyLogoPreview: companyUrl,
      }));
    } catch (err: any) {
      if (err?.response?.data?.message?.includes("about")) {
        setError("Company description must be at least 30 characters long.");
      } else {
        setError(err?.response?.data?.message || "Failed to save changes.");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 2500);
    }
  };

  const descriptionLength = formState.description.length;
  const isDescriptionValid = descriptionLength >= 30 || descriptionLength === 0;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm dark:shadow-gray-900/50 p-8 space-y-10 transition-colors duration-200">
      {/* Personal Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Personal name & logo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This is the first thing customers will see when searching for a professional.
            <br />
            As a sole-trader, you can just enter your name.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:border-blue-500 dark:group-hover:border-blue-400">
                {formState.avatarPreview ? (
                  <Image
                    height={96}
                    width={96}
                    src={formState.avatarPreview}
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                )}
              </div>
              {formState.avatarFile && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <label className="mt-3">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md cursor-pointer shadow-sm transition-colors duration-200">
                Upload new picture
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-label="Upload personal avatar"
              />
            </label>
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
              Personal name
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-sm transition-colors duration-200"
            />
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Company name & logo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This is the first thing customers will see when searching for a professional.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:border-blue-500 dark:group-hover:border-blue-400">
                {formState.companyLogoPreview ? (
                  <Image
                    height={96}
                    width={96}
                    src={formState.companyLogoPreview}
                    alt="Company Logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                )}
              </div>
              {formState.companyLogoFile && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <label className="mt-3">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md cursor-pointer shadow-sm transition-colors duration-200">
                Upload new picture
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCompanyLogoChange}
                className="hidden"
                aria-label="Upload company logo"
              />
            </label>
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
              Company name
            </label>
            <input
              type="text"
              value={formState.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="Your company name"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-sm transition-colors duration-200"
            />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="space-y-4">
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
              value={formState.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              placeholder="e.g. contact@yourcompany.com"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company phone number
            </label>
            <input
              type="tel"
              value={formState.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              placeholder="e.g. +1 234 567 890"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company website
            </label>
            <input
              type="text"
              value={formState.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="e.g. https://www.yourcompany.com"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>
        </div>
      </section>

      {/* About the company */}
      <section className="space-y-4">
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
                value={formState.companySize}
                onChange={(e) => updateField("companySize", e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              >
                <option value="">Select company size</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employee{size !== "Sole-Trader" ? "s" : ""}
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
                value={formState.yearsInBusiness}
                onChange={(e) => updateField("yearsInBusiness", e.target.value)}
                placeholder="e.g. 5"
                min="0"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company description
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your company (minimum 30 characters)"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 resize-none"
              rows={4}
            />
            <div className="flex items-center justify-between mt-1">
              <p className={`text-xs ${isDescriptionValid ? 'text-gray-500 dark:text-gray-400' : 'text-amber-600 dark:text-amber-500'}`}>
                {descriptionLength}/30 characters
              </p>
              {descriptionLength >= 30 && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ Valid
                </span>
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCancel}
          disabled={!hasChanges || saving}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md shadow-sm border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          type="button"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {msg && (
            <span
              className={`text-sm font-medium flex items-center gap-2 ${
                msg.includes("success") || msg.includes("Saved")
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400"
              } animate-fade-in`}
            >
              {(msg.includes("success") || msg.includes("Saved")) && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {msg}
            </span>
          )}
          <button
            onClick={save}
            disabled={!hasChanges || saving}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>

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