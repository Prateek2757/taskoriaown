import { getCityLabel } from "@/lib/location-labels";

export type SeoLocationLike = {
  city_id?: number | null;
  name?: string | null;
  slug?: string | null;
  display_name?: string | null;
  state_slug?: string | null;
  state_name?: string | null;
  parent_city_id?: number | null;
  postcode?: string | number | null;
  subcities?: SeoLocationLike[] | null;
};

function normalize(value?: string | number | null) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(nsw|vic|qld|sa|wa|tas|nt|act|australia|au)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isStandalonePostcode(value?: string | number | null) {
  return /^\d{4}$/.test(String(value ?? "").trim());
}

function hasStreetAddressSignal(value?: string | null) {
  const text = String(value ?? "").trim();

  return (
    /\b\d+[a-z]?\s+[\w\s'-]+\b(street|st|road|rd|avenue|ave|drive|dr|lane|ln|highway|hwy|parade|pde|terrace|tce|court|ct|place|pl|boulevard|blvd|crescent|cres)\b/i.test(
      text
    ) ||
    /\b(unit|suite|level|shop|lot)\s+\d+\b/i.test(text)
  );
}

function hasRoadOrVenueSignal(value?: string | null) {
  const text = String(value ?? "").trim();

  return /\b(road|rd|street|st|avenue|ave|drive|dr|lane|ln|highway|hwy|parade|pde|terrace|tce|court|ct|boulevard|blvd|airport|station|hospital|medical centre|clinic|school|college|university|campus|hotel|motel|resort|shopping centre|shopping center|mall|market|club|restaurant|cafe|bar|pub|store|shop|warehouse|factory|office|tower|building|stadium|arena|venue)\b/i.test(
    text
  );
}

function hasAdminLocationSignal(value?: string | null) {
  return /\b(council|municipality|shire|regional)\b|^city of\b|\bcity$/i.test(
    String(value ?? "").trim()
  );
}

function hasCombinedRegionSignal(value?: string | null) {
  const text = String(value ?? "").trim();

  return /\b[a-z][a-z\s']+\s*[-/]\s*[a-z][a-z\s']+\b/i.test(text);
}

function displayNameMatchesLocality(city: SeoLocationLike) {
  if (!city.display_name) return true;

  const firstPart = city.display_name.split(",")[0]?.trim();
  if (!firstPart) return true;
  if (hasAdminLocationSignal(city.display_name)) return false;

  const display = normalize(firstPart);
  const name = normalize(city.name);
  const label = normalize(getCityLabel(city));

  if (!display || !name) return false;

  return display === name || display === label;
}

export function isSeoLocation(location: SeoLocationLike) {
  const label = getCityLabel(location);
  const textToCheck = [location.name, location.slug, location.display_name, label]
    .filter(Boolean)
    .join(" ");

  if (!location.slug || !location.name || !location.state_slug) return false;
  if (isStandalonePostcode(location.name) || isStandalonePostcode(location.slug)) {
    return false;
  }
  if (
    location.postcode &&
    (normalize(location.name) === normalize(location.postcode) ||
      normalize(location.slug) === normalize(location.postcode))
  ) {
    return false;
  }
  if (
    hasStreetAddressSignal(textToCheck) ||
    hasRoadOrVenueSignal(textToCheck) ||
    hasAdminLocationSignal(textToCheck) ||
    hasCombinedRegionSignal(location.name) ||
    hasCombinedRegionSignal(location.display_name)
  ) {
    return false;
  }
  if (!displayNameMatchesLocality(location)) return false;

  return true;
}

export function filterSeoLocations<T extends SeoLocationLike>(locations: T[]): T[] {
  return locations
    .filter(isSeoLocation)
    .map((location) => ({
      ...location,
      subcities: (location.subcities ?? [])
        .map((subcity) => ({
          ...subcity,
          state_slug: subcity.state_slug ?? location.state_slug,
        }))
        .filter(isSeoLocation),
    }));
}

export function findSeoRedirectLocation<T extends SeoLocationLike>(
  locations: T[],
  stateSlug: string,
  citySlug: string
) {
  const allSeoLocations = filterSeoLocations(locations);
  const badLocation = locations.find(
    (city) => city.state_slug === stateSlug && city.slug === citySlug
  );

  if (!badLocation) return null;

  const badName = normalize(badLocation.name);
  const badLabel = normalize(getCityLabel(badLocation));

  return (
    allSeoLocations.find((city) => {
      if (city.state_slug !== stateSlug || city.slug === citySlug) return false;

      const cityName = normalize(city.name);
      const cityLabel = normalize(getCityLabel(city));

      return (
        cityName === badName ||
        cityLabel === badLabel ||
        (badName.length > 0 && cityName === badLabel)
      );
    }) ?? null
  );
}
