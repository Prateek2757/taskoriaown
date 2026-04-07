"use client";

import { useMemo, useState } from "react";
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

function parseHTML(html) {
  const body = new DOMParser().parseFromString(html, "text/html").body;
  const title = body.querySelector("h1")?.textContent?.trim() ?? "";

  const intros = [];
  const firstH2 = body.querySelector("h2");
  if (firstH2) {
    let sib = firstH2.previousElementSibling;
    while (sib) {
      if (sib.tagName === "P") intros.unshift(sib.textContent.trim());
      sib = sib.previousElementSibling;
    }
  }

  const sections = [];
  body.querySelectorAll("h2").forEach((h2, idx) => {
    const section = {
      id: `s${idx}`,
      heading: h2.textContent.trim(),
      paragraphs: [],
      lists: [],
      subsections: [],
    };
    let cur = h2.nextElementSibling;
    let sub = null;
    while (cur && cur.tagName !== "H2") {
      if (cur.tagName === "H3") {
        if (sub) section.subsections.push(sub);
        sub = { heading: cur.textContent.trim(), paragraphs: [], items: [] };
      } else if (cur.tagName === "P") {
        const t = cur.textContent.trim();
        if (t) (sub ? sub.paragraphs : section.paragraphs).push(t);
      } else if (cur.tagName === "UL" || cur.tagName === "OL") {
        const items = Array.from(cur.querySelectorAll("li")).map((li) =>
          li.textContent.trim()
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

const STEPS_RE = /how.it.works|get.started|steps|process|works/i;
const SERVICE_RE =
  /included|services|what.you|options|types|packages|offering|provide/i;
const FEATURE_RE =
  /help.you|why|benefit|find|choose|advantage|platform|taskoria|bark|marketplace/i;

function classify(s) {
  const hasSubs = s.subsections.length >= 2;
  const isNumbered = s.subsections.some((sub) => /^\d/.test(sub.heading));
  if ((STEPS_RE.test(s.heading) || isNumbered) && hasSubs) return "steps";
  if (SERVICE_RE.test(s.heading) && hasSubs) return "services";
  if (FEATURE_RE.test(s.heading) && hasSubs) return "features";
  if (hasSubs) return "features";
  if (s.lists.length > 0) return "checklist";
  return "prose";
}

function cleanNum(h) {
  return h.replace(/^(\d+\.?\s+|step\s+\d+[.:]\s*)/i, "").trim();
}

const T = {
  brand: "#2563EB",
  brandSoft: "rgba(37,99,235,0.08)",
  text: "var(--color-text-primary)",
  muted: "var(--color-text-secondary)",
  hint: "var(--color-text-tertiary)",
  surface: "var(--color-background-primary)",
  raised: "var(--color-background-secondary)",
  border: "var(--color-border-tertiary)",
  borderHover: "var(--color-border-secondary)",
  radius: "8px",
  radiusLg: "12px",
  maxW: "820px",
};

const up = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Fade({ children, i = 0, style = {} }) {
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

function Inner({ children, style = {} }) {
  return (
    <div
      style={{
        maxWidth: T.maxW,
        margin: "0 auto",
        padding: "0 clamp(16px, 4vw, 32px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ text }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.11em",
        textTransform: "uppercase",
        color: T.brand,
        margin: "0 0 8px",
      }}
    >
      {text}
    </p>
  );
}

function SecTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: "clamp(18px, 2.8vw, 22px)",
        fontWeight: 600,
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
  return (
    <Inner>
      <div style={{ height: "0.5px", background: T.border }} />
    </Inner>
  );
}

const TRUST = [
  { icon: <Users size={14} />, stat: "500+", label: "Verified providers" },
  { icon: <Star size={14} />, stat: "4.8 / 5", label: "Average rating" },
  { icon: <Clock size={14} />, stat: "< 1 hr", label: "Response time" },
  { icon: <ShieldCheck size={14} />, stat: "Free", label: "To post a job" },
];

function TrustBar() {
  return (
    <div
      style={{
        borderTop: `0.5px solid ${T.border}`,
        borderBottom: `0.5px solid ${T.border}`,
        background: T.raised,
        padding: "12px 0",
      }}
    >
      <Inner>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: "12px 0",
          }}
        >
          {TRUST.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "0 12px",
                borderLeft: i > 0 ? `0.5px solid ${T.border}` : "none",
              }}
            >
              <span style={{ color: T.brand, display: "flex", flexShrink: 0 }}>
                {item.icon}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                    lineHeight: 1.2,
                  }}
                >
                  {item.stat}
                </div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.3 }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Inner>
    </div>
  );
}

function Hero({ title, intros, onPostJob }) {
  if (!title && !intros.length) return null;
  return (
    <div style={{ padding: "clamp(10px, 5vw, 20px) 0 clamp(10px, 4vw, 20px)" }}>
      <Inner>
        {title && (
          <Fade i={0}>
            <h1
              style={{
                fontSize: "clamp(24px, 4vw, 34px)",
                fontWeight: 700,
                lineHeight: 1.2,
                color: T.text,
                margin: "0 0 14px",
                letterSpacing: "-0.015em",
              }}
            >
              {title}
            </h1>
          </Fade>
        )}

        {intros.map((p, i) => (
          <Fade key={i} i={i + 1}>
            <p
              style={{
                fontSize: i === 0 ? 16 : 14,
                fontWeight: i === 0 ? 500 : 400,
                color: i === 0 ? T.text : T.muted,
                lineHeight: 1.7,
                margin: "0 0 6px",
              }}
            >
              {p}
            </p>
          </Fade>
        ))}

        {/* <Fade i={intros.length + 1}>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <button
              onClick={onPostJob}
              style={{
                padding: "10px 24px",
                borderRadius: T.radius,
                background: T.brand,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Get Free Quotes
            </button>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: T.radius,
                background: "transparent",
                color: T.text,
                fontSize: 14,
                fontWeight: 500,
                border: `0.5px solid ${T.borderHover}`,
                cursor: "pointer",
              }}
            >
              Browse Providers
            </button>
          </div>
        </Fade> */}
      </Inner>
    </div>
  );
}

function StepsSection({ section }) {
  const subs = section.subsections;
  return (
    <div style={{ padding: "clamp(10px, 5vw, 20px) 0" }}>
      <Inner>
        <Fade i={0}>
          <Eyebrow text="The Process" />
          <SecTitle>{section.heading}</SecTitle>
          {section.paragraphs.map((p, i) => (
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
        </Fade>

        <style>{`
          .steps-row {
            margin-top: 30px;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
          }
          .step-arrow-h { display: flex; }
          .step-arrow-v { display: none; }
          @media (max-width: 540px) {
            .steps-row { flex-direction: column; }
            .step-card { flex-direction: row !important; text-align: left !important; align-items: flex-start !important; padding: 0 !important; }
            .step-card-body { align-items: flex-start !important; text-align: left !important; }
            .step-arrow-h { display: none; }
            .step-arrow-v { display: flex; }
          }
        `}</style>

        <div className="steps-row">
          {subs.map((sub, i) => (
            <Fade key={i} i={i + 1} style={{ display: "contents" }}>
              {/* Step card */}
              <div
                className="step-card"
                style={{
                  flex: "1 1 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 8px",
                  gap: 0,
                }}
              >
                <div
                  className="step-card-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: T.brandSoft,
                      border: `1.5px solid ${T.brand}`,
                      color: T.brand,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginBottom: 1,
                    }}
                  >
                    {i + 1}
                  </div>

                  <h3
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: T.text,
                      margin: "0 0 6px",
                      lineHeight: 1.35,
                    }}
                  >
                    {cleanNum(sub.heading)}
                  </h3>

                  {sub.paragraphs.slice(0, 1).map((p, pi) => (
                    <p
                      key={pi}
                      style={{
                        fontSize: 12.5,
                        color: T.muted,
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {i < subs.length - 1 && (
                <div
                  className="step-arrow-h"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: 24,
                    marginTop: 15,
                    paddingBottom: 30,
                    color: T.muted,
                    opacity: 0.35,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {i < subs.length - 1 && (
                <div
                  className="step-arrow-v"
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: 14,
                    height: 28,
                    color: T.muted,
                    opacity: 0.35,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0  16" fill="none">
                    <path
                      d="M8 3v10M4 9l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </Fade>
          ))}
        </div>

        <Fade i={subs.length + 1}>
          <div style={{ marginTop: 28, textAlign: "center" }}>
            {/* <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13.5,
                fontWeight: 600,
                color: T.brand,
                textDecoration: "none",
                borderBottom: `1px solid transparent`,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderBottomColor = T.brand)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderBottomColor = "transparent")
              }
            >
              See how it works in detail
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a> */}
          </div>
        </Fade>
      </Inner>
    </div>
  );
}

function ServiceCard({ sub, i }) {
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
              width: 7,
              height: 7,
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
                fontSize: 13.5,
                fontWeight: 600,
                color: T.text,
                lineHeight: 1.35,
                marginBottom: preview ? 4 : 0,
              }}
            >
              {sub.heading}
            </div>
            {preview && (
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
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
                {sub.paragraphs.slice(1).map((p, pi) => (
                  <p
                    key={pi}
                    style={{
                      fontSize: 13,
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
                    {sub.items.map((item, ii) => (
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

function ServicesSection({ section }) {
  return (
    <div style={{ padding: "clamp(10px, 5vw, 20px) 0", background: T.raised }}>
      <Inner>
        <Fade i={0}>
          <div style={{ marginBottom: 22 }}>
            <Eyebrow text="Services" />
            <SecTitle>{section.heading}</SecTitle>
            {section.paragraphs.map((p, i) => (
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
              "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: 10,
          }}
        >
          {section.subsections.map((sub, i) => (
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
              {section.lists.map((item, i) => (
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

/* ─── Feature card ────────────────────────────────────────── */
function FeatureCard({ sub, i }) {
  return (
    <Fade i={i}>
      <div
        style={{
          border: `0.5px solid ${T.border}`,
          borderRadius: T.radiusLg,
          background: T.surface,
          padding: "16px 18px",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.brand)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
      >
        <h3
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: T.text,
            margin: "0 0 6px",
            lineHeight: 1.35,
          }}
        >
          {sub.heading}
        </h3>
        {sub.paragraphs.map((p, pi) => (
          <p
            key={pi}
            style={{
              fontSize: 13,
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
            {sub.items.map((item, ii) => (
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

function FeaturesSection({ section }) {
  return (
    <div style={{ padding: "clamp(10px, 5vw, 20px) 0" }}>
      <Inner>
        <Fade i={0}>
          <div style={{ marginBottom: 22 }}>
            <Eyebrow text="Why choose us" />
            <SecTitle>{section.heading}</SecTitle>
            {section.paragraphs.map((p, i) => (
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
          {section.subsections.map((sub, i) => (
            <FeatureCard key={i} sub={sub} i={i + 1} />
          ))}
        </div>
      </Inner>
    </div>
  );
}

/* ─── Checklist section ───────────────────────────────────── */
function ChecklistSection({ section }) {
  return (
    <div style={{ padding: "clamp(10px, 5vw, 20px) 0", background: T.raised }}>
      <Inner>
        <Fade i={0}>
          <div style={{ marginBottom: 18 }}>
            <Eyebrow text="Included" />
            <SecTitle>{section.heading}</SecTitle>
            {section.paragraphs.map((p, i) => (
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
              "repeat(auto-fill, minmax(min(100%, 230px), 1fr))",
            gap: 8,
          }}
        >
          {section.lists.map((item, i) => (
            <Fade key={i} i={i + 1}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 9,
                  padding: "11px 13px",
                  border: `0.5px solid ${T.border}`,
                  borderRadius: T.radius,
                  background: T.surface,
                }}
              >
                <CheckCircle2
                  size={13}
                  style={{
                    color: T.brand,
                    flexShrink: 0,
                    marginTop: 1,
                    opacity: 0.8,
                  }}
                />
                <span
                  style={{ fontSize: 13.5, color: T.text, lineHeight: 1.5 }}
                >
                  {item}
                </span>
              </div>
            </Fade>
          ))}
        </div>
      </Inner>
    </div>
  );
}

/* ─── Prose section ───────────────────────────────────────── */
function ProseSection({ section }) {
  return (
    <div style={{ padding: "clamp(28px, 5vw, 44px) 0" }}>
      <Inner>
        <Fade i={0}>
          <SecTitle>{section.heading}</SecTitle>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {section.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {p}
              </p>
            ))}
          </div>
          {section.lists.length > 0 && (
            <ul
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 7,
                listStyle: "none",
                padding: 0,
              }}
            >
              {section.lists.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: 14,
                    color: T.muted,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: T.brand,
                      flexShrink: 0,
                      marginTop: 5,
                      opacity: 0.5,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Fade>
      </Inner>
    </div>
  );
}

/* ─── Section router ──────────────────────────────────────── */
function SectionRouter({ section }) {
  switch (classify(section)) {
    case "steps":
      return <StepsSection section={section} />;
    case "services":
      return <ServicesSection section={section} />;
    case "features":
      return <FeaturesSection section={section} />;
    case "checklist":
      return <ChecklistSection section={section} />;
    default:
      return <ProseSection section={section} />;
  }
}

/* ─── Root export ─────────────────────────────────────────── */
export function ServiceDetailsSection({ serviceDetails, onPostJob }) {
  const { title, intros, sections } = useMemo(
    () => parseHTML(serviceDetails),
    [serviceDetails]
  );

  if (!sections.length && !title) return null;

  const classified = sections.map((s) => ({ section: s, layout: classify(s) }));
  const shaded = new Set(["services", "checklist"]);

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <Hero title={title} intros={intros} onPostJob={onPostJob} />
      <TrustBar />
      {classified.map(({ section, layout }, i) => (
        <div key={section.id}>
          {i > 0 &&
            !shaded.has(layout) &&
            !shaded.has(classified[i - 1].layout) && <Divider />}
          <SectionRouter section={section} />
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks({ servicedetails, onpostjob }) {
  return (
    <ServiceDetailsSection
      serviceDetails={servicedetails}
      onPostJob={onpostjob}
    />
  );
}
