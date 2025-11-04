import AuthProvider from "@/context/AuthProvider";

import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./admincomponents/app-sidebar";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html>
        <AuthProvider>
          <body>
            <SidebarProvider>
              <AppSidebar />
              <main>
                <SidebarTrigger />

                {children}
              </main>
            </SidebarProvider>
          </body>
        </AuthProvider>
      </html>
    </>
  );
}
