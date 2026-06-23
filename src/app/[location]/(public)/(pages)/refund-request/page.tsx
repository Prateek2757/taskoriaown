import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Request a Refund or Credit Return | Taskoria`,
  description: `Submit a Taskoria refund or credit return request with the details our support team needs to review it.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
