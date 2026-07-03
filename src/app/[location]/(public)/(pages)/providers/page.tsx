import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProvidersGrid from "@/components/providers/provider-list";
import { fetchCategories } from "@/utils/api";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

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

  if (!res.ok) {
    throw new Error(`Failed to fetch providers: ${res.status}`);
  }

  return res.json();
}
//rrr
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Service Providers | Taskoria",
    robots: { index: false, follow: false },
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
