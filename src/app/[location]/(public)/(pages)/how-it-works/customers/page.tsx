import type { Metadata } from "next";
import HowItWorksCustomers from "../components/HowItWorksCustomersClient";
export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.taskoria.com/how-it-works/customers",
  },
};

export default function Page() {
  return <HowItWorksCustomers />;
}