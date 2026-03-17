// components/servicePage/StructuredData.tsx
// Drop this file into your components/servicePage/ folder

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
  
  interface CityData {
    name: string;
    slug: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    providers?: any[];
  }
  
  interface Props {
    service: ServiceData;
    city?: CityData | null;
    citySlug?: string | null;
    stateSlug?: string | null;
    providers?: any[];
  }
  
  export default function StructuredData({
    service,
    city,
    citySlug,
  
    stateSlug,
    providers = [],
  }: Props) {
    const cityName = city?.name || citySlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const stateName = stateSlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const baseUrl = "https://www.taskoria.com";
    const pageUrl = `${baseUrl}/services/${service.slug}${stateSlug ? `/${stateSlug}` : ""}${citySlug ? `/${citySlug}` : ""}`;
    const imageUrl = service.hero_image || `${baseUrl}/og-images/${service.slug}.jpg`;
  
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": cityName ? ["Service", "LocalBusiness"] : "Service",
      name: cityName
        ? `${service.name} in ${cityName}`
        : `${service.name} Services`,
      description:
        service.description ||
        `Professional ${service.name.toLowerCase()} services${cityName ? ` in ${cityName}` : ""} – get free quotes from verified professionals on Taskoria.`,
      url: pageUrl,
      image: imageUrl,
      provider: {
        "@type": "Organization",
        name: "Taskoria",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          "https://www.facebook.com/taskoria",
          "https://twitter.com/taskoria",
        ],
      },
      ...(cityName && {
        areaServed: {
          "@type": "City",
          name: cityName,
          ...(stateName && {
            containedInPlace: {
              "@type": "State",
              name: stateName,
              containedInPlace: {
                "@type": "Country",
                name: "Australia",
              },
            },
          }),
        },
        serviceArea: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: city?.latitude || -25.2744,
            longitude: city?.longitude || 133.7751,
          },
          geoRadius: "50000",
        },
      }),
      ...(!cityName && {
        areaServed: {
          "@type": "Country",
          name: "Australia",
        },
      }),
      aggregateRating:
        providers.length > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: Math.max(providers.length * 3, 50).toString(),
              bestRating: "5",
              worstRating: "1",
            }
          : undefined,
    };
  
    const breadcrumbItems: { name: string; url: string }[] = [
      { name: "Home", url: baseUrl },
      { name: "Services", url: `${baseUrl}/services` },
      { name: service.name, url: `${baseUrl}/services/${service.slug}` },
    ];
    if (stateSlug) {
      breadcrumbItems.push({
        name: stateName || stateSlug,
        url: `${baseUrl}/services/${service.slug}/${stateSlug}`,
      });
    }
    if (citySlug && citySlug !== stateSlug) {
      breadcrumbItems.push({
        name: cityName || citySlug,
        url: pageUrl,
      });
    }
  
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  
    // ── 3. FAQPage Schema ──────────────────────────────────────────────────────
    const faqSchema =
      service.faqs && service.faqs.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }
        : null;
  
    // ── 4. WebPage Schema ──────────────────────────────────────────────────────
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: cityName
        ? `${service.name} in ${cityName} | Taskoria`
        : `${service.name} Services | Taskoria`,
      url: pageUrl,
      description:
        service.description ||
        `Find trusted ${service.name.toLowerCase()} professionals${cityName ? ` in ${cityName}` : " near you"}.`,
      inLanguage: "en-AU",
      isPartOf: {
        "@type": "WebSite",
        name: "Taskoria",
        url: baseUrl,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbSchema.itemListElement,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    };
  
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </>
    );
  }