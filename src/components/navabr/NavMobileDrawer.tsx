"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import { FaMoneyCheck } from "react-icons/fa6";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import NavAvatar from "./NavAvatar";
import NavMobileLink from "./NavMobileLink";
import type { NavLink, ViewMode } from "./types";

interface NavMobileDrawerProps {
  session: any;
  isPro: boolean;
  viewMode: ViewMode;
  pathname: string;
  currentLinks: NavLink[];
  onClose: () => void;
  onLogout: () => void;
  onSwitchView: (v: ViewMode) => void;
  onJoinAsProvider: () => void;
}

export default function NavMobileDrawer({
  session,
  isPro,
  viewMode,
  pathname,
  currentLinks,
  onClose,
  onLogout,
  onSwitchView,
  onJoinAsProvider,
}: NavMobileDrawerProps) {
  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        key="drawer"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        className="fixed left-0 top-0 bottom-0 w-[min(320px,85vw)]
          bg-white dark:bg-gray-900 shadow-2xl z-[9999] overflow-y-auto
          flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center justify-between mb-4 gap-2">
            <Link
              href="/"
              className="flex items-center gap-1 hover:opacity-90 transition-opacity min-w-0"
              onClick={onClose}
            >
              <Image
                src="/images/taskoria_logo.svg?v=bold-control-5"
                alt="Taskoria"
                width={150}
                height={43}
                className="h-auto w-[112px] shrink-0"
              />
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <div suppressHydrationWarning>
                <ThemeToggle />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {session && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <NavAvatar src={session.user?.image} size="md" isPro={isPro} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-gray-100 truncate text-base">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <div
                className="inline-flex items-center px-3 py-1 rounded-full
                bg-white/80 dark:bg-gray-800 backdrop-blur-sm
                text-xs font-medium text-blue-700 dark:text-blue-400
                border border-blue-200 dark:border-blue-800"
              >
                {viewMode === "provider" ? "Provider View" : "Customer View"}
              </div>
            </div>
          )}
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {currentLinks.map((link) => (
            <NavMobileLink
              key={link.href + link.name}
              href={link.href}
              icon={link.icon}
              label={link.name}
              isActive={
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href) || (link.href.startsWith("/messages") && pathname.startsWith("/messages"))
              }
              onClick={onClose}
            />
          ))}

          {session?.user?.adminrole === "admin" && (
            <NavMobileLink
              href="/admin"
              icon={LayoutDashboard}
              label="Admin Menu"
              isActive={pathname.startsWith("/admin")}
              onClick={onClose}
            />
          )}

          {session?.user?.public_id && (
            <NavMobileLink
              href={`/providerprofile/${session.user.company_slug}`}
              icon={User}
              label="View Public Profile"
              isActive={false}
              onClick={onClose}
            />
          )}

          {session && (
            <NavMobileLink
              href="/settings/billing/taskoria_pro"
              icon={FaMoneyCheck}
              label="Taskoria Plans & Pricing"
              isActive={pathname.startsWith("/settings/billing")}
              onClick={onClose}
            />
          )}

          {session && (
            <NavMobileLink
              href="/affiliate-dashboard-portal"
              icon={LayoutDashboard}
              label="Affiliate Hub"
              isActive={pathname.startsWith("/affiliate")}
              onClick={onClose}
            />
          )}

          {session?.user?.role === "provider" && (
            <button
              onClick={() =>
                onSwitchView(viewMode === "provider" ? "customer" : "provider")
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-800
                font-medium transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 -rotate-90" />
              <span>
                Switch to {viewMode === "provider" ? "Customer" : "Provider"}
              </span>
            </button>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2 shrink-0">
          {session ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center border gap-3 px-4 py-3 rounded-xl
                border-gray-300 dark:border-gray-700
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-950
                font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/signin"
                prefetch
                onClick={onClose}
                className="flex items-center justify-center w-full border border-gray-300 dark:border-gray-700
                  font-medium rounded-xl h-10 px-4 py-2 text-sm
                  bg-transparent text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
              <Button
                onClick={onJoinAsProvider}
                className="w-full bg-[#2563EB] rounded-xl text-white hover:opacity-90 font-medium"
              >
                Join as Provider
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
