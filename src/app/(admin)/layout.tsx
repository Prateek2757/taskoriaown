import { AppSidebar } from "@/components/admin/admin-sidebar";



export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html>
         
        <body>
      <AppSidebar/>

        </body>
      </html>
      {children}
    </>
  );
}
