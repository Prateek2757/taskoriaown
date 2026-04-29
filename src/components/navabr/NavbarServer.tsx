
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ModernNavbar from "./Navbar";
import type { ViewMode } from "./types";

export default async function NavbarServer() {
  const cookieStore = await cookies();
  const initialViewMode =
    (cookieStore.get("taskoria_viewMode")?.value as ViewMode) ?? "customer";

  const session = await getServerSession(authOptions);

  return (
    <ModernNavbar
      initialViewMode={initialViewMode}
      initialSession={session}
    />
  );
}
