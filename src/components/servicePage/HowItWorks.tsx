"use client";

import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  ShieldCheck,
  Clock,
  Zap,
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
  const hasLists = s.lists.length > 0;
  const isNumbered = s.subsections.some((sub) => /^\d/.test(sub.heading));

  if ((STEPS_RE.test(s.heading) || isNumbered) && hasSubs) return "steps";
  if (SERVICE_RE.test(s.heading) && hasSubs) return "services";
  if (FEATURE_RE.test(s.heading) && hasSubs) return "features";
  if (hasSubs) return "features";
  if (hasLists) return "checklist";
  return "prose";
}

function cleanNum(h) {
  return h.replace(/^(\d+\.?\s+|step\s+\d+[.:]\s*)/i, "").trim();
}

const T = {
  brand: "#2563EB",
  brandLight: "#7494DE",
  brandMid: "#7494DE",
  brandBorder: "#2563EB",

  text: "var(--color-text-primary)",
  muted: "var(--color-text-secondary)",
  hint: "var(--color-text-tertiary)",

  surface: "var(--color-background-primary)",
  raised: "var(--color-background-secondary)",
  border: "var(--color-border-tertiary)",
  borderHover: "var(--color-border-secondary)",

  radius: "10px",
  radiusLg: "14px",
};

const up = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, delay: i * 0.065, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Fade({ children, i = 0, style = {}, tag = "div" }) {
  const Tag = motion[tag] || motion.div;
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      custom={i}
      variants={up}
      style={style}
    >
      {children}
    </Tag>
  );
}

function EyebrowLabel({ text }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: T.brand,
        marginBottom: 8,
      }}
    >
      {text}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: "clamp(20px, 3vw, 26px)",
        fontWeight: 700,
        lineHeight: 1.25,
        color: T.text,
        marginBottom: 8,
      }}
    >
      {children}
    </h2>
  );
}

function Dot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: T.brandMid,
        flexShrink: 0,
        marginTop: 5,
      }}
    />
  );
}

function Divider() {
  return (
    <div style={{ padding: "0 24px" }}>
      <div style={{ height: 1, background: T.border }} />
    </div>
  );
}

const TRUST_ITEMS = [
  { icon: <Users size={15} />, stat: "50,000+", label: "Verified providers" },
  { icon: <Star size={15} />, stat: "4.8/5", label: "Average rating" },
  { icon: <Clock size={15} />, stat: "< 1 hr", label: "Avg response time" },
  { icon: <ShieldCheck size={15} />, stat: "100%", label: "Free to post" },
];

function TrustBar() {
  return (
    <div
      style={{
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        padding: "14px 24px",
        display: "flex",
        gap: 0,
        overflowX: "auto",
        background: T.raised,
      }}
    >
      {TRUST_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: "1 1 0",
            minWidth: 120,
            padding: "0 12px",
            borderLeft: i > 0 ? `1px solid ${T.border}` : "none",
          }}
        >
          <span style={{ color: T.brand, display: "flex" }}>{item.icon}</span>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
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
  );
}

function Hero({ title, intros, onPostJob }) {
  if (!title && !intros.length) return null;
  return (
    <div style={{ padding: "36px 24px 28px", maxWidth: 700 }}>
      {title && (
        <Fade i={0}>
          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: T.text,
              marginBottom: 12,
              letterSpacing: "-0.01em",
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
              fontSize: i === 0 ? 17 : 14,
              fontWeight: i === 0 ? 500 : 400,
              color: i === 0 ? T.text : T.muted,
              lineHeight: 1.65,
              marginBottom: 8,
            }}
          >
            {p}
          </p>
        </Fade>
      ))}
      <Fade i={intros.length + 1}>
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}
        >
          <button
            onClick={onPostJob}
            style={{
              padding: "11px 26px",
              borderRadius: T.radius,
              background: T.brand,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Get Free Quotes{" "}
          </button>
          <button
            style={{
              padding: "11px 22px",
              borderRadius: T.radius,
              background: "transparent",
              color: T.text,
              fontSize: 14,
              fontWeight: 600,
              border: `1.5px solid ${T.borderHover}`,
              cursor: "pointer",
            }}
          >
            Browse Providers
          </button>
        </div>
      </Fade>
    </div>
  );
}

function StepsSection({ section }) {
  const subs = section.subsections;
  return (
    <div style={{ padding: "36px 24px", maxWidth: 620 }}>
      <Fade i={0}>
        <EyebrowLabel text="How it works" />
        <SectionTitle>{section.heading}</SectionTitle>
        {section.paragraphs.map((p, i) => (
          <p
            key={i}
            style={{
              fontSize: 14,
              color: T.muted,
              lineHeight: 1.65,
              marginBottom: 4,
            }}
          >
            {p}
          </p>
        ))}
      </Fade>

      <div style={{ marginTop: 28 }}>
        {subs.map((sub, i) => (
          <Fade key={i} i={i + 1}>
            <div style={{ display: "flex", gap: 18, position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 36,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: T.brand,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                    boxShadow: `0 0 0 4px ${T.brandLight}`,
                  }}
                >
                  {i + 1}
                </div>
                {i < subs.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      width: 2,
                      background: `linear-gradient(to bottom, ${T.brandBorder}, transparent)`,
                      margin: "8px 0 0",
                      minHeight: 32,
                    }}
                  />
                )}
              </div>

              <div
                style={{ paddingBottom: i < subs.length - 1 ? 28 : 0, flex: 1 }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: T.text,
                    marginBottom: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {cleanNum(sub.heading)}
                </h3>
                {sub.paragraphs.map((p, pi) => (
                  <p
                    key={pi}
                    style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65 }}
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
                    }}
                  >
                    {sub.items.map((item, ii) => (
                      <li
                        key={ii}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          fontSize: 13,
                          color: T.muted,
                        }}
                      >
                        <Dot />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Fade>
        ))}
      </div>
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
          border: `1px solid ${open ? T.brandBorder : T.border}`,
          borderRadius: T.radiusLg,
          background: T.surface,
          overflow: "hidden",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: open ? `0 4px 16px rgba(15,110,86,.08)` : "none",
        }}
      >
        <button
          onClick={() => hasMore && setOpen((o) => !o)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "16px 18px",
            background: "none",
            border: "none",
            cursor: hasMore ? "pointer" : "default",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.brandMid,
              flexShrink: 0,
              marginTop: 6,
            }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
                lineHeight: 1.35,
                marginBottom: preview ? 5 : 0,
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
              size={16}
              style={{
                color: T.muted,
                flexShrink: 0,
                marginTop: 2,
                transition: "transform 0.22s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
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
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "12px 18px 16px 38px",
                  borderTop: `1px solid ${T.border}`,
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
                      marginBottom: 8,
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
                    }}
                  >
                    {sub.items.map((item, ii) => (
                      <li
                        key={ii}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          fontSize: 13,
                          color: T.muted,
                        }}
                      >
                        <CheckCircle2
                          size={13}
                          style={{
                            color: T.brandMid,
                            flexShrink: 0,
                            marginTop: 2,
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
    <div style={{ padding: "36px 24px", background: T.raised }}>
      <Fade i={0}>
        <div style={{ maxWidth: 620, marginBottom: 24 }}>
          <EyebrowLabel text="Services" />
          <SectionTitle>{section.heading}</SectionTitle>
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 14,
                color: T.muted,
                lineHeight: 1.65,
                marginTop: 4,
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
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
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
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {section.lists.map((item, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 100,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  fontSize: 13,
                  color: T.muted,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: T.brandMid,
                    display: "inline-block",
                  }}
                />
                {item}
              </span>
            ))}
          </div>
        </Fade>
      )}
    </div>
  );
}

function FeatureCard({ sub, i }) {
  return (
    <Fade i={i}>
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusLg,
          background: T.surface,
          padding: "18px 20px",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = T.brandBorder;
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,110,86,.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* <div style={{
          width: 32, height: 32,
          borderRadius: 8,
          background: T.brandLight,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 12,
        }}>
          <Zap size={15} color={T.brand} />
        </div> */}

        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 6,
            lineHeight: 1.3,
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
              marginBottom: 4,
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
            }}
          >
            {sub.items.map((item, ii) => (
              <li
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 7,
                  fontSize: 12.5,
                  color: T.muted,
                }}
              >
                <ArrowRight
                  size={12}
                  style={{ color: T.brandMid, flexShrink: 0, marginTop: 2 }}
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
    <div style={{ padding: "36px 24px" }}>
      <Fade i={0}>
        <div style={{ maxWidth: 620, marginBottom: 24 }}>
          <EyebrowLabel text="Why Taskoria" />
          <SectionTitle>{section.heading}</SectionTitle>
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 14,
                color: T.muted,
                lineHeight: 1.65,
                marginTop: 4,
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
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {section.subsections.map((sub, i) => (
          <FeatureCard key={i} sub={sub} i={i + 1} />
        ))}
      </div>
    </div>
  );
}

function ChecklistSection({ section }) {
  return (
    <div style={{ padding: "36px 24px", background: T.raised }}>
      <Fade i={0}>
        <div style={{ maxWidth: 620, marginBottom: 20 }}>
          <EyebrowLabel text="Included" />
          <SectionTitle>{section.heading}</SectionTitle>
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 14,
                color: T.muted,
                lineHeight: 1.65,
                marginTop: 4,
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
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 8,
        }}
      >
        {section.lists.map((item, i) => (
          <Fade key={i} i={i + 1}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "12px 14px",
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
                background: T.surface,
              }}
            >
              <CheckCircle2
                size={14}
                style={{ color: T.brandMid, flexShrink: 0, marginTop: 1 }}
              />
              <span style={{ fontSize: 13.5, color: T.text, lineHeight: 1.5 }}>
                {item}
              </span>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
}

function ProseSection({ section }) {
  return (
    <div style={{ padding: "36px 24px", maxWidth: 660 }}>
      <Fade i={0}>
        <SectionTitle>{section.heading}</SectionTitle>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{ fontSize: 14, color: T.muted, lineHeight: 1.7 }}
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
            }}
          >
            {section.lists.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 9,
                  fontSize: 14,
                  color: T.muted,
                }}
              >
                <Dot />
                {item}
              </li>
            ))}
          </ul>
        )}
      </Fade>
    </div>
  );
}

// function CtaBanner({ title }) {
//   const serviceLabel = title || "this service";
//   return (
//     <Fade i={0}>
//       <div style={{
//         margin: "0 24px 40px",
//         borderRadius: 16,
//         background: T.brand,
//         padding: "32px 28px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         flexWrap: "wrap",
//         gap: 16,
//       }}>
//         <div>
//           <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 5 }}>
//             Ready to book {serviceLabel.toLowerCase()}?
//           </div>
//           <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
//             Post your job for free and get quotes from local providers within the hour.
//           </div>
//         </div>
//         <button style={{
//           padding: "12px 24px",
//           borderRadius: T.radius,
//           background: "#fff",
//           color: T.brand,
//           fontSize: 14,
//           fontWeight: 700,
//           border: "none",
//           cursor: "pointer",
//           whiteSpace: "nowrap",
//           flexShrink: 0,
//         }}>
//           Post a Job
//         </button>
//       </div>
//     </Fade>
//   );
// }

function SectionRouter({ section }) {
  const layout = classify(section);
  switch (layout) {
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

      {/* <CtaBanner title={title} /> */}
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
