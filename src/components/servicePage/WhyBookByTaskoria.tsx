
"use client"
import { useMemo } from "react";
import { ShieldCheck, Clock, FileText, MapPin } from "lucide-react";

interface WhyBookByTaskoriaProps {
    serviceName: string;
    serviceSlug?: string;
    serviceDetail?: string;
    seo_service_details?: string;
}

interface InfoCard {
    title: string;
    description: string;
}

const ICONS = [ShieldCheck, Clock, FileText, MapPin];

function getCardsFromHtml(html?: string): InfoCard[] {
    if (!html || typeof window === "undefined") return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const headings = Array.from(doc.querySelectorAll("h3"));

    return headings
        .map((heading) => {
            const paragraph = heading.nextElementSibling;
            if (paragraph?.tagName !== "P") return null;
            return {
                title: heading.textContent?.trim() ?? "",
                description: paragraph.textContent?.trim() ?? "",
            };
        })
        .filter((c): c is InfoCard => c !== null);
}

export default function WhyBookByTaskoria({
    serviceName, serviceSlug, serviceDetail, seo_service_details
}: WhyBookByTaskoriaProps) {
    const cards = useMemo(
        () => getCardsFromHtml(seo_service_details),
        [seo_service_details]
    );

    return (
        <section>
            <div className="text-center mb-10">
                <h1 className="text-2xl text-center md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white py-4">
                    Booking a {serviceName.toLowerCase()} pro:{" "}
                    <span className="text-[#2563EB] dark:text-blue-400">
                        Here's What to Know
                    </span>
                </h1>
            </div>

            {cards.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
                    {cards.map((card, i) => {
                        const Icon = ICONS[i % ICONS.length];
                        return (
                            <div
                                key={i}
                                className="flex gap-4 p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg"
                            >
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    )
}