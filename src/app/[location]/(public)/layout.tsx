import "../../globals.css";
import { UserProvider } from "@/context/userContext";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import ModernNavbar from "@/components/navabr/Navbar";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import NotificationHandler from "@/components/NotificationHandler";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SupportChatbot from "@/components/supportChatbox";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const BASE_URL = "https://www.taskoria.com";


export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Taskoria | Find Trusted Local Professionals Across Australia",
    template: "%s | Taskoria",
  },

  description:
    "Taskoria connects Australians with verified local professionals for home, business, and digital services. Compare quotes, read real reviews, and book with confidence.",

  keywords: [
    "taskoria",
    "find professionals australia",
    "hire local experts australia",
    "home services australia",
    "professional services near me",
    "verified tradespeople australia",
    "get free quotes australia",
    "book local professionals",
    "house cleaning australia",
    "plumber australia",
    "electrician australia",
  ],

  authors: [{ name: "Taskoria", url: BASE_URL }],
  creator: "Taskoria",
  publisher: "Taskoria",

  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-AU": BASE_URL,
      "x-default": BASE_URL,
    },
  },

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
    title: "Taskoria | Find Trusted Local Professionals Across Australia",
    description:
      "Connect with verified Australian professionals for home, business, and digital services. AI-powered matching, transparent pricing, and secure payments.",
    url: BASE_URL,
    siteName: "Taskoria",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Taskoria – Find Trusted Local Professionals Across Australia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Taskoria | Trusted Local Professionals Across Australia",
    description:
      "Discover and hire verified professionals near you. Compare quotes, read reviews, and book instantly with Taskoria.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@taskoria",
    site: "@taskoria",
  },

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Taskoria",
  },
  formatDetection: {
    telephone: false,
  },


};


export const viewport: Viewport = {
  themeColor: "#8A2BE2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,   
  userScalable: true, 
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={poppins.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="140x140" href="/taskorialogonew.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Cormorant+Garamond:ital,wght@1,700&display=swap"
          rel="stylesheet"
        />

        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Taskoria",
              url: BASE_URL,
              logo: `${BASE_URL}/taskorialogonew.png`,
              description:
                "Taskoria connects Australians with verified local professionals for home, business, and digital services.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "AU",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: "English",
              },
              sameAs: [
                "https://www.facebook.com/taskoria",
                "https://twitter.com/taskoria",
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Taskoria",
              url: BASE_URL,
              inLanguage: "en-AU",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${BASE_URL}/services?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <AuthProvider>
        <body className="antialiased dark:bg-black">
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
              <main>{children}</main>
              <SpeedInsights />
              <Toaster position="top-right" richColors expand closeButton />
              <Footer />
              <SupportChatbot />
            </UserProvider>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}