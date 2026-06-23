import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Taskoria Help Center | Customer & Provider Support",
    template: "%s | Taskoria Help Center",
  },
  description:
    "Find Taskoria support articles for accounts, quotes, leads, payments, refunds, reviews, safety, and platform policies.",
};

export default function HelpLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
