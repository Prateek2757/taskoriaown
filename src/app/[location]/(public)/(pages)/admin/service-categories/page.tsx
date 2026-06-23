import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Service Categories Admin | Taskoria`,
  description: `Create, edit, and organize Taskoria service categories, questions, FAQs, and category metadata.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
