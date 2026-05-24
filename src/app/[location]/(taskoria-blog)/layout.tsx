import { Poppins } from "next/font/google";
import "../../globals.css";
import AuthProvider from "@/context/AuthProvider";
import BlogNavbar from "@/components/Blog-Navbar";
import { ThemeProvider } from "next-themes";

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
    <html className={`${poppins.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-white dark:bg-slate-950  text-gray-900"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem> 
        <BlogNavbar />
        <AuthProvider>
          <main>{children}</main>
          
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
