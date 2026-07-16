import type { Metadata } from "next";
import PageClient from "./page-client";
import { getProfessionalPackagesFromDB } from "@/lib/cache";

// Packages come from PostgreSQL. Render this page at request time so Docker
// builds do not require access to the production database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Taskoria Pricing | Provider Plans and Credits`,
  description: `Compare Taskoria provider pricing, credit options, and subscription benefits for winning more local service jobs.`,
  robots: { index: true, follow: true },
};

export default async function Page() {
  const packages = await getProfessionalPackagesFromDB();

  return <PageClient initialPackages={packages} />;
}
