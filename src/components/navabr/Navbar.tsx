"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Menu as MenuIcon,
  X,
  User,
  ChevronDown,
  Search,
  Users,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type ViewMode = "customer" | "provider" | null;

export default function ModernNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(null);

  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const minimalPages = ["/create", "/create-account"];

  const navLinks = {
    public: [
      { name: "Home", href: "/", icon: Search },
      { name: "Discover", href: "/discover", icon: Search },
      { name: "Community", href: "/community", icon: Users },
    ],
    customer: [
      { name: "Home", href: "/", icon: Search },
      { name: "My Requests", href: "/customer/my-requests", icon: Search },
      { name: "Discover", href: "/discover", icon: Search },
    ],
    provider: [
      { name: "Home", href: "/", icon: Search },
      { name: "Leads", href: "/provider/leads", icon: Search },
      { name: "My Responses", href: "/provider/message", icon: MessageSquare },
      { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
    ],
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load or initialize view mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedView = localStorage.getItem("viewMode") as ViewMode | null;

    if (storedView === "customer" || storedView === "provider") {
      setViewMode(storedView);
    } else if (session?.user?.role) {
      const defaultView =
        session.user.role === "provider" ? "provider" : "customer";
      setViewMode(defaultView);
      localStorage.setItem("viewMode", defaultView);
    }
  }, [session]);

  const handleJoinAsProvider = async () => {
    try {
      localStorage.removeItem("draftProviderId");
      const res = await fetch("/api/signup/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "provider" }),
      });

      const data = await res.json();
      if (data?.user?.user_id) {
        localStorage.setItem("draftProviderId", data.user.user_id);
        router.push(`/create?user_id=${data.user.user_id}`);
      }
    } catch (err) {
      console.error("Error creating draft provider:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    await signOut({ redirect: false });

    if (typeof window !== "undefined") {
      localStorage.removeItem("viewMode");
      localStorage.removeItem("draftProviderId");
    }

    setViewMode(null);
    router.push("/signin");
  };

  const handleSwitchView = (newView: "customer" | "provider") => {
    if (!session) return;
    setViewMode(newView);
    localStorage.setItem("viewMode", newView);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    router.push(
      newView === "provider" ? "/provider/dashboard" : "/customer/dashboard"
    );
  };

  const getCurrentLinks = () => {
    if (!session) return navLinks.public;
    if (viewMode === "provider") return navLinks.provider;
    if (viewMode === "customer") return navLinks.customer;
    return navLinks.public;
  };

  const currentLinks = getCurrentLinks();

  const renderProfileDropdown = () => {
    const profilePath =
      viewMode === "provider" ? "/provider/profile" : "/customer/profile";
    const canSwitchView = session?.user?.role === "provider";

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-[999]"
      >
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-md">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="py-2">
          {canSwitchView && (
            <button
              onClick={() =>
                handleSwitchView(
                  viewMode === "provider" ? "customer" : "provider"
                )
              }
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <span>
                Switch to {viewMode === "provider" ? "Customer" : "Provider"}
              </span>
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          )}
          <Link
            href={profilePath}
            onClick={() => setIsProfileOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            View Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsProfileOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Settings
          </Link>
        </div>
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    );
  };

  if (status === "loading") {
    return (
      <header className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <header className="backdrop-saturate-150 border-b sticky top-0 z-50 bg-white/70 backdrop-blur-md border border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Taskoria
            </span>
          </Link>

          {/* Center Nav (floating glass look) */}
          {!minimalPages.includes(pathname) && (
            <motion.nav
              className="hidden md:flex absolute left-1/2 transform -translate-x-1/2    px-5 py-2 rounded-full space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-muted-foreground font-medium text-sm transition-all ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shad-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </motion.nav>
          )}

          {/* Right Side */}
          {!minimalPages.includes(pathname) && (
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <div className="relative" ref={profileRef}>
                  <Button
                    onClick={() => setIsProfileOpen((p) => !p)}
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      {session.user?.name?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  <AnimatePresence>
                    {isProfileOpen && renderProfileDropdown()}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/signin")}
                    className="font-medium"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleJoinAsProvider}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 font-medium shadow-md"
                  >
                    Join as Provider
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen((p) => !p)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
          >
            {isMenuOpen ? <X /> : <MenuIcon />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[9999] md:hidden overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      Taskoria
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* User Info */}
                {session && (
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-lg">
                          {session.user?.name || session.user?.display_name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-xs font-medium text-blue-700 border border-blue-200">
                      {viewMode === "provider"
                        ? "Provider View"
                        : "Customer View"}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Links */}
              <nav className="p-4">
                {currentLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}
                      />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}

                <div className="my-4 border-t border-gray-200" />

                {session?.user?.role === "provider" && (
                  <button
                    onClick={() =>
                      handleSwitchView(
                        viewMode === "provider" ? "customer" : "provider"
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-5 h-5 text-gray-500 -rotate-90" />
                      <span>
                        Switch to{" "}
                        {viewMode === "provider" ? "Customer" : "Provider"}
                      </span>
                    </div>
                  </button>
                )}

                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  Settings
                </Link>

                <Link
                  href="/notifications"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <Bell className="w-5 h-5 text-gray-500" />
                  Notifications
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    23
                  </span>
                </Link>

                {session ? (
                  <>
                    <div className="my-4 border-t border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="my-4 border-t border-gray-200" />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 font-medium"
                        onClick={() => router.push("/signin")}
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={handleJoinAsProvider}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 font-medium"
                      >
                        Join as Provider
                      </Button>
                    </div>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
