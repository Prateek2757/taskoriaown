"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaMoneyCheck } from "react-icons/fa6";
import Image from "next/image";
import {
  Menu as MenuIcon,
  X,
  User,
  ChevronDown,
  Search,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Home,
  HandPlatter,
  Binoculars,
  Star,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import SlidingUnderlineNav from "./slidingUnderline";
import NotificationBell from "../notification/NotificationBell";
import Explore from "./explore/Explore";

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode = "customer" | "provider";

type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

// ─── Constants (stable — defined outside component, never recreated) ──────────

const NAV_LINKS: Record<"public" | "customer" | "provider", NavLink[]> = {
  public: [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: HandPlatter },
  ],
  customer: [
    { name: "Home", href: "/", icon: Home },
    { name: "My Requests", href: "/customer/dashboard", icon: Search },
    { name: "Discover", href: "/services", icon: Binoculars },
    { name: "Messages", href: "/messages/null", icon: MessageSquare },
  ],
  provider: [
    { name: "Home", href: "/", icon: Home },
    { name: "Leads", href: "/provider/leads", icon: Search },
    { name: "Inbox", href: "/messages/null", icon: MessageSquare },
    { name: "My Responses", href: "/provider-responses", icon: MessageSquare },
    { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  ],
};

const MINIMAL_PAGES = ["/create", "/create-account"];

const PREFETCH_ROUTES = [
  "/signin",
  "/services",
  "/",
  "/provider/leads",
  "/customer/dashboard",
  "/provider/dashboard",
  "/messages/null",
  "/settings/profile/my-profile",
];

// ─── Helper — read viewMode from localStorage synchronously ──────────────────

function readStoredViewMode(role?: string): ViewMode {
  if (typeof window === "undefined") return "customer";
  return (
    (localStorage.getItem("viewMode") as ViewMode | null) ??
    (role === "provider" ? "provider" : "customer")
  );
}

// ─── Sub-components (memoized to avoid cascade re-renders) ───────────────────

interface AvatarProps {
  src?: string | null;
  size?: "sm" | "md";
  isPro?: boolean;
}

const Avatar = memo(function Avatar({ src, size = "md", isPro }: AvatarProps) {
  const dim = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const starDim = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${dim} rounded-full flex items-center justify-center
          bg-gradient-to-br from-blue-100 to-cyan-100
          dark:from-blue-900 dark:to-cyan-900 overflow-hidden
          ${isPro ? "ring-2 ring-yellow-400" : ""}`}
      >
        {src ? (
          <Image
            src={src}
            alt="Profile"
            fill
            className="object-cover rounded-full"
            sizes={size === "sm" ? "32px" : "40px"}
            priority
          />
        ) : (
          <User className={`${iconSize} text-blue-600 dark:text-blue-300`} />
        )}
      </div>
      {isPro && (
        <div
          className={`absolute -bottom-1 -right-1 ${starDim} rounded-full
            bg-gradient-to-br from-yellow-400 to-orange-500
            flex items-center justify-center
            ring-2 ring-white dark:ring-slate-900 shadow-md`}
        >
          <Star className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      )}
    </div>
  );
});

// ─── Dropdown ────────────────────────────────────────────────────────────────

interface DropdownProps {
  session: any;
  viewMode: ViewMode;
  onSwitchView: (v: ViewMode) => void;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileDropdown = memo(function ProfileDropdown({
  session,
  viewMode,
  onSwitchView,
  onClose,
  onLogout,
}: DropdownProps) {
  const canSwitch = session?.user?.role === "provider";
  const isPro =
    session?.user?.status === "active" ||
    session?.user?.status === "trialing";

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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar src={session?.user?.image} size="md" isPro={isPro} />
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

      {/* Actions */}
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
            onClick={onClose}
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
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

// ─── Mobile drawer nav link ───────────────────────────────────────────────────

const MobileNavLink = memo(function MobileNavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-colors ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ModernNavbar() {
  const { joinAsProvider } = useJoinAsProvider();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ── Synchronous init from localStorage — zero flicker ──────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    readStoredViewMode(),
  );

  const profileRef = useRef<HTMLDivElement>(null);
  const isMinimal = MINIMAL_PAGES.includes(pathname);
  const isLoggedIn = status === "authenticated";

  const isPro =
    session?.user?.status === "active" ||
    session?.user?.status === "trialing";

  // ── Sync viewMode once session resolves ─────────────────────────────────────
  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    const stored = localStorage.getItem("viewMode") as ViewMode | null;
    if (!stored) {
      const def: ViewMode =
        session.user.role === "provider" ? "provider" : "customer";
      localStorage.setItem("viewMode", def);
      setViewMode(def);
    }
  }, [status, session]);

  // ── Cross-tab viewMode sync ─────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const stored = localStorage.getItem("viewMode") as ViewMode | null;
      if (stored) setViewMode(stored);
    };
    window.addEventListener("viewModeChanged", update);
    return () => window.removeEventListener("viewModeChanged", update);
  }, []);

  // ── Click-outside to close profile dropdown ─────────────────────────────────
  useEffect(() => {
    if (!isProfileOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isProfileOpen]);

  // ── Close mobile menu on route change ──────────────────────────────────────
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // ── Prefetch routes ─────────────────────────────────────────────────────────
  useEffect(() => {
    PREFETCH_ROUTES.forEach((r) => router.prefetch(r));
  }, [router]);

  // ── Memoized current links ──────────────────────────────────────────────────
  const currentLinks = useMemo<NavLink[]>(() => {
    if (!isLoggedIn) return NAV_LINKS.public;
    return viewMode === "provider"
      ? NAV_LINKS.provider
      : NAV_LINKS.customer;
  }, [isLoggedIn, viewMode]);

  // ── Stable handlers ─────────────────────────────────────────────────────────
  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    closeAll();
    await signOut({ redirect: false });
    if (typeof window !== "undefined") {
      localStorage.removeItem("viewMode");
      localStorage.removeItem("draftProviderId");
    }
    setViewMode("customer");
    router.push("/signin");
  }, [closeAll, router]);

  const handleSwitchView = useCallback(
    (newView: ViewMode) => {
      setViewMode(newView);
      localStorage.setItem("viewMode", newView);
      window.dispatchEvent(new Event("viewModeChanged"));
      closeAll();
      router.push(
        newView === "provider" ? "/provider/dashboard" : "/customer/dashboard",
      );
    },
    [closeAll, router],
  );

  const handleJoinAsProvider = useCallback(async () => {
    await joinAsProvider();
    setIsMenuOpen(false);
  }, [joinAsProvider]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Desktop / sticky header ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50
          backdrop-blur-xl bg-white/70 dark:bg-gray-900/70
          border-b border-white/40 dark:border-white/10
          shadow-sm transition-colors w-full"
      >
        <div className="container mx-auto px-4 py-2 flex items-center gap-2 relative">
          {/* Logo */}
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

          {/* Desktop centered nav */}
          {!isMinimal && (
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 px-5 py-2 rounded-full space-x-2">
              <SlidingUnderlineNav
                currentLinks={currentLinks}
                pathname={pathname}
              />
            </nav>
          )}

          {!isMinimal && (
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
                    <Avatar
                      src={session?.user?.image}
                      size="md"
                      isPro={isPro}
                    />
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
                      <ProfileDropdown
                        session={session}
                        viewMode={viewMode}
                        onSwitchView={handleSwitchView}
                        onClose={closeAll}
                        onLogout={handleLogout}
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
                      text-gray-700 dark:text-gray-300
                      hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Button
                    onClick={handleJoinAsProvider}
                    className="bg-[#3C7DED] text-white hover:opacity-90 font-medium shadow-md"
                  >
                    Join as Provider
                  </Button>
                </>
              )}
              <div suppressHydrationWarning>
                <ThemeToggle />
              </div>
            </div>
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
              {isMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              onClick={() => setIsMenuOpen(false)}
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
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-1 hover:opacity-90 transition-opacity min-w-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image
                      src="/images/taskoria_logo.svg"
                      alt="Taskoria"
                      height={32}
                      width={22}
                      className="shrink-0"
                    />
                    <span className="text-xl font-bold text-[#3C7DED] truncate">
                      Taskoria
                    </span>
                  </Link>
                  <div className="flex items-center gap-1 shrink-0">
                    <div suppressHydrationWarning>
                      <ThemeToggle />
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
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
                      <Avatar
                        src={session.user?.image}
                        size="md"
                        isPro={isPro}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-gray-100 truncate text-base">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full
                      bg-white/80 dark:bg-gray-800 backdrop-blur-sm
                      text-xs font-medium text-blue-700 dark:text-blue-400
                      border border-blue-200 dark:border-blue-800">
                      {viewMode === "provider" ? "Provider View" : "Customer View"}
                    </div>
                  </div>
                )}
              </div>

              <nav className="p-4 space-y-1 flex-1">
                {currentLinks.map((link) => (
                  <MobileNavLink
                    key={link.href + link.name}
                    href={link.href}
                    icon={link.icon}
                    label={link.name}
                    isActive={
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href)
                    }
                    onClick={() => setIsMenuOpen(false)}
                  />
                ))}

                {session?.user?.adminrole === "admin" && (
                  <MobileNavLink
                    href="/admin"
                    icon={LayoutDashboard}
                    label="Admin Menu"
                    isActive={pathname.startsWith("/admin")}
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}

                {session?.user?.public_id && (
                  <MobileNavLink
                    href={`/providerprofile/${session.user.company_slug}`}
                    icon={User}
                    label="View Public Profile"
                    isActive={false}
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}

                {session && (
                  <MobileNavLink
                    href="/settings/billing/taskoria_pro"
                    icon={FaMoneyCheck}
                    label="Taskoria Plans & Pricing"
                    isActive={pathname.startsWith("/settings/billing")}
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}

                {session && (
                  <MobileNavLink
                    href="/affiliate-dashboard-portal"
                    icon={LayoutDashboard}
                    label="Affiliate Hub"
                    isActive={pathname.startsWith("/affiliate")}
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}

                {session?.user?.role === "provider" && (
                  <button
                    onClick={() =>
                      handleSwitchView(
                        viewMode === "provider" ? "customer" : "provider",
                      )
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

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2 shrink-0">
                {session ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center  border gap-3 px-4 py-3 rounded-xl border-gray-300 dark:border-gray-700
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
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center w-full border border-gray-300 dark:border-gray-700
                        font-medium rounded-xl h-10 px-4 py-2 text-sm
                        bg-transparent text-gray-700 dark:text-gray-300
                        hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Button
                      onClick={handleJoinAsProvider}
                      className="w-full bg-[#3C7DED] text-white hover:opacity-90 font-medium"
                    >
                      Join as Provider
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}