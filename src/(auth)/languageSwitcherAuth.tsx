"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-changeLanguage";

export default function LanguageSwitcherAuth() {
    const { locale, updateLanguage } = useLanguage();

    const languages = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "ne", name: "नेपाली", flag: "🇳🇵" },
    ];

    const switchLanguage = (newLang: "en" | "ne") => {
        updateLanguage(newLang);
    };

    const currentLanguageData = languages.find((lang) => lang.code === locale);

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild suppressHydrationWarning>
                <Button variant="outline" size="sm" >
                    <Globe className="h-4 w-4 mr-2" />
                    {currentLanguageData?.flag} {currentLanguageData?.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" suppressHydrationWarning>
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => switchLanguage(language.code as "en" | "ne")}
                        className={locale === language.code ? "bg-gray-100" : ""}
                    >
                        {language.flag}
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}