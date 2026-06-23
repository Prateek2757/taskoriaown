import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Budget Manager Admin | Taskoria`,
  description: `Manage Taskoria task budgets, pricing rules, and budget-related admin workflows.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
