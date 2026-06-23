import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Contact Submissions Admin | Taskoria`,
  description: `Review and manage customer contact submissions sent to Taskoria support.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
