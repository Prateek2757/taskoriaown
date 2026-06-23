import type { Metadata } from "next";
import ProfileSettings from "@/components/ProfileSettings/ProfileSettings";

export const metadata: Metadata = {
  title: { absolute: "My Profile Settings | Taskoria" },
  description:
    "Update your Taskoria profile details, company information, services, photos, FAQs, and account settings.",
  robots: { index: false, follow: false },
};

export default function ProfileSettingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d1117]  py-12 px-6 sm:px-12 lg:px-24">
      <ProfileSettings />
    </main>
  );
}
