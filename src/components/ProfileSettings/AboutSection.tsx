"use client";

import React, { useState, ChangeEvent, useEffect } from "react";

type Props = {
  data?: {
    display_name?: string;
    avatarUrl?: string;
    company_name?: string;
    company_logo?: string;
    contact_email?: string;
    contact_phone?: string;
    website?: string;
    bio?: string;
  };
  companydata?: {
    company_name?: string;
    company_logo?: string;

    contact_email?: string;
    contact_phone?: string;
    website?: string;
    bio?: string;
  };
  onSave?: (payload: any) => Promise<void>;
};

export default function AboutSection({ companydata, data, onSave }: Props) {
  const [name, setName] = useState(data?.display_name ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(data?.avatarUrl ?? "");

  const [companyName, setCompanyName] = useState(
    companydata?.company_name ?? ""
  );
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(
    data?.company_logo ?? ""
  );

  const [contactEmail, setContactEmail] = useState(data?.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState(data?.contact_phone ?? "");
  const [website, setWebsite] = useState(data?.website ?? "");
  const [bio, setBio] = useState(data?.bio ?? "");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setName(data.display_name ?? "");
      setAvatarPreview(data.avatarUrl ?? "");
     
    }
  }, [data]);

  useEffect(() => {
    if (companydata) {
      setCompanyName(companydata.company_name ?? "");
      setCompanyLogoPreview(companydata.company_logo ?? "");
      setContactEmail(companydata.contact_email ?? "");
      setContactPhone(companydata.contact_phone ?? "");
      setWebsite(companydata.website ?? "");
    }
  }, [companydata]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCompanyLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCompanyLogoFile(e.target.files[0]);
      setCompanyLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const payload: any = {
        display_name: name,
        avatarFile,
        company_name: companyName,
        companyLogoFile,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        website,
        bio,
      };
      await onSave?.(payload);
      setMsg("Saved successfully!");
    } catch {
      setMsg("Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-10">
      {/* Company name & logo */}
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
          {/* Company Logo Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {companyLogoPreview ? (
                <img
                  src={companyLogoPreview}
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
              Personal name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your company name"
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
          <br />
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Company Logo Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {companyLogoPreview ? (
                <img
                  src={companyLogoPreview}
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

          {/* Company Name Input */}
          <div className="flex-1">
            <label className="text-sm text-gray-700 font-medium block mb-1">
              Company name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your company name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900">Contact details</h2>
        <p className="text-sm text-gray-500 mt-1">
          These will be visible to customers once you’re live.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Company email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Company phone"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Company website"
            className="w-full sm:col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </section>



      {/* Save Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>
    </div>
  );
}
