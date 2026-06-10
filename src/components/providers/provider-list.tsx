"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Search,
  Sparkles,
  Tag,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

type Category = {
  category_id?: number;
  name: string;
  slug?: string;
  public_id?: string;
};

type Provider = {
  public_id?: string;
  name?: string;
  company_name?: string;
  company_slug?: string;
  cover_image?: string;
  services?: string[] | null;
  slug?: string[] | null;
  badges?: string[] | null;
};

function HighlightText({
  text,
  query,
}: {
  text?: string | null;
  query: string;
}) {
  if (!text) return null;

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmedQuery.toLowerCase();
  const parts = [];
  let cursor = 0;
  let matchIndex = lowerText.indexOf(lowerQuery);

  while (matchIndex !== -1) {
    if (matchIndex > cursor) {
      parts.push(text.slice(cursor, matchIndex));
    }

    parts.push(
      <mark
        key={`${matchIndex}-${trimmedQuery}`}
        className="rounded bg-blue-500/20 px-0.5 font-semibold text-blue-700 dark:text-blue-300"
      >
        {text.slice(matchIndex, matchIndex + trimmedQuery.length)}
      </mark>
    );

    cursor = matchIndex + trimmedQuery.length;
    matchIndex = lowerText.indexOf(lowerQuery, cursor);
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
}

export default function ProvidersGrid({
  providers,
  categories = [],
}: {
  providers: Provider[];
  categories?: Category[];
}) {
  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();
  const normalizedCategorySearch = categorySearch.trim().toLowerCase();

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();

    return categories
      .filter((category) => category.name && category.slug)
      .filter((category) => {
        const slug = category.slug!;
        if (seen.has(slug)) return false;
        seen.add(slug);
        return true;
      });
  }, [categories]);

  const selectedCategory = useMemo(
    () =>
      categoryOptions.find((category) => category.slug === selectedCategorySlug),
    [categoryOptions, selectedCategorySlug]
  );

  const visibleCategoryOptions = useMemo(() => {
    if (!normalizedCategorySearch) return categoryOptions;

    return categoryOptions.filter((category) =>
      category.name.toLowerCase().includes(normalizedCategorySearch)
    );
  }, [categoryOptions, normalizedCategorySearch]);

  const providerCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();

    providers.forEach((provider) => {
      const providerSlugs = Array.isArray(provider.slug) ? provider.slug : [];
      const uniqueSlugs = new Set(providerSlugs.filter(Boolean));

      uniqueSlugs.forEach((slug) => {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      });
    });

    return counts;
  }, [providers]);

  const topCategoryOptions = useMemo(() => {
    return [...categoryOptions]
      .sort((a, b) => {
        const countDiff =
          (providerCountByCategory.get(b.slug ?? "") ?? 0) -
          (providerCountByCategory.get(a.slug ?? "") ?? 0);

        if (countDiff !== 0) return countDiff;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10);
  }, [categoryOptions, providerCountByCategory]);

  const displayedCategoryOptions = useMemo(() => {
    if (normalizedCategorySearch || showAllCategories) {
      return visibleCategoryOptions;
    }

    if (
      selectedCategory &&
      !topCategoryOptions.some(
        (category) => category.slug === selectedCategory.slug
      )
    ) {
      return [selectedCategory, ...topCategoryOptions];
    }

    return topCategoryOptions;
  }, [
    normalizedCategorySearch,
    selectedCategory,
    showAllCategories,
    topCategoryOptions,
    visibleCategoryOptions,
  ]);

  const filtered = useMemo(() => {
    return providers.filter((provider) => {
      const providerServices = Array.isArray(provider.services)
        ? provider.services
        : [];
      const providerSlugs = Array.isArray(provider.slug) ? provider.slug : [];
      const searchableProvider = [
        provider.name,
        provider.company_name,
        ...providerServices,
        ...providerSlugs,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableProvider.includes(normalizedSearch);

      const matchesCategory =
        !selectedCategory ||
        providerSlugs.includes(selectedCategory.slug ?? "") ||
        providerServices.some(
          (service) =>
            service.toLowerCase() === selectedCategory.name.toLowerCase()
        );

      return matchesSearch && matchesCategory;
    });
  }, [providers, normalizedSearch, selectedCategory]);

  const hasActiveFilters = Boolean(search.trim() || selectedCategory);

  const clearFilters = () => {
    setSearch("");
    setCategorySearch("");
    setSelectedCategorySlug("");
    setShowAllCategories(false);
  };

  return (
    <section className="min-h-screen bg-background text-foreground transition-colors">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;1,700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body    { font-family: 'Sora', sans-serif; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .card-enter { animation: fadeUp 0.45s cubic-bezier(.25,.46,.45,.94) both; }
      `}</style>

      <div className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute -top-16 right-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px]" />

          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)
            `,
              backgroundSize: "55px 55px",
            }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 opacity-50 pointer-events-none dark:opacity-20 hidden dark:block"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
              backgroundSize: "55px 55px",
            }}
            aria-hidden="true"
          />
        </div>

        <div
          className={`${sora.variable} ${fraunces.variable} font-body relative mx-auto max-w-6xl px-6 py-10`}
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <Zap className="h-3 w-3" />
            Verified Professionals
          </span>

          <h1 className="font-display mb-3 text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            Find{" "}
            <span className="italic text-amber-500 dark:text-amber-400">
              elite
            </span>
            <br className="hidden sm:block" />
            service providers
          </h1>

          <p className="mb-7 max-w-md text-[15px] font-light leading-relaxed text-muted-foreground">
            Hand-picked professionals ready to take your project to the next
            level. Rated, reviewed, and ready to work.
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold">{filtered.length}</span>
                <span className="text-xs text-muted-foreground">
                  {hasActiveFilters ? "matches" : "providers"}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5">
                <Tag className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold">
                  {categoryOptions.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  categories
                </span>
              </div>
              <div className="relative sm:ml-auto">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search providers or services..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-border bg-background py-2.5 pl-11 pr-5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:w-80"
              />
            </div>
            </div>

        
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="rounded-2xl border border-border bg-background/85 p-3 shadow-sm backdrop-blur">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {normalizedCategorySearch
                      ? "Matching categories"
                      : showAllCategories
                        ? "All categories"
                        : "Popular categories"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {normalizedCategorySearch
                      ? "Search checks every service category."
                      : "Popular filters are ranked by available providers."}
                  </p>
                </div>

                {!normalizedCategorySearch &&
                  categoryOptions.length > topCategoryOptions.length && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllCategories((currentValue) => !currentValue)
                      }
                      className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-muted px-4 text-xs font-semibold text-muted-foreground transition hover:border-blue-500/50 hover:text-foreground"
                    >
                      {showAllCategories
                        ? "Most Popular"
                        : `Show all ${categoryOptions.length}`}
                    </button>
                  )}
              </div>

              <div className="relative">
                <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by category..."
                  value={categorySearch}
                  onChange={(event) => setCategorySearch(event.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-muted pl-11 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                {categorySearch && (
                  <button
                    type="button"
                    onClick={() => setCategorySearch("")}
                    className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-background hover:text-foreground"
                    aria-label="Clear category search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 flex max-h-36 flex-wrap gap-2 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug("");
                    setShowAllCategories(false);
                  }}
                  className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition ${
                    !selectedCategory
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-border bg-muted text-muted-foreground hover:border-blue-500/50 hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Popular categories
                </button>

                {displayedCategoryOptions.map((category) => {
                  const providerCount =
                    providerCountByCategory.get(category.slug ?? "") ?? 0;

                  return (
                    <button
                      type="button"
                      key={category.slug}
                      onClick={() =>
                        setSelectedCategorySlug(category.slug ?? "")
                      }
                      className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition ${
                        selectedCategorySlug === category.slug
                          ? "border-blue-500 bg-[#2563EB] text-white"
                          : "border-border bg-muted text-muted-foreground hover:border-blue-500/50 hover:text-foreground"
                      }`}
                    >
                      <Tag className="h-3.5 w-3.5" />
                      <span>{category.name}</span>
                      {providerCount > 0 && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            selectedCategorySlug === category.slug
                              ? "bg-white/20 text-white"
                              : "bg-background text-muted-foreground"
                          }`}
                        >
                          {providerCount}
                        </span>
                      )}
                    </button>
                  );
                })}

                {displayedCategoryOptions.length === 0 && (
                  <span className="inline-flex h-9 items-center rounded-full border border-border px-4 text-xs text-muted-foreground">
                    No categories match "{categorySearch}"
                  </span>
                )}
              </div>
            </div>

            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategorySlug("")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear category
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="font-body mx-auto max-w-6xl px-6 py-10">
        {filtered.length > 0 ? (
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((provider, index) => {
              const services = Array.isArray(provider.services)
                ? provider.services
                : [];
              const providerSlugs = Array.isArray(provider.slug)
                ? provider.slug
                : [];
              const selectedCategoryIndex = selectedCategory
                ? providerSlugs.findIndex(
                    (slug) => slug === selectedCategory.slug
                  )
                : -1;
              const serviceBySelectedSlug =
                selectedCategoryIndex >= 0
                  ? services[selectedCategoryIndex]
                  : undefined;
              const serviceBySelectedName = selectedCategory
                ? services.find(
                    (service) =>
                      service.toLowerCase() ===
                      selectedCategory.name.toLowerCase()
                  )
                : undefined;
              const searchMatchedServiceIndex = normalizedSearch
                ? services.findIndex(
                    (service, serviceIndex) =>
                      service.toLowerCase().includes(normalizedSearch) ||
                      providerSlugs[serviceIndex]
                        ?.toLowerCase()
                        .includes(normalizedSearch)
                  )
                : -1;
              const serviceBySearch =
                searchMatchedServiceIndex >= 0
                  ? services[searchMatchedServiceIndex]
                  : undefined;
              const displayedService =
                serviceBySelectedName ??
                serviceBySelectedSlug ??
                serviceBySearch ??
                services[0];
              const isDisplayedServiceMatched = Boolean(
                selectedCategory || serviceBySearch
              );
              const displayedServiceLabel = selectedCategory
                ? "Selected category"
                : serviceBySearch
                  ? "Search match"
                  : normalizedSearch
                    ? "Provider match"
                    : "Primary category";
              const hiddenServiceCount = displayedService
                ? Math.max(services.length - 1, 0)
                : 0;

              return (
                <li
                  key={provider.public_id ?? provider.company_slug ?? index}
                  className="card-enter"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="group relative flex h-full h-auto flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative flex h-full flex-col gap-2 p-4">
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                        <div className="relative">
                          {provider.cover_image ? (
                            <Image
                              title="Provider List Photo"
                              src={provider.cover_image}
                              alt={provider.company_name ?? "Provider"}
                              width={56}
                              height={56}
                              className="h-12 w-12 rounded-xl border border-border object-cover"
                            />
                          ) : (
                            <div className="grid h-12 w-12 shrink-0 place-content-center rounded-xl bg-linear-to-br from-blue-600 via-blue-400 to-[#2563EB] text-sm font-semibold uppercase text-white">
                              {provider.company_name
                                ?.split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2) ?? "TP"}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2
                            title={provider.company_name ?? ""}
                            className="line-clamp-2 min-h-[40px] text-base font-semibold leading-5"
                          >
                            <HighlightText
                              text={provider.company_name}
                              query={search}
                            />
                          </h2>
                        </div>

                        <span className="mt-0.5 shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                          Available
                        </span>
                      </div>

                      <div className="min-h-[56px] rounded-xl border border-border bg-muted/40 px-3 py-">
                        {displayedService ? (
                          <div className="flex h-full flex-col justify-center gap-1">
                            <div className="flex min-w-0 items-center gap-2">
                              <Tag
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  isDisplayedServiceMatched
                                    ? "text-[#2563EB]"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <span
                                title={displayedService}
                                className={`line-clamp-1 min-w-0 rounded-md text-sm font-medium ${
                                  isDisplayedServiceMatched
                                    ? "text-[#2563EB] dark:text-blue-300"
                                    : "text-foreground"
                                }`}
                              >
                                {isDisplayedServiceMatched ? (
                                  <HighlightText
                                    text={displayedService}
                                    query={search}
                                  />
                                ) : (
                                  displayedService
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>{displayedServiceLabel}</span>
                              {hiddenServiceCount > 0 && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                  <span>+{hiddenServiceCount} more</span>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-full items-center text-sm text-muted-foreground">
                            No services listed
                          </div>
                        )}
                      </div>

                      <div className="h-auto">
                        {provider.badges && provider.badges.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {provider.badges.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border bg-muted px-3 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="t h-px w-full bg-border" />

                      <Link
                        href={`/providerprofile/${encodeURIComponent(
                          provider.company_slug ?? ""
                        )}`}
                        className="group flex h-10 items-center justify-between rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500"
                      >
                        <span>View Profile</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <Search className="h-7 w-7 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {selectedCategory
                  ? `No ${selectedCategory.name} providers yet`
                  : "No providers found"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {selectedCategory
                  ? "This category is still opening in the marketplace. Post your job anyway so available professionals can respond, or clear the filter to browse every provider."
                  : `No providers match "${search}". Try a broader service term or clear your filters.`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
              >
                Post a job
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-border px-5 py-2 text-xs font-semibold hover:bg-muted"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
