import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Affiliate Dashboard Portal | Taskoria`,
  description: `Track Taskoria affiliate referrals, commissions, payouts, analytics, and marketing resources from your dashboard.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
