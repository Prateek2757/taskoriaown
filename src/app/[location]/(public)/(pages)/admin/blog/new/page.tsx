import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `New Blog Post | Taskoria Admin`,
  description: `Create a new Taskoria blog post with content, images, author details, and publishing settings.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
