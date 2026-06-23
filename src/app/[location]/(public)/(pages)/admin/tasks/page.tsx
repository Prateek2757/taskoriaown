import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Tasks Admin | Taskoria`,
  description: `Review customer tasks, provider responses, budgets, and task activity in Taskoria admin.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
