import type { Metadata } from "next";
import PageClient from "./page-client";

type Props = {
  params: Promise<{ convoId: string }>;
};

export const metadata: Metadata = {
  title: `Messages | Taskoria`,
  description: `Read and reply to Taskoria conversations about jobs, quotes, and bookings.`,
  robots: { index: false, follow: false },
};

export default function Page({ params }: Props) {
  return <PageClient params={params} />;
}
