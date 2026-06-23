import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Admin Dashboard | Taskoria`,
  description: `Manage Taskoria users, providers, tasks, refunds, blog content, and platform operations.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
