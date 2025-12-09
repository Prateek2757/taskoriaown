import AllProvidersClient from "@/components/providers/provider-list";
import { fetchProviders } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const providers = await fetchProviders();

  return {
    title: `All Providers (${providers.length}) — Taskoria`,
    description: "Browse and hire verified service providers across Nepal.",
    openGraph: {
      title: `All Providers (${providers.length})`,
      description: "Find trusted service providers.",
    },
  };
}


export default function ProvidersPage() {
  
  return <AllProvidersClient />;
}
