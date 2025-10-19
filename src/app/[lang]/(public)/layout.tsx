import type { Metadata } from "next";

import "../../globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/userContext";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import NavbarNew from "@/components/navabr/Navbar";
import ModernNavbar from "@/components/navabr/Navbar";




export const metadata: Metadata = {
  title: "Taskoria",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={` antialiased`}
        >
          <UserProvider>
            {/* <Navbar /> */}
            <ModernNavbar/>
            {/* <NavbarNew/> */}
            {children}
            <Toaster position="top-right" richColors expand closeButton />
      
          </UserProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
