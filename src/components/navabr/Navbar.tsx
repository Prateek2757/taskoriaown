"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Menu as MenuIcon,
  X,
  User,
  ChevronDown,
  Search,
  Users,
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

type ViewMode = "customer" | "provider" | null;

export default function ModernNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(null);
  const { joinAsProvider, loading } = useJoinAsProvider();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const minimalPages = ["/create", "/create-account"];

  const navLinks = {
    public: [
      { name: "Home", href: "/", icon: Home },
      // { name: "Providers", href: "/providers", icon: Users },
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
      { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
    ],
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!session) return;

    const stored = localStorage.getItem("viewMode") as ViewMode;

    if (stored) {
      setViewMode(stored);
      return;
    }

    const defaultView =
      session.user.role === "provider" ? "provider" : "customer";
    setViewMode(defaultView);
    localStorage.setItem("viewMode", defaultView);
  }, [session]);

  useEffect(() => {
    const update = () => {
      const stored = localStorage.getItem("viewMode") as ViewMode;
      setViewMode(stored);
    };

    window.addEventListener("viewModeChanged", update);
    return () => window.removeEventListener("viewModeChanged", update);
  }, []);

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
  // console.log(session?.user.adminrole, "adinsdnoinas");

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
        className="absolute right-0 mt- w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden z-[999]"
      >
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`w-13 h-13 rounded-full flex items-center justify-center
      bg-gradient-to-br from-blue-100 to-cyan-100
      dark:from-blue-900 dark:to-cyan-900
      transition-all group-hover:scale-[1.05] overflow-hidden
      ${session?.user.status === "active" ? "ring-2 ring-yellow-400" : ""}`}
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="profile pic"
                    fill
                    className="object-cover rounded-full"
                    sizes="52px"
                    priority
                  />
                ) : (
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                )}
              </div>

              {session?.user.status === "active" && (
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                 bg-gradient-to-br from-yellow-400 to-orange-500
                 flex items-center justify-center
                 ring-2 ring-white dark:ring-slate-900 shadow-md"
                >
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
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
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors"
            >
              <span>
                Switch to {viewMode === "provider" ? "Customer" : "Provider"}
              </span>
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          )}
          <Link
            href="/settings/billing/taskoria_pro"
            onClick={() => {
              setIsMenuOpen(false);
              setIsProfileOpen(false);
            }}
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Taskoria Plans & Pricing{" "}
          </Link>
          {session?.user.adminrole === "admin" ? (
            <Link
              href="/adminbudgetmanager"
              onClick={() => {
                setIsMenuOpen(false);
                setIsProfileOpen(false);
              }}
              className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Admin Menu
            </Link>
          ) : (
            ""
          )}

          <Link
            href="/settings/profile/my-profile"
            onClick={() => setIsProfileOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Settings
          </Link>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    );
  };

  if (status === "loading") {
    return (
      <header className="bg-white dark:bg-gray-900/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#3C7DED] rounded-xl animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className="
  sticky top-0 z-50 
  backdrop-blur-xl
  bg-white/30 dark:bg-gray-900/20 
  border-b border-white/40 dark:border-white/10
  shadow-lg shadow-black/5 dark:shadow-white/5
  transition-colors w-full
"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between relative">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Image
              src="/taskorialogonew.png"
              alt="taskorialogo"
              height={41}
              width={28}
            />

            <span className="text-2xl font-bold bg-[#3C7DED]  bg-clip-text text-transparent ">
              Taskoria
            </span>
          </Link>

          {!minimalPages.includes(pathname) && (
            <motion.nav
              className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 px-5 py-2 rounded-full space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* {currentLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative  mx-4  py-3.5 rounded-full font-medium text-sm transition-all text-gray-700 dark:text-gray-300 group inline-block"
                >
                  {link.name}
                  <span
                    className={`
          absolute left-0 right-0 bottom-[-3] h-[2px] bg-[#3C7DED] rounded-full
          scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
          ${pathname === link.href ? "scale-x-100" : ""}
         `}
                  />
                </Link>
              ))} */}
              <SlidingUnderlineNav
                currentLinks={currentLinks}
                pathname={pathname}
              />
            </motion.nav>
          )}

          {!minimalPages.includes(pathname) && (
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <div className="relative flex" ref={profileRef}>
                  <div className="">
                    <NotificationBell userId={Number(session?.user?.id)} />
                  </div>

                  <Button
                    onClick={() => setIsProfileOpen((p) => !p)}
                    variant="ghost"
                    className=" flex items-center gap-2 px py-2 rounded-full transition-all "
                  >
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center
      bg-gradient-to-br from-blue-100 to-cyan-100
      dark:from-blue-900 dark:to-cyan-900
      transition-all group-hover:scale-[1.05] overflow-hidden
      ${session?.user.status === "active" ? "ring-2 ring-yellow-400" : ""}
      `}
                      >
                        {session?.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="profile pic"
                            fill
                            className="object-cover rounded-full"
                            sizes="52px"
                            priority
                          />
                        ) : (
                          <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                        )}
                      </div>

                      {session?.user.status === "active" && (
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 py-1 rounded-full
                 bg-gradient-to-br from-yellow-400 to-orange-500
                 flex items-center justify-center
                 ring-2 ring-white dark:ring-slate-900 shadow-md"
                        >
                          <Star className=" text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {session.user?.name?.split(" ")[0] || "User"}
                    </span>

                    <ChevronDown
                      className={`
                      w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform 
                    ${isProfileOpen ? "rotate-180" : ""}
                     `}
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
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={joinAsProvider}
                    className="bg-[#3C7DED] text-white hover:from-blue-700 hover:to-cyan-700 font-medium shadow-md"
                  >
                    Join as Provider
                  </Button>
                </>
              )}
              <div className="">
                <ThemeToggle />
              </div>
            </div>
          )}
          <div className=" md:hidden ml-50 ">
            <NotificationBell userId={Number(session?.user?.id)} />
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen((p) => !p)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
          >
            {isMenuOpen ? <X /> : <MenuIcon />}
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-[9999] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <Link
                    href="/"
                    className="flex items-center hover:opacity-90 transition-opacity"
                  >
                    <div>
                      <Image
                        src="/taskorialogonew.png"
                        alt="logo taskoria"
                        height={0}
                        width={23}
                      />
                    </div>
                    <span className="text-2xl font-bold bg-[#3C7DED] bg-clip-text text-transparent">
                      Taskoria
                    </span>
                  </Link>
                  <div className="pl-16  ">
                    <ThemeToggle />
                  </div>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {session && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div
                          className={`w-13 h-13 rounded-full flex items-center justify-center
      bg-gradient-to-br from-blue-100 to-cyan-100
      dark:from-blue-900 dark:to-cyan-900
      transition-all group-hover:scale-[1.05] overflow-hidden
      ${session?.user.status === "active" ? "ring-2 ring-yellow-400" : ""}`}
                        >
                          {session?.user?.image ? (
                            <Image
                              src={session.user.image}
                              alt="profile pic"
                              fill
                              className="object-cover rounded-full"
                              sizes="52px"
                              priority
                            />
                          ) : (
                            <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                          )}
                        </div>

                        {session?.user.status === "active" && (
                          <div
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                 bg-gradient-to-br from-yellow-400 to-orange-500
                 flex items-center justify-center
                 ring-2 ring-white dark:ring-slate-900 shadow-md"
                          >
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-gray-100 truncate text-lg">
                          {session.user?.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800 backdrop-blur-sm text-xs font-medium text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {viewMode === "provider"
                        ? "Provider View"
                        : "Customer View"}
                    </div>
                  </div>
                )}
              </div>

              <nav className="p-4 space-y-2">
                {currentLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
                {session?.user.adminrole === "admin" ? (
                  <Link
                    href="/adminbudgetmanager"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    Adminmenu
                  </Link>
                ) : (
                  ""
                )}

                {session?.user?.role === "provider" && (
                  <button
                    onClick={() =>
                      handleSwitchView(
                        viewMode === "provider" ? "customer" : "provider"
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 -rotate-90" />
                      <span>
                        Switch to{" "}
                        {viewMode === "provider" ? "Customer" : "Provider"}
                      </span>
                    </div>
                  </button>
                )}

                {/* <Link
                  href="/notifications"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                >
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  Notifications
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    23
                  </span>
                </Link> */}

                {session ? (
                  <>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 dark:border-gray-700 font-medium"
                      onClick={() => {
                        router.push("/signin");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={async () => {
                        await joinAsProvider();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-[#3C7DED] text-white hover:from-blue-700 hover:to-cyan-700 font-medium"
                    >
                      Join as Provider
                    </Button>
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
