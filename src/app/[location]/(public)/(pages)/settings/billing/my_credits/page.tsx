import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `My Credits | Taskoria Billing`,
  description: `Buy and manage Taskoria provider credits used to respond to customer leads.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
