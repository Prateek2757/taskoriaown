"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  admin: "Admin Hub",
  adminaffiliatespage: "Affiliates",
  admincommissionstab: "Commissions",
  adminbudgetmanager: "Budget Manager",
  refunds: "Refunds",
};

function toLabel(slug: string) {
  return (
    LABEL_MAP[slug] ??
    slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function AdminBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: toLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-sm   pb-0"
    >
      <Link
        href="/admin"
        className="flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        aria-label="Admin Hub"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
          {crumb.isLast ? (
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
