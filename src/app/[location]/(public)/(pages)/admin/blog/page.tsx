import type { Metadata } from "next";
import PageClient from "./page-client";

export type { BlogPost } from "./page-client";

export const metadata: Metadata = {
  title: `Blog Admin | Taskoria`,
  description: `Manage Taskoria blog posts, categories, publishing status, and editorial workflow.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
