"use client";

import {
  CheckCircle,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";


interface ContentList {
  ordered: boolean;
  items: string[];
}
interface Subsection {
  heading: string;
  paragraphs: string[];
  lists: ContentList[];
}
interface Section {
  id: string;
  heading: string;
  paragraphs: string[];
  lists: ContentList[];
  subsections: Subsection[];
}
interface ParsedContent {
  title: string;
  intro: string;
  sections: Section[];
}


function parseHTML(html: string): ParsedContent {
  const body = new DOMParser().parseFromString(html, "text/html").body;

  const title =
    body.querySelector("h1")?.textContent?.trim() ??
    body.querySelector("h2")?.textContent?.trim() ??
    "";

  let intro = "";
  const firstH2 = body.querySelector("h2");
  if (firstH2) {
    let sib = firstH2.previousElementSibling;
    while (sib) {
      if (sib.tagName === "P") { intro = sib.textContent?.trim() ?? ""; break; }
      sib = sib.previousElementSibling;
    }
  }
  if (!intro) intro = body.querySelector("p")?.textContent?.trim() ?? "";

  const sections: Section[] = [];
  const h2Els = Array.from(body.querySelectorAll("h2"));

  h2Els.forEach((h2, idx) => {
    const heading = h2.textContent?.trim() ?? "";
    if (!body.querySelector("h1") && idx === 0 && heading === title) return;

    const section: Section = {
      id: `s${idx}`,
      heading,
      paragraphs: [],
      lists: [],
      subsections: [],
    };
    let cur = h2.nextElementSibling;
    let sub: Subsection | null = null;

    while (cur && cur.tagName !== "H2") {
      if (cur.tagName === "H3") {
        if (sub) section.subsections.push(sub);
        sub = { heading: cur.textContent?.trim() ?? "", paragraphs: [], lists: [] };
      } else if (cur.tagName === "P") {
        const t = cur.textContent?.trim() ?? "";
        if (t) (sub ? sub.paragraphs : section.paragraphs).push(t);
      } else if (cur.tagName === "UL" || cur.tagName === "OL") {
        const items = Array.from(cur.querySelectorAll("li")).map(
          (li) => li.textContent?.trim() ?? ""
        );
        (sub ? sub.lists : section.lists).push({ ordered: cur.tagName === "OL", items });
      } else if (cur.tagName === "LI") {
        const items: string[] = [];
        while (cur && cur.tagName === "LI") {
          items.push(cur.textContent?.trim() ?? "");
          cur = cur.nextElementSibling;
        }
        if (items.length)
          (sub ? sub.lists : section.lists).push({ ordered: false, items });
        continue;
      }
      cur = cur.nextElementSibling;
    }
    if (sub) section.subsections.push(sub);
    sections.push(section);
  });

  return { title, intro, sections };
}


type Layout =
  | "tiers"
  | "steps"
  | "pricing"
  | "warnings"
  | "checklist"
  | "chips"
  | "prose-list"
  | "accordion"
  | "prose";

const PRICE_RE = /\b(cost|price|pric|fee|rate|charg|quot|budget|\$|dollar|invest)\b/i;
const WARN_RE  = /^(don'?t|avoid|never|not |ensure|always|make sure|check|confirm|beware|watch)/i;

function classify(s: Section): Layout {
  const items  = s.lists.flatMap((l) => l.items);
  const hasOL  = s.lists.some((l) => l.ordered);
  const hasSub = s.subsections.length >= 2;
  const n      = items.length;
  const p      = s.paragraphs.length;

  if (hasSub) return "tiers";
  if (hasOL && n > 0) return "steps";

  if (n > 0) {
    const avgWords = items.reduce((sum, i) => sum + i.split(" ").length, 0) / n;
    const pricey =
      PRICE_RE.test(s.heading) ||
      s.paragraphs.some((x) => PRICE_RE.test(x)) ||
      items.some((x) => PRICE_RE.test(x));
    const warnish = items.filter((i) => WARN_RE.test(i)).length > n * 0.3;

    if (pricey)        return "pricing";
    if (warnish)       return "warnings";
    if (avgWords <= 5) return "chips";
    if (p >= 1)        return "prose-list";
    return "checklist";
  }

  if (p >= 3) return "accordion";
  return "prose";
}


const up = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function InView({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.06 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


const PALETTE = [
  {
    pill:  "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40",
    icon:  "text-blue-500",
    card:  "hover:border-blue-300 dark:hover:border-blue-700/60",
    badge: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    bar:   "bg-blue-500",
  },
  {
    pill:  "text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-950/40",
    icon:  "text-violet-500",
    card:  "hover:border-violet-300 dark:hover:border-violet-700/60",
    badge: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
    bar:   "bg-violet-500",
  },
  {
    pill:  "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40",
    icon:  "text-emerald-500",
    card:  "hover:border-emerald-300 dark:hover:border-emerald-700/60",
    badge: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
    bar:   "bg-emerald-500",
  },
  {
    pill:  "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40",
    icon:  "text-amber-500",
    card:  "hover:border-amber-300 dark:hover:border-amber-700/60",
    badge: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
    bar:   "bg-amber-500",
  },
  {
    pill:  "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40",
    icon:  "text-rose-500",
    card:  "hover:border-rose-300 dark:hover:border-rose-700/60",
    badge: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
    bar:   "bg-rose-500",
  },
];

const PILL_LABELS: Record<Layout, string> = {
  tiers:        "Overview",
  steps:        "How It Works",
  pricing:      "Pricing",
  warnings:     "Important",
  checklist:    "What's Included",
  chips:        "Services",
  "prose-list": "Details",
  accordion:    "About",
  prose:        "About",
};


function Pill({ idx = 0, label }: { idx?: number; label: string }) {
  const p = PALETTE[idx % PALETTE.length];
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold tracking-[0.2em] uppercase border px-3.5 py-1.5 rounded-full ${p.pill}`}
    >
      {label}
    </span>
  );
}

function SectionHeader({
  heading,
  paragraphs = [],
  pill,
  idx = 0,
}: {
  heading: string;
  paragraphs?: string[];
  pill: string;
  idx?: number;
}) {
  return (
    <div className="text-center mb-8">
      <motion.div variants={up} custom={0}>
        <Pill idx={idx} label={pill} />
      </motion.div>
      <motion.h2
        variants={up}
        custom={0.6}
        className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug"
      >
        {heading}
      </motion.h2>
      {paragraphs.length > 0 && (
        <div className="mt-3 max-w-2xl mx-auto space-y-2">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={up}
              custom={i + 1}
              className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-2">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700/60 to-transparent" />
    </div>
  );
}


function Hero({ title, intro }: { title: string; intro: string }) {
  if (!title && !intro) return null;
  return (
    <InView className="max-w-4xl mx-auto px-4 pt-8 pb-4 text-center">
      {title && (
        <motion.h1
          variants={up}
          custom={0}
          className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-gray-900 dark:text-white leading-[1.12] mb-4"
        >
          {title}
        </motion.h1>
      )}
      {intro && (
        <motion.p
          variants={up}
          custom={1}
          className="text-base sm:text-[17px] text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          {intro}
        </motion.p>
      )}
    </InView>
  );
}


function TiersLayout({ s, idx }: { s: Section; idx: number }) {
  const cols =
    s.subsections.length === 2
      ? "sm:grid-cols-2"
      : s.subsections.length >= 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-3";

  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        heading={s.heading}
        paragraphs={s.paragraphs}
        pill={PILL_LABELS.tiers}
        idx={idx}
      />
      <div className={`grid grid-cols-1 ${cols} gap-5`}>
        {s.subsections.map((sub, si) => {
          const ac    = PALETTE[si % PALETTE.length];
          const items = sub.lists.flatMap((l) => l.items);
          return (
            <motion.div
              key={si}
              variants={up}
              custom={si + 1}
              className={`relative flex flex-col rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-6 hover:shadow-lg transition-all duration-300 overflow-hidden ${ac.card}`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${ac.bar} opacity-60 rounded-t-2xl`} />
              <span
                className={`self-start text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4 ${ac.badge}`}
              >
                {sub.heading}
              </span>
              {sub.paragraphs.map((p, pi) => (
                <p key={pi} className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{p}</p>
              ))}
              {items.length > 0 && (
                <ul className="space-y-2.5 mt-auto pt-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${ac.icon}`} />
                      <span className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          );
        })}
      </div>
    </InView>
  );
}


function StepsLayout({ s, idx }: { s: Section; idx: number }) {
  const steps =
    s.lists.find((l) => l.ordered)?.items ?? s.lists[0]?.items ?? [];
  const cols =
    steps.length <= 2
      ? "sm:grid-cols-2"
      : steps.length === 3
        ? "sm:grid-cols-3"
        : steps.length === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        heading={s.heading}
        paragraphs={s.paragraphs}
        pill={PILL_LABELS.steps}
        idx={idx}
      />
      <div className="hidden sm:flex items-center max-w-4xl mx-auto mb-6 px-2">
        {steps.map((_, i) => {
          const ac = PALETTE[i % PALETTE.length];
          return (
            <div key={i} className="flex items-center flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-950 border-current ${ac.icon}`}
              >
                <span className={`text-[11px] font-bold ${ac.icon}`}>{i + 1}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800 mx-1" />
              )}
            </div>
          );
        })}
      </div>
      <div className={`grid grid-cols-1 ${cols} gap-4`}>
        {steps.map((step, i) => {
          const ac = PALETTE[i % PALETTE.length];
          return (
            <motion.div
              key={i}
              variants={up}
              custom={i}
              className={`relative rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-md transition-all duration-300 overflow-hidden ${ac.card}`}
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${ac.bar} opacity-50`} />
              {/* mobile step number */}
              <div
                className={`sm:hidden w-7 h-7 rounded-full border-2 flex items-center justify-center mb-3 border-current ${ac.icon}`}
              >
                <span className={`text-[11px] font-bold ${ac.icon}`}>{i + 1}</span>
              </div>
              <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{step}</p>
            </motion.div>
          );
        })}
      </div>
    </InView>
  );
}


function ChecklistLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap((l) => l.items);
  const ac    = PALETTE[idx % PALETTE.length];
  const cols  = items.length > 6 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        heading={s.heading}
        paragraphs={s.paragraphs}
        pill={PILL_LABELS.checklist}
        idx={idx}
      />
      <div className={`grid grid-cols-1 ${cols} gap-3`}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={up}
            custom={i}
            className={`flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] transition-all duration-200 ${ac.card}`}
          >
            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${ac.icon}`} />
            <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
          </motion.div>
        ))}
      </div>
    </InView>
  );
}


function WarningsLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap((l) => l.items);
  const cols  = "sm:grid-cols-2";

  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        heading={s.heading}
        paragraphs={s.paragraphs}
        pill={PILL_LABELS.warnings}
        idx={idx}
      />
      <div className={`grid grid-cols-1 ${cols} gap-3`}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={up}
            custom={i}
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:border-amber-200 dark:hover:border-amber-800/40 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-all duration-200"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center flex-shrink-0 mt-0.5 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
          </motion.div>
        ))}
      </div>
    </InView>
  );
}


function PricingLayout({ s, idx }: { s: Section; idx: number }) {
  const items         = s.lists.flatMap((l) => l.items);
  const introParagraph = s.paragraphs.slice(0, 1);
  const outroParagraphs = s.paragraphs.slice(1);
  const cols = items.length > 4 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        heading={s.heading}
        paragraphs={introParagraph}
        pill={PILL_LABELS.pricing}
        idx={idx}
      />
      <div className={`grid grid-cols-1 ${cols} gap-3 mb-6`}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={up}
            custom={i}
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:border-blue-200 dark:hover:border-blue-800/40 transition-all duration-200"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center flex-shrink-0 mt-0.5 shrink-0">
              <DollarSign className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
          </motion.div>
        ))}
      </div>
      {outroParagraphs.length > 0 && (
        <div className="max-w-2xl mx-auto text-center space-y-2">
          {outroParagraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={up}
              custom={items.length + i}
              className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>
      )}
    </InView>
  );
}


function ChipsLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap((l) => l.items);
  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        heading={s.heading}
        paragraphs={s.paragraphs}
        pill={PILL_LABELS.chips}
        idx={idx}
      />
      <div className="flex flex-wrap gap-2.5 justify-center">
        {items.map((item, i) => (
          <motion.span
            key={i}
            variants={up}
            custom={i}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] hover:border-blue-300 dark:hover:border-blue-700/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 cursor-default transition-all duration-200 text-[13px] font-medium text-gray-700 dark:text-gray-300"
          >
            <Sparkles className="w-3 h-3 text-blue-400 flex-shrink-0" />
            {item}
          </motion.span>
        ))}
      </div>
    </InView>
  );
}


function ProseListLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap((l) => l.items);
  const ac    = PALETTE[idx % PALETTE.length];
  const cols  = items.length > 6 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <SectionHeader
        heading={s.heading}
        paragraphs={s.paragraphs}
        pill={PILL_LABELS["prose-list"]}
        idx={idx}
      />
      {items.length > 0 && (
        <div className={`grid grid-cols-1 ${cols} gap-3`}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={up}
              custom={i}
              className={`flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] transition-all duration-200 ${ac.card}`}
            >
              <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${ac.icon}`} />
              <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
            </motion.div>
          ))}
        </div>
      )}
    </InView>
  );
}


function AccordionLayout({ s, idx }: { s: Section; idx: number }) {
  const [open, setOpen] = useState(false);
  const ac   = PALETTE[idx % PALETTE.length];
  const rest = s.paragraphs.slice(1);

  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        variants={up}
        custom={0}
        className="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] overflow-hidden"
      >
        <div className={`h-1 ${ac.bar} opacity-60`} />
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full text-left px-6 py-6 flex items-start gap-4 hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <Pill idx={idx} label={PILL_LABELS.accordion} />
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
              {s.heading}
            </h2>
            {s.paragraphs[0] && (
              <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {s.paragraphs[0]}
              </p>
            )}
          </div>
          {rest.length > 0 && (
            <ChevronDown
              className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>
        <AnimatePresence initial={false}>
          {open && rest.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-4 space-y-3 border-t border-gray-100 dark:border-white/[0.05]">
                {rest.map((p, i) => (
                  <p key={i} className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{p}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </InView>
  );
}


function ProseLayout({ s, idx }: { s: Section; idx: number }) {
  const ac = PALETTE[idx % PALETTE.length];
  return (
    <InView className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        variants={up}
        custom={0}
        className="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] overflow-hidden"
      >
        <div className={`h-1 ${ac.bar} opacity-60`} />
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
              <BookOpen className={`w-4 h-4 ${ac.icon}`} />
            </div>
            <Pill idx={idx} label={PILL_LABELS.prose} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug mb-4">
            {s.heading}
          </h2>
          <div className="space-y-3">
            {s.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                variants={up}
                custom={i + 1}
                className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>
    </InView>
  );
}


function SectionRouter({ section, idx }: { section: Section; idx: number }) {
  const layout = classify(section);
  const p = { s: section, idx };
  switch (layout) {
    case "tiers":      return <TiersLayout {...p} />;
    case "steps":      return <StepsLayout {...p} />;
    case "pricing":    return <PricingLayout {...p} />;
    case "warnings":   return <WarningsLayout {...p} />;
    case "checklist":  return <ChecklistLayout {...p} />;
    case "chips":      return <ChipsLayout {...p} />;
    case "prose-list": return <ProseListLayout {...p} />;
    case "accordion":  return <AccordionLayout {...p} />;
    case "prose":      return <ProseLayout {...p} />;
  }
}

/* ─── ROOT ───────────────────────────────────────────────────────────────────── */

export function ServiceDetailsSection({ serviceDetails }: { serviceDetails: string }) {
  const { title, intro, sections } = useMemo(
    () => parseHTML(serviceDetails),
    [serviceDetails]
  );
  if (!sections.length && !title) return null;

  return (
    <div className="w-full">
      <Hero title={title} intro={intro} />
      {sections.map((section, i) => (
        <div key={section.id}>
          {i > 0 && <Divider />}
          <SectionRouter section={section} idx={i} />
        </div>
      ))}
    </div>
  );
}

export default function Howitwork({ servicedetails }: { servicedetails: string }) {
  return <ServiceDetailsSection serviceDetails={servicedetails} />;
}