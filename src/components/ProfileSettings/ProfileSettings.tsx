"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { useLeadProfile } from "@/hooks/useLeadProfile";
import { Progress } from "../ui/progress";
import { useSession } from "next-auth/react";
// Section Components
import AboutSection from "./AboutSection";
import ReviewsSection from "./ReviewSection";
import ServicesSection from "./ServicesSection";
import PhotosSection from "./PhotosSection";
import SocialLinksSection from "./SocialLinksSection";
import AccreditationsSection from "./AccreditationsSection";
import QASection from "./QASection";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";


// ---------------- Types ----------------
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
  const {  update } = useSession();
  const { profile, loading , updateProfile} = useLeadProfile();
  const { company ,loading: companyLoading, updateCompany} = useCompanyProfile();
  const [expanded, setExpanded] = useState<SectionId | null>(null);
  const [completion, setCompletion] = useState<number>(profile ? 27 : 0); // placeholder until backend provides value


  const saveAbout = async (payload: any) => {
    try {
      // 1️⃣ Update profile in your DB
      await updateProfile({ display_name: payload.display_name });
  
      // 2️⃣ Update company data too
      await updateCompany({
        company_name: payload.company_name,
        contact_name: payload.display_name,
         about:payload.bio,
        company_size:payload.company_size,
        years_in_business:payload.years_in_business,
        contact_email: payload.contact_email,
        contact_phone: payload.contact_phone,
        website: payload.website,
      });
  
      // 3️⃣ Refresh session globally (✅ Proper merge)
        await update({
      name: payload.display_name,
    });
  
      console.log("✅ Session updated instantly");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    }
  };
  
  // simulate completion (you can compute dynamically from backend)
  React.useEffect(() => {
    if (profile) {
      const completed = profile.categories?.length ? 15 : 0;
      setCompletion(completed + 12); // Example logic
    }
  }, [profile]);

  const toggle = (id: SectionId) => setExpanded((e) => (e === id ? null : id));

  // ---------------- Update Function ----------------
  const updateSection = async (section: SectionId, payload: any) => {
    console.log(`Saving ${section}:`, payload);
    // TODO: integrate with your backend update routes
  };

  if (loading  && companyLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 text-slate-600">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header / Progress */}
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-gray-700 mb-4"
          aria-label="Back"
        >
          ← Settings
        </button>

        <h1 className="text-3xl font-semibold text-slate-900">
          Your profile is{" "}
          <span className="text-amber-500">{completion}% complete</span>
        </h1>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <Progress value={completion} />
          </div>
          <div className="min-w-[64px] text-sm text-slate-600">
            {completion}%
          </div>
        </div>

        <p className="mt-4 text-sm text-amber-600 font-medium">
          Take two minutes to improve your profile
        </p>

        <p className="mt-2 text-sm text-slate-700 max-w-2xl">
          Make the best first impression with a great profile — this is what
          customers will look at first when choosing which professional to
          hire.
        </p>

        <a
          href="/public-profile"
          className="inline-block mt-3 text-sm text-blue-600 underline"
        >
          View public profile
        </a>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {SECTIONS.map((s) => {
          const isOpen = expanded === s.id;
          const done =
            (profile as any)?.completedSections?.includes(s.id) ?? false;

          return (
            <section
              key={s.id}
              className="border rounded-xl overflow-hidden bg-white shadow-sm"
            >
              <header
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggle(s.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-xs text-slate-500">{s.description}</p>
                    )}
                  </div>
                  {done && (
                    <span className="flex items-center gap-1 text-sm text-emerald-600">
                      <CheckCircle size={16} /> Completed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(s.id);
                    }}
                    className="text-sm inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </header>

              {isOpen && (
                <div className="p-4 border-t bg-gray-50">
                  {s.id === "about" && (
                    <AboutSection
                      data={(profile as any)}
                      companydata={(company as any)}
                      onSave={saveAbout}
                    />
                  )}
                  {s.id === "reviews" && (
                    <ReviewsSection data={(profile as any)?.reviews} />
                  )}
                  {s.id === "services" && (
                    <ServicesSection
                      data={(profile as any)?.services}
                      onSave={(payload) => updateSection("services", payload)}
                    />
                  )}
                  {s.id === "photos" && (
                    <PhotosSection
                      data={(profile as any)?.photos}
                      onSave={(payload) => updateSection("photos", payload)}
                    />
                  )}
                  {s.id === "social" && (
                    <SocialLinksSection
                      data={(profile as any)?.social}
                      onSave={(payload) => updateSection("social", payload)}
                    />
                  )}
                  {s.id === "accreditations" && (
                    <AccreditationsSection
                      data={(profile as any)?.accreditations}
                      onSave={(payload) =>
                        updateSection("accreditations", payload)
                      }
                    />
                  )}
                  {s.id === "qa" && (
                    <QASection
                      data={(profile as any)?.qa}
                      onSave={(payload) => updateSection("qa", payload)}
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
