"use client";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────
interface NavLink {
  href: string;
  name: string;
}

function SlidingUnderlineNav({
  currentLinks,
  pathname,
}: {
  currentLinks: NavLink[];
  pathname: string;
}) {
  return (
    <div className="relative flex">
      {currentLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href.startsWith("/messages") && pathname.startsWith("/messages"));

        return (
          <Link
            key={link.href}
            prefetch
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative px-6 py-3.5 text-sm font-medium transition-colors after:absolute after:inset-x-6 after:-bottom-[3px] after:h-[3px] after:origin-center after:rounded-full after:bg-[#2563EB] after:transition-transform after:duration-200 dark:after:bg-[#4d86e7] ${
              isActive
                ? "text-[#2563EB] after:scale-x-100 dark:text-[#4d86e7]"
                : "text-gray-700 after:scale-x-0 hover:text-[#2563EB] hover:after:scale-x-100 dark:text-gray-300 dark:hover:text-[#4d86e7]"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}

export default SlidingUnderlineNav;
