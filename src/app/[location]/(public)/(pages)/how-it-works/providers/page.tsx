import type { Metadata } from "next";
import HowItWorksProviders from "../components/HowItWorksProvidersClient";
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "How Taskoria Works for Providers | Win Local Jobs" },
  description:
    "See how Taskoria helps service providers receive local leads, send quotes, manage customer conversations, and grow their business.",
  alternates: {
    canonical: "https://www.taskoria.com/how-it-works/providers",
  },
};

export default function Page() {
  return <HowItWorksProviders />;
}
