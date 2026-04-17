"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, Search, ArrowUpRight, Zap, Users } from "lucide-react";
import { Fraunces, Sora } from "next/font/google";
 const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

 const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});
export default function ProvidersGrid({ providers }: { providers: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? providers.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.company_name?.toLowerCase().includes(search.toLowerCase())
      )
    : providers;

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.8)
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    if (rating >= 4.5)
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    return "text-sky-500 bg-sky-500/10 border-sky-500/20";
  };

  return (
    <section className="min-h-screen bg-background text-foreground transition-colors">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;1,700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body    { font-family: 'Sora', sans-serif; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .card-enter { animation: fadeUp 0.45s cubic-bezier(.25,.46,.45,.94) both; }
      `}</style>

      <div className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]" />
          <div className="absolute -top-16 right-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px]" />

          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)
            `,
              backgroundSize: "55px 55px",
            }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 opacity-50 pointer-events-none dark:opacity-20 hidden dark:block"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
              backgroundSize: "55px 55px",
            }}
            aria-hidden="true"
          />

          {/* <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          /> */}
        </div>

        <div className={` font-body  relative mx-auto max-w-6xl px-6 py-10`}>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            <Zap className="h-3 w-3" />
            Verified Professionals
          </span>

          <h1
            className={` font-display mb-3 text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl`}
          >
            Find{" "}
            <span className="italic text-amber-500 dark:text-amber-400">
              elite
            </span>
            <br className="hidden sm:block" />
            service providers
          </h1>

          <p className="mb-7 max-w-md text-[15px] font-light leading-relaxed text-muted-foreground">
            Hand-picked professionals ready to take your project to the next
            level. Rated, reviewed, and ready to work.
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-beween">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5">
                <Users className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">
                  {providers.length}
                </span>
                <span className="text-xs text-muted-foreground">providers</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-semibold">4.8+</span>
                <span className="text-xs text-muted-foreground">
                  avg rating
                </span>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search providers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background py-3 pl-11 pr-5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:w-72"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={` font-body mx-auto max-w-6xl px-6 py-10`}>
        {filtered.length > 0 ? (
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => {
              const rating = Number(p.rating) || 4.7;

              return (
                <li
                  key={p.public_id}
                  className="card-enter"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="relative flex flex-col gap-4 p-3">
                      <div className="flex items-start justify-between">
                        <div className="relative flex gap-3">
                          {p.cover_image ? (
                            <Image
                            title="Provider List Photo"
                              src={p.cover_image}
                              alt={p.company_name}
                              width={56}
                              height={56}
                              className="h-14 w-14 rounded-xl object-cover border border-border"
                            />
                          ) : (
                            <div className="h-14 w-14 shrink-0 rounded-xl bg-linear-to-br from-blue-600 via-blue-400 to-[#2536EB] text-white grid place-content-center font-semibold uppercase">
                              {p.company_name
                                ?.split(" ")
                                .map((w: string) => w[0])
                                .join("")}
                            </div>
                          )}

                          <div>
                            <h2 className="text-base font-semibold">
                              {p.company_name}
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                              {p.services?.length > 0
                                ? `${p.services.slice(0, 2).join(" · ")}${
                                    p.services.length > 2
                                      ? ` +${p.services.length - 2}`
                                      : ""
                                  }`
                                : "No services listed"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {/* <span className="text-sm font-semibold">
                            ${p.hourly_rate}
                            <span className="text-xs text-muted-foreground">
                              /hr
                            </span>
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${getRatingBadge(
                              rating
                            )}`}
                          >
                            <Star className="h-3 w-3 fill-current" />
                            {rating}
                          </span> */}
                          <span className="text-xs text-muted-foreground">
                            Available
                          </span>
                          {/* <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold text-amber-600 border-amber-200">
                            Responds in ~1 hr
                          </span> */}
                        </div>
                      </div>

                      {/* Info */}
                      {/* <div>
                        <h2 className="text-base font-semibold">
                          {p.company_name}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {p.services?.length > 0
                            ? `${p.services.slice(0, 2).join(" · ")}${
                                p.services.length > 2
                                  ? ` +${p.services.length - 2}`
                                  : ""
                              }`
                            : "No services listed"}
                        </p>
                      </div> */}

                      {p.badges?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {p.badges.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border bg-muted px-3 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="h-px w-full bg-border" />

                      <Link
                        href={`/providerprofile/${encodeURIComponent(p.company_slug)}`}
                        className="group flex items-center justify-between rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-amber-500/10 hover:text-amber-500 hover:scale-105 hover:border-amber-500/30"
                      >
                        <span>View Profile</span>

                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <Search className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No providers match{" "}
              <span className="font-semibold">"{search}"</span>
            </p>
            <button
              onClick={() => setSearch("")}
              className="rounded-full border border-border px-5 py-2 text-xs hover:bg-muted"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
