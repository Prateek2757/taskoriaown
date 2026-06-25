"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Landmark,
  MapPin,
  MonitorCheck,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Provider {
  user_id: number;
  name: string | null;
  public_id?: string;
  image: string | null;
  avg_rating: number | string | null;
  total_reviews: number | string | null;
  nationwide: boolean;
  company_name: string | null;
  logo_url: string | null;
  company_about?: string | null;
  company_size?: string | number | null;
  years_in_business?: string | number | null;
  has_company?: boolean;
  is_pro?: boolean;
  is_email_verified?: boolean;
  profile_completion?: number | string | null;
  total_responses_sent?: number | string | null;
  accreditations?: Accreditation[] | null;
  company_slug?: string | null;
  services?: string[] | null;
  slugs?: string[] | null;
  locationnames?: string[] | null;
  statenames?: string[] | null;
  joineddate?: string | null;
}

interface Accreditation {
  id?: number | string;
  name?: string | null;
  issuing_organization?: string | null;
  display_order?: number | string | null;
}

interface Props {
  serviceSlug?: string | null;
  serviceName?: string | null;
  stateSlug?: string | null;
  citySlug?: string | null;
  locationName?: string | null;
  limit?: number;
  className?: string;
}

const providerRequestCache = new Map<string, Promise<Provider[]>>();

function loadProviders(query: string) {
  const cached = providerRequestCache.get(query);
  if (cached) return cached;

  const request = fetch(`/api/service-city-providers/providers?${query}`)
    .then((res) => (res.ok ? res.json() : []))
    .then((data) => (Array.isArray(data) ? data : []))
    .catch(() => []);

  providerRequestCache.set(query, request);
  return request;
}

function titleFromSlug(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildHeading({
  serviceName,
  serviceSlug,
  locationName,
}: Pick<Props, "serviceName" | "serviceSlug" | "locationName">) {
  const serviceLabel = serviceName || titleFromSlug(serviceSlug);

  if (serviceLabel && locationName) {
    return `Top ${serviceLabel} providers in ${locationName}`;
  }

  if (serviceLabel) {
    return `Top ${serviceLabel} providers`;
  }

  if (locationName) {
    return `Top providers in ${locationName}`;
  }

  return "Top providers";
}

function getInitials(provider: Provider) {
  const label = provider.company_name || provider.name || "Taskoria Provider";
  return label
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProfileHref(provider: Provider) {
  if (provider.company_slug) {
    return `/providerprofile/${encodeURIComponent(provider.company_slug)}`;
  }

  return "/providers";
}

function uniqueValues(values?: (string | null | undefined)[] | null) {
  return Array.from(
    new Set((values ?? []).filter((value): value is string => Boolean(value)))
  );
}

function summarizeValues(values: string[], fallback = "") {
  if (!values.length) {
    return {
      label: fallback,
      title: fallback,
    };
  }

  const [first, second] = values;
  const visible = second ? `${first}, ${second}` : first;
  const remaining = values.length - (second ? 2 : 1);

  return {
    label: remaining > 0 ? `${visible} +${remaining} more` : visible,
    title: values.join(", "),
  };
}

function getDisplayedService(provider: Provider, serviceSlug?: string | null) {
  const services = uniqueValues(provider.services);

  if (!serviceSlug) return summarizeValues(services);

  const matchingIndex =
    provider.slugs?.findIndex((slug) => slug === serviceSlug) ?? -1;
  const matchingService =
    matchingIndex >= 0
      ? provider.services?.[matchingIndex]
      : services.find(
          (service) =>
            service.toLowerCase() === titleFromSlug(serviceSlug).toLowerCase()
        );
  const label = matchingService || titleFromSlug(serviceSlug);

  return {
    label,
    title: label,
  };
}

function getServiceArea(provider: Provider) {
  if (provider.nationwide) {
    return {
      label: "Serves Australia wide",
      title: "Serves customers Australia wide",
      isNationwide: true,
    };
  }

  const locations = uniqueValues(provider.locationnames);
  const states = uniqueValues(provider.statenames);
  const summary = summarizeValues(
    locations.length ? locations : states,
    "Service area on profile"
  );

  return {
    ...summary,
    isNationwide: false,
  };
}

function getYearsOnTaskoria(joineddate?: string | null) {
  if (!joineddate) return "Profile listed on Taskoria";

  const joined = new Date(joineddate);
  if (Number.isNaN(joined.getTime())) return "Profile listed on Taskoria";

  const years = new Date().getFullYear() - joined.getFullYear();

  if (years <= 0) return "New on Taskoria";
  if (years === 1) return "1 year on Taskoria";

  return `${years} years on Taskoria`;
}

function stripHtml(value?: string | null) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getBusinessLabel(provider: Provider) {
  const years = Number(provider.years_in_business);

  if (Number.isFinite(years) && years > 0) {
    return years === 1 ? "1 year in business" : `${years} years in business`;
  }

  return getYearsOnTaskoria(provider.joineddate);
}

function getTrustLabel(provider: Provider) {
  if (provider.is_pro) return "Pro provider";
  if (provider.is_email_verified) return "Verified profile";
  if (provider.has_company) return "Business profile";
  return "Available";
}

function getAccreditationTitle(provider: Provider) {
  const accreditations = Array.isArray(provider.accreditations)
    ? provider.accreditations
    : [];

  const first = [...accreditations].sort(
    (a, b) => Number(a.display_order ?? 999) - Number(b.display_order ?? 999)
  )[0];

  return first?.name?.trim() || "";
}

function ExpandableDescription({
  text,
  title,
}: {
  text: string;
  title: string;
}) {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [expandedText, setExpandedText] = useState<string | null>(null);
  const [canExpand, setCanExpand] = useState(false);
  const expanded = expandedText === text;

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkOverflow = () => {
      if (expanded) {
        setCanExpand(true);
        return;
      }

      setCanExpand(element.scrollHeight > element.clientHeight + 1);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div className="sm:mx-4">
      <p
        ref={textRef}
        title={title}
        className={`text-sm leading-5 text-slate-600 dark:text-slate-300 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpandedText(expanded ? null : text)}
          className="mt-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}

export default function CityProviders({
  serviceSlug = null,
  serviceName = null,
  stateSlug = null,
  citySlug = null,
  locationName = null,
  limit = 10,
  className = "",
}: Props) {
  const query = useMemo(() => {
    const params = new URLSearchParams();

    params.set("service", serviceSlug || "");
    params.set("limit", String(limit));

    if (stateSlug) params.set("state", stateSlug);
    if (citySlug) params.set("city", citySlug);

    return params.toString();
  }, [citySlug, limit, serviceSlug, stateSlug]);
  const [providerState, setProviderState] = useState<{
    query: string;
    providers: Provider[];
  }>({ query: "", providers: [] });
  const loading = providerState.query !== query;
  const providers = loading ? [] : providerState.providers;

  useEffect(() => {
    let cancelled = false;

    loadProviders(query)
      .then((data) => {
        if (!cancelled) {
          setProviderState({ query, providers: data });
        }
      })
      .catch(() => {
        if (!cancelled) setProviderState({ query, providers: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const heading = buildHeading({ serviceName, serviceSlug, locationName });
  const serviceLabel = serviceName || titleFromSlug(serviceSlug) || "services";
  const locationLabel = locationName || titleFromSlug(citySlug || stateSlug);

  if (loading) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="mb-7">
          <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="grid gap-3 lg:grid-cols-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!providers.length) {
    return (
      <section className={`py-3 ${className}`}>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-6 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Providers are coming soon
            {locationLabel ? ` to ${locationLabel}` : ""}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            We are expanding this directory. You can still post a task and let
            available professionals respond with quotes.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            Browse services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 md:py-12 ${className}`}>
      <div className="mb-5 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between">
        <div>
          {/* <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Recently joined professionals
          </p> */}
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white ">
            {heading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Showing the latest {Math.min(limit, providers.length)} verified
            providers
            {locationLabel ? ` for ${locationLabel}` : ""}
            {serviceSlug ? ` in ${serviceLabel.toLowerCase()}` : ""}.
          </p>
        </div>
        <Link
          href="/providers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
        >
          View all providers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-3">
        {providers.map((provider) => {
          const serviceSummary = getDisplayedService(provider, serviceSlug);
          const serviceArea = getServiceArea(provider);
          const providerName =
            provider.company_name || provider.name || "Local provider";
          const services = uniqueValues(provider.services);
          const profileServiceSummary = summarizeValues(services);
          const companyAbout = stripHtml(provider.company_about);
          const serviceCopy = serviceSlug
            ? companyAbout || `Specialises in ${serviceSummary.label}.`
            : profileServiceSummary.label
              ? companyAbout || `Services include ${profileServiceSummary.label}.`
              : "Profile services are available on Taskoria.";
          const serviceTitle = serviceSlug
            ? companyAbout || serviceSummary.title
            : companyAbout || profileServiceSummary.title;
          const businessLabel = getBusinessLabel(provider);
          const trustLabel = getTrustLabel(provider);
          const accreditationTitle = getAccreditationTitle(provider);

          return (
            <article
              key={provider.user_id}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            >
              <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-2 sm:grid-cols-[64px_minmax(0,1fr)_auto]">
                <div>
                  {provider.logo_url || provider.image ? (
                    <Image
                      src={provider.logo_url || provider.image || ""}
                      alt={providerName}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-14 w-14 rounded-xl object-contain dark:border-slate-700 sm:h-16 sm:w-16"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-lg bg-blue-700 text-lg font-bold text-white sm:h-16 sm:w-16">
                      {getInitials(provider)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex min-w-0 items-start gap-2">
                    <h3 className="line-clamp-2 text-base font-bold leading-5 text-slate-950 dark:text-white">
                      {providerName}
                    </h3>
                    {(provider.is_pro || provider.is_email_verified) && (
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    )}
                  </div>

                  <div className="mt-2 flex min-w-0 flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300 sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="inline-flex items-center gap-1.5 rounded-md py-0.5 font-medium text-slate-700 dark:text-slate-200">
                      <MonitorCheck className="h-3.5 w-3.5 text-green-600" />
                      {trustLabel}
                    </span>

                    {serviceArea.label && (
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-red-500 dark:text-slate-300" />
                        <span
                          className="max-w-full truncate sm:max-w-[280px]"
                          title={serviceArea.title}
                        >
                          {serviceArea.isNationwide ? "" : "Serves "}
                          {serviceArea.label}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={getProfileHref(provider)}
                  className="col-span-2 mt-2 inline-flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 sm:col-span-1 sm:mt-0 sm:w-auto"
                >
                  View profile
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="mt-3 flex flex-1 flex-col">
                <ExpandableDescription text={serviceCopy} title={serviceTitle} />

                <div className="mt-3 grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 sm:mx-4 sm:grid-cols-2 lg:flex lg:flex-wrap">
                  {serviceSummary.label && (
                    <div className="flex min-w-0 items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800/70">
                      <Tag className="h-4 w-4 shrink-0 text-blue-600" />
                      <span className="truncate" title={serviceSummary.title}>
                        {serviceSummary.label}
                      </span>
                    </div>
                  )}

                  <div className="flex min-w-0 items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800/70">
                    <BriefcaseBusiness className="h-4 w-4 shrink-0 text-blue-600" />
                    <span className="truncate">{businessLabel}</span>
                  </div>

                  {accreditationTitle && (
                    <div className="flex min-w-0 items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800/70 sm:col-span-2">
                      <Landmark className="h-4 w-4 shrink-0 text-blue-600" />
                      <span className="truncate" title={accreditationTitle}>
                        {accreditationTitle}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
