import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Taskoria Pricing | Provider Plans and Credits`,
  description: `Compare Taskoria provider pricing, credit options, and subscription benefits for winning more local service jobs.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
