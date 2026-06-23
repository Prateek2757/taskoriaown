import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Provider Messages | Taskoria`,
  description: `Manage Taskoria conversations with customers about leads, quotes, and bookings.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
