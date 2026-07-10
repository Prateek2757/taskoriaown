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
        <section className="relative py-8 px-4 dark:from-slate-950 dark:to-slate-900 overflow-hidden">

            <div className="text-center mb-12">
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Booking a {serviceName.toLowerCase()} pro:{" "}
                    <br/>
                    <span className="text-[#2563EB] dark:text-blue-400">
                        Here's what to know...
                    </span>
                </h1>
            </div>

            {cards.length > 0 && (
                <div className="relative grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
                    {cards.map((card, i) => {
                        const Icon = ICONS[i % ICONS.length];
                        return (
                            <div
                                key={i}
                                className="flex gap-5 p-7 rounded-2xl bg-white dark:bg-slate-900
                                           shadow-[0_2px_20px_rgba(15,23,42,0.06)]
                                           dark:shadow-none dark:border dark:border-slate-800"
                            >
                                <div className="shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                                        <Icon className="w-7 h-7 text-[#2563EB] dark:text-blue-400" strokeWidth={1.75} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-md md:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            <div className="pointer-events-none absolute -top-10 right-0 w-64 h-64 rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-3xl" />
        </section>
    )
}