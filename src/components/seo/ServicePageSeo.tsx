import Head from "next/head";

interface ServiceData {
  name: string;
  description?: string;
  hero_image?: string;
  slug?: string;
}

interface City {
  name?: string;
  display_name?: string;
}

interface ServicePageSEOProps {
  service: ServiceData;
  city?: City | null;
  citySlug?: string | null;
}

export default function ServicePageSEO({ 
  service, 
  city, 
  citySlug 
}: ServicePageSEOProps) {
  const cityName = city?.display_name || city?.name || citySlug;
  const isLocalService = !!cityName;

  const generateTitle = () => {
    if (isLocalService) {
      return `${service.name} in ${cityName} | Get Free Quotes | Taskoria`;
    }
    return `${service.name} Services | Compare Quotes & Book Online | Taskoria`;
  };

  const generateDescription = () => {
    const baseDesc = service.description || 
      `Professional ${service.name.toLowerCase()} services`;
    
    if (isLocalService) {
      return `Find trusted ${service.name.toLowerCase()} professionals in ${cityName}. Get free quotes, compare prices, read reviews, and book online. 100% verified providers.`;
    }
    return `${baseDesc}. Get instant quotes from verified professionals. Compare prices, read reviews, and book with confidence. Fast, easy, and secure.`;
  };

  const generateKeywords = () => {
    const baseKeywords = [
      service.name.toLowerCase(),
      `${service.name.toLowerCase()} service`,
      `hire ${service.name.toLowerCase()}`,
      `${service.name.toLowerCase()} professionals`,
      `${service.name.toLowerCase()} quotes`,
      `book ${service.name.toLowerCase()}`,
      `${service.name.toLowerCase()} near me`,
      `affordable ${service.name.toLowerCase()}`,
      `best ${service.name.toLowerCase()}`,
      `${service.name.toLowerCase()} cost`
    ];

    if (isLocalService) {
      return [
        ...baseKeywords.map(k => `${k} ${cityName}`),
        `${service.name.toLowerCase()} in ${cityName}`,
        `${cityName} ${service.name.toLowerCase()}`,
        `local ${service.name.toLowerCase()} ${cityName}`,
        `${service.name.toLowerCase()} providers ${cityName}`
      ].join(", ");
    }

    return baseKeywords.join(", ");
  };

  const canonicalUrl = `https://www.taskoria.com/services/${service.slug}${
    citySlug ? `/${citySlug}` : ''
  }`;

  const imageUrl = service.hero_image || 
    `https://www.taskoria.com/og-images/${service.slug}.jpg`;

  return (
    <Head>
      <title>{generateTitle()}</title>
      <meta name="title" content={generateTitle()} />
      <meta name="description" content={generateDescription()} />
      <meta name="keywords" content={generateKeywords()} />
      
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={generateTitle()} />
      <meta property="og:description" content={generateDescription()} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Taskoria" />
      <meta property="og:locale" content="en_AU" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={generateTitle()} />
      <meta name="twitter:description" content={generateDescription()} />
      <meta name="twitter:image" content={imageUrl} />
      
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Taskoria" />
      
      {/* Geographic Meta Tags */}
      {isLocalService && (
        <>
          <meta name="geo.region" content="AU" />
          <meta name="geo.placename" content={cityName} />
          <meta name="geo.position" content="" />
          <meta name="ICBM" content="" />
        </>
      )}
      
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Taskoria" />
      
      <link rel="alternate" hrefLang="en-au" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Head>
  );
}