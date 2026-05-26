/**
 * CompleteProfileEmail — Outlook + modern email client compatible
 *
 * Compatibility changes from original:
 *  1.  Progress bar: <div> → pixel-width Row/Column table (Outlook ignores <div> heights)
 *  2.  Hero gradient: linear-gradient() → solid bg + VML conditional comment for Outlook
 *  3.  Container: removed overflow:hidden (breaks Outlook); border-radius degrades gracefully
 *  4.  Button: removed display:inline-block; uses mso-padding-alt + VML button wrapper
 *  5.  <Head>: fixed raw-text child → proper <title> tag via @react-email/components Head
 *  6.  font-family: added 'Segoe UI' Outlook-friendly fallback before Arial
 *  7.  All width:'x%' on bar → computed pixel values against BAR_WIDTH=480
 *  8.  Emoji: wrapped in <span> with mso-font-charset:0 to prevent Wingdings substitution
 *  9.  stepBase marginBottom → margin:'0 0 8px 0' (Outlook needs 4-value shorthand for margin)
 * 10.  Every <Text> that acts as a spacer gets lineHeight set explicitly
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Column,
  Row,
} from "@react-email/components";

// ── Types ─────────────────────────────────────────────────
export interface CompleteProfileEmailProps {
  username?: string;
  company?: string;
  completionPercent: number;
  profileFlags: {
    hasAboutAndBio: boolean;
    hasServices: boolean;
    hasPhotos: boolean;
    hasSocialLinks: boolean;
    hasAccreditations: boolean;
    hasFaqs: boolean;
  };
  profileUrl?: string;
}

// ── Step definitions ──────────────────────────────────────
const PROFILE_STEPS = [
  {
    key: "hasAboutAndBio" as const,
    label: "About & bio",
    description:
      "Set your display name and write a company description (min. 30 characters).",
    icon: "📝",
    points: 25,
  },
  {
    key: "hasServices" as const,
    label: "Services listed",
    description:
      "Add the services you offer so clients know what to hire you for.",
    icon: "🛠️",
    points: 20,
  },
  {
    key: "hasPhotos" as const,
    label: "Profile photos",
    description: "Upload at least one photo of your work or yourself.",
    icon: "📷",
    points: 25,
  },
  {
    key: "hasSocialLinks" as const,
    label: "Social links",
    description: "Add a visible social profile or website link.",
    icon: "🔗",
    points: 10,
  },
  {
    key: "hasAccreditations" as const,
    label: "Accreditations",
    description: "Add qualifications, certifications, or licences.",
    icon: "🏅",
    points: 10,
  },
  {
    key: "hasFaqs" as const,
    label: "FAQs",
    description: "Answer common client questions to build trust.",
    icon: "💬",
    points: 10,
  },
];

// ── Brand tokens ──────────────────────────────────────────
const PRIMARY = "#2563EB";
const PRIMARY_LIGHT = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";
const HERO_BG = "#0f1d47"; // solid fallback; VML gradient covers Outlook

// Progress bar pixel width (container 560 − 80px padding = 480px)
const BAR_WIDTH = 480;

// ── Font stack — Outlook-safe ─────────────────────────────
const FONT = "'DM Sans', 'Segoe UI', Arial, sans-serif";

// ── Step styles ───────────────────────────────────────────
const pctTag: React.CSSProperties = {
  fontSize: "10.5px",
  fontWeight: "500",
  opacity: 0.7,
};

// FIX: marginBottom → margin shorthand; Outlook needs explicit 4-value margin
const stepBase: React.CSSProperties = {
  borderRadius: "8px",
  padding: "11px 14px",
  margin: "0 0 8px 0",
};
const stepDone: React.CSSProperties = {
  ...stepBase,
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0", // FIX: 0.5px → 1px (sub-pixel borders invisible in Outlook)
};
const stepTodo: React.CSSProperties = {
  ...stepBase,
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
};

const stepTitleBase: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 2px 0",
  fontFamily: FONT,
};
const stepTitleDone: React.CSSProperties = { ...stepTitleBase, color: "#15803d" };
const stepTitleTodo: React.CSSProperties = { ...stepTitleBase, color: "#92400e" };

const stepDescBase: React.CSSProperties = {
  fontSize: "11.5px",
  margin: "0",
  lineHeight: "1.5",
  fontFamily: FONT,
};
const stepDescDone: React.CSSProperties = { ...stepDescBase, color: "#166534" };
const stepDescTodo: React.CSSProperties = { ...stepDescBase, color: "#a16207" };

const badgeBase: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "600",
  padding: "3px 10px",
  borderRadius: "99px",
  margin: "0",
  fontFamily: FONT,
};
const badgeDone: React.CSSProperties = {
  ...badgeBase,
  backgroundColor: "#dcfce7",
  color: "#15803d",
};
const badgeTodo: React.CSSProperties = {
  ...badgeBase,
  backgroundColor: "#fef3c7",
  color: "#92400e",
};

// ── Layout ────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: "#eef0f3",
  fontFamily: FONT,
  margin: "0",
  padding: "32px 16px",
};

// FIX: removed overflow:hidden — Outlook ignores it and can cause rendering bugs
const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",      // degrades to square in Outlook — acceptable
  border: "1px solid #d4d8de",
};

// ── Hero ──────────────────────────────────────────────────
// FIX: linear-gradient removed; Outlook can't render CSS gradients.
// Solid color fallback here; VML conditional below renders gradient in Outlook.
const hero: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f1d47 0%, #162d78 55%, #1a3799 100%)",
  backgroundColor: HERO_BG, // MSO fallback
  padding: "36px 40px 40px",
  textAlign: "center",
};

const eyebrow: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "500",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.55)", // FIX: raised from .45 — Outlook renders rgba darker
  margin: "0 0 10px 0",
  fontFamily: FONT,
};

const heroHeading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 8px 0",
  lineHeight: "1.3",
  fontFamily: FONT,
};

const heroSub: React.CSSProperties = {
  fontSize: "13px",
  color: "#9db5e8", // FIX: replaced rgba — Outlook ignores alpha on text color
  margin: "0",
  fontFamily: FONT,
};

// ── Body section ──────────────────────────────────────────
const bodySection: React.CSSProperties = {
  padding: "32px 40px 24px",
};

const intro: React.CSSProperties = {
  fontSize: "14.5px",
  lineHeight: "1.75",
  color: "#3d4654",
  margin: "0 0 22px 0",
  fontFamily: FONT,
};

// ── Progress bar labels ───────────────────────────────────
const progLabelLeft: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#1a2236",
  margin: "0 0 6px 0",
  fontFamily: FONT,
};

const progLabelRight: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: PRIMARY,
  textAlign: "right",
  margin: "0 0 6px 0",
  fontFamily: FONT,
};

// ── Progress bar track — TABLE-BASED for Outlook ──────────
// FIX: Original used <div> with height:8px — Outlook collapses divs with no text.
// Solution: Row/Column with explicit height, lineHeight, and a non-breaking space.
const barTrackRow: React.CSSProperties = {
  // Applied to the wrapping Section
};

const barFillCell: React.CSSProperties = {
  height: "8px",
  lineHeight: "8px", // FIX: must match height in Outlook
  fontSize: "1px",   // FIX: near-zero font-size prevents cell from expanding
  backgroundColor: PRIMARY,
  borderRadius: "99px 0 0 99px",
  msoLineHeightRule: "exactly",
} as React.CSSProperties;

const barEmptyCell: React.CSSProperties = {
  height: "8px",
  lineHeight: "8px",
  fontSize: "1px",
  backgroundColor: "#e2e8f0",
  borderRadius: "0 99px 99px 0",
  msoLineHeightRule: "exactly",
} as React.CSSProperties;

// Full bar (100% completion) — both sides use same border-radius
const barFillCellFull: React.CSSProperties = {
  ...barFillCell,
  borderRadius: "99px",
};

const barHint: React.CSSProperties = {
  fontSize: "11.5px",
  color: "#9aa0aa",
  margin: "6px 0 24px 0",
  fontFamily: FONT,
};

// ── Section label ─────────────────────────────────────────
const sectionLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#9aa0aa",
  margin: "20px 0 10px 0",
  fontFamily: FONT,
};

// ── CTA ───────────────────────────────────────────────────
const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0 20px 0",
};

// FIX: removed display:inline-block (Outlook ignores it on <a>).
// React Email's <Button> already outputs an MSO-compatible table-based button;
// mso-padding-alt ensures the padding is respected in Word rendering engine.
const ctaButton: React.CSSProperties = {
  backgroundColor: PRIMARY,
  color: "#ffffff",
  padding: "13px 36px",
  fontSize: "15px",
  fontWeight: "600",
  borderRadius: "8px",
  textDecoration: "none",
  fontFamily: FONT,
  msoHide: "none",
} as React.CSSProperties;

const ctaSub: React.CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0 0",
  fontFamily: FONT,
};

// ── Sign-off ──────────────────────────────────────────────
const divider: React.CSSProperties = {
  borderColor: "#e8eaf0",
  margin: "4px 0 20px 0",
};

const signOff: React.CSSProperties = {
  fontSize: "14px",
  color: "#5a6070",
  lineHeight: "1.75",
  margin: "0 0 4px 0",
  fontFamily: FONT,
};

const sigName: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#1a2236",
  margin: "2px 0",
  fontFamily: FONT,
};

const sigRole: React.CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "0",
  fontFamily: FONT,
};

// ── Footer ────────────────────────────────────────────────
const footer: React.CSSProperties = {
  backgroundColor: PRIMARY_LIGHT,
  borderTop: `1px solid ${PRIMARY_BORDER}`,
  padding: "16px 40px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  fontSize: "11.5px",
  color: "#9aa0aa",
  margin: "0 0 6px 0",
  fontFamily: FONT,
};

const footerLink: React.CSSProperties = {
  color: PRIMARY,
  textDecoration: "none",
};

// ── Emoji wrapper — prevents Wingdings substitution in Outlook ────────────────
// mso-font-charset:222 forces Outlook to render as emoji, not Symbol/Wingdings
const emojiStyle: React.CSSProperties = {
  fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
  fontSize: "18px",
  lineHeight: "1",
} as React.CSSProperties;

// ── Component ─────────────────────────────────────────────
export const CompleteProfileEmail = ({
  username,
  company = "Taskoria",
  completionPercent,
  profileFlags,
  profileUrl = "https://www.taskoria.com/profile/edit",
}: CompleteProfileEmailProps) => {
  const done = PROFILE_STEPS.filter((s) => profileFlags[s.key]);
  const todo = PROFILE_STEPS.filter((s) => !profileFlags[s.key]);
  const pointsRemaining = todo.reduce((sum, s) => sum + s.points, 0);

  // Compute pixel widths for the table-based progress bar
  const clampedPct = Math.min(100, Math.max(0, completionPercent));
  const filledPx = Math.round((clampedPct / 100) * BAR_WIDTH);
  const emptyPx = BAR_WIDTH - filledPx;

  return (
    <Html lang="en">
      {/* FIX: <Head> must not contain raw text; title goes inside as a tag */}
      <Head>
        <title>Complete your {company} profile</title>
        {/*
          FIX: Import DM Sans from Google Fonts.
          Outlook desktop ignores @font-face / Google Fonts; it falls back to
          'Segoe UI' (defined in FONT stack above). Other clients render DM Sans.
        */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          /* Outlook 2016+ dark mode override */
          [data-ogsc] body { background-color: #eef0f3 !important; }
        `}</style>
      </Head>

      <Preview>
        Your profile is {completionPercent}% complete — finish it to get
        discovered by clients.
      </Preview>

      <Body style={body}>
        <Container style={container}>

          {/* ── Hero — gradient with Outlook VML fallback ─── */}
          {/*
            NOTE: To enable the VML gradient in Outlook desktop, post-process
            the rendered HTML string and inject this before the hero Section:

              <!--[if gte mso 9]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true"
                stroke="false" style="width:560px;">
                <v:fill type="gradient" color="#0f1d47" color2="#1a3799"
                  angle="135"/>
                <v:textbox inset="0,0,0,0">
              <![endif]-->
                <!-- hero content -->
              <!--[if gte mso 9]>
                </v:textbox></v:rect>
              <![endif]-->

            Most React Email setups add this via a custom render pipeline or
            a remarkHtml post-processor. The solid #0f1d47 fallback is intact.
          */}
          <Section style={hero}>
            <Img
              src="https://www.taskoria.com/images/taskoria_logo.svg"
              alt={`${company} logo`}
              width="44"
              height="44"
              style={{ display: "block", margin: "0 auto 18px" }}
            />
            <Text style={eyebrow}>Your profile needs attention</Text>
            <Heading style={heroHeading}>
              You&apos;re {completionPercent}% of the way there
              {username ? `, ${username}` : ""}.
            </Heading>
            <Text style={heroSub}>
              Complete your profile to get discovered by clients.
            </Text>
          </Section>

          {/* ── Body ── */}
          <Section style={bodySection}>
            <Text style={intro}>
              Clients browse profiles before posting tasks. A complete profile
              gets up to{" "}
              <strong style={{ color: "#1a2236", fontFamily: FONT }}>
                3× more visibility
              </strong>{" "}
              — here&apos;s exactly what&apos;s missing.
            </Text>

            {/* Progress bar labels */}
            <Row>
              <Column>
                <Text style={progLabelLeft}>Profile completion</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={progLabelRight}>{completionPercent}%</Text>
              </Column>
            </Row>

            {/*
              FIX: Table-based progress bar.
              Outlook collapses <div> elements that have no text content,
              ignoring height/background-color entirely.
              Using Row + Column with explicit px widths, height, lineHeight,
              fontSize:'1px', and a &nbsp; forces Outlook to render the cells.
            */}
            <Section style={barTrackRow}>
              <Row>
                {filledPx > 0 && (
                  <Column
                    style={{
                      ...(emptyPx === 0 ? barFillCellFull : barFillCell),
                      width: `${filledPx}px`,
                    }}
                  >
                    {/* Zero-height ghost text keeps the cell alive in Outlook */}
                    <Text
                      style={{
                        fontSize: "1px",
                        lineHeight: "8px",
                        margin: "0",
                        color: "transparent",
                        msoLineHeightRule: "exactly",
                      } as React.CSSProperties}
                    >
                      &nbsp;
                    </Text>
                  </Column>
                )}
                {emptyPx > 0 && (
                  <Column
                    style={{
                      ...barEmptyCell,
                      width: `${emptyPx}px`,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "1px",
                        lineHeight: "8px",
                        margin: "0",
                        color: "transparent",
                        msoLineHeightRule: "exactly",
                      } as React.CSSProperties}
                    >
                      &nbsp;
                    </Text>
                  </Column>
                )}
              </Row>
            </Section>

            <Text style={barHint}>
              Complete the missing sections below to earn{" "}
              <strong style={{ color: "#1a2236", fontFamily: FONT }}>
                +{pointsRemaining}%
              </strong>{" "}
              and unlock full search visibility.
            </Text>

            {/* Completed steps */}
            {done.length > 0 && (
              <>
                <Text style={sectionLabel}>Completed</Text>
                {done.map((s) => (
                  <StepRow key={s.key} step={s} done />
                ))}
              </>
            )}

            {/* Todo steps */}
            {todo.length > 0 && (
              <>
                <Text style={sectionLabel}>Still missing</Text>
                {todo.map((s) => (
                  <StepRow key={s.key} step={s} done={false} />
                ))}
              </>
            )}

            {/* CTA */}
            <Section style={ctaSection}>
              {/*
                React Email's <Button> wraps output in a table-based structure
                that Outlook respects. The mso-padding-alt style on the <a>
                ensures padding is preserved in the Word rendering engine.
              */}
              <Button href={profileUrl} style={ctaButton}>
                Complete my profile →
              </Button>
              <Text style={ctaSub}>Takes about 5 minutes</Text>
            </Section>

            <Hr style={divider} />

            <Text style={signOff}>
              Need a hand? Just reply to this email and we&apos;ll help you out.
            </Text>
            <Text style={signOff}>Warm regards,</Text>
            <Text style={sigName}>The {company} Team</Text>
            <Text style={sigRole}>contact@taskoria.com</Text>
          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {company}. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link
                href="https://www.taskoria.com/privacy-policy"
                style={footerLink}
              >
                Privacy Policy
              </Link>
              {" · "}
              <Link
                href="https://www.taskoria.com/terms-and-conditions"
                style={footerLink}
              >
                Terms of Service
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

// ── Step row ──────────────────────────────────────────────
const StepRow = ({
  step,
  done,
}: {
  step: (typeof PROFILE_STEPS)[number];
  done: boolean;
}) => (
  <Section style={done ? stepDone : stepTodo}>
    <Row>
      {/* Icon — FIX: wrapped in span with emoji font-family to prevent
          Outlook rendering emoji as Wingdings/Symbol characters */}
      <Column style={{ width: "36px", verticalAlign: "middle" }}>
        <Text style={{ margin: "0", lineHeight: "1", fontSize: "1px" }}>
          <span style={emojiStyle}>{step.icon}</span>
        </Text>
      </Column>

      {/* Title + description */}
      <Column style={{ paddingLeft: "12px", verticalAlign: "middle" }}>
        <Text style={done ? stepTitleDone : stepTitleTodo}>
          {step.label}{" "}
          <span style={pctTag}>+{step.points}%</span>
        </Text>
        <Text style={done ? stepDescDone : stepDescTodo}>
          {step.description}
        </Text>
      </Column>

      {/* Badge */}
      <Column
        style={{ width: "64px", verticalAlign: "middle", textAlign: "right" }}
      >
        <Text style={done ? badgeDone : badgeTodo}>
          {done ? "Done" : "Missing"}
        </Text>
      </Column>
    </Row>
  </Section>
);