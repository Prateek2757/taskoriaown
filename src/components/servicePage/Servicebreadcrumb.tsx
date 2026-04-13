"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface ServiceBreadcrumbProps {
  service: { name: string; slug: string };
  stateSlug: string | null;
  citySlug: string | null;
  subCitySlug: string | null;
  stateName?: string;   // resolved display name, e.g. "New South Wales"
  cityName?: string;    // resolved display name, e.g. "Sydney"
  subCityName?: string; // resolved display name, e.g. "Parramatta"
}

function slugToLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ServiceBreadcrumb({
  service,
  stateSlug,
  citySlug,
  subCitySlug,
  stateName,
  cityName,
  subCityName,
}: ServiceBreadcrumbProps) {
  const stateLabel = stateName ?? (stateSlug ? slugToLabel(stateSlug) : null);
  const cityLabel =  citySlug ? slugToLabel(citySlug) : null;
  const subCityLabel = subCityName ?? (subCitySlug ? slugToLabel(subCitySlug) : null);

  type Crumb =
    | { label: string; href: string; current?: false }
    | { label: string; href?: undefined; current: true };

  const crumbs: Crumb[] = [
    { label: "Services", href: "/services" },
    { label: service.name, href: `/services/${service.slug}` },
  ];

  if (stateLabel && stateSlug) {
    // State is navigable only if we're below it (city or subcity level)
    if (citySlug) {
      crumbs.push({
        label: stateLabel,
        href: `/services/${service.slug}/${stateSlug}`,
      });
    } else {
      crumbs.push({ label: stateLabel, current: true });
    }
  }

  if (cityLabel && citySlug) {
    if (subCitySlug) {
      // City is a link when we're viewing a subcity
      crumbs.push({
        label: cityLabel,
        href: `/services/${service.slug}/${stateSlug}/${citySlug}`,
      });
    } else {
      // We are ON the city page – show as current
      crumbs.push({ label: cityLabel, current: true });
    }
  }

  if (subCityLabel) {
    crumbs.push({ label: subCityLabel, current: true });
  }
  console.log(stateSlug,citySlug,subCitySlug,stateName,cityName,subCityName,"citynames ");


  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center flex-wrap gap-1 text-sm text-slate-400 dark:text-slate-500 mb-6"
    >
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" />}

          {"current" in crumb && crumb.current ? (
            <span
              className="font-semibold text-slate-700 dark:text-slate-200"
              aria-current="page"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              href={(crumb as { href: string }).href}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors hover:underline underline-offset-2"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}