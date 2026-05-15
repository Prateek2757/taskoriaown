import { Poppins } from "next/font/google";
import "../../globals.css";
import AuthProvider from "@/context/AuthProvider";
import BlogNavbar from "@/components/Blog-Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

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
        {" "}
        <BlogNavbar />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
