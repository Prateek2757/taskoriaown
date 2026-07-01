import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  currentPage?: string;
}

export default function ServiceBreadcrumbs({
  currentPage,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 cursor-pointer ">
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-slate-500 transition-colors hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <Home className="h-4 w-4 shrink-0" />
            <span>Home</span>
          </Link>
        </li>

        {currentPage && (
          <>
            <li aria-hidden="true" className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-slate-900 dark:text-slate-600" />
            </li>
            <li className="min-w-0">
              <span
                aria-current="page"
                className="block truncate px-1.5 py-0.5 font-medium  text-[#2563EB]"
              >
                {currentPage}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}