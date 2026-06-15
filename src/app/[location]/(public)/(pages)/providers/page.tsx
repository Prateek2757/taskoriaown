import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProvidersGrid from "@/components/providers/provider-list";
import { fetchCategories } from "@/utils/api";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/providers");
  }

  if (session.user?.adminrole !== "admin") {
    redirect("/provider/dashboard");
  }
}

async function fetchAdminProviders() {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie") ?? "";
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const baseURL = host
    ? `${protocol}://${host}`
    : process.env.NEXT_PUBLIC_APP_URL || "https://www.taskoria.com";

  const res = await fetch(`${baseURL}/api/providers`, {
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch providers");

  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  await requireAdmin();
  const providers = await fetchAdminProviders();
  const count = providers.length;

  return {
    title: `Service Providers (${count}) — Find Local Experts | Taskoria`,
    description: `Browse ${count} verified service providers on Taskoria. Find top-rated professionals by name, service, or location. Read reviews and hire with confidence.`,
    alternates: {
      canonical: "https://www.taskoria.com/providers",
    },
    openGraph: {
      title: `Service Providers — Find Local Experts | Taskoria`,
      description: `Browse ${count} verified service providers on Taskoria. Find top-rated professionals by name, service, or location.`,
      url: "https://www.taskoria.com/providers",
      siteName: "Taskoria",
      type: "website",
    },
  };
}

export default async function ProvidersPage() {
  await requireAdmin();

  const [providers, categories] = await Promise.all([
    fetchAdminProviders(),
    fetchCategories(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Service Providers on Taskoria",
    numberOfItems: providers.length,
    itemListElement: providers.map((p: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: p.name,
        url: `https://www.taskoria.com/providerprofile/${p.company_slug}`,
        image: p.image ?? undefined,
        description: p.description ?? `${p.name} offers ${p.services?.slice(0, 2).join(", ")} on Taskoria.`,
        ...(p.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.review_count ?? 1,
          },
        }),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <ProvidersGrid providers={providers} categories={categories} />
      </Suspense>
    </>
  );
}
