import TrustSafety from "@/components/Trust&safety/trust-safety";

export const metadata = {
  title: "Trust & Safety | Taskoria",
  description:
    "Taskoria ensures safe hiring with verified providers, secure payments, and dispute protection.",
  alternates: {
    canonical: "https://www.taskoria.com/trust-safety",
  },
  openGraph: {
    title: "Trust & Safety | Taskoria",
    description:
      "Verified providers, secure payments, and protection for every job.",
    url: "https://www.taskoria.com/trust-safety",
  },
};

export default function Page() {
  return <TrustSafety />;
}