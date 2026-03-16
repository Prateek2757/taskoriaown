"use client";

import { CheckCircle, DollarSign, Lightbulb, Star } from "lucide-react";
import { AnimatedBeam, Circle } from "../ui/animated-beam";
import { useRef } from "react";
import { motion } from "motion/react";


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ duration: 0.5 }}
      className={`py-5 ${className}`}
    >
      {children}
    </motion.section>
  );
}


function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-1 text-center">
      <motion.span
        variants={fadeUp}
        transition={{ duration: 0.45 }}
        className="
          inline-flex items-center mb-
          text-[10px] font-bold tracking-[0.22em] uppercase
          text-blue-600 dark:text-blue-400
          border border-blue-200/70 dark:border-blue-800/60
          bg-blue-50 dark:bg-blue-950/50
          px-4 py-1.5 rounded-full
        "
      >
        {label}
      </motion.span>

      <motion.h2
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="
          block text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15]
          text-gray-900 dark:text-white mb-4
        "
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[15px] sm:text-base text-gray-500 dark:text-gray-400 max-w-[520px] mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}


function Divider() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </div>
  );
}


export function ServiceDetailsSection({ serviceDetails }: { serviceDetails: string }) {
  /* ── Beam refs ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  /* ── HTML extraction ── */
  const extractSections = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html").body;

    const sections = {
      title: "",
      subtitle: "",
      howItWorks: [] as string[],
      whatsIncluded: [] as string[],
      pricing: { description: "", factors: [] as string[] },
      tips: [] as string[],
      faqs: [] as { question: string; answer: string }[],
    };

    const h1 = doc.querySelector("h1");
    const firstP = doc.querySelector("p");
    if (h1) sections.title = h1.textContent || "";
    if (firstP) sections.subtitle = firstP.textContent || "";

    doc.querySelectorAll("h2").forEach((h2) => {
      const text = (h2.textContent || "").toLowerCase();
      const next = h2.nextElementSibling;

      if (text.includes("get quotes") || text.includes("how")) {
        if (next?.tagName === "OL")
          sections.howItWorks = Array.from(next.querySelectorAll("li")).map((li) => li.textContent || "");
      } else if (text.includes("included")) {
        if (next?.tagName === "UL")
          sections.whatsIncluded = Array.from(next.querySelectorAll("li")).map((li) => li.textContent || "");
      } else if (text.includes("pricing")) {
        let cur = next;
        while (cur && cur.tagName !== "H2") {
          if (cur.tagName === "P") sections.pricing.description = cur.textContent || "";
          if (cur.tagName === "UL")
            sections.pricing.factors = Array.from(cur.querySelectorAll("li")).map((li) => li.textContent || "");
          cur = cur.nextElementSibling;
        }
      } else if (text.includes("tips")) {
        if (next?.tagName === "UL")
          sections.tips = Array.from(next.querySelectorAll("li")).map((li) => li.textContent || "");
      }
    });

    sections.faqs = Array.from(doc.querySelectorAll("details")).map((d) => ({
      question: d.querySelector("summary")?.textContent || "",
      answer: d.querySelector("p")?.textContent || "",
    }));

    return sections;
  };

  const sections = extractSections(serviceDetails);
  const steps = sections.howItWorks.slice(0, 5);
  const activeRefs = stepRefs.slice(0, steps.length);

  const accents = [
    { border: "border-blue-400",    text: "text-blue-500",    dim: "text-blue-400/50",    beamA: "#60A5FA", beamB: "#818CF8" },
    { border: "border-violet-400",  text: "text-violet-500",  dim: "text-violet-400/50",  beamA: "#818CF8", beamB: "#34D399" },
    { border: "border-blue-400", text: "text-blue-500", dim: "text-blue-400/50", beamA: "#34D399", beamB: "#FBBF24" },
    { border: "border-amber-400",   text: "text-amber-500",   dim: "text-amber-400/50",   beamA: "#FBBF24", beamB: "#F87171" },
    { border: "border-rose-400",    text: "text-rose-500",    dim: "text-rose-400/50",    beamA: "#F87171", beamB: "#F87171" },
  ];

  const gridClass =
    steps.length <= 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
      : steps.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : steps.length === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const hasAny =
    steps.length > 0 ||
    sections.whatsIncluded.length > 0 ||
    sections.pricing.factors.length > 0 ||
    sections.tips.length > 0;

  if (!hasAny) return null;

  return (
    <div className="w-full">

   
      {steps.length > 0 && (
        <Section>
          <div className="max-w-5xl my-auto mx-auto px-3">
            <SectionHeading
              label="The Process"
              title="How It Works"
              subtitle="Simple steps to connect you with the right professional."
            />

            {/* Animated beam strip */}
            <div
              ref={containerRef}
              aria-hidden="true"
              className="relative flex h-12 max-w-4xl mx-auto items-center justify-between overflow-hidden mb-1"
            >
              {activeRefs.map((ref, i) => (
                <Circle
                  key={i}
                  ref={ref}
                  className={`
                    w-10 h-10 shadow-none
                    bg-white dark:bg-gray-950
                    ${accents[i].border}
                  `}
                >
                  <span className={`font-bold text-sm ${accents[i].text}`}>{i + 1}</span>
                </Circle>
              ))}

              {activeRefs.slice(0, -1).map((fromRef, i) => (
                <AnimatedBeam
                  key={i}
                  duration={5 + i * 0.8}
                  containerRef={containerRef}
                  fromRef={fromRef}
                  toRef={activeRefs[i + 1]}
                  gradientStartColor={accents[i].beamA}
                  gradientStopColor={accents[i].beamB}
                />
              ))}
            </div>

            <div className={`grid ${gridClass} gap-4 mx-auto`}>
              {steps.map((step, i) => (
                <motion.article
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="
                    relative rounded-2xl p-3 overflow-hidden
                    bg-white dark:bg-white/[0.025]
                    border border-gray-100 dark:border-white/[0.06]
                    hover:shadow-xl hover:shadow-gray-100/80 dark:hover:shadow-none
                    hover:-translate-y-0.5
                    transition-all duration-300
                  "
                >
                  {/* Watermark number */}
                  <span
                    aria-hidden="true"
                    className="
                      absolute -right-2 -top-3 select-none pointer-events-none
                      text-[5rem] font-black leading-none
                      text-gray-50 dark:text-white/[0.025]
                    "
                  >
                    {i + 1}
                  </span>

                  {/* <p className={`text-[10px] font-bold tracking-[0.18em] uppercase mb-3 ${accents[i].text}`}>
                    Step {i + 1}
                  </p> */}
                  <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                    {step}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </Section>
      )}

      {sections.whatsIncluded.length > 0 && <Divider />}

      {sections.whatsIncluded.length > 0 && (
        <Section>
          <div className="max-w-5xl mx-auto px-3">
            <SectionHeading
              label="Coverage"
              title="What's Included"
              subtitle="Everything covered — no surprises, no hidden gaps."
            />

            <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {sections.whatsIncluded.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.055 }}
                  className="
                    flex items-start gap-2 px-2 shrink-0 py-2 rounded-2xl
                    bg-white dark:bg-white/[0.025]
                    border border-gray-100 dark:border-white/[0.06]
                    hover:border-blue-200/80 dark:hover:border-blue-800/40
                    hover:bg-blue-50/40 dark:hover:bg-blue-950/20
                    transition-all duration-250
                  "
                >
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {sections.pricing.factors.length > 0 && <Divider />}

    
      {sections.pricing.factors.length > 0 && (
        <Section>
          <div className="max-w-5xl mx-auto px-3">
            <SectionHeading
              label="Investment"
              title="Pricing Guide"
              subtitle={sections.pricing.description || "Transparent pricing with no hidden costs."}
            />

            <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto mb-8">
              {sections.pricing.factors.map((factor, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.055 }}
                  className="
                    flex items-start gap-4 px-5 py-4 rounded-2xl
                    bg-white dark:bg-white/[0.025]
                    border border-gray-100 dark:border-white/[0.06]
                    hover:border-blue-200/80 dark:hover:border-blue-800/30
                    transition-all duration-250
                  "
                >
                  <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    {factor}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="
                max-w-3xl mx-auto rounded-2xl overflow-hidden
                border border-gray-100 dark:border-white/[0.06]
                bg-white dark:bg-white/[0.02]
                flex flex-col sm:flex-row
                divide-y sm:divide-y-0 sm:divide-x
                divide-gray-100 dark:divide-white/[0.05]
              "
            >
              {[
                { Icon: CheckCircle, label: "No Hidden Fees",       iconClass: "text-blue-500" },
                { Icon: Star,        label: "Vetted Professionals",  iconClass: "text-amber-400 fill-amber-400" },
                { Icon: CheckCircle, label: "Competitive Rates",     iconClass: "text-blue-500" },
              ].map(({ Icon, label, iconClass }, i) => (
                <div key={i} className="flex items-center justify-center gap-2.5 px-8 py-4 flex-1">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${iconClass}`} />
                  <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </Section>
      )}

      {sections.tips.length > 0 && <Divider />}

 
      {sections.tips.length > 0 && (
        <Section>
          <div className="max-w-5xl mx-auto px-3">
            <SectionHeading
              label="Pro Tips"
              title="Tips for Better Results"
              subtitle="Small details that help you get faster, more accurate quotes."
            />

            <div className="max-w-3xl mx-auto space-y-3">
              {sections.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.065 }}
                  className="
                    flex items-start gap-5 px-5 py-3 rounded-2xl
                    bg-white dark:bg-white/[0.025]
                    border border-gray-100 dark:border-white/[0.06]
                    hover:border-amber-200/70 dark:hover:border-amber-800/30
                    hover:bg-amber-50/20 dark:hover:bg-amber-950/10
                    transition-all duration-250 group
                  "
                >
                  <div className="
                    flex-shrink-0 mt-0.5 w-8 h-8 rounded-xl
                    bg-amber-50 dark:bg-amber-900/25
                    border border-amber-100 dark:border-amber-800/30
                    flex items-center justify-center
                    group-hover:bg-amber-100/80 dark:group-hover:bg-amber-900/40
                    transition-colors duration-250
                  ">
                    <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  </div>
                  <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                    {tip}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

    </div>
  );
}

function Howitwork({ servicedetails }: { servicedetails: string }) {
  return <ServiceDetailsSection serviceDetails={servicedetails} />;
}

export default Howitwork;