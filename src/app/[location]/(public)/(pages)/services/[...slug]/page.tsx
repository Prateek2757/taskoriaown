
import dynamic from "next/dynamic";
import { Metadata } from "next";
import StructuredData from "@/components/servicePage/StructureData";

const ServicePageClient = dynamic(
  () => import("@/components/servicePage/ServicePage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    ),
  }
);

type Props = {
  params: Promise<{ slug?: string[]; location?: string }>;
};

interface ServiceData {
  category_id: number;
  name: string;
  description?: string;
  hero_image?: string;
  about?: string;
  service_detail?: string;
  slug?: string;
  faqs?: { question: string; answer: string }[];
}


function toTitleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function buildCanonical(
  serviceSlug: string,
  stateSlug: string | null,
  citySlug: string | null
) {
  const base = `https://www.taskoria.com/services/${serviceSlug}`;
  if (stateSlug && citySlug) return `${base}/${stateSlug}/${citySlug}`;
  if (stateSlug) return `${base}/${stateSlug}`;
  return base;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const [serviceSlug, stateSlug = null, citySlug = null] = slug;

  if (!serviceSlug) {
    return {
      title: "Professional Services Near You | Taskoria",
      description:
        "Find and book trusted local professionals with Taskoria. Get free quotes, compare prices, and read verified reviews.",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/${serviceSlug}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return {
        title: "Service Not Found | Taskoria",
        description: "The service you are looking for could not be found.",
        robots: { index: false, follow: false },
      };
    }

    const service: ServiceData = await res.json();
    const cityName     = citySlug  ? toTitleCase(citySlug)  : null;
    const stateName    = stateSlug ? toTitleCase(stateSlug) : null;
    const canonicalUrl = buildCanonical(serviceSlug, stateSlug, citySlug);
    const imageUrl     =
      service.hero_image ||
      `https://www.taskoria.com/og-images/${serviceSlug}.jpg`;

    const title = cityName
      ? `${service.name} in ${cityName}${stateName ? `, ${stateName}` : ""} | Get Free Quotes – Taskoria`
      : `${service.name} Services in Australia | Trusted Professionals – Taskoria`;

    const description = cityName
      ? `Looking for reliable ${service.name.toLowerCase()} in ${cityName}? Compare verified professionals, read real reviews and get free quotes fast on Taskoria.`
      : service.description
      ? `${service.description.slice(0, 130).trimEnd()}. Get free quotes from verified professionals across Australia – only on Taskoria.`
      : `Hire trusted ${service.name.toLowerCase()} professionals across Australia. Compare verified providers, read reviews and get instant free quotes on Taskoria.`;

    const keywords = cityName
      ? [
          `${service.name.toLowerCase()} ${cityName}`,
          `${service.name.toLowerCase()} in ${cityName}`,
          `${cityName} ${service.name.toLowerCase()} services`,
          `hire ${service.name.toLowerCase()} ${cityName}`,
          `best ${service.name.toLowerCase()} ${cityName}`,
          `cheap ${service.name.toLowerCase()} ${cityName}`,
          `${service.name.toLowerCase()} near me`,
          `${service.name.toLowerCase()} quotes ${cityName}`,
          ...(stateName ? [`${service.name.toLowerCase()} ${stateName}`] : []),
        ].join(", ")
      : [
          `${service.name.toLowerCase()} australia`,
          `${service.name.toLowerCase()} services australia`,
          `hire ${service.name.toLowerCase()} australia`,
          `best ${service.name.toLowerCase()} australia`,
          `${service.name.toLowerCase()} near me`,
          `${service.name.toLowerCase()} quotes`,
          `professional ${service.name.toLowerCase()}`,
        ].join(", ");

    return {
      title,
      description,
      keywords,
      authors: [{ name: "Taskoria", url: "https://www.taskoria.com" }],
      creator: "Taskoria",
      publisher: "Taskoria",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_AU",
        url: canonicalUrl,
        siteName: "Taskoria",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: cityName
              ? `${service.name} in ${cityName}`
              : `${service.name} Services in Australia`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
        creator: "@taskoria",
        site: "@taskoria",
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          "en-AU": canonicalUrl,
          "x-default": `https://www.taskoria.com/services/${serviceSlug}`,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Taskoria | Professional Services",
      description: "Find and book professional services with Taskoria.",
    };
  }
}


export default async function ServicePage({ params }: Props) {
  const { slug = [] } = await params;
  const [serviceSlug, stateSlug = null, citySlug = null, subCitySlug = null] = slug;

  let service: ServiceData | null = null;
  let fetchError = false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/${serviceSlug}`,
      { next: { revalidate: 3600 } }
    );
    service = res.ok ? await res.json() : null;
    if (!service) fetchError = true;
  } catch {
    fetchError = true;
  }

  if (fetchError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Service Not Found</h1>
          <p className="mt-2 text-gray-500">
            We couldn&apos;t find the service you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }

  const citiesRes = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`,
    { next: { revalidate: 3600 } }
  );
  const cities = citiesRes.ok ? await citiesRes.json() : [];

  const selectedLocation = citySlug
    ? cities.find((city: any) => city.slug === citySlug) ?? null
    : null;

  const selectedSubCity = subCitySlug
    ? selectedLocation?.subcities?.find((s: any) => s.slug === subCitySlug) ?? null
    : null;

  const activeLocation = selectedSubCity ?? selectedLocation;

  return (
    <>
     
      <StructuredData
        service={service}
        city={selectedLocation}
        citySlug={citySlug}
        stateSlug={stateSlug}
        providers={selectedLocation?.providers || []}
      />

      <nav
        aria-label="Breadcrumb"
        className="sr-only"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {[
          { name: "Home",       href: "/" },
          { name: "Services",   href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
          ...(stateSlug
            ? [{ name: toTitleCase(stateSlug), href: `/services/${service.slug}/${stateSlug}` }]
            : []),
          ...(citySlug
            ? [{ name: toTitleCase(citySlug), href: `/services/${service.slug}/${stateSlug}/${citySlug}` }]
            : []),
          ...(subCitySlug
            ? [{ name: toTitleCase(subCitySlug), href: `/services/${service.slug}/${stateSlug}/${citySlug}/${subCitySlug}` }]
            : []),
        ].map((crumb, i) => (
          <span
            key={crumb.href}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <a itemProp="item" href={crumb.href}>
              <span itemProp="name">{crumb.name}</span>
            </a>
            <meta itemProp="position" content={String(i + 1)} />
          </span>
        ))}
      </nav>

   
      <ServicePageClient
        service={service}
        cities={cities}
        initialLocation={activeLocation}
        citySlug={citySlug}
        stateSlug={stateSlug}
        subCitySlug={subCitySlug}
      />
    </>
  );
}


export async function generateStaticParams() {
  try {
    const [servicesRes, citiesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`),
    ]);

    const services: { slug: string }[] = servicesRes.ok
      ? await servicesRes.json()
      : [];
    const cities: {
      slug: string;
      state_slug?: string;
      subcities?: { slug: string }[];
    }[] = citiesRes.ok ? await citiesRes.json() : [];

    const params: { slug: string[] }[] = [];

    for (const service of services) {
      params.push({ slug: [service.slug] });

      for (const city of cities) {
        if (!city.state_slug) continue;

        params.push({ slug: [service.slug, city.state_slug, city.slug] });

        for (const sub of city.subcities ?? []) {
          params.push({
            slug: [service.slug, city.state_slug, city.slug, sub.slug],
          });
        }
      }
    }

    return params;
  } catch (err) {
    console.error("generateStaticParams error:", err);
    return [];
  }
}