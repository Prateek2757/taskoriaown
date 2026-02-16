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
import NotificationHandler from "@/components/NotificationHandler";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { i18n } from "../../../../i18n-config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

function getOGLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    'en': 'en_US',
    'en-au': 'en_AU',
    'en-gb': 'en_GB',
    'es': 'es_ES',
    'fr': 'fr_FR',
    'de': 'de_DE',
  };
  return localeMap[locale] || 'en_US';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location?: string }>;
}){

  const locale = (await params).location || i18n.defaultLocale;
  const baseUrl = "https://www.taskoria.com";

  const titles: Record<string, string> = {
    en: "Taskoria | Find Trusted Local Professionals for Any Job",
    "en-au": "Taskoria | Find Trusted Local Professionals for Any Job",
    es: "Taskoria | Encuentra Profesionales Locales de Confianza para Cualquier Trabajo",
  };

  const descriptions: Record<string, string> = {
    en: "Taskoria connects you with verified local professionals for home, business, and digital services. AI-powered matching, transparent pricing, and secure payments.",
    "en-au": "Taskoria connects you with verified local professionals for home, business, and digital services. AI-powered matching, transparent pricing, and secure payments.",
    es: "Taskoria te conecta con profesionales locales verificados para servicios domésticos, empresariales y digitales. Emparejamiento impulsado por IA, precios transparentes y pagos seguros.",
  };

  const title = titles[locale] || titles.en;
  const description = descriptions[locale] || descriptions.en;

  const languages: Record<string, string> = {};
  i18n.locales.forEach((loc) => {
    const localePath = loc === i18n.defaultLocale ? "" : `/${loc}`;
    languages[loc] = `${baseUrl}${localePath}`;
  });
  languages["x-default"] = baseUrl;

  const ogLocale = getOGLocale(locale);
  
  const alternateLocales = i18n.locales
    .filter((loc) => loc !== locale)
    .map(getOGLocale);

  return {
    metadataBase: new URL(baseUrl),
    title,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Taskoria",
    },
    formatDetection: {
      telephone: false,
    },
    description,
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
    authors: [{ name: "Taskoria", url: "https://wwww.taskoria.com" }],
    creator: "Taskoria",
    publisher: "Taskoria",
    
    alternates: {
      canonical: locale === i18n.defaultLocale ? "/" : `/${locale}`,
      languages,
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
      title,
      description,
      url: locale === i18n.defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      siteName: "Taskoria",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Taskoria - Service Providers",
        },
      ],
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: "Taskoria — Find Trusted Service Providers",
      description:
        "Discover and hire top service providers in your area across multiple categories with Taskoria.",
      images: [`${baseUrl}/og-image.png`],
      creator: "@Taskoria",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#8A2BE2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    location: locale,
  }));
}

export  default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ location?: string }>;
}>) {
  const locale = (await params).location || i18n.defaultLocale;

  return (
    <html 
      lang={locale} 
      className={`${poppins.variable}`} 
      suppressHydrationWarning
    >
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
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
            </UserProvider>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}