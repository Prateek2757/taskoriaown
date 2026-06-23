import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Post a Job | Choose a Service Category | Taskoria`,
  description: `Choose the service you need and start a free job request on Taskoria to receive quotes from verified local professionals.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
