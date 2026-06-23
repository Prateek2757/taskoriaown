type CityLike = {
  name?: string | null;
  slug?: string | null;
  display_name?: string | null;
};

function titleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isUsefulCityName(value?: string | null) {
  if (!value) return false;

  const trimmed = value.trim();

  return (
    trimmed.length > 0 &&
    !/^\d+$/.test(trimmed) &&
    !/^\d+\s+/.test(trimmed) &&
    !trimmed.includes(",")
  );
}

function displayNameToCityName(value?: string | null) {
  if (!value) return null;

  const firstPart = value.split(",")[0]?.trim();

  if (!isUsefulCityName(firstPart)) {
    return null;
  }

  return firstPart;
}

function displayNameToCouncilCityName(value?: string | null) {
  if (!value) return null;

  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const adminIndex = parts.findIndex((part) =>
    /\b(council|municipality|shire)\b|^city of\b/i.test(part)
  );

  if (adminIndex === -1) {
    return null;
  }

  const adminPart = parts[adminIndex];
  const cityOfMatch = adminPart.match(
    /^(?:council of (?:the )?)?city of\s+(.+)$/i
  );

  if (cityOfMatch?.[1] && isUsefulCityName(cityOfMatch[1])) {
    return cityOfMatch[1].trim();
  }

  if (adminIndex === 0) {
    return null;
  }

  const firstPart = parts[0];
  const previousPart = parts[adminIndex - 1];

  if (
    isUsefulCityName(firstPart) &&
    adminPart.toLowerCase().includes(firstPart.toLowerCase())
  ) {
    return firstPart;
  }

  if (isUsefulCityName(previousPart)) {
    return previousPart;
  }

  return null;
}

export function getCityLabel(city: CityLike) {
  const councilCityName = displayNameToCouncilCityName(city.display_name);

  if (councilCityName) {
    return councilCityName;
  }

  const displayName = displayNameToCityName(city.display_name);

  if (
    displayName &&
    city.name &&
    /\b(council|municipality|shire)\b|-/i.test(city.name)
  ) {
    return displayName;
  }

  if (isUsefulCityName(city.name)) {
    return city.name!.trim();
  }

  if (displayName) {
    return displayName;
  }

  if (city.slug) {
    return titleCase(city.slug);
  }

  return "Unknown location";
}

export function getCityDedupKey(city: CityLike) {
  return getCityLabel(city).toLowerCase();
}
