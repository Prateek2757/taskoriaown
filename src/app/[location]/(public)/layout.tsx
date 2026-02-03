import type { Metadata } from "next";
import "../../globals.css";
import { UserProvider } from "@/context/userContext";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import ModernNavbar from "@/components/navabr/Navbar";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { useNotificationTitle } from "@/hooks/useNotificationTitle";
import NotificationHandler from "@/components/NotificationHandler";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.taskoria.com"),

  title: "Taskoria | Find Trusted Local Professionals for Any Job",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Taskoria",
  },
  formatDetection: {
    telephone: false,
  },
  description:
    "Taskoria connects you with verified local professionals for home, business, and digital services. AI-powered matching, transparent pricing, and secure payments.",
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
  openGraph: {
    title: "Taskoria | Find Trusted Local Professionals for Any Job",
    description:
      "Taskoria connects you with verified local professionals for home, business, and digital services. AI-powered matching, transparent pricing, and secure payments.",
    url: "https://taskoria.com",

    siteName: "Taskoria",
    images: [
      {
        url: "https://taskoria.com/og-image.png",
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
    images: ["https://taskoria.com/og-image.png"],
    creator: "@Taskoria",
  },
};

export const viewport: Viewport = {
  themeColor: "#8A2BE2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="48x48"
          type="image/x-icon"
        />

        <link
          rel="apple-touch-icon"
          sizes="140x140"
          href="/taskorialogonew.png"
        />
      </head>
      <AuthProvider>
        <body className="antialiased dark:bg-black ">
          <NotificationHandler />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Analytics />
            <UserProvider>
              <ModernNavbar />
              <main className=" ">{children}</main>
              <SpeedInsights />

              <Toaster position="top-right" richColors expand closeButton />
              <Footer />
            </UserProvider>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
