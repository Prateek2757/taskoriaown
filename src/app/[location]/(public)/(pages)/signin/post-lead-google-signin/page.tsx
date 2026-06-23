import type { Metadata } from "next";
import PageClient from "./page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Continue Your Job Request | Taskoria`,
  description: `Finish signing in with Google and continue your Taskoria job request.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
