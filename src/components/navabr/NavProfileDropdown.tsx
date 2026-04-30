"use client";

import { memo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import NavAvatar from "./NavAvatar";
import type { ViewMode } from "./types";

interface ProfileDropdownProps {
  session: any;
  viewMode: ViewMode;
  onSwitchView: (v: ViewMode) => void;
  onClose: () => void;
  onLogout: () => void;
}

const NavProfileDropdown = memo(function NavProfileDropdown({
  session,
  viewMode,
  onSwitchView,
  onClose,
  onLogout,
}: ProfileDropdownProps) {
  const canSwitch = session?.user?.role === "provider";
  const isPro =
    session?.user?.status === "active" || session?.user?.status === "trialing";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 w-72
        bg-white dark:bg-gray-900 rounded-xl shadow-xl
        border border-gray-100 dark:border-gray-800
        overflow-hidden z-[999]"
    >
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <NavAvatar src={session?.user?.image} size="md" isPro={isPro} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="py-1">
        {canSwitch && (
          <button
            onClick={() =>
              onSwitchView(viewMode === "provider" ? "customer" : "provider")
            }
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium
              text-gray-700 dark:text-gray-300
              hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600
              transition-colors"
          >
            <span>
              Switch to {viewMode === "provider" ? "Customer" : "Provider"}
            </span>
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        )}

        {[
          {
            href: "/settings/billing/taskoria_pro",
            label: "Taskoria Plans & Pricing",
          },
          ...(session?.user?.adminrole === "admin"
            ? [{ href: "/admin", label: "Admin Menu" }]
            : []),
          ...(session?.user?.public_id
            ? [
                {
                  href: `/providerprofile/${session.user.company_slug}`,
                  label: "View Public Profile",
                },
              ]
            : []),
          { href: "/affiliate-dashboard-portal", label: "Affiliate Hub" },
          { href: "/settings/profile/my-profile", label: "Settings" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            prefetch
            onClick={onClose}
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 text-sm font-medium rounded-lg
            text-red-600 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-950
            transition-colors"
        >
          Sign Out
        </button>
      </div>
    </motion.div>
  );
});

export default NavProfileDropdown;
