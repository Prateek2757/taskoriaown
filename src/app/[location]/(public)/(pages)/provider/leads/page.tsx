import type { Metadata } from "next";

import LeadsPage from "@/components/showinglead/Leadpage"

export const metadata: Metadata = {
  title: { absolute: "Provider Leads | Taskoria" },
  description:
    "Browse and manage Taskoria customer leads available to your provider account.",
  robots: { index: false, follow: false },
};

function page() {
  return (
    <div><LeadsPage></LeadsPage></div>
  )
}

export default page;
