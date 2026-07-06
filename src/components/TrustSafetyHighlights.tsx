import Link from "next/link";
import { BadgeCheck, ShieldCheck, Star } from "lucide-react";

export default function TrustSafetyHighlights() {
  return (
    <section
      aria-label="Trust and safety highlights"
      className="relative border-y border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-[14px] text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>
              <span className="font-semibold">Background-checked</span>{" "}
              professionals
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-blue-600" />
            <span>Clear quotes</span>
          </div>

          <div className="flex items-center gap-2">
            <span>
              🇦🇺 <span className="font-semibold">Brisbane-first</span>,
              Australia-wide
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>
              <span className="font-semibold text-yellow-500">5.0</span> on
              Google Reviews
            </span>
          </div>

          <Link
            href="/trust-safety"
            className="flex items-center font-semibold text-[#2563EB] hover:underline"
          >
            Learn how Taskoria keeps you safe →
          </Link>
        </div>
      </div>
    </section>
  );
}
