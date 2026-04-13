"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  ShieldCheck,
  Clock,
} from "lucide-react";

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const LIGHT = {
  bg: "#ffffff",
  raised: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  borderHover: "#bfdbfe",
  text: "#0f172a",
  muted: "#64748b",
  subtle: "#94a3b8",
  brand: "#2563eb",
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
  borderHover: "#3b82f6",
  text: "#e8f0fe",
  muted: "#8da4c4",
  subtle: "#4e6887",
  brand: "#60a5fa",
  brandLight: "#1a2d4a",
  brandBorder: "#1e40af",
  radiusLg: 18,
  radiusMd: 12,
};

// ─── Theme context ────────────────────────────────────────────────────────────
// Avoids prop-drilling T into every sub-component.

const ThemeCtx = createContext(LIGHT);
const useT = () => useContext(ThemeCtx);

// ─── HTML parser ──────────────────────────────────────────────────────────────

function parseHTML(html: string) {
  const body = new DOMParser().parseFromString(html, "text/html").body;
  const title = body.querySelector("h1")?.textContent?.trim() ?? "";

  const intros: string[] = [];
  const firstH2 = body.querySelector("h2");
  if (firstH2) {
    let sib = firstH2.previousElementSibling;
    while (sib) {
      if (sib.tagName === "P") intros.unshift(sib.textContent!.trim());
      sib = sib.previousElementSibling;
    }
  }

  const sections: any[] = [];
  body.querySelectorAll("h2").forEach((h2, idx) => {
    const section: any = {
      id: `s${idx}`,
      heading: h2.textContent!.trim(),
      paragraphs: [],
      lists: [],
      subsections: [],
    };
    let cur = h2.nextElementSibling;
    let sub: any = null;
    while (cur && cur.tagName !== "H2") {
      if (cur.tagName === "H3") {
        if (sub) section.subsections.push(sub);
        sub = { heading: cur.textContent!.trim(), paragraphs: [], items: [] };
      } else if (cur.tagName === "P") {
        const t = cur.textContent!.trim();
        if (t) (sub ? sub.paragraphs : section.paragraphs).push(t);
      } else if (cur.tagName === "UL" || cur.tagName === "OL") {
        const items = Array.from(cur.querySelectorAll("li")).map((li) =>
          li.textContent!.trim()
        );
        if (sub) sub.items.push(...items);
        else section.lists.push(...items);
      }
      cur = cur.nextElementSibling;
    }
    if (sub) section.subsections.push(sub);
    sections.push(section);
  });

  return { title, intros, sections };
}

// ─── Classifiers ─────────────────────────────────────────────────────────────

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

// ─── Animation ────────────────────────────────────────────────────────────────

const up = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
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

// ─── Layout primitives ────────────────────────────────────────────────────────

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
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: T.brand,
        marginBottom: 8,
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
        fontSize: "clamp(22px, 2.8vw, 28px)",
        fontWeight: 800,
        lineHeight: 1.3,
        color: T.text,
        margin: "0 0 6px",
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
      <div style={{ height: "0.5px", background: T.border }} />
    </Inner>
  );
}

// ─── Service card (accordion) ─────────────────────────────────────────────────

function ServiceCard({ sub, i }: any) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const hasMore = sub.paragraphs.length > 1 || sub.items.length > 0;
  const preview = sub.paragraphs[0] ?? "";

  return (
    <Fade i={i}>
      <div
        style={{
          border: `0.5px solid ${open ? T.brand : T.border}`,
          borderRadius: T.radiusLg,
          background: T.surface,
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        <button
          onClick={() => hasMore && setOpen((o) => !o)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "14px 16px",
            background: "none",
            border: "none",
            cursor: hasMore ? "pointer" : "default",
            display: "flex",
            alignItems: "flex-start",
            gap: 11,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: T.brand,
              flexShrink: 0,
              marginTop: 5,
              opacity: 0.6,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: T.text,
                lineHeight: 1.35,
                marginBottom: preview ? 4 : 0,
              }}
            >
              {sub.heading}
            </div>
            {preview && (
              <div style={{ fontSize: 15, color: T.muted, lineHeight: 1.6 }}>
                {preview}
              </div>
            )}
          </div>
          {hasMore && (
            <ChevronDown
              size={15}
              style={{
                color: T.muted,
                flexShrink: 0,
                marginTop: 2,
                transition: "transform 0.22s",
                transform: open ? "rotate(180deg)" : "none",
              }}
            />
          )}
        </button>

        <AnimatePresence initial={false}>
          {open && hasMore && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "12px 16px 14px 34px",
                  borderTop: `0.5px solid ${T.border}`,
                  background: T.raised,
                }}
              >
                {sub.paragraphs.slice(1).map((p: string, pi: number) => (
                  <p
                    key={pi}
                    style={{
                      fontSize: 14,
                      color: T.muted,
                      lineHeight: 1.65,
                      margin: "0 0 8px",
                    }}
                  >
                    {p}
                  </p>
                ))}
                {sub.items.length > 0 && (
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {sub.items.map((item: string, ii: number) => (
                      <li
                        key={ii}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 7,
                          fontSize: 13,
                          color: T.muted,
                        }}
                      >
                        <CheckCircle2
                          size={13}
                          style={{
                            color: T.brand,
                            flexShrink: 0,
                            marginTop: 2,
                            opacity: 0.7,
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Fade>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

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
              "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: 10,
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
              fontSize: 15,
              color: T.muted,
              lineHeight: 1.65,
              margin: "0 0 4px",
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
  /**
   * next-themes: `resolvedTheme` is the actual applied theme ("light" | "dark").
   * It resolves "system" automatically against the OS preference — no manual
   * matchMedia needed. Falls back to "light" during SSR (before hydration).
   */
  const { resolvedTheme } = useTheme();
  const T = resolvedTheme === "dark" ? DARK : LIGHT;

  const { title, intros, sections } = useMemo(
    () => parseHTML(serviceDetails),
    [serviceDetails]
  );

  if (!sections.length && !title) return null;

  const classified = sections.map((s) => ({ section: s, layout: classify(s) }));
  const shaded = new Set(["services", "checklist"]);

  return (
    /**
     * Provide T via context — every sub-component calls useT() instead of
     * receiving T as a prop, so nothing in the tree needs to change.
     */
    <ThemeCtx.Provider value={T}>
      <div
        style={{
          width: "100%",
          background: T.bg,
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          // Smooth colour cross-fade when the theme switches
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