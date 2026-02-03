"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu as MenuIcon, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

type ViewMode = "customer" | "provider" | null;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  const minimalPages = ["/create", "/create-account"];

  const navLinks = {
    public: [
      { name: "Discover", href: "/discover" },
      { name: "Community", href: "/community" },
    ],
    customer: [
      { name: "My Requests", href: "/customer/my-requests" },
      { name: "Discover", href: "/discover" },
    ],
    provider: [
      { name: "Leads", href: "/provider/leads" },
      { name: "My Responses", href: "/provider/message" },
      { name: "Dashboard", href: "/provider/dashboard" },
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      if (typeof window !== "undefined") {
        localStorage.removeItem("draftProviderId");
      }

      const res = await fetch("/api/signup/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "provider" }),
      });

      const data = await res.json();
      console.log(data?.user?.public_id);

      if (data?.user?.user_id || data?.user?.public_id) {
        localStorage.setItem("draftProviderId", data.user.user_id);
        localStorage.setItem("draftProviderPublicId", data.user.public_id);
        router.push(`/create?userr_id=${data.user.public_id}`);
      }
    } catch (error) {
      console.error("Error creating draft provider:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    await signOut({ redirect: false });
    setViewMode(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("viewMode");
      localStorage.removeItem("draftProviderId");
    }

    router.push("/signin");
  };

  const handleSwitchView = (newView: "customer" | "provider") => {
    if (!session) return;

    setViewMode(newView);
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", newView);
    }
    setIsProfileOpen(false);
    setIsMenuOpen(false);

    const targetPath =
      newView === "provider" ? "/provider/dashboard" : "/customer/dashboard";

    router.push(targetPath);
  };

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
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {session?.user?.name || session?.user?.display_name || "User"}
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
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Profile
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsProfileOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Settings
          </Link>
        </div>
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    );
  };

  const getCurrentLinks = () => {
    if (!session) return navLinks.public;
    if (viewMode === "provider") return navLinks.provider;
    if (viewMode === "customer") return navLinks.customer;
    return navLinks.public;
  };

  const currentLinks = getCurrentLinks();

  if (status === "loading") {
    return (
      <header className="bg-white/95 backdrop-blur-md  border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b sticky w-full top-0 z-[9999] shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
            Taskoria
          </span>
        </Link>

        {!minimalPages.includes(pathname) && (
          <>
            <nav className="hidden md:flex text-muted-foreground items-center space-x-1">
              {currentLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1 rounded-md font-medium transition-all ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {session ? (
                <div className="relative ml-4" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      {session.user?.name?.split(" ")[0] ||
                        session.user?.display_name ||
                        "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && renderProfileDropdown()}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/signin")}
                    className="font-medium"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={JoinAsProvider}
                    className="bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white hover:from-blue-700 hover:to-cyan-700 font-medium shadow-md"
                  >
                    Join as Provider
                  </Button>
                </div>
              )}
            </nav>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && !minimalPages.includes(pathname) && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col p-4 space-y-1">
              {currentLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {session ? (
                <>
                  <div className="border-t border-gray-200 my-3 pt-3">
                    <div className="px-4 py-2 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {session.user?.name || session.user?.display_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {viewMode === "provider"
                            ? "Provider View"
                            : "Customer View"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {session.user?.role === "provider" && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleSwitchView(
                          viewMode === "provider" ? "customer" : "provider"
                        )
                      }
                      className="w-full justify-between"
                    >
                      <span>
                        Switch to{" "}
                        {viewMode === "provider" ? "Customer" : "Provider"}
                      </span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => {
                      const path =
                        viewMode === "provider"
                          ? "/provider/profile"
                          : "/customer/profile";
                      router.push(path);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    View Profile
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full mt-2"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-3 pt-3 space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push("/signin");
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
                      className="w-full rounded-xl bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white hover:from-blue-700 hover:to-cyan-700"
                    >
                      Join as Provider
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
