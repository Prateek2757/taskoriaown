import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Customer Dashboard | Taskoria`,
  description: `View your Taskoria job requests, manage quotes, and continue conversations with local professionals.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
