import "../../globals.css";
import { UserProvider } from "@/context/userContext";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import NavbarServer from "@/components/navabr/NavbarServer";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import { Poppins, Bricolage_Grotesque } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import NotificationHandler from "@/components/NotificationHandler";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TaskoriaAgent from "@/components/TaskoriaAgent";
import Script from "next/script";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import WhatsAppSupportButton from "@/components/supportChatbox";
import ChatbotWidget from "@/components/ChatbotWidget";

export const BASE_URL = "https://www.taskoria.com";
export const SITE_NAME = "Taskoria";
export const LEGAL_NAME = "Taskoria Pty Ltd";
export const ABN = "37 658 760 831";
export const TWITTER_HANDLE = "@taskoria";
export const OG_IMAGE = `${BASE_URL}/og-image.png`;
export const LOGO = `${BASE_URL}/images/taskoria_logo.svg`;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-bricolage",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Find Trusted Local Professionals Across Australia | Taskoria",
    template: `%s | ${SITE_NAME}`,
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

  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

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
    title: "Find Trusted Local Professionals Across Australia | Taskoria",
    description:
      "Connect with verified Australian professionals for home, business, and digital services. AI-powered matching, transparent pricing, and secure payments.",
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
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
    images: [OG_IMAGE],
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  },

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
    apple: [{ url: LOGO, sizes: "140x140" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLEANALYTICS_MEASUREMENT_ID;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO,
        },
        taxID: `ABN ${ABN}`,
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+61 1300 531 727",
            contactType: "customer support",
            email: "contact@taskoria.com",
            areaServed: "AU",
            availableLanguage: ["en"],
          },
        ],
        sameAs: [
          "https://www.instagram.com/taskoria.au/",
          "https://www.tiktok.com/@taskoria",
          "https://x.com/taskoria",
          "https://www.linkedin.com/company/taskoria-au",
          "https://www.trustpilot.com/review/taskoria.com",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: SITE_NAME,
        url: BASE_URL,
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "en-AU",
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/services?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${bricolage.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <AuthProvider>
        <head>
          <link
            rel="stylesheet"
            href="https://www.gstatic.com/chat-messenger/sdk/prod/v1.16/themes/chat-messenger-default.css"
          />
          <Script id="clarity" strategy="afterInteractive">
            {`

    (function(c,l,a,r,i,t,y){

        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};

        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;

        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);

    })(window, document, "clarity", "script", "wylra8huxw");

  `}
          </Script>
        </head>
        <body className="antialiased dark:bg-black" suppressHydrationWarning>
          {GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `}
              </Script>
            </>
          )}

          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "b0381ce5a7494c56869a77d5b4d0623c"}'
            strategy="afterInteractive"
          />

          <NotificationHandler />
          <Script
            id="organization-jsonld"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Analytics />
            <UserProvider>
              <BreadcrumbJsonLd />
              <NavbarServer />
              <main>{children}</main>
              <SpeedInsights />
              <Toaster position="top-right" richColors expand closeButton />
              <Footer />
              <ChatbotWidget/>
              {/* <WhatsAppSupportButton/> */}
              {/* <TaskoriaAgent /> */}
            </UserProvider>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
