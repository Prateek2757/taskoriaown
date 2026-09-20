import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getCategoryBySlug } from "@/lib/cache";

type Props = { params: Promise<{ slug: string }> };

async function getGuide(slug: string) {
  const category = await getCategoryBySlug(slug.toLowerCase());
  if (!category) notFound();
  if (slug !== category.slug) permanentRedirect(`/cost-guides/${category.slug}`);
  return category;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getGuide(slug);
  return {
    title: { absolute: `${category.name} Cost Guide | Taskoria` },
    description: `Learn what to include in a ${category.name.toLowerCase()} quote and compare providers on Taskoria.`,
    alternates: { canonical: `https://www.taskoria.com/cost-guides/${category.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CostGuide({ params }: Props) {
  const { slug } = await params;
  const category = await getGuide(slug);
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <Link href="/cost-guides">All cost guides</Link>
      <h1 className="text-3xl font-bold">{category.name} cost guide</h1>
      {category.description && <p>{category.description}</p>}
      <h2 className="text-2xl font-semibold">Request an accurate quote</h2>
      <p>
        For a {category.name.toLowerCase()} quote, describe the work you need,
        your location, preferred timing, and any access requirements. Include
        relevant photos or measurements so providers can assess the scope.
        Prices depend on the individual job; ask for a written estimate.
      </p>
      <h2 className="text-2xl font-semibold">What to compare</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>The work included and any exclusions.</li>
        <li>Whether the price includes materials, travel, and applicable taxes.</li>
        <li>Whether pricing is fixed or hourly, and how extra work is approved.</li>
        <li>Payment terms, availability, and cancellation conditions.</li>
      </ul>
      <Link className="inline-block underline" href={`/services/${category.slug}`}>
        Find {category.name.toLowerCase()} providers and request quotes
      </Link>
    </article>
  );
}
