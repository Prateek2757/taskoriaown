"use client";

import {
  CheckCircle,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  Star,
  Shield,
  Clock,
  Sparkles,
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
        const list = { ordered: cur.tagName === "OL", items };
        (sub ? sub.lists : section.lists).push(list);
      }
      cur = cur.nextElementSibling;
    }
    if (sub) section.subsections.push(sub);
    sections.push(section);
  });

  return { title, intro, sections };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHAPE CLASSIFIER
   Chooses layout purely from content structure — no service-specific words.
   Works for cleaning, plumbing, tutoring, gardening, legal, anything.
───────────────────────────────────────────────────────────────────────────── */
type Layout =
  | "tiers"      // has h3 subsections
  | "steps"      // has an ordered list
  | "pricing"    // list items + cost/money signals in text
  | "warnings"   // list items skew negative/imperative
  | "checklist"  // plain list, medium-length items
  | "chips"      // very short list items (tags/services)
  | "split"      // paragraphs + list side by side
  | "accordion"  // many paragraphs, expandable
  | "prose";     // just paragraphs

const PRICE_RE = /\b(cost|price|pric|fee|rate|charg|quot|budget|\$|dollar|invest)\b/i;
const WARN_RE  = /^(don'?t|avoid|never|not |ensure|always|make sure|check|confirm|beware|watch)/i;

function classify(s: Section): Layout {
  const items  = s.lists.flatMap(l => l.items);
  const hasOL  = s.lists.some(l => l.ordered);
  const hasSub = s.subsections.length >= 2;
  const n      = items.length;
  const p      = s.paragraphs.length;

  if (hasSub) return "tiers";
  if (hasOL && n > 0) return "steps";

  if (n > 0) {
    const avgWords = items.reduce((sum, i) => sum + i.split(" ").length, 0) / n;
    const pricey   = PRICE_RE.test(s.heading) || s.paragraphs.some(x => PRICE_RE.test(x)) || items.some(x => PRICE_RE.test(x));
    const warnish  = items.filter(i => WARN_RE.test(i)).length > n * 0.3;

    if (pricey)       return "pricing";
    if (warnish)      return "warnings";
    if (avgWords <= 5) return "chips";
    if (p >= 1)       return "split";
    return "checklist";
  }

  if (p >= 3) return "accordion";
  return "prose";
}


const up = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.065, ease: [0.22, 1, 0.36, 1] },
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
      viewport={{ once: true, amount: 0.08 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


const ACCENT = [
  "text-blue-600 dark:text-blue-400 border-blue-200/70 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/50",
  "text-violet-600 dark:text-violet-400 border-violet-200/70 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-950/50",
  "text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/50",
  "text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/50",
  "text-rose-600 dark:text-rose-400 border-rose-200/70 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/50",
];

function Pill({ idx = 0, children }: { idx?: number; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold tracking-[0.22em] uppercase border px-4 py-1.5 rounded-full mb-3 ${ACCENT[idx % ACCENT.length]}`}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-1">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
    </div>
  );
}

function derivePill(heading: string, layout: Layout): string {
  const word1 = heading.split(" ")[0] ?? "";
  const pills: Record<Layout, string> = {
    tiers:     "Service Levels",
    steps:     "Process",
    pricing:   "Investment",
    warnings:  "Watch Out",
    checklist: "Coverage",
    chips:     "Quick Look",
    split:     word1,
    accordion: word1,
    prose:     word1,
  };
  return pills[layout] || word1;
}


function Hero({ title, intro }: { title: string; intro: string }) {
  if (!title && !intro) return null;
  return (
    <InView className="max-w-5xl mx-auto px-4 pt-6 pb-2 text-center">
      {title && (
        <motion.h1
          variants={up}
          custom={0}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-[1.12]"
        >
          {title}
        </motion.h1>
      )}
      {intro && (
        <motion.p
          variants={up}
          custom={1}
          className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          {intro}
        </motion.p>
      )}
    </InView>
  );
}



const TC = [
  { border: "border-blue-200 dark:border-blue-800/40",    icon: "text-blue-500",    badge: "bg-blue-50 dark:bg-blue-950/50 text-blue-600",    glow: "hover:shadow-blue-100/60" },
  { border: "border-violet-200 dark:border-violet-800/40", icon: "text-violet-500",  badge: "bg-violet-50 dark:bg-violet-950/50 text-violet-600", glow: "hover:shadow-violet-100/60" },
  { border: "border-emerald-200 dark:border-emerald-800/40",icon: "text-emerald-500",badge: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600",glow: "hover:shadow-emerald-100/60" },
  { border: "border-amber-200 dark:border-amber-800/40",  icon: "text-amber-500",   badge: "bg-amber-50 dark:bg-amber-950/50 text-amber-600",  glow: "hover:shadow-amber-100/60" },
];

function TiersLayout({ s, idx }: { s: Section; idx: number }) {
  const cols =
    s.subsections.length === 2 ? "sm:grid-cols-2" :
    s.subsections.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <div className="text-center mb-6">
        <Pill idx={idx}>{derivePill(s.heading, "tiers")}</Pill>
        <motion.h2 variants={up} custom={0} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{s.heading}</motion.h2>
        {s.paragraphs[0] && <motion.p variants={up} custom={0.5} className="text-[15px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-2 leading-relaxed">{s.paragraphs[0]}</motion.p>}
      </div>
      <div className={`grid ${cols} gap-4`}>
        {s.subsections.map((sub, si) => {
          const ac = TC[si % TC.length];
          const items = sub.lists.flatMap(l => l.items);
          return (
            <motion.div key={si} variants={up} custom={si + 1}
              className={`relative rounded-2xl p-5 bg-white dark:bg-white/[0.025] border ${ac.border} hover:shadow-xl ${ac.glow} hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}>
              <span aria-hidden className="absolute -right-2 -top-4 select-none text-[5rem] font-black leading-none text-gray-50 dark:text-white/[0.03]">{si + 1}</span>
              <span className={`inline-flex text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-3 ${ac.badge}`}>{sub.heading}</span>
              {sub.paragraphs.map((p, pi) => <p key={pi} className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{p}</p>)}
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${ac.icon}`} />
                    <span className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </InView>
  );
}

const SC = ["text-blue-500 border-blue-300","text-violet-500 border-violet-300","text-emerald-500 border-emerald-300","text-amber-500 border-amber-300","text-rose-500 border-rose-300"];
const SB = ["border-blue-100 dark:border-blue-900/30","border-violet-100 dark:border-violet-900/30","border-emerald-100 dark:border-emerald-900/30","border-amber-100 dark:border-amber-900/30","border-rose-100 dark:border-rose-900/30"];

function StepsLayout({ s, idx }: { s: Section; idx: number }) {
  const steps = s.lists.find(l => l.ordered)?.items ?? s.lists[0]?.items ?? [];
  const cols =
    steps.length <= 2 ? "sm:grid-cols-2 max-w-2xl" :
    steps.length === 3 ? "sm:grid-cols-3" :
    steps.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <div className="text-center mb-6">
        <Pill idx={idx}>{derivePill(s.heading, "steps")}</Pill>
        <motion.h2 variants={up} custom={0} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{s.heading}</motion.h2>
        {s.paragraphs[0] && <motion.p variants={up} custom={0.5} className="text-[15px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-2 leading-relaxed">{s.paragraphs[0]}</motion.p>}
      </div>
      <div className="hidden sm:flex items-center justify-center max-w-4xl mx-auto mb-4 px-4">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center flex-1 min-w-0">
            <div className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-950 ${SC[i % SC.length]}`}>
              <span className={`text-[11px] font-bold ${SC[i % SC.length].split(" ")[0]}`}>{i + 1}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 mx-1" />}
          </div>
        ))}
      </div>
      <div className={`grid ${cols} gap-4 mx-auto`}>
        {steps.map((step, i) => (
          <motion.article key={i} variants={up} custom={i}
            className={`relative rounded-2xl p-4 bg-white dark:bg-white/[0.025] border ${SB[i % SB.length]} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}>
            <span aria-hidden className="absolute -right-2 -top-3 select-none text-[5rem] font-black leading-none text-gray-50 dark:text-white/[0.025]">{i + 1}</span>
            <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">{step}</p>
          </motion.article>
        ))}
      </div>
    </InView>
  );
}

/* CHECKLIST */
function ChecklistLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap(l => l.items);
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <div className="text-center mb-5">
        <Pill idx={idx}>{derivePill(s.heading, "checklist")}</Pill>
        <motion.h2 variants={up} custom={0} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{s.heading}</motion.h2>
        {s.paragraphs[0] && <motion.p variants={up} custom={0.5} className="text-[15px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-2 leading-relaxed">{s.paragraphs[0]}</motion.p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <motion.div key={i} variants={up} custom={i}
            className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-white/[0.025] border border-gray-100 dark:border-white/[0.06] hover:border-blue-200/80 dark:hover:border-blue-800/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all duration-200">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
          </motion.div>
        ))}
      </div>
    </InView>
  );
}

/* WARNINGS */
function WarningsLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap(l => l.items);
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <div className="text-center mb-5">
        <Pill idx={idx}>{derivePill(s.heading, "warnings")}</Pill>
        <motion.h2 variants={up} custom={0} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{s.heading}</motion.h2>
        {s.paragraphs[0] && <motion.p variants={up} custom={0.5} className="text-[15px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-2 leading-relaxed">{s.paragraphs[0]}</motion.p>}
      </div>
      {s.paragraphs.slice(1).map((p, i) => (
        <motion.p key={i} variants={up} custom={i} className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-3">{p}</motion.p>
      ))}
      <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <motion.div key={i} variants={up} custom={i}
            className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-white/[0.025] border border-gray-100 dark:border-white/[0.06] hover:border-amber-200/70 dark:hover:border-amber-800/30 hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-all duration-200">
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
            </div>
            <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
          </motion.div>
        ))}
      </div>
    </InView>
  );
}

/* PRICING */
function PricingLayout({ s, idx }: { s: Section; idx: number }) {
  const factors = s.lists.flatMap(l => l.items);
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <div className="text-center mb-5">
        <Pill idx={idx}>{derivePill(s.heading, "pricing")}</Pill>
        <motion.h2 variants={up} custom={0} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{s.heading}</motion.h2>
        {s.paragraphs[0] && <motion.p variants={up} custom={0.5} className="text-[15px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-2 leading-relaxed">{s.paragraphs[0]}</motion.p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto mb-6">
        {factors.map((f, i) => (
          <motion.div key={i} variants={up} custom={i}
            className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-white/[0.025] border border-gray-100 dark:border-white/[0.06] hover:border-blue-200/80 dark:hover:border-blue-800/30 transition-all duration-200">
            <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{f}</span>
          </motion.div>
        ))}
      </div>
      {s.paragraphs.slice(1).map((p, i) => (
        <motion.p key={i} variants={up} custom={factors.length + i} className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-3">{p}</motion.p>
      ))}
      {/* <motion.div variants={up} custom={factors.length + 2}
        className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/[0.05]">
        {[
          { Icon: CheckCircle, label: "No Hidden Fees", cls: "text-blue-500" },
          { Icon: Star, label: "Vetted Professionals", cls: "text-amber-400 fill-amber-400" },
          { Icon: Shield, label: "Competitive Rates", cls: "text-blue-500" },
        ].map(({ Icon, label, cls }, i) => (
          <div key={i} className="flex items-center justify-center gap-2.5 px-8 py-4 flex-1">
            <Icon className={`w-4 h-4 flex-shrink-0 ${cls}`} />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">{label}</span>
          </div>
        ))}
      </motion.div> */}
    </InView>
  );
}

/* CHIPS */
function ChipsLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap(l => l.items);
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <div className="text-center mb-5">
        <Pill idx={idx}>{derivePill(s.heading, "chips")}</Pill>
        <motion.h2 variants={up} custom={0} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{s.heading}</motion.h2>
        {s.paragraphs[0] && <motion.p variants={up} custom={0.5} className="text-[15px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-2 leading-relaxed">{s.paragraphs[0]}</motion.p>}
      </div>
      <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
        {items.map((item, i) => (
          <motion.span key={i} variants={up} custom={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/[0.025] border border-gray-200 dark:border-white/[0.08] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-default transition-all duration-200 text-[13px] font-medium text-gray-700 dark:text-gray-300">
            <Sparkles className="w-3 h-3 text-blue-400" />
            {item}
          </motion.span>
        ))}
      </div>
    </InView>
  );
}

/* SPLIT */
function SplitLayout({ s, idx }: { s: Section; idx: number }) {
  const items = s.lists.flatMap(l => l.items);
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <motion.div variants={up} custom={0} className="mb-5">
        <Pill idx={idx}>{derivePill(s.heading, "split")}</Pill>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">{s.heading}</h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 gap-6">
        <motion.div variants={up} custom={1} className="space-y-3">
          {s.paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{p}</p>
          ))}
        </motion.div>
        {items.length > 0 && (
          <motion.div variants={up} custom={2}
            className="rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.025] p-5 space-y-2.5">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                <span className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </InView>
  );
}

/* ACCORDION */
function AccordionLayout({ s, idx }: { s: Section; idx: number }) {
  const [open, setOpen] = useState(false);
  const rest = s.paragraphs.slice(1);
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <motion.div variants={up} custom={0}
        className="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-white/[0.025] border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        <button onClick={() => setOpen(o => !o)}
          className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] transition-colors">
          <div className="flex-1">
            <Pill idx={idx}>{derivePill(s.heading, "accordion")}</Pill>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug mb-2">{s.heading}</h2>
            {s.paragraphs[0] && <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.paragraphs[0]}</p>}
          </div>
          {rest.length > 0 && (
            <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
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
              <div className="px-6 pb-5 space-y-3 border-t border-gray-100 dark:border-white/[0.05] pt-4">
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
  return (
    <InView className="max-w-5xl mx-auto px-4 py-5">
      <motion.div variants={up} custom={0} className="mb-4">
        <Pill idx={idx}>{derivePill(s.heading, "prose")}</Pill>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">{s.heading}</h2>
      </motion.div>
      <div className="max-w-3xl space-y-3">
        {s.paragraphs.map((p, i) => (
          <motion.p key={i} variants={up} custom={i + 1} className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{p}</motion.p>
        ))}
      </div>
    </InView>
  );
}


function SectionRouter({ section, idx }: { section: Section; idx: number }) {
  const layout = classify(section);
  const p = { s: section, idx };
  switch (layout) {
    case "tiers":     return <TiersLayout {...p} />;
    case "steps":     return <StepsLayout {...p} />;
    case "pricing":   return <PricingLayout {...p} />;
    case "warnings":  return <WarningsLayout {...p} />;
    case "checklist": return <ChecklistLayout {...p} />;
    case "chips":     return <ChipsLayout {...p} />;
    case "split":     return <SplitLayout {...p} />;
    case "accordion": return <AccordionLayout {...p} />;
    // case "prose":     return <ProseLayout {...p} />;
  }
}


export function ServiceDetailsSection({ serviceDetails }: { serviceDetails: string }) {
  const { title, intro, sections } = useMemo(() => parseHTML(serviceDetails), [serviceDetails]);
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