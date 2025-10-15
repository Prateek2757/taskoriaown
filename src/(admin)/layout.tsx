// // import { Geist, Geist_Mono } from "next/font/google";
// import { AppSidebar } from "@/components/app-sidebar";
// import Providers from "@/components/Providers";
// import { Separator } from "@/components/ui/separator";
// import {
// 	SidebarInset,
// 	SidebarProvider,
// 	SidebarTrigger,
// } from "@/components/ui/sidebar";
// // import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
// import CustomBreadcrumb from "./components/CustomBreadcrumb";
// import Footer from "./components/Footer";
// import { ThemeToggle } from "@/components/theme-toggle";

// // const geistSans = Geist({
// // 	variable: "--font-geist-sans",
// // 	subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// // 	variable: "--font-geist-mono",
// // 	subsets: ["latin"],
// // });

// export const metadata = {
// 	title: "Sun Life Insurance",
// 	description: "Sun Life Insurance",
// };

// export default function RootLayout({
// 	children,
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	return (
// 		<html lang="en" suppressHydrationWarning>
// 			<body
// 			// className={`${geistSans.variable} ${geistMono.variable} antialiased`}
// 			>
// 				<Providers>
// 					<SidebarProvider>
// 						<AppSidebar />
// 						<SidebarInset>
// 							<header className="z-50 sticky bg-background  top-0 border-b-1 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
// 								<div className="flex items-center gap-2 px-4">
// 									<SidebarTrigger className="-ml-1" />
// 									<Separator
// 										orientation="vertical"
// 										className="mr-2 data-[orientation=vertical]:h-4"
// 									/>
// 									<ThemeToggle />
// 									<CustomBreadcrumb />
// 								</div>
// 							</header>
// 							<div className="flex flex-1 flex-col gap-4 p-4">
// 								{children}
// 							</div>
// 						</SidebarInset>
// 					</SidebarProvider>
// 				</Providers>
// 				<Footer />
// 			</body>
// 		</html>
// 	);
// }
// src/app/(admin)/layout.tsx
// Comment out everything for now, or just a placeholder:

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>; // simple pass-through layout
  }