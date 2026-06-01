import type { Metadata } from "next";
import CostGuides from "@/components/cost-guide/CostGuide";

export const metadata: Metadata = {
  title: "Cost Guides | Taskoria",
  description:
    "Browse Taskoria cost guides to compare common service prices and plan your next job with confidence.",
  alternates: {
    canonical: "https://www.taskoria.com/cost-guides",
  },
};

export default function CostPage() {
  return (
    <>
      <CostGuides />
    </>
  );
}
