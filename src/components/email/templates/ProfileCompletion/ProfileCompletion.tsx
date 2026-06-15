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

const PRIMARY = "#2563EB";
const PRIMARY_LIGHT = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";
const HERO_BG = "#0f1d47"; 

const BAR_WIDTH = 480;

const FONT = "'DM Sans', 'Segoe UI', Arial, sans-serif";

const pctTag: React.CSSProperties = {
  fontSize: "10.5px",
  fontWeight: "500",
  opacity: 0.7,
};

const stepBase: React.CSSProperties = {
  borderRadius: "8px",
  padding: "11px 14px",
  margin: "0 0 8px 0",
};
const stepDone: React.CSSProperties = {
  ...stepBase,
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0", 
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

const body: React.CSSProperties = {
  backgroundColor: "#eef0f3",
  fontFamily: FONT,
  margin: "0",
  padding: "32px 16px",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",      
  border: "1px solid #d4d8de",
};


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
  color: "rgba(255,255,255,0.55)", 
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
  color: "#9db5e8",
  margin: "0",
  fontFamily: FONT,
};

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


const barTrackRow: React.CSSProperties = {
};

const barFillCell: React.CSSProperties = {
  height: "8px",
  lineHeight: "8px", 
  fontSize: "1px",   
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

const sectionLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#9aa0aa",
  margin: "20px 0 10px 0",
  fontFamily: FONT,
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0 20px 0",
};

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


const emojiStyle: React.CSSProperties = {
  fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
  fontSize: "18px",
  lineHeight: "1",
} as React.CSSProperties;

export const CompleteProfileEmail = ({
  username,
  company = "Taskoria",
  completionPercent,
  profileFlags,
  profileUrl = "https://www.taskoria.com/settings/profile/my-profile",
}: CompleteProfileEmailProps) => {
  const done = PROFILE_STEPS.filter((s) => profileFlags[s.key]);
  const todo = PROFILE_STEPS.filter((s) => !profileFlags[s.key]);
  const pointsRemaining = todo.reduce((sum, s) => sum + s.points, 0);

  const clampedPct = Math.min(100, Math.max(0, completionPercent));
  const filledPx = Math.round((clampedPct / 100) * BAR_WIDTH);
  const emptyPx = BAR_WIDTH - filledPx;

  return (
    <Html lang="en">
      <Head>
        <title>Complete your {company} profile</title>
        
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

          <Section style={bodySection}>
            <Text style={intro}>
              Clients browse profiles before posting tasks. A complete profile
              gets up to{" "}
              <strong style={{ color: "#1a2236", fontFamily: FONT }}>
                3× more visibility
              </strong>{" "}
              — here&apos;s exactly what&apos;s missing.
            </Text>

            <Row>
              <Column>
                <Text style={progLabelLeft}>Profile completion</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={progLabelRight}>{completionPercent}%</Text>
              </Column>
            </Row>

            <Section style={barTrackRow}>
              <Row>
                {filledPx > 0 && (
                  <Column
                    style={{
                      ...(emptyPx === 0 ? barFillCellFull : barFillCell),
                      width: `${filledPx}px`,
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

            {done.length > 0 && (
              <>
                <Text style={sectionLabel}>Completed</Text>
                {done.map((s) => (
                  <StepRow key={s.key} step={s} done />
                ))}
              </>
            )}

            {todo.length > 0 && (
              <>
                <Text style={sectionLabel}>Still missing</Text>
                {todo.map((s) => (
                  <StepRow key={s.key} step={s} done={false} />
                ))}
              </>
            )}

            <Section style={ctaSection}>
             
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

const StepRow = ({
  step,
  done,
}: {
  step: (typeof PROFILE_STEPS)[number];
  done: boolean;
}) => (
  <Section style={done ? stepDone : stepTodo}>
    <Row>
   
      <Column style={{ width: "36px", verticalAlign: "middle" }}>
        <Text style={{ margin: "0", lineHeight: "1", fontSize: "1px" }}>
          <span style={emojiStyle}>{step.icon}</span>
        </Text>
      </Column>

      <Column style={{ paddingLeft: "12px", verticalAlign: "middle" }}>
        <Text style={done ? stepTitleDone : stepTitleTodo}>
          {step.label}{" "}
          <span style={pctTag}>+{step.points}%</span>
        </Text>
        <Text style={done ? stepDescDone : stepDescTodo}>
          {step.description}
        </Text>
      </Column>

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