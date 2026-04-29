"use client";

import type { Session } from "next-auth";
import { AnimatePresence } from "motion/react";
import { Menu as MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NotificationBell from "../notification/NotificationBell";
import SlidingUnderlineNav from "./slidingUnderline";
import Explore from "./explore/Explore";
import NavDesktopActions from "./NavDesktopActions";
import NavMobileDrawer from "./NavMobileDrawer";
import { useNavState } from "./useNavState";
import { MINIMAL_PAGES } from "./types";
import type { ViewMode } from "./types";


interface ModernNavbarProps {
  initialViewMode: ViewMode;
  initialSession: Session | null;
}


export default function ModernNavbar({
  initialViewMode,
  initialSession,
}: ModernNavbarProps) {
  const {
    session,
    isLoggedIn,
    isPro,
    pathname,
    viewMode,
    isMenuOpen,
    setIsMenuOpen,
    isProfileOpen,
    setIsProfileOpen,
    currentLinks,
    closeAll,
    handleLogout,
    handleSwitchView,
    handleJoinAsProvider,
  } = useNavState({ initialViewMode, initialSession });

  const isMinimal = MINIMAL_PAGES.includes(pathname);

  return (
    <>
      <header
        className="sticky top-0 z-50
          backdrop-blur-xl bg-white/70 dark:bg-gray-900/70
          border-b border-white/40 dark:border-white/10
          shadow-sm transition-colors w-full"
      >
        <div className="container mx-auto px-4 py-2 flex items-center gap-2 relative">
          <Link
            href="/"
            className="flex gap-1 items-center hover:opacity-90 transition-opacity flex-1 md:flex-none min-w-0"
          >
            <Image
              src="/images/taskoria_logo.svg"
              alt="Taskoria"
              height={41}
              width={25}
              className="shrink-0"
              priority
            />
            <span className="text-2xl font-bold text-[#2563EB] truncate">
              Taskoria
            </span>
          </Link>

          <Explore />

          {!isMinimal && (
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 px-5 py-2 rounded-full space-x-2">
              <SlidingUnderlineNav
                currentLinks={currentLinks}
                pathname={pathname}
              />
            </nav>
          )}

          {!isMinimal && (
            <NavDesktopActions
              session={session}
              isLoggedIn={isLoggedIn}
              isPro={isPro}
              viewMode={viewMode}
              isProfileOpen={isProfileOpen}
              setIsProfileOpen={setIsProfileOpen}
              onSwitchView={handleSwitchView}
              onLogout={handleLogout}
              onClose={closeAll}
              onJoinAsProvider={handleJoinAsProvider}
            />
          )}

          <div className="flex items-center gap-1 md:hidden ml-auto">
            {isLoggedIn && session && (
              <NotificationBell userId={Number(session.user?.id)} />
            )}
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen((p) => !p)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <NavMobileDrawer
            session={session}
            isPro={isPro}
            viewMode={viewMode}
            pathname={pathname}
            currentLinks={currentLinks}
            onClose={closeAll}
            onLogout={handleLogout}
            onSwitchView={handleSwitchView}
            onJoinAsProvider={handleJoinAsProvider}
          />
        )}
      </AnimatePresence>
    </>
  );
}