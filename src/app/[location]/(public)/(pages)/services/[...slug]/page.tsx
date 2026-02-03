import ServicePageClient from "@/components/servicePage/ServicePage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const serviceSlug = slug[0];
  const stateSlug = slug[1] || null;
  const citySlug = slug[2]|| null;

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
    const cityName = citySlug
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const title = cityName
      ? `${service.name} in ${cityName} Near You |Trusted ${service.name} | Get Free Quotes | Taskoria`
      : `${service.name} Services Near You | Trusted ${service.name}  – Taskoria`;

    const description = cityName
      ? `Hire trusted ${service.name.toLowerCase()} professionals near you in ${cityName}.Compare verified ${service.name.toLowerCase()}  check reviews, and get fast quotes with Taskoria`
      : `${service.description || `Professional ${service.name.toLowerCase()} services`}. Get instant quotes from verified professionals. Compare prices, read reviews, and book with confidence.`;
    const keywords = cityName
      ? [
          `${service.name.toLowerCase()} ${cityName}`,
          `${cityName} ${service.name.toLowerCase()}`,
          `${service.name.toLowerCase()} in ${cityName}`,
          `hire ${service.name.toLowerCase()} ${cityName}`,
          `best ${service.name.toLowerCase()} ${cityName}`,
          `${service.name.toLowerCase()} near me`,
          `${service.name.toLowerCase()} quotes ${cityName}`,
        ].join(", ")
      : [
          service.name.toLowerCase(),
          `${service.name.toLowerCase()} service`,
          `hire ${service.name.toLowerCase()}`,
          `${service.name.toLowerCase()} quotes`,
        ].join(", ");

    const canonicalUrl = `https://taskoria.com/services/${serviceSlug}${
      citySlug ? `/${citySlug}` : ""
    }`;

    const imageUrl =
      service.hero_image || `https://taskoria.com/og-images/${serviceSlug}.jpg`;

    return {
      title,
      description,
      keywords,
      authors: [{ name: "Taskoria" }],
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
            alt: `${service.name} service${cityName ? ` in ${cityName}` : ""}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
        creator: "@taskoria",
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          "en-AU": canonicalUrl,
          "x-default": canonicalUrl,
        },
      },
      viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Taskoria | Professional Services",
      description: "Find and book professional services with Taskoria",
    };
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug = [] } = await params;

  const serviceSlug = slug[0];
  const stateSlug = slug[1] || null;
  const citySlug = slug[2] || null;

  let service: ServiceData | null = null;
  let error = false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/${serviceSlug}`,
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      service = await res.json();
    } else {
      error = true;
    }
  } catch (err) {
    console.error("Failed to fetch service:", err);
    error = true;
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1>Service Not Found</h1>
        </div>
      </div>
    );
  }
  // console.log(service.description);

  const citiesRes = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/service-location`,
    { next: { revalidate: 3600 } }
  );
  const cities = citiesRes.ok ? await citiesRes.json() : [];

  const selectedLocation = citySlug
    ? cities.find(
        (city: any) =>
          city.slug ===
          citySlug
      )
    : null;

  return (
    <>
      {/* Structured Data - Rendered on SERVER */}
      {/* <StructuredData
        service={service}
        city={selectedLocation}
        citySlug={citySlug}
        providers={selectedLocation?.providers || []}
      /> */}

      {/* Client Component - Interactive parts only */}
      <ServicePageClient
        service={service}
        cities={cities}
        initialLocation={selectedLocation}
        citySlug={citySlug}
      />
    </>
  );
}

// export async function generateStaticParams() {
//   try {
//     const servicesRes = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
//     );
//     const services = servicesRes.ok ? await servicesRes.json() : [];

//     const citiesRes = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/cities`
//     );
//     const cities = citiesRes.ok ? await citiesRes.json() : [];

//     const params = [];

//     for (const service of services) {
//       params.push({ slug: [service.slug] });
//     }

//     for (const service of services) {
//       for (const city of cities) {
//         const citySlug = city.name?.toLowerCase().replace(/\s+/g, '-');
//         if (citySlug) {
//           params.push({ slug: [service.slug, citySlug] });
//         }
//       }
//     }

//     return params;
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }
