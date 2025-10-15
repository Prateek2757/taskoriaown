import Providers from "@/components/Providers";
// import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
// import Providers from "@/components/Providers";
// import '../../global.css';
// import bgImage from '../../../../public/images/bg.svg';
import bgImage from "../../../../public/images/bg.svg";
import logoImage from "../../../../public/images/logo.png";
import "../../globals.css";
import LanguageSwitcherAuth from "./languageSwitcherAuth";
import { ThemeToggle } from "@/components/theme-toggle";

// import

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

export const metadata = {
	title: "Sun Life Insurance | Login",
	description: "Sun Life Insurance",
};

export default async function LoginLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ lang: "en" | "ne" }>;
}>) {
	const { lang } = await params;
	// const dict = await getDictionary(lang);
	return (
		<html lang="en">
			<body
				suppressHydrationWarning
				// className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<div className="flex items-start md:items-center md:justify-center min-h-screen bg-white dark:bg-gray-600">
						<div className="absolute top-5 right-10 flex gap-2 align-middle">
							<LanguageSwitcherAuth />
							<ThemeToggle />
						</div>
						<div className="mt-5 md:mt-0 relative flex flex-col md:flex-row w-full max-w-4xl overflow-hidden bg-white dark:bg-gray-700 rounded-2xl shadow-lg mx-3 md:mx-0">
							<Image
								className="z-1 absolute left-0 top-0 w-full h-full object-cover opacity-20 md:opacity-100"
								src={bgImage}
								width={300}
								height={300}
								alt="bg-image"
							/>
							<div className="flex md:w-1/2 ">
								<div className="flex flex-col items-center justify-center w-full h-full">
									<div className="flex align-middle gap-2 ">
										<Image
											src={logoImage}
											alt=""
											width={120}
											height={64}
											className="mt-8 md:mt-0"
										/>
									</div>
								</div>
							</div>
							{children}
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
