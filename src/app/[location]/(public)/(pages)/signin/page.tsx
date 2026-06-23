import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Sign In to Taskoria`,
  description: `Sign in to Taskoria to manage jobs, quotes, messages, provider leads, and account settings.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
