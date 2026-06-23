import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "../../globals.css";
import AuthProvider from "@/context/AuthProvider";
import BlogNavbar from "@/components/Blog-Navbar";
import { ThemeProvider } from "next-themes";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Taskoria Blog | Local Services Tips & Hiring Guides",
    template: "%s | Taskoria Blog",
  },
  description:
    "Read Taskoria guides for hiring local professionals, comparing quotes, planning service projects, and understanding local service costs.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${poppins.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-white dark:bg-slate-950  text-gray-900"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BreadcrumbJsonLd />
          <BlogNavbar />
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
