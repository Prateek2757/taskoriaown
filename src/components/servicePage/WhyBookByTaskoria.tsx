
"use client"
import { useMemo } from "react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

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

function getListItemsFromHtml(html?: string): string[] {
    if (!html || typeof window === "undefined") return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const items = Array.from(doc.querySelectorAll("li"));

    return items
        .map((li) => li.textContent?.trim() ?? "")
        .filter((text) => text.length > 0);
}

export default function WhyBookByTaskoria({
    serviceName, serviceSlug, serviceDetail, seo_service_details
}: WhyBookByTaskoriaProps) {
    const cards = useMemo(
        () => getCardsFromHtml(seo_service_details),
        [seo_service_details]
    );

    const jobTypes = useMemo(
        () => getListItemsFromHtml(seo_service_details),
        [seo_service_details]
    );

    return (

        <section className="relative py-8 px-4 dark:from-slate-950 dark:to-slate-900 overflow-hidden">

            <div className="text-center mb-12">
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Booking a {serviceName.toLowerCase()} pro:{" "}
                    <br />
                    <span className="text-[#2563EB] dark:text-blue-400">
                        Here's what to know...
                    </span>
                </h1>
            </div>

            {cards.length > 0 && (
                <div className="relative grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="flex gap-5 p-7 rounded-2xl bg-white dark:bg-slate-900
                                       shadow-[0_2px_20px_rgba(15,23,42,0.06)]
                                       dark:shadow-none dark:border dark:border-slate-800"
                        >
                            <div className="shrink-0">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-[#2563EB]" strokeWidth={3} />
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
                    ))}
                </div>
            )}
            <div className="relative mt-8 py-4 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden">
                {jobTypes.length > 0 && (
                    <div className="relative max-w-6xl mx-auto">
                        <div className="flex justify-center mb-6">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#2563EB] shadow-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                                MOST REQUESTED
                            </span>
                        </div>
                        <div className="text-center mb-4">
                            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                                Popular {serviceName} Jobs
                                <br />

                                <span className="text-[#2563EB] dark:text-blue-400"> People Book on{" "}Taskoria</span>
                            </h2>
                        </div>
                        <p className="text-center text-slate-500 dark:text-slate-400 text-sm md:text-base mb-12">
                            Trusted {serviceName.toLowerCase()} services for every home and every occasion.
                        </p>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {jobTypes.map((item, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-2xl bg-white dark:bg-slate-900
                                   shadow-[0_2px_20px_rgba(15,23,42,0.06)]
                                   dark:shadow-none dark:border dark:border-slate-800"
                                >
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                                        {item}
                                    </h3>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>


        </section>
    )
}