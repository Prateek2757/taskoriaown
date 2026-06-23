import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: { absolute: "Taskoria Blog Redirect" },
  description:
    "Redirects to the Taskoria blog with local service tips, hiring guides, and cost advice.",
  robots: { index: false, follow: true },
};

export default function LegacyBlogPage() {
  permanentRedirect("/blog");
}
