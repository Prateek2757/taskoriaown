import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Commissions Admin | Taskoria`,
  description: `Review and manage Taskoria provider commissions and commission status.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
