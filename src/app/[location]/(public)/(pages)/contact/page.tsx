import type { Metadata } from "next";
import ContactSupport from "./components/contact";

export const dynamic = "force-static";

const BASE_URL = "https://www.taskoria.com";

export const metadata: Metadata = {
  title: "Contact Taskoria — Customer Support & Service Help",
  description:
    "Contact Taskoria for customer support, provider help, service enquiries, account assistance, payment questions, and local services support across Australia.",

  keywords: [
    "Contact Taskoria",
    "Taskoria customer support",
    "Taskoria help centre",
    "local services support Australia",
    "service provider support",
    "customer service Taskoria",
    "Taskoria contact page",
    "home services help Australia",
    "Taskoria enquiries",
    "provider help Taskoria",
  ],

  alternates: {
    canonical: `${BASE_URL}/contact`,
  },

  openGraph: {
    title: "Contact Taskoria — Customer Support & Service Help",
    description:
      "Need help with Taskoria? Contact our support team for service enquiries, account help, provider support, payment questions, and local services assistance.",
    url: `${BASE_URL}/contact`,
    siteName: "Taskoria",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Contact Taskoria customer support",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Taskoria — Customer Support & Service Help",
    description:
      "Get help from Taskoria for customer support, provider enquiries, account assistance, and local services questions.",
    images: [`${BASE_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
  },

  authors: [{ name: "Taskoria Team" }],
  creator: "Taskoria",
  publisher: "Taskoria",
  metadataBase: new URL(BASE_URL),
};

export default function Page() {
  return <ContactSupport />;
}