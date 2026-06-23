import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Affiliate Admin | Taskoria`,
  description: `Review Taskoria affiliate accounts, referrals, and commission activity.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
