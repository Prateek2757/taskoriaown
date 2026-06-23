"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InternalLink } from "@/lib/internal-links";

type InternalLinkGroup = {
  title: string;
  links: InternalLink[];
  variant?: "list" | "service-cards";
};

type InternalLinkModuleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  groups: InternalLinkGroup[];
  className?: string;
};

export default function InternalLinkModule({
  eyebrow = "Explore Taskoria",
  title,
  description,
  groups,
  className = "",
}: InternalLinkModuleProps) {
  const visibleGroups = groups.filter((group) => group.links.length > 0);

  if (!visibleGroups.length) return null;

  return (
    <section className={`py-4 ${className}`}>
      <div className="rounded-none  border-slate-100  px-5  dark:border-slate-800 dark:bg-slate-900/50 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          {eyebrow}
        </p>
        <div className="mt-2 grid gap-6  lg:items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white ">
              {title}
            </h2>
            {description && (
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            )}
          </div>

          <div className="grid gap-3  md:grid-cols-2">
            {visibleGroups.map((group) => (
              <div
                key={group.title}
                className={group.variant === "service-cards" ? "md:col-span-2" : ""}
              >
               
                {group.variant === "service-cards" ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {group.links.map((link) => (
                      <ServiceCardLink key={link.href} link={link} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 grid gap-3">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group inline-flex min-h-9 items-center font-semibold rounded-xl justify-between gap-3 border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:text-blue-300"
                      >
                        <span >{link.label}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCardLink({ link }: { link: InternalLink }) {
  const serviceSlug = getServiceSlugFromHref(link.href);

  return (
    <Link
      href={link.href}
      className="group overflow-hidden border border-slate-200 bg-white rounded-xl text-slate-900 transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-blue-700"
    >
      <div className="flex items-center gap-3 p-2">
        <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
          {link.imageUrl || serviceSlug ? (
            <img
              src={link.imageUrl ?? `/images/services/${serviceSlug}.svg`}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-blue-50 dark:bg-blue-950/40" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
            {link.label}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            View providers
          </p>
        </div>
      </div>
    </Link>
  );
}

function getServiceSlugFromHref(href: string) {
  const match = href.match(/^\/services\/([^/]+)/);
  return match?.[1] ?? null;
}
