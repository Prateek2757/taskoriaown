import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Provider Signup | Taskoria`,
  description: `Complete your Taskoria provider signup with business details, services, and service areas.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
