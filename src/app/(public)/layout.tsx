import type { Metadata } from "next";
import "../globals.css";
import { UserProvider } from "@/context/userContext";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import ModernNavbar from "@/components/navabr/Navbar";

export const metadata: Metadata = {
  title: "Taskoria — Find Trusted Service Providers",
  description:
    "Taskoria helps you discover top service providers across categories like Home, Professional, Creative, Technology, Health & Education. Connect, compare, and hire with confidence.",
  keywords: [
    "Taskoria",
    "service providers",
    "home services",
    "professional services",
    "creative services",
    "technology services",
    "health services",
    "education services",
    "hire experts",
    "find professionals",
  ],
  authors: [{ name: "Taskoria", url: "https://taskoria.com" }],
  creator: "Taskoria",
  publisher: "Taskoria",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  themeColor: "#8A2BE2",
  openGraph: {
    title: "Taskoria — Find Trusted Service Providers",
    description:
      "Discover and hire top service providers in your area across multiple categories with Taskoria.",
    url: "https://taskoria.com",
    siteName: "Taskoria",
    images: [
      {
        url: "https://taskoria.com/og-image.png", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "Taskoria - Service Providers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskoria — Find Trusted Service Providers",
    description:
      "Discover and hire top service providers in your area across multiple categories with Taskoria.",
    images: ["https://taskoria.com/og-image.png"], // replace with your OG image
    creator: "@Taskoria",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="antialiased">
          <UserProvider>
            <ModernNavbar />
            {children}
            <Toaster position="top-right" richColors expand closeButton />
          </UserProvider>
        </body>
      </AuthProvider>
    </html>
  );
}