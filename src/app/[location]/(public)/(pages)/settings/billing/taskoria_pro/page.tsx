import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Taskoria Pro Billing | Provider Subscription`,
  description: `Manage your Taskoria Pro subscription and review provider plan benefits.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
