import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Refunds Admin | Taskoria`,
  description: `Review refund requests, return evidence, and refund workflow status in Taskoria admin.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
