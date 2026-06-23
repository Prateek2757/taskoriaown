import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Provider Dashboard | Taskoria`,
  description: `Manage your Taskoria provider profile, leads, reviews, and performance from one dashboard.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
