import type { Metadata } from "next";
import HowItWorksProviders from "../components/HowItWorksProvidersClient";
export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.taskoria.com/how-it-works/providers",
  },
};

export default function Page() {
  return <HowItWorksProviders />;
}