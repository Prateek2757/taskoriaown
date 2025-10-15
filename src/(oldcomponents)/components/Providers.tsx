"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/uiComponents/custom-toast/custom-toast";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class" // adds "class" to <html>
			defaultTheme="system" // system default
			enableSystem // respect OS setting
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<ToastProvider>{children}</ToastProvider>
				</SessionProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
