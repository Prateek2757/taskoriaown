"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const minimalPages = ["/en/create", "/en/create-account"];

  const navLinks = {
    public: [
      { name: "Home", href: "/en", icon: Search },
      { name: "Discover", href: "/en/discover", icon: Search },
      { name: "Community", href: "/en/community", icon: Users },
    ],
    customer: [
      { name: "My Requests", href: "/en/customer/my-requests", icon: Search },
      { name: "Discover", href: "/en/discover", icon: Search },
    ],
    provider: [
      { name: "Leads", href: "/en/provider/leads", icon: Search },
      { name: "My Responses", href: "/en/provider/message", icon: MessageSquare },
      { name: "Dashboard", href: "/en/provider/dashboard", icon: LayoutDashboard },
    ],
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize viewMode
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

  // Create provider draft
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
        router.push(`/en/create?user_id=${data.user.user_id}`);
      }
    } catch (err) {
      console.error("Error creating draft provider:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // Logout cleanup
  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    await signOut({ redirect: false });

    if (typeof window !== "undefined") {
      localStorage.removeItem("viewMode");
      localStorage.removeItem("draftProviderId");
    }

    setViewMode(null);
    router.push("/en/signin");
  };

  // Switch view
  const handleSwitchView = (newView: "customer" | "provider") => {
    if (!session) return;
    setViewMode(newView);
    localStorage.setItem("viewMode", newView);
    setIsProfileOpen(false);
    setIsMenuOpen(false);

    router.push(
      newView === "provider"
        ? "/en/provider/dashboard"
        : "/en/customer/dashboard"
    );
  };

  const getCurrentLinks = () => {
    if (!session) return navLinks.public;
    if (viewMode === "provider") return navLinks.provider;
    if (viewMode === "customer") return navLinks.customer;
    return navLinks.public;
  };

  const currentLinks = getCurrentLinks();

  // Profile dropdown
  const renderProfileDropdown = () => {
    const profilePath =
      viewMode === "provider" ? "/en/provider/profile" : "/en/customer/profile";
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
            href="/en/settings"
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
      <header className="bg-white/95 backdrop-blur-lg backdrop-saturate-150  border-b sticky top-0 z-[9999] shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Links */}
          {!minimalPages.includes(pathname) && (
            <nav className="hidden md:flex items-center space-x-1">
              {currentLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Profile or Join */}
              {session ? (
                <div className="relative ml-4" ref={profileRef}>
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
                      className={`w-4 h-4 text-gray-500 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  <AnimatePresence>
                    {isProfileOpen && renderProfileDropdown()}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/en/signin")}
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
                </div>
              )}
            </nav>
          )}

          {/* Mobile Button */}
          <Button
          variant="ghost"
            onClick={() => setIsMenuOpen((p) => !p)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
          >
            {isMenuOpen ?"" : <MenuIcon />}
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
        {/* Header */}
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
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-4">
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
                {viewMode === "provider" ? "Provider View" : "Customer View"}
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="p-4">
          <div className="space-y-1">
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
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg shadow-blue-200"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
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
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* Provider Actions */}
          {session?.user?.role === "provider" && (
            <button
              onClick={() =>
                handleSwitchView(
                  viewMode === "provider" ? "customer" : "provider"
                )
              }
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 font-medium transition-all"
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

          {/* Profile */}
          <Button
            variant="ghost"
            onClick={() => {
              const path =
                viewMode === "provider"
                  ? "/en/provider/profile"
                  : "/en/customer/profile";
              router.push(path);
              setIsMenuOpen(false);
            }}
            className="w-full justify-start flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium transition-all"
          >
            <User className="w-5 h-5 text-gray-500" />
            View Profile
          </Button>

          {/* Settings */}
          <Link
            href="/en/settings"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 font-medium transition-all"
          >
            <Settings className="w-5 h-5 text-gray-500" />
            Settings
          </Link>

          {/* Notifications */}
          <Link
            href="/en/notifications"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 font-medium transition-all"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            Notifications
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              23
            </span>
          </Link>

          {/* Sign Out */}
          {session ? (
            <>
              <div className="my-4 border-t border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 font-medium transition-all"
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
                  onClick={() => {
                    router.push("/en/signin");
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    handleJoinAsProvider();
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
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