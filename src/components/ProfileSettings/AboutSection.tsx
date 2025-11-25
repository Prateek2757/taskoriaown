"use client";

import { uploadToSupabase } from "@/lib/uploadFileToSupabase";
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

  // console.log(companydata?.logo_url,"asdbakjsbc");
  
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
    console.log(formState.avatarFile)
    console.log(formState.avatarPreview,"ijoijoin");
    
    setSaving(true);
    setMsg(null);
    setError(null);

    try {
   
         let avatarUrl = formState.avatarPreview
         if (formState.avatarFile) {
          const uploadedUrl = await uploadToSupabase(formState.avatarFile, "profilepicture");
          console.log("Uploaded avatar URL:", uploadedUrl);
          // setFormState((prev) => ({
          //   ...prev,
          //   avatarFile: null,
          //   avatarPreview: uploadedUrl, 
          // }));
          avatarUrl = uploadedUrl;
        }      
          let companyUrl = formState.companyLogoPreview
          if(formState.companyLogoFile){
            const uploadedCompanyurl = await uploadToSupabase(formState.companyLogoFile,"companyProfile")
            companyUrl = uploadedCompanyurl
          }
      
      const payload = {
        display_name: formState.name,
        avatarUrl: avatarUrl,
        company_name: formState.companyName,
        companyLogoUrl:  companyUrl,
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
        avatarPreview:avatarUrl,
        companyLogoPreview:companyUrl
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

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-10">
      <section>
        <h2 className="text-xl font-semibold text-gray-900">
          Personal name & logo
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          This is the first thing customers will see when searching for a
          professional.
          <br />
          As a sole-trader, you can just enter your name.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {formState.avatarPreview ? (
                <img
                  src={formState.avatarPreview}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
              )}
            </div>

            <label className="mt-3">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer shadow-sm">
                Upload new picture
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-700 font-medium block mb-1">
              Personal name
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">
          Company name & logo
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          This is the first thing customers will see when searching for a
          professional.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {formState.companyLogoPreview ? (
                <img
                  src={formState.companyLogoPreview}
                  alt="Company Logo"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
              )}
            </div>

            <label className="mt-3">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer shadow-sm">
                Upload new picture
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCompanyLogoChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-700 font-medium block mb-1">
              Company name
            </label>
            <input
              type="text"
              value={formState.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="Your company name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900">
          Company Contact details
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          These will be visible to customers once you're live.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Company email address
            </label>
            <input
              type="email"
              value={formState.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              placeholder="e.g. contact@yourcompany.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Company phone number
            </label>
            <input
              type="tel"
              value={formState.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              placeholder="e.g. +1 234 567 890"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Company website
            </label>
            <input
              type="text"
              value={formState.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="e.g. https://www.yourcompany.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* About the company */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900">
          About the company
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Introduce your company to your customers.
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Company size
              </label>
              <select
                value={formState.companySize}
                onChange={(e) => updateField("companySize", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select company size</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employee
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Years in business
              </label>
              <input
                type="number"
                value={formState.yearsInBusiness}
                onChange={(e) => updateField("yearsInBusiness", e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Company description
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your company (minimum 30 characters)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formState.description.length}/30 characters
            </p>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleCancel}
          disabled={!hasChanges || saving}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md shadow-sm border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          type="button"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {msg && (
            <span
              className={`text-sm font-medium ${
                msg.includes("success") || msg.includes("Saved")
                  ? "text-cyan-600"
                  : "text-gray-600"
              }`}
            >
              {msg}
            </span>
          )}
          <button
            onClick={save}
            disabled={!hasChanges || saving}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
