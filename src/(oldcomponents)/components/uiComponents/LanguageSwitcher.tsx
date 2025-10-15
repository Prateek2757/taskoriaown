"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
	currentLang: "en" | "ne";
}

export default function LanguageSwitcher({
	currentLang,
}: LanguageSwitcherProps) {
	const pathname = usePathname();
	const router = useRouter();

	const languages = [
		{ code: "en", name: "English", flag: "🇺🇸" },
		{ code: "ne", name: "नेपाली", flag: "🇳🇵" },
	];

	const switchLanguage = (newLang: string) => {
		const segments = pathname.split("/");
		segments[1] = newLang;
		const newPath = segments.join("/");
		router.push(newPath);
		localStorage.setItem("currentLanguage", newLang);
	};

	const currentLanguage = languages.find((lang) => lang.code === currentLang);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<Globe className="w-4 h-4 mr-2" />
					{currentLanguage?.flag} {currentLanguage?.name}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => switchLanguage(language.code)}
						className={currentLang === language.code ? "bg-gray-100" : ""}
					>
						<span className="mr-2">{language.flag}</span>
						{language.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
