"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import type { Session } from "next-auth";
import {
  NAV_LINKS,
  type NavLink,
  type ViewMode,
} from "./types";


const ONE_YEAR = 60 * 60 * 24 * 365;

function isViewMode(value: unknown): value is ViewMode {
  return value === "customer" || value === "provider";
}

function setCookieViewMode(value: ViewMode) {
  document.cookie = `taskoria_viewMode=${value}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

function clearCookieViewMode() {
  document.cookie = "taskoria_viewMode=; path=/; max-age=0";
}

// ─────────────────────────────────────────────────────────────────────────────

interface UseNavStateOptions {
  /** Initial viewMode read from cookie by the server component — no flicker. */
  initialViewMode: ViewMode;
  /** Initial session read by the server component — no loading flash. */
  initialSession: Session | null;
}

export function useNavState({
  initialViewMode,
  initialSession,
}: UseNavStateOptions) {
  const { joinAsProvider } = useJoinAsProvider();


  const { data: session, status } = useSession();

  // Use live session when available, fall back to server-provided initial
  const activeSession = session ?? initialSession;
  const activeRole = activeSession?.user?.role;
  const hasActiveSession = !!activeSession;
  const isLoggedIn = status === "authenticated" || (status === "loading" && initialSession !== null);
  const isPro =
    activeSession?.user?.status === "active" ||
    activeSession?.user?.status === "trialing";

  const pathname = usePathname();
  const router = useRouter();

  // ── viewMode ─────────────────────────────────────────────────────────────────
  // Initialised from the server-read cookie — matches SSR output exactly.
  // No hasMounted guard needed: server & client agree from byte one.
  const [viewMode, setViewMode] = useState<ViewMode>(
    isViewMode(initialViewMode) ? initialViewMode : "customer"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ── Sync viewMode when session resolves or storage/cookie disagree ──────────
  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    const stored = localStorage.getItem("viewMode");
    const canUseProviderView = session.user.role === "provider";
    const defaultView: ViewMode = canUseProviderView ? "provider" : "customer";
    const nextView: ViewMode =
      isViewMode(stored) && (stored === "customer" || canUseProviderView)
        ? stored
        : defaultView;

    if (stored !== nextView) {
      localStorage.setItem("viewMode", nextView);
    }
    setCookieViewMode(nextView);
  }, [status, session]);

  // ── Cross-tab / cross-component viewMode sync ────────────────────────────────
  useEffect(() => {
    const update = () => {
      const stored = localStorage.getItem("viewMode");
      if (!isViewMode(stored)) return;
      const isKnownNonProvider = hasActiveSession && activeRole !== "provider";
      const nextView =
        stored === "provider" && isKnownNonProvider
          ? "customer"
          : stored;
      if (stored !== nextView) {
        localStorage.setItem("viewMode", nextView);
      }
      setCookieViewMode(nextView);
      setViewMode(nextView);
    };

    update();
    window.addEventListener("viewModeChanged", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("viewModeChanged", update);
      window.removeEventListener("storage", update);
    };
  }, [activeRole, hasActiveSession]);

  // ── Memoised current nav links ───────────────────────────────────────────────
  const currentLinks = useMemo<NavLink[]>(() => {
    if (!isLoggedIn) return NAV_LINKS.public;
    return viewMode === "provider" ? NAV_LINKS.provider : NAV_LINKS.customer;
  }, [isLoggedIn, viewMode]);

  // ── Stable handlers ──────────────────────────────────────────────────────────
  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    closeAll();
    await signOut({ redirect: false });
    if (typeof window !== "undefined") {
      localStorage.removeItem("viewMode");
      clearCookieViewMode();
    }
    setViewMode("provider");
    router.push("/signin");
  }, [closeAll, router]);

  const handleSwitchView = useCallback(
    (newView: ViewMode) => {
      setViewMode(newView);
      localStorage.setItem("viewMode", newView);
      setCookieViewMode(newView); // keeps cookie in sync for next server render
      window.dispatchEvent(new Event("viewModeChanged"));
      closeAll();
      router.push(
        newView === "provider" ? "/provider/dashboard" : "/customer/dashboard"
      );
    },
    [closeAll, router]
  );

  const handleJoinAsProvider = useCallback(async () => {
    await joinAsProvider();
    setIsMenuOpen(false);
  }, [joinAsProvider]);

  return {
    session: activeSession,
    status,
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
  };
}
