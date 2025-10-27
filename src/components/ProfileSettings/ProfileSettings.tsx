// // components/ProfileSettings.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   CheckCircle,
//   Pencil,
// } from "lucide-react";
// // small Progress component provided below
// import { useLeadProfile } from "@/hooks/useLeadProfile";
// import AboutSection from "./AboutSection";
// import ReviewsSection from "./sections/ReviewsSection";
// import ServicesSection from "./sections/ServicesSection";
// import PhotosSection from "./PhotosSection";
// import SocialLinksSection from "./SocialLinksSection";
// import AccreditationsSection from "./AccreditationsSection";
// import QASection from "./QASection";
// import { Progress } from "../ui/progress";

// const SECTIONS = [
//   { id: "about", title: "About" },
//   { id: "reviews", title: "Reviews" },
//   { id: "services", title: "Services" },
//   { id: "photos", title: "Photos" },
//   { id: "social", title: "Social media & links" },
//   { id: "accreditations", title: "Accreditations" },
//   { id: "qa", title: "Q&A" },
// ] as const;

// export default function ProfileSettings() {
//   const { profile, loading, fetchProfile, updateSection } = useLeadProfile();
//   const [expanded, setExpanded] = useState<string | null>(null);
//   const completion = profile?.completion ?? 0;

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const toggle = (id: string) => setExpanded((e) => (e === id ? null : id));

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header / Progress */}
//       <div className="mb-8">
//         <button
//           onClick={() => window.history.back()}
//           className="text-gray-500 hover:text-gray-700 mb-4"
//           aria-label="Back"
//         >
//           ← Settings
//         </button>

//         <h1 className="text-3xl font-semibold text-slate-900">
//           Your profile is <span className="text-amber-500">{completion}% complete</span>
//         </h1>

//         <div className="mt-4 flex items-center gap-4">
//           <div className="flex-1">
//             <Progress value={completion} />
//           </div>
//           <div className="min-w-[64px] text-sm text-slate-600">{completion}%</div>
//         </div>

//         <p className="mt-4 text-sm text-amber-600 font-medium">Take two minutes to improve your profile</p>

//         <p className="mt-2 text-sm text-slate-700 max-w-2xl">
//           Make the best first impression with a great profile — this is what customers will look at first when choosing which professional to hire.
//         </p>

//         <a
//           href="/public-profile"
//           className="inline-block mt-3 text-sm text-blue-600 underline"
//         >
//           View public profile
//         </a>
//       </div>

//       {/* Sections */}
//       <div className="space-y-4">
//         {SECTIONS.map((s) => {
//           const isOpen = expanded === s.id;
//           const done = profile?.completedSections?.includes(s.id) ?? false;

//           return (
//             <section
//               key={s.id}
//               className="border rounded-xl overflow-hidden bg-white shadow-sm"
//             >
//               <header
//                 className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
//                 onClick={() => toggle(s.id)}
//                 aria-expanded={isOpen}
//               >
//                 <div className="flex items-center gap-4">
//                   <div>
//                     <h3 className="text-lg font-medium text-slate-900">{s.title}</h3>
//                     <p className="text-xs text-slate-500">
//                       {s.id === "about" ? "Name, profile picture and bio" : ""}
//                     </p>
//                   </div>
//                   {done && (
//                     <span className="flex items-center gap-1 text-sm text-emerald-600">
//                       <CheckCircle size={16} /> Completed
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggle(s.id);
//                     }}
//                     className="text-sm inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100"
//                   >
//                     <Pencil size={14} />
//                     Edit
//                   </button>
//                   {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                 </div>
//               </header>

//               {isOpen && (
//                 <div className="p-4 border-t bg-gray-50">
//                   {s.id === "about" && (
//                     <AboutSection
//                       data={profile?.about}
//                       onSave={(payload) => updateSection("about", payload)}
//                     />
//                   )}
//                   {s.id === "reviews" && <ReviewsSection data={profile?.reviews} />}
//                   {s.id === "services" && (
//                     <ServicesSection
//                       data={profile?.services}
//                       onSave={(payload) => updateSection("services", payload)}
//                     />
//                   )}
//                   {s.id === "photos" && (
//                     <PhotosSection
//                       data={profile?.photos}
//                       onSave={(payload) => updateSection("photos", payload)}
//                     />
//                   )}
//                   {s.id === "social" && (
//                     <SocialLinksSection
//                       data={profile?.social}
//                       onSave={(payload) => updateSection("social", payload)}
//                     />
//                   )}
//                   {s.id === "accreditations" && (
//                     <AccreditationsSection
//                       data={profile?.accreditations}
//                       onSave={(payload) => updateSection("accreditations", payload)}
//                     />
//                   )}
//                   {s.id === "qa" && (
//                     <QASection data={profile?.qa} onSave={(payload) => updateSection("qa", payload)} />
//                   )}
//                 </div>
//               )}
//             </section>
//           );
//         })}
//       </div>

//       {/* Loading / Empty state */}
//       {loading && (
//         <div className="mt-6 text-sm text-slate-500">Loading profile…</div>
//       )}
//     </div>
//   );
// }
