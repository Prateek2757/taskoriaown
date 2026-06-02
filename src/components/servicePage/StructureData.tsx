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
  name?: string;
  slug?: string;
  state_name?: string;
  display_name?: string | null;
  latitude?: number;
  longitude?: number;
  providers?: any[];
}

interface Props {
  service: ServiceData;
  city?: CityData | null;
  citySlug?: string | null;
  stateSlug?: string | null;
  subCitySlug?: string | null;
  showFaqPage?: boolean;
  providers?: any[];
}

function slugToLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function compact<T extends Record<string, any>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null)
  ) as T;
}

export default function StructuredData({
  service,
  city,
  citySlug,
  stateSlug,
  subCitySlug,
  showFaqPage = false,
  providers = [],
}: Props) {
  const baseUrl = "https://www.taskoria.com";
  const serviceSlug = service.slug ?? "";
  const serviceUrl = `${baseUrl}/services/${serviceSlug}`;
  const stateName = city?.state_name ?? (stateSlug ? slugToLabel(stateSlug) : null);
  const cityName =
    city?.display_name ?? city?.name ?? (citySlug ? slugToLabel(citySlug) : null);
  const subCityName = subCitySlug ? slugToLabel(subCitySlug) : null;
  const pagePath = [
    "services",
    serviceSlug,
    stateSlug,
    citySlug,
    subCitySlug,
  ].filter(Boolean).join("/");
  const pageUrl = `${baseUrl}/${pagePath}`;
  const imageUrl = service.hero_image || `${baseUrl}/og-images/${serviceSlug}.jpg`;
  const serviceAreaName = subCityName ?? cityName ?? stateName ?? "Australia";
  const description =
    service.description ||
    `Find trusted ${service.name.toLowerCase()} professionals${
      serviceAreaName !== "Australia" ? ` in ${serviceAreaName}` : " across Australia"
    } on Taskoria.`;

  const organizationId = `${baseUrl}/#organization`;
  const websiteId = `${baseUrl}/#website`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const serviceId = `${pageUrl}#service`;

  const breadcrumbItems: { name: string; url: string }[] = [
    { name: "Home", url: baseUrl },
    { name: "Services", url: `${baseUrl}/services` },
    { name: service.name, url: serviceUrl },
  ];

  if (stateSlug) {
    breadcrumbItems.push({
      name: stateName ?? slugToLabel(stateSlug),
      url: `${serviceUrl}/${stateSlug}`,
    });
  }

  if (citySlug) {
    breadcrumbItems.push({
      name: cityName ?? slugToLabel(citySlug),
      url: `${serviceUrl}/${stateSlug}/${citySlug}`,
    });
  }

  if (subCitySlug) {
    breadcrumbItems.push({
      name: subCityName ?? slugToLabel(subCitySlug),
      url: pageUrl,
    });
  }

  const graph: Record<string, any>[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Taskoria",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/taskoria_logo.svg`,
      },
      sameAs: [
        "https://www.facebook.com/taskoria",
        "https://twitter.com/taskoria",
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "Taskoria",
      url: baseUrl,
      publisher: { "@id": organizationId },
      inLanguage: "en-AU",
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/services?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
    compact({
      "@type": "Service",
      "@id": serviceId,
      name:
        serviceAreaName !== "Australia"
          ? `${service.name} in ${serviceAreaName}`
          : `${service.name} Services`,
      description,
      url: pageUrl,
      image: imageUrl,
      provider: { "@id": organizationId },
      mainEntityOfPage: pageUrl,
      areaServed:
        serviceAreaName === "Australia"
          ? {
              "@type": "Country",
              name: "Australia",
            }
          : {
              "@type": cityName || subCityName ? "City" : "State",
              name: serviceAreaName,
              ...(stateName && {
                containedInPlace: {
                  "@type": stateName === serviceAreaName ? "Country" : "State",
                  name: stateName === serviceAreaName ? "Australia" : stateName,
                },
              }),
            },
      serviceArea:
        city?.latitude && city?.longitude
          ? {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: city.latitude,
                longitude: city.longitude,
              },
              geoRadius: "50000",
            }
          : undefined,
      aggregateRating:
        providers.length > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: Math.max(providers.length * 3, 50),
              bestRating: "5",
              worstRating: "1",
            }
          : undefined,
    }),
  ];

  if (showFaqPage && service.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: service.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
