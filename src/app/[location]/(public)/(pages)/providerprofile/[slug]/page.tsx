import ProviderProfileClient from "@/components/providers/ProviderIndividual/ProviderProfileClient";
import pool from "@/lib/dbConnect";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

function isProfileComplete(provider: any): boolean {
  return !!(
    provider.name &&
    provider.profile_services?.length > 0   );
}

async function fetchProviderBySlug(slug: string) {
  const { rows } = await pool.query(
    `
      WITH active_sub AS (
        SELECT
          ps.user_id
        FROM professional_subscriptions ps
        WHERE ps.status IN ('active','trialing')
      )
      SELECT
        up.user_id,
        up.display_name AS name,
        up.avg_rating,
        up.total_reviews,
        up.is_nationwide AS nationwide,
        u.public_id,
        up.profile_image_url AS image,
        up.created_at AS joineddate,
        cp.company_name,
        cp.slug AS company_slug,
        cp.logo_url AS cover_image,
        json_agg(DISTINCT sc.name)
          FILTER (WHERE sc.name IS NOT NULL) AS services,
        json_agg(DISTINCT sc.slug)
          FILTER (WHERE sc.slug IS NOT NULL) AS slug,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'platform', usl.platform,
            'url', usl.url,
            'username', usl.username,
            'display_order', usl.display_order
          )) FILTER (WHERE usl.id IS NOT NULL),
          '[]'
        ) AS social_links,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', ups.id,
            'title', ups.title,
            'description', ups.description
          )) FILTER (WHERE ups.id IS NOT NULL),
          '[]'
        ) AS profile_services,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', upp.id,
            'photo_url', upp.photo_url,
            'title', upp.title,
            'description', upp.description,
            'is_featured', upp.is_featured,
            'display_order', upp.display_order
          )) FILTER (WHERE upp.id IS NOT NULL),
          '[]'
        ) AS photos,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', uf.id,
            'question', uf.question,
            'answer', uf.answer,
            'category', uf.category,
            'display_order', uf.display_order
          )) FILTER (WHERE uf.id IS NOT NULL),
          '[]'
        ) AS faqs,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', ua.id,
            'name', ua.name,
            'issuing_organization', ua.issuing_organization,
            'display_order', ua.display_order
          )) FILTER (WHERE ua.id IS NOT NULL),
          '[]'
        ) AS accreditations,

        CASE WHEN asub.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS isPro

      FROM user_profiles up
      JOIN users u ON up.user_id = u.user_id
      LEFT JOIN user_categories uc ON up.user_id = uc.user_id
      LEFT JOIN service_categories sc ON sc.category_id = uc.category_id
      LEFT JOIN company cp ON up.user_id = cp.user_id
      LEFT JOIN cities c ON c.city_id = up.location_id

      LEFT JOIN user_social_links usl ON up.user_id = usl.user_id AND usl.is_visible = true
      LEFT JOIN user_profile_services ups ON up.user_id = ups.user_id
      LEFT JOIN user_profile_photos upp ON up.user_id = upp.user_id
      LEFT JOIN user_faqs uf ON up.user_id = uf.user_id AND uf.is_visible = true
      LEFT JOIN user_accreditations ua ON up.user_id = ua.user_id

      LEFT JOIN active_sub asub ON asub.user_id = up.user_id

      WHERE u.status = 'active' AND cp.slug = $1

      GROUP BY
        up.user_id,
        up.display_name,
        up.avg_rating,
        up.total_reviews,
        up.profile_image_url,
        up.is_nationwide,
        up.created_at,
        u.public_id,
        cp.company_name,
        cp.logo_url,
        cp.slug,
        c.name,
        asub.user_id
    `,
    [slug]
  );

  return rows[0] ?? null;
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const provider = await fetchProviderBySlug(slug);

  if (!provider) {
    return {
      title: "Provider Not Found — Taskoria",
      robots: { index: false, follow: false },
    };
  }

  const complete = isProfileComplete(provider);
  const primaryService = provider.services?.[0] ?? "Professional";
  const primaryCategory = provider.categories?.[0] ?? "Services";
  const location = provider.service_areas?.[0] ?? "";

  const title = `${provider.company_name} | Taskoria profiles and review `;
  // | ${primaryService} ${primaryCategory} Provider${location ? ` in ${location}` : ""} | Taskoria

  const description =
  provider.description ||
  `Hire ${provider.name} on Taskoria for ${primaryService} services. View ratings, reviews, availability, and service areas.`;

  return {
    title,
    description,

    robots: complete
      ? { index: true, follow: true }
      : { index: true, follow: true },

    alternates: {
      canonical: `https://www.taskoria.com/providerprofile/${slug}`,
    },

    openGraph: {
      title,
      description,
      url: `https://www.taskoria.com/providerprofile/${slug}`,
      siteName: "Taskoria",
      images: provider.image
        ? [{ url: provider.image, alt: `${provider.name} profile photo` }]
        : [],
      type: "profile",
    },

  };
}

export default async function ProviderPage({ params }: any) {
  const { slug } = await params;
  const provider = await fetchProviderBySlug(slug);

  if (!provider) notFound();


  const complete = isProfileComplete(provider);
  const primaryService = provider.profile_services?.[0] ?? "Professional";
  let location: string | undefined;
  if (provider.locationname) {
    location = provider.locationname;
  } else if (provider.nationwide) {
    location = "Australia"; 
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    description: provider.description,
    image: provider.image ?? undefined,
    url: `https://www.taskoria.com/providerprofile/${slug}`,
    ...(location && {
      areaServed: {
        "@type": "Place",
        name: location,
      },
    }),    ...(provider.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: provider.rating,
        reviewCount: provider.review_count ?? 1,
      },
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${primaryService} Services`,
    },
  };

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProviderProfileClient provider={provider}  />
    </>
  );
}
