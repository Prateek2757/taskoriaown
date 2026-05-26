"use client";

import { memo } from "react";
import Link from "next/link";

interface MobileNavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavMobileLink = memo(function NavMobileLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${
        isActive
          ? "bg-[#2563EB] text-white shadow-md"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${
          isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
        }`}
      />
      <span>{label}</span>
    </Link>
  );
});

export default NavMobileLink;
