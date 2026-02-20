"use client";

import { type ComponentType, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderOpen,
  Search,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import NewRequestModal from "../leads/RequestModal";

interface ServiceCategory {
  category_id: string | number;
  name: string;
  slug: string;
}

interface ServiceCategoriesProps {
  categories: ServiceCategory[];
}

export default function ServiceCategoriesClient({
  categories,
}: ServiceCategoriesProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    category_id: number;
    name: string;
    slug?: string;
  } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesWithSignals = useMemo(() => {
    return categories.map((cat, index) => ({
      ...cat,
      demandScore: categories.length - index,
      responseTime:
        index % 4 === 0
          ? "~18 min"
          : index % 4 === 1
            ? "~26 min"
            : index % 4 === 2
              ? "~34 min"
              : "~48 min",
      typicalQuote:
        index % 3 === 0
          ? "A$120-A$280"
          : index % 3 === 1
            ? "A$180-A$420"
            : "A$90-A$240",
    }));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesWithSignals;
    const query = searchQuery.toLowerCase();
    return categoriesWithSignals.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query),
    );
  }, [categoriesWithSignals, searchQuery]);

  const topCategories = useMemo(() => {
    return [...filteredCategories]
      .sort((a, b) => b.demandScore - a.demandScore)
      .slice(0, 12);
  }, [filteredCategories]);

  const secondaryCategories = useMemo(() => {
    const topIds = new Set(topCategories.map((cat) => cat.category_id));
    return filteredCategories.filter((cat) => !topIds.has(cat.category_id));
  }, [filteredCategories, topCategories]);

  const quickPickCategories = useMemo(() => {
    return categoriesWithSignals.slice(0, 6);
  }, [categoriesWithSignals]);

  const hasSearchQuery = searchQuery.trim().length > 0;

  const clearSearch = () => {
    setSearchQuery("");
    setShowAll(false);
  };

  const handlePostJob = (category?: ServiceCategory) => {
    if (category) {
      setSelectedCategory({
        category_id: Number(category.category_id),
        name: category.name,
        slug: category.slug,
      });
    
    } else {
      setSelectedCategory(null);
    }

    setOpenModal(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-700/20" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-700/20" />

      <div className="relative mx-auto max-w-7xl space-y-10">
        {/* <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <BadgeCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Brisbane-first service marketplace
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
                Tell us the job once.
                <span className="mt-1 block text-blue-600 dark:text-blue-400">
                  Get quotes from local providers.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
                Post for free, compare verified providers, and hire only when you are ready. No spam calls. No obligation.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => handlePostJob()}
                  className="h-11 bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  Post a Job Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="h-11 px-6">
                  <Link href="/providers/register">Get Leads as a Provider</Link>
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Free to post
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Verified providers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Trust & Safety support
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/80">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Why customers choose Taskoria
              </h2>
              <div className="mt-4 space-y-3">
                <TrustRow
                  icon={Clock3}
                  title="Fast replies"
                  body="Most active categories see first responses in under 35 minutes."
                />
                <TrustRow
                  icon={ShieldCheck}
                  title="Safer hiring"
                  body="Profile checks, review signals, and support escalation before and after hire."
                />
                <TrustRow
                  icon={Briefcase}
                  title="Compare before committing"
                  body="Receive multiple quotes and choose based on fit, timeline, and price."
                />
              </div>
            </div>
          </div>
        </header> */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">
              Find a service or post directly
            </h2>
            <p className="hidden text-sm text-slate-500 dark:text-slate-400 md:block">
              {categories.length} categories available
            </p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search services: electrician, cleaner, removals, web design"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
               
              }}
              className="h-12 border-slate-300 bg-white pl-11 pr-11 text-base focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-950"
            />
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {!hasSearchQuery ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {quickPickCategories.map((category) => (
                <button
                  key={category.category_id}
                  onClick={() => handlePostJob(category)}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-slate-800"
                >
                  Post {category.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Showing {filteredCategories.length} matching
              {filteredCategories.length === 1 ? " category" : " categories"}
            </p>
          )}
        </div>

        <NewRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          presetCategory={selectedCategory}
        />

        {hasSearchQuery && filteredCategories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <FolderOpen className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              No exact match found
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
              Try broader terms like plumbing, cleaning, electrical, removals, or digital services. You can still post your job and providers will match it.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="outline" onClick={clearSearch}>
                Clear search
              </Button>
              <Button onClick={() => handlePostJob()} className="bg-blue-600 text-white hover:bg-blue-700">
                Post My Job Instead
              </Button>
            </div>
          </div>
        ) : null}

        {topCategories.length > 0 ? (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {hasSearchQuery ? "Best matching services" : "Most requested services"}
              </h3>
              <Button
                variant="outline"
                onClick={() => handlePostJob()}
                className="hidden sm:inline-flex"
              >
                Post a Custom Job
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topCategories.map((category) => (
                <article
                  key={category.category_id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                  <Link href={`/services/${category.slug}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
                          {highlightMatch(category.name, searchQuery)}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Typical quote range {category.typicalQuote}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </Link>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      Avg first response {category.responseTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                      In demand
                    </span>
                  </div>

                  <Button
                    className="mt-4 w-full bg-[#2563EB] text-white  hover:bg-slate-800  dark:hover:text-slate-800 dark:hover:bg-slate-200"
                    onClick={() => handlePostJob(category)}
                  >
                    Post this job
                  </Button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {secondaryCategories.length > 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Explore all services
              </h3>
              {secondaryCategories.length > 12 ? (
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {showAll ? "Show less" : `Show all (${secondaryCategories.length})`}
                </button>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(showAll || secondaryCategories.length <= 12
                ? secondaryCategories
                : secondaryCategories.slice(0, 12)
              ).map((category) => (
                <Link
                  key={category.category_id}
                  href={`/services/${category.slug}`}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {highlightMatch(category.name, searchQuery)}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* <section className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="1. Post your job"
            body="Describe what you need, your location, and when you want it done."
            icon={CheckCircle2}
          />
          <InfoCard
            title="2. Compare providers"
            body="Review profiles, pricing, and response quality before choosing."
            icon={UserCheck}
          />
          <InfoCard
            title="3. Hire with confidence"
            body="Use transparent messaging and support if anything goes wrong."
            icon={ShieldCheck}
          />
        </section> */}

        {/* <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-slate-900 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Are you a service provider?
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-700 dark:text-slate-300">
                Join Taskoria to receive local leads in categories you choose. Control your availability and quote only jobs you want.
              </p>
            </div>
            <Button asChild className="h-11 bg-blue-600 px-6 text-white hover:bg-blue-700">
              <Link href="/providers/register">
                Join as Provider
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section> */}
      </div>
    </section>
  );
}

function TrustRow({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{body}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <h4 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</p>
    </article>
  );
}

function highlightMatch(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const start = lowerText.indexOf(lowerQuery);

  if (start === -1) return text;

  const end = start + trimmed.length;

  return (
    <>
      {text.slice(0, start)}
      <span className="rounded bg-blue-200 px-1 text-slate-900 dark:bg-blue-800 dark:text-slate-100">
        {text.slice(start, end)}
      </span>
      {text.slice(end)}
    </>
  );
}
