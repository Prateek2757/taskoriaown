import type { Metadata } from "next";

import PageClient from "./page-client";

export const metadata: Metadata = {
  title: "Australian Locations Admin | Taskoria",
  description: "Manage popularity, images, and descriptions for Australian locations.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
