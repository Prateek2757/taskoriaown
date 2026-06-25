export type PriorityServiceLink = {
  slug: string;
  label: string;
};

export type PriorityCityLink = {
  slug: string;
  stateSlug: string;
  label: string;
};

export type InternalLink = {
  href: string;
  label: string;
  imageUrl?: string | null;
};

type ServiceLike = {
  slug?: string | null;
  name?: string | null;
  rank?: number | null;
  image_url?: string | null;
  service_image_url?: string | null;
};

type CityLike = {
  slug?: string | null;
  state_slug?: string | null;
  stateSlug?: string | null;
  name?: string | null;
};

export const priorityServiceLinks = [
  { slug: "house-cleaning", label: "House Cleaning" },
  { slug: "removals", label: "Removalists" },
  { slug: "plumbing", label: "Plumbers" },
  { slug: "electricians", label: "Electricians" },
  { slug: "handyman", label: "Handyman" },
  { slug: "garden-maintenance-weeding", label: "Gardening" },
  { slug: "rubbish-removal", label: "Rubbish Removal" },
  { slug: "carpet-steam-cleaning", label: "Carpet Steam Cleaning" },
  { slug: "air-conditioning-heating", label: "Air Conditioning & Heating" },
  { slug: "wedding-photography", label: "Wedding Photography" },
  { slug: "web-design-development", label: "Web Design & Development" },
] satisfies PriorityServiceLink[];

export const priorityCityLinks = [
  { slug: "sydney", stateSlug: "nsw", label: "Sydney" },
  { slug: "melbourne", stateSlug: "vic", label: "Melbourne" },
  { slug: "brisbane", stateSlug: "qld", label: "Brisbane" },
  { slug: "perth", stateSlug: "wa", label: "Perth" },
  { slug: "adelaide", stateSlug: "sa", label: "Adelaide" },
  { slug: "newcastle", stateSlug: "nsw", label: "Newcastle" },
  {
    slug: "canberra",
    stateSlug: "australian-capital-territory",
    label: "Canberra",
  },
  { slug: "gold-coast", stateSlug: "queensland", label: "Gold Coast" },
] satisfies PriorityCityLink[];

export function getPriorityServiceLinks(
  availableServices?: ServiceLike[],
  limit = priorityServiceLinks.length
): InternalLink[] {
  const servicesBySlug = new Map(
    availableServices
      ?.filter((service) => service.slug)
      .map((service) => [service.slug, service]) ?? []
  );

  return priorityServiceLinks
    .filter((service) => !availableServices || servicesBySlug.has(service.slug))
    .slice(0, limit)
    .map((service) => ({
      href: `/services/${service.slug}`,
      label: servicesBySlug.get(service.slug)?.name ?? service.label,
    }));
}

export function getRankedServiceLinks(
  services: ServiceLike[] | undefined,
  limit = 8,
  currentSlug?: string | null
): InternalLink[] {
  return (services ?? [])
    .filter((service) => service.slug && service.rank != null)
    .filter((service) => service.slug !== currentSlug)
    .sort((a, b) => {
      const rankDiff = (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER);
      if (rankDiff !== 0) return rankDiff;
      return (a.name ?? "").localeCompare(b.name ?? "");
    })
    .slice(0, limit)
    .map((service) => ({
      href: `/services/${service.slug}`,
      label: service.name ?? service.slug ?? "Service",
      imageUrl: service.image_url ?? service.service_image_url ?? null,
    }));
}

export function getRankedCityServiceLinks(
  stateSlug: string,
  citySlug: string,
  services: ServiceLike[] | undefined,
  limit = 8,
  currentSlug?: string | null
): InternalLink[] {
  return getRankedServiceLinks(services, limit, currentSlug).map((serviceLink) => ({
    ...serviceLink,
    href: `${serviceLink.href}/${stateSlug}/${citySlug}`,
  }));
}

export function getPriorityCityLinks(
  availableCities?: CityLike[],
  limit = priorityCityLinks.length
): InternalLink[] {
  const citiesByKey = new Map(
    availableCities
      ?.filter((city) => city.slug && (city.state_slug || city.stateSlug))
      .map((city) => [
        `${city.state_slug ?? city.stateSlug}/${city.slug}`,
        city,
      ]) ??
      []
  );

  return priorityCityLinks
    .filter(
      (city) =>
        !availableCities || citiesByKey.has(`${city.stateSlug}/${city.slug}`)
    )
    .slice(0, limit)
    .map((city) => {
      const matchedCity = citiesByKey.get(`${city.stateSlug}/${city.slug}`);

      return {
        href: `/locations/${city.stateSlug}/${city.slug}`,
        label: matchedCity?.name ?? city.label,
      };
    });
}

export function getPriorityServiceCityLinks(
  serviceSlug: string,
  availableCities?: CityLike[],
  limit = 8
): InternalLink[] {
  return getPriorityCityLinks(availableCities, limit).map((cityLink) => ({
    ...cityLink,
    href: `/services/${serviceSlug}${cityLink.href.replace("/locations", "")}`,
  }));
}

export function getPriorityCityServiceLinks(
  stateSlug: string,
  citySlug: string,
  availableServices?: ServiceLike[],
  limit = 8
): InternalLink[] {
  return getPriorityServiceLinks(availableServices, limit).map(
    (serviceLink) => ({
      ...serviceLink,
      href: `${serviceLink.href}/${stateSlug}/${citySlug}`,
    })
  );
}
