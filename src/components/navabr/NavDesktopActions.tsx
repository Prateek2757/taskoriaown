"use client";

import { useRef } from "react";
import { AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import NotificationBell from "../notification/NotificationBell";
import NavAvatar from "./NavAvatar";
import NavProfileDropdown from "./NavProfileDropdown";
import type { ViewMode } from "./types";

interface NavDesktopActionsProps {
  session: any;
  isLoggedIn: boolean;
  isPro: boolean;
  viewMode: ViewMode;
  isProfileOpen: boolean;
  setIsProfileOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  onSwitchView: (v: ViewMode) => void;
  onLogout: () => void;
  onClose: () => void;
  onJoinAsProvider: () => void;
}

export default function NavDesktopActions({
  session,
  isLoggedIn,
  isPro,
  viewMode,
  isProfileOpen,
  setIsProfileOpen,
  onSwitchView,
  onLogout,
  onClose,
  onJoinAsProvider,
}: NavDesktopActionsProps) {
  const profileRef = useRef<HTMLDivElement>(null);

  return (
    <div className="hidden md:flex items-center gap-3 ml-auto">
      {isLoggedIn ? (
        <div className="relative flex items-center" ref={profileRef}>
          <NotificationBell userId={Number(session?.user?.id)} />

          <Button
            onClick={() => setIsProfileOpen((p) => !p)}
            variant="ghost"
            className="flex items-center gap-2 px-3 py-2 rounded-full transition-all"
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
          >
            <NavAvatar src={session?.user?.image} size="md" isPro={isPro} />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {session?.user?.name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </Button>

          <AnimatePresence>
            {isProfileOpen && (
              <NavProfileDropdown
                session={session}
                viewMode={viewMode}
                onSwitchView={onSwitchView}
                onClose={onClose}
                onLogout={onLogout}
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <>
          <Link
            href="/signin"
            prefetch
            className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium
              text-gray-700 dark:text-gray-300 hover:scale-105 transition-all duration-300 
              hover:bg-blue-100 hover:text-blue-500 "
          >
            Sign In
          </Link>
          <Button
            onClick={onJoinAsProvider}
            className="bg-[#2563EB]  hover:shadow-xl hover:shadow-blue-500/40
               hover:scale-105  text-white transition-all duration-300 font-medium border-none hover:bg-[#1D4FD8]"
          >
            Join as Provider
          </Button>
        </>
      )}
      <div suppressHydrationWarning>
        <ThemeToggle />
      </div>
    </div>
  );
}
