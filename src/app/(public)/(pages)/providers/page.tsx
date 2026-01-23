import AllProvidersClient from "@/components/providers/provider-list";
import { Metadata } from "next";
import { Suspense } from "react";

// Force dynamic rendering to prevent build-time fetch errors
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "All Providers — Taskoria",
  description: "Browse and hire verified service providers across Australia.",
  openGraph: {
    title: "All Providers — Taskoria",
    description: "Find trusted service providers.",
  },
};

export default function ProvidersPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AllProvidersClient />
    </Suspense>
  );
}
