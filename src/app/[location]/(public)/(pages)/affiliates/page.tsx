import type { Metadata } from "next";
import PageClient from "./page-client";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Taskoria Affiliate Program | Earn From Local Service Leads`,
  description: `Join the Taskoria affiliate program and earn commissions by referring customers who post verified local service jobs.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
