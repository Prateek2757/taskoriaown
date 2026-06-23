import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "../../globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Affiliate Dashboard | Taskoria",
    template: "%s | Taskoria Affiliate Dashboard",
  },
  description:
    "Manage Taskoria affiliate referrals, commissions, payouts, resources, and performance reporting.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${poppins.variable}`}>
      <body
        className="min-h-screen bg-slate-100 dark:bg-slate-950"
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
