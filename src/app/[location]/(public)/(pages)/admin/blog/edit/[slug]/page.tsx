import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Edit Blog Post | Taskoria Admin`,
  description: `Edit Taskoria blog post content, SEO fields, images, and publishing settings.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
