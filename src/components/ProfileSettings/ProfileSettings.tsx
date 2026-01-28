"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { Progress } from "../ui/progress";
import { useLeadProfile } from "@/hooks/useLeadProfile";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

import AboutSection from "./AboutSection";
import ReviewsSection from "./ReviewSection";
import ServicesSection from "./ServicesSection";
import PhotosSection from "./PhotosSection";
import SocialLinksSection from "./SocialLinksSection";
import AccreditationsSection from "./AccreditationsSection";
import QASection from "./QASection";

type SectionId =
  | "about"
  | "reviews"
  | "services"
  | "photos"
  | "social"
  | "accreditations"
  | "qa";

interface Section {
  id: SectionId;
  title: string;
  description?: string;
}

const SECTIONS: Section[] = [
  { id: "about", title: "About", description: "Name, profile picture and bio" },
  { id: "reviews", title: "Reviews" },
  { id: "services", title: "Services" },
  { id: "photos", title: "Photos" },
  { id: "social", title: "Social media & links" },
  { id: "accreditations", title: "Accreditations" },
  { id: "qa", title: "Q&A" },
];

export default function ProfileSettings() {
  const { update } = useSession();
  const { profile, loading, updateProfile } = useLeadProfile();
  const { company, loading: companyLoading, updateCompany } =
    useCompanyProfile();

  const [expanded, setExpanded] = useState<SectionId | null>(null);
  const [completion, setCompletion] = useState<number>(profile ? 60 : 0);

  const toggle = (id: SectionId) =>
    setExpanded((prev) => (prev === id ? null : id));

  const saveAbout = async (payload: any) => {
    try {
      await updateProfile({
        display_name: payload.display_name,
        profile_image_url: payload.avatarUrl,
      });

      await updateCompany({
        company_name: payload.company_name,
        contact_name: payload.display_name,
        company_logo_url: payload.companyLogoUrl,
        about: payload.description,
        company_size: payload.company_size,
        years_in_business: payload.years_in_business,
        contact_email: payload.contact_email,
        contact_phone: payload.contact_phone,
        website: payload.website,
      });

      await update({ name: payload.display_name });
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    }
  };

  useEffect(() => {
    if (profile) {
      const completed = profile.categories?.length ? 15 : 0;
      setCompletion(completed + 12);
    }
  }, [profile]);

  if (loading && companyLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 text-center text-slate-600 dark:text-slate-400">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16 text-slate-900 dark:text-slate-100">
      <div className="mb-10">
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Settings
        </button>

        <h1 className="text-3xl font-semibold">
          Your profile is{" "}
          <span className="text-amber-500">{completion}% complete</span>
        </h1>

        <div className="mt-5 flex items-center gap-4">
          <div className="flex-1">
            <Progress value={completion} />
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[48px]">
            {completion}%
          </span>
        </div>

        <p className="mt-4 text-sm font-medium text-amber-600 dark:text-amber-400">
          Take two minutes to improve your profile
        </p>

        <p className="mt-2 text-sm text-slate-700 dark:text-slate-400 max-w-2xl">
          Make the best first impression — this is the first thing customers see
          before hiring you.
        </p>

       
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const isOpen = expanded === section.id;
          const done =
            (profile as any)?.completedSections?.includes(section.id) ?? false;

          return (
            <section
              key={section.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <header
                onClick={() => toggle(section.id)}
                className="flex items-center justify-between p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <div>
                    <h3 className="text-lg font-medium">
                      {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {section.description}
                      </p>
                    )}
                  </div>

                  {done && (
                    <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={16} />
                      Completed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(section.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  {isOpen ? (
                    <ChevronUp className="text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              </header>

              {isOpen && (
                <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  {section.id === "about" && (
                    <AboutSection
                      data={profile as any}
                      companydata={company as any}
                      onSave={saveAbout}
                    />
                  )}
                  {section.id === "reviews" && (
                    <ReviewsSection data={(profile as any)?.reviews} />
                  )}
                  {section.id === "services" && (
                    <ServicesSection
                      data={(profile as any)?.services}
                    />
                  )}
                  {section.id === "photos" && (
                    <PhotosSection
                      data={(profile as any)?.photos}
                    />
                  )}
                  {section.id === "social" && (
                    <SocialLinksSection
                      data={(profile as any)?.social}
                    />
                  )}
                  {section.id === "accreditations" && (
                    <AccreditationsSection
                      data={(profile as any)?.accreditations}
                    />
                  )}
                  {section.id === "qa" && (
                    <QASection
                      data={(profile as any)?.qa}
                    />
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}