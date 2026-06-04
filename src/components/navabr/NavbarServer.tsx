
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ModernNavbar from "./Navbar";
import type { ViewMode } from "./types";

function isViewMode(value: unknown): value is ViewMode {
  return value === "customer" || value === "provider";
}

export default async function NavbarServer() {
  const cookieStore = await cookies();
  const session = await getServerSession(authOptions);
  const cookieViewMode = cookieStore.get("taskoria_viewMode")?.value;
  const canUseProviderView = session?.user?.role === "provider";
  const defaultViewMode: ViewMode =
    canUseProviderView ? "provider" : "customer";
  const canUseCookieViewMode =
    isViewMode(cookieViewMode) &&
    (cookieViewMode === "customer" || canUseProviderView);
  const initialViewMode = canUseCookieViewMode
    ? cookieViewMode
    : defaultViewMode;

  return (
    <ModernNavbar
      initialViewMode={initialViewMode}
      initialSession={session}
    />
  );
}
