import AllProvidersClient from "@/components/providers/provider-list";
import { fetchProviders } from "@/utils/api";
import { Metadata } from "next";
import { Suspense } from "react";
export async function generateMetadata(): Promise<Metadata> {

  const providers = await fetchProviders();

  return {
    title: `Become a Service Provider | Grow Your Business with Taskoria`,
    description: "Join Taskoria as a verified service provider. Get quality job leads, flexible work, and AI-powered matching to grow your business faster.",
    openGraph: {
      title: `Become a Service Provider | Grow Your Business with Taskoria`,
      description: "Join Taskoria as a verified service provider. Get quality job leads, flexible work, and AI-powered matching to grow your business faster.",
    },
  };
}


export default function ProvidersPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AllProvidersClient />
    </Suspense>
  );
}
