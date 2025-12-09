import ProviderProfileClient from "@/components/providers/providerIndivisual";
import { fetchProviders } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params; 
  const providers = await fetchProviders();
  const provider = providers.find((p: any) => String(p.public_id) === resolvedParams.id);

  if (!provider) {
    return {
      title: "Provider Not Found — Taskoria",
      description: "The provider you are looking for does not exist.",
    };
  }

  return {
    title: `${provider.name} — Taskoria`,
    description: provider.description ?? "View provider details.",
    openGraph: {
      title: provider.name,
      description: provider.description,
      images: provider.image ? [provider.image] : [],
    },
  };
}

export default async function ProviderPage({ params }: any) {
  const resolvedParams = await params; 
  const providers = await fetchProviders();
  const provider = providers.find((p: any) => String(p.public_id) === resolvedParams.id);

  return <ProviderProfileClient provider={provider} />;
}
