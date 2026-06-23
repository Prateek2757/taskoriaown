import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Category Image Admin | Taskoria`,
  description: `Manage Taskoria service category images and visual assets.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
