import type { Metadata } from "next";
import HowItWorksCustomers from "../components/HowItWorksCustomersClient";
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "How Taskoria Works for Customers | Get Free Quotes" },
  description:
    "Learn how customers use Taskoria to post a job, compare quotes from verified local professionals, and book the right provider.",
  alternates: {
    canonical: "https://www.taskoria.com/how-it-works/customers",
  },
};

export default function Page() {
  return <HowItWorksCustomers />;
}
