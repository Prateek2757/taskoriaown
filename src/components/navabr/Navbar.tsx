"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import PublicNavbar from "./publicNavbar";
import CustomerNavbar from "./customerNavbar";
import ProviderNavbar from "./providerNavbar";

export default function NavbarNew() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [role, setRole] = useState<"provider" | "customer" | null>(null);

  const minimalPages = ["/en/create", "/en/create-account", "/en/onboarding"];

  // Hide on minimal pages
  if (minimalPages.includes(pathname)) return null;

  // Load role
  useEffect(() => {
    if (!session) {
      setRole(null);
      sessionStorage.removeItem("viewRole");
      return;
    }
    const stored = sessionStorage.getItem("viewRole") as "provider" | "customer" | null;
    if (stored) setRole(stored);
    else {
      const roleFromSession = (session.user?.role as "provider" | "customer") || "customer";
      setRole(roleFromSession);
      sessionStorage.setItem("viewRole", roleFromSession);
    }
  }, [session]);

  // Loading state
  if (status === "loading") return null;

  // Decide which variant
  if (!session) return <PublicNavbar />;
  if (role === "provider") return <ProviderNavbar />;
  if (role === "customer") return <CustomerNavbar />;
  return <PublicNavbar />;
}