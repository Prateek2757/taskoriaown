"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  ShieldCheck,
  Clock,
} from "lucide-react";
import * as cheerio from "cheerio";

const LIGHT = {
  bg: "#ffffff",
  raised: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  borderHover: "#bfdbfe",
  text: "#0f172a",
  muted: "#64748b",
  subtle: "#94a3b8",
  brand: "#2563EB",
  brandLight: "#eff6ff",
  brandBorder: "#bfdbfe",
  radiusLg: 18,
  radiusMd: 12,
};

const DARK = {
  bg: "#0b1120",
  raised: "#131c2e",
  surface: "#182032",
  border: "#1e2d45",
  borderHover: "var(--color-brand-accent-light)",
  text: "#e8f0fe",
  muted: "#8da4c4",
  subtle: "#4e6887",
  brand: "#60a5fa",
  brandLight: "#1a2d4a",
  brandBorder: "#1e40af",
  radiusLg: 18,
  radiusMd: 12,
};

const ThemeCtx = createContext(LIGHT);
const useT = () => useContext(ThemeCtx);

function parseHTML(html: string) {
  const $ = cheerio.load(html);

  const title = $("h1").first().text().trim();

  const intros: string[] = [];

  const firstH2 = $("h2").first();

  if (firstH2.length) {
    firstH2.prevAll("p").each((_, el) => {
      intros.unshift($(el).text().trim());
    });
  }

  const sections: any[] = [];

  $("h2").each((idx, h2) => {
    const section: any = {
      id: `s${idx}`,
      heading: $(h2).text().trim(),
      paragraphs: [],
      lists: [],
      subsections: [],
    };

    let sub: any = null;

    let cur = $(h2).next();

    while (cur.length && cur[0].tagName !== "h2") {
      const tag = cur[0].tagName;

      if (tag === "h3") {
        if (sub) section.subsections.push(sub);

        sub = {
          heading: cur.text().trim(),
          paragraphs: [],
          items: [],
        };
      } else if (tag === "p") {
        const text = cur.text().trim();

        if (text) {
          if (sub) sub.paragraphs.push(text);
          else section.paragraphs.push(text);
        }
      } else if (tag === "ul" || tag === "ol") {
        const items = cur
          .find("li")
          .map((_, li) => $(li).text().trim())
          .get();

        if (sub) sub.items.push(...items);
        else section.lists.push(...items);
      }

      cur = cur.next();
    }

    if (sub) section.subsections.push(sub);

    sections.push(section);
  });

  return { title, intros, sections };
}

const STEPS_RE = /how.it.works|get.started|steps|process|works/i;
const SERVICE_RE =
  /included|services|what.you|options|types|packages|offering|provide/i;
const FEATURE_RE =
  /help.you|why|benefit|find|choose|advantage|platform|taskoria|bark|marketplace/i;

function classify(s: any) {
  const hasSubs = s.subsections.length >= 2;
  const isNumbered = s.subsections.some((sub: any) => /^\d/.test(sub.heading));
  if ((STEPS_RE.test(s.heading) || isNumbered) && hasSubs) return "steps";
  if (SERVICE_RE.test(s.heading) && hasSubs) return "services";
  if (FEATURE_RE.test(s.heading) && hasSubs) return "features";
  if (hasSubs) return "features";
  if (s.lists.length > 0) return "checklist";
  return "prose";
}

const up: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function Fade({ children, i = 0, style = {} }: any) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      custom={i}
      variants={up}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Inner({ children, style = {} }: any) {
  return (
    <div
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "0 clamp(16px, 4vw, 32px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ text }: { text: string }) {
  const T = useT();
  return (
    <p
      style={{
        fontSize: 36,
        fontWeight: "700",
        letterSpacing: -1.8,
        marginBottom: 24,
        color: "#2563EB",
        textAlign: "center",
      }}
    >
      {text}
    </p>
  );
}

function SecTitle({ children }: any) {
  const T = useT();
  return (
    <h2
      style={{
        fontSize: "24px",
        fontWeight: 700,
        lineHeight: 1.3,
        color: T.text,
        margin: "0 0 6px",
        textAlign: "center",
      }}
    >
      {children}
    </h2>
  );
}

function Divider() {
  const T = useT();
  return (
    <Inner>
      {/* <div style={{ height: "0.4px", background: T.border }} /> */}
    </Inner>
  );
}


// ─── Sections ─────────────────────────────────────────────────────────────────
function ServiceCard({ sub, i }: any) {
  const T = useT();

  return (
    <Fade i={i}>
      <div
        style={{
          padding: "10px",
          // border: `0.5px solid ${T.border}`,
          // borderRadius: T.radiusLg,
          background: T.raised,
          // marginBottom: 20,
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: 14,
            color: "#2563EB",
          }}
        >
          {sub.heading}
        </h3>

        {/* Paragraphs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // gap: 6,
            marginBottom: sub.items.length > 0 ? 18 : 0,
          }}
        >
          {sub.paragraphs.map((p: string, pi: number) => (
            <p
              key={pi}
              style={{
                fontSize: 16,
                color: T.muted,
                lineHeight: 1.7,
                margin: "3px 0 0",
              }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Items */}
        {sub.items.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 16,
                color: T.muted,
                lineHeight: 1.7,
                margin: "3px 0 0",
              }}
            >
              Popular add-ons
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 10,
              }}
            >
              {sub.items.map((item: string, ii: number) => (
                <div
                  key={ii}
                  style={{
                    fontSize: 16,
                    color: T.muted,
                    lineHeight: 1.7,
                    margin: "3px 0 0",
                    background: T.bg,
                    border: `0.5px solid ${T.border}`,
                    borderRadius: T.radiusMd,
                    padding: "10px 12px",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Fade>
  );
}
function ServicesSection({ section }: any) {
  const T = useT();
  return (
    <div style={{ padding: "clamp(10px, 5vw, 20px) 0", background: T.raised }}>
      <Inner>
        <Fade i={0}>
          <div style={{ marginBottom: 22 }}>
            <Eyebrow text="Services" />
            <SecTitle>{section.heading}</SecTitle>
            {section.paragraphs.map((p: string, i: number) => (
              <p
                key={i}
                style={{
                  fontSize: 18,
                  color: T.muted,
                  lineHeight: 1.7,
                  margin: "3px 0 0",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </Fade>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: 8,
          }}
        >
          {section.subsections.map((sub: any, i: number) => (
            <ServiceCard key={i} sub={sub} i={i + 1} />
          ))}
        </div>

        {section.lists.length > 0 && (
          <Fade i={section.subsections.length + 1}>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
              }}
            >
              {section.lists.map((item: string, i: number) => (
                <span
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 12px",
                    borderRadius: 100,
                    border: `0.5px solid ${T.border}`,
                    background: T.surface,
                    fontSize: 12.5,
                    color: T.muted,
                  }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: T.brand,
                      display: "inline-block",
                      opacity: 0.6,
                    }}
                  />
                  {item}
                </span>
              ))}
            </div>
          </Fade>
        )}
      </Inner>
    </div>
  );
}

function FeatureCard({ sub, i }: any) {
  const T = useT();
  const [hovered, setHovered] = useState(false);
  return (
    <Fade i={i}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `0.5px solid ${hovered ? T.brand : T.border}`,
          borderRadius: T.radiusLg,
          background: T.surface,
          padding: "16px 18px",
          transition: "border-color 0.2s",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: T.text,
            margin: "0 0 6px",
            lineHeight: 1.35,
          }}
        >
          {sub.heading}
        </h3>
        {sub.paragraphs.map((p: string, pi: number) => (
          <p
            key={pi}
            style={{
              fontSize: 16,
              fontWeight: 600,

              margin: "0 0 6px",
              color: T.muted,
            }}
          >
            {p}
          </p>
        ))}
        {sub.items.length > 0 && (
          <ul
            style={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              listStyle: "none",
              padding: 0,
              margin: "8px 0 0",
            }}
          >
            {sub.items.map((item: string, ii: number) => (
              <li
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                  fontSize: 12.5,
                  color: T.muted,
                }}
              >
                <ArrowRight
                  size={11}
                  style={{
                    color: T.brand,
                    flexShrink: 0,
                    marginTop: 3,
                    opacity: 0.7,
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Fade>
  );
}

function FeaturesSection({ section }: any) {
  const T = useT();
  return (
    <div style={{ padding: "clamp(10px, 5vw, 20px) 0" }}>
      <Inner>
        <Fade i={0}>
          <div style={{ marginBottom: 22 }}>
            <Eyebrow text="Why choose us" />
            <SecTitle>{section.heading}</SecTitle>
            {section.paragraphs.map((p: string, i: number) => (
              <p
                key={i}
                style={{
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.7,
                  margin: "4px 0 0",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </Fade>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 210px), 1fr))",
            gap: 10,
          }}
        >
          {section.subsections.map((sub: any, i: number) => (
            <FeatureCard key={i} sub={sub} i={i + 1} />
          ))}
        </div>
      </Inner>
    </div>
  );
}

// ─── Section router ───────────────────────────────────────────────────────────

function SectionRouter({ section }: any) {
  switch (classify(section)) {
    case "services":
      return <ServicesSection section={section} />;
    case "features":
      return <FeaturesSection section={section} />;
    default:
      return null;
  }
}

function ServiceDetailsSection({
  serviceDetails,
  onPostJob,
}: {
  serviceDetails: string;
  onPostJob?: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const T = resolvedTheme === "dark" ? DARK : LIGHT;

  const { title, intros, sections } = useMemo(
    () => parseHTML(serviceDetails),
    [serviceDetails],
  );

  if (!sections.length && !title) return null;

  const classified = sections.map((s) => ({ section: s, layout: classify(s) }));
  const shaded = new Set(["services", "checklist"]);

  return (
    <ThemeCtx.Provider value={T}>
      <div
        style={{
          width: "100%",
          background: T.bg,
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        {classified.map(({ section, layout }, i) => (
          <div key={section.id}>
            {i > 0 &&
              !shaded.has(layout) &&
              !shaded.has(classified[i - 1].layout) && <Divider />}
            <SectionRouter section={section} />
          </div>
        ))}
      </div>
    </ThemeCtx.Provider>
  );
}

export default function HowItWorks({
  servicedetails,
  onpostjob,
}: {
  servicedetails: string;
  onpostjob?: () => void;
}) {
  return (
    <ServiceDetailsSection
      serviceDetails={servicedetails}
      onPostJob={onpostjob}
    />
  );
}
