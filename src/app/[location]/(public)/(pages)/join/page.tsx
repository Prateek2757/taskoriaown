import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Join Taskoria as a Provider`,
  description: `Create or connect your Taskoria provider account and start receiving local service leads.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
