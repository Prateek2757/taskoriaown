import "../../globals.css";

import type { Metadata, Viewport } from "next";
import { Poppins, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";

import { UserProvider } from "@/context/userContext";
import AuthProvider from "@/context/AuthProvider";

import NavbarServer from "@/components/navabr/NavbarServer";
import Footer from "@/components/Footer";
import NotificationHandler from "@/components/NotificationHandler";
import WhatsAppSupportButton from "@/components/supportChatbox";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";



export const BASE_URL = "https://www.taskoria.com";
export const SITE_NAME = "Taskoria";
export const LEGAL_NAME = "Taskoria Pty Ltd";
export const ABN = "37 658 760 831";

export const TWITTER_HANDLE = "@taskoria";

export const OG_IMAGE = `${BASE_URL}/og-image.png`;
export const LOGO = `${BASE_URL}/taskorialogonew.png`;


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

  applicationName: SITE_NAME,

  title: {
    absolute: "Taskoria | Find Trusted Local Professionals Across Australia"
  },

  description:
    "Find trusted local professionals across Australia with Taskoria. Compare quotes and connect with professionals for home, trade, business and digital services.",

  keywords: [
    "Taskoria",
    "local professionals Australia",
    "tradies Australia",
    "home services Australia",
    "professional services Australia",
    "plumbers Australia",
    "electricians Australia",
    "cleaners Australia",
    "local service marketplace",
    "compare quotes Australia",
  ],

  authors: [
    {
      name: SITE_NAME,
      url: BASE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  category: "Business",

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
    type: "website",
    locale: "en_AU",

    url: BASE_URL,
    siteName: SITE_NAME,

    title: "Taskoria | Find Trusted Local Professionals Across Australia",

    description:
      "Find trusted local professionals across Australia. Compare quotes and connect with professionals for home, trade, business and digital services.",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Taskoria - Find Trusted Local Professionals Across Australia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Taskoria | Find Trusted Local Professionals Across Australia",

    description:
      "Find and compare trusted local professionals across Australia with Taskoria.",

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
    icon: [
      {
        url: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID =
    process.env.NEXT_PUBLIC_GOOGLEANALYTICS_MEASUREMENT_ID;

  return (
    <html
      lang="en-AU"
      className={`${poppins.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <head>
      
        <Script
          src="/api/runtime-config.js"
          strategy="beforeInteractive"
        />

      
        <script
          async
          src="https://news.google.com/swg/js/v1/publisher.js"
        />
      </head>

      <body
        className="antialiased dark:bg-black"
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
             

              {GA_ID ? (
                <>
                  <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="afterInteractive"
                  />

                  <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                  >
                    {`
                      window.dataLayer = window.dataLayer || [];

                      function gtag() {
                        window.dataLayer.push(arguments);
                      }

                      gtag('js', new Date());

                      gtag('config', '${GA_ID}', {
                        anonymize_ip: true
                      });
                    `}
                  </Script>
                </>
              ) : null}

            

              <Script
                id="microsoft-clarity"
                strategy="afterInteractive"
              >
                {`
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){
                      (c[a].q=c[a].q||[]).push(arguments)
                    };

                    t=l.createElement(r);
                    t.async=1;
                    t.src="https://www.clarity.ms/tag/"+i;

                    y=l.getElementsByTagName(r)[0];
                    y.parentNode.insertBefore(t,y);

                  })(window, document, "clarity", "script", "wylra8huxw");
                `}
              </Script>


              <Script
                src="https://static.cloudflareinsights.com/beacon.min.js"
                data-cf-beacon='{"token":"b0381ce5a7494c56869a77d5b4d0623c"}'
                strategy="afterInteractive"
              />


              <NotificationHandler />

              <Analytics />

              <NavbarServer />

              {/*
                IMPORTANT:

                There is intentionally NO <main> here.

                Every route should own its own <main> element.
                This prevents:

                <main>
                  <main>...</main>
                </main>
              */}

              {children}

              <Footer currentYear={new Date().getFullYear()} />

              <WhatsAppSupportButton />

              <Toaster
                position="top-right"
                richColors
                expand
                closeButton
              />

              <SpeedInsights />
            </UserProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}