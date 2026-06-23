import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Blog Admin Editor | Taskoria`,
  description: `Manage Taskoria blog posts, publishing status, and article details.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
