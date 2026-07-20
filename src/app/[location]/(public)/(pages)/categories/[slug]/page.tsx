import type { Metadata } from "next";
import PageClient from "./page-client";
import { getCategoryBySlug } from "@/lib/cache";

type Props = {
  params: Promise<{ slug: string }>;
};

function toTitleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const categoryName = category?.name ?? toTitleCase(slug);

  return {
    title: `${categoryName} Services | Hire Verified Professionals | Taskoria`,
    description: `Browse verified ${categoryName.toLowerCase()} service providers on Taskoria. Compare profiles, reviews, and quotes from trusted local professionals.`,
    alternates: {
      canonical: `https://www.taskoria.com/categories/${slug}`,
    },
  };
}

// export const dynamic = "force-static";

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  return <PageClient initialCategory={category} />;
}
