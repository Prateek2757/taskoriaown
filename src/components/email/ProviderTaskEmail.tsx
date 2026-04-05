import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components";

export interface ProviderTaskEmailProps {
  customerName?: string;
  taskTitle?: string;
  taskLocation?: string;
  taskPostcode?: string;
  isRemote?: boolean;
  creditsRequired?: number;
  maskedPhone?: string;
  maskedEmail?: string;
  taskDescription?: string;
  respondedCount?: number;
  totalSlots?: number;
  isUrgent?: boolean;
  mapImageUrl?: string;
  projectDetails?: { question: string; answer: string }[];
  taskId?: string | number;
  company?: string;
  baseUrl?: string;
  lastUpdated?: string;
}

const ProviderTaskEmail = ({
  customerName = "the customer",
  taskTitle = "Web Developer Needed",
  taskLocation = "London",
  taskPostcode = "",
  isRemote = false,
  creditsRequired = 20,
  maskedPhone = "011********",
  maskedEmail = "s*****@g***.com",
  taskDescription = "I need a professional to help with my project.",
  respondedCount = 2,
  totalSlots = 5,
  isUrgent = false,
  mapImageUrl,
  projectDetails = [],
  taskId = "",
  company = "Taskoria",
  baseUrl = "https://www.taskoria.com",
  lastUpdated,
}: ProviderTaskEmailProps) => {
  const leadsUrl = `${baseUrl}/provider/leads`;
  const taskUrl = taskId ? `${leadsUrl}?task=${taskId}` : leadsUrl;
  const spotsLeft = totalSlots - respondedCount;
  const isAlmostFull = spotsLeft <= 2;
  const progressPercent = Math.round((respondedCount / totalSlots) * 100);

  return (
    <Html lang="en">
      <Head>
        <title>
          {customerName} is looking for a {taskTitle}
        </title>
      </Head>

      <Preview>
        🔔 {customerName} is looking for a {taskTitle} in {taskLocation} —{" "}
        {creditsRequired} credits to respond
      </Preview>

      <Body style={s.body}>
        {/* ── TOP BRAND BAR ── */}
        <Section style={s.brandBar}>
          <Container style={s.brandBarInner}>
            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/images/taskoria_logo.svg`}
                  alt={company}
                  width="30"
                  height="30"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                />
                <Text style={s.brandName}>{company}</Text>
              </Column>
              <Column style={{ textAlign: "right" as const }}>
                <Text style={s.brandTagline}>
                  Connecting pros with customers
                </Text>
              </Column>
            </Row>
          </Container>
        </Section>

        {/* ── ALERT STRIP ── */}
        <Section style={s.alertStrip}>
          <Container style={{ maxWidth: "620px", margin: "0 auto" }}>
            <Text style={s.alertText}>
              🚨 New lead available — be one of the first to respond!
            </Text>
          </Container>
        </Section>

        <Container style={s.outerContainer}>
          {/* ── MAIN HERO CARD ── */}
          <Section style={s.heroCard}>
            {isUrgent && (
              <Section style={s.urgencyBanner}>
                <Text style={s.urgencyText}>
                  ⚡ URGENT — This customer needs help fast. Respond now.
                </Text>
              </Section>
            )}

            <Section style={s.heroBody}>
              <Heading style={s.taskTitle}>
                🔔 {customerName} is looking for a {taskTitle}
              </Heading>

              <Text style={s.locationLine}>
                📍 {taskLocation}
                {taskPostcode ? `, ${taskPostcode}` : ""}
                {isRemote ? ": Happy to receive service remote or online" : ""}
              </Text>

              {/* Badges row */}
              <Row style={{ marginBottom: "20px" }}>
                {isUrgent && (
                  <Column style={{ paddingRight: "10px", width: "auto" }}>
                    <Text style={s.badgeOrange}>⚡ Urgent</Text>
                  </Column>
                )}
                <Column style={{ paddingRight: "10px", width: "auto" }}>
                  <Text style={s.badgeGreen}>ℹ️ Additional details</Text>
                </Column>
                {isAlmostFull && (
                  <Column style={{ width: "auto" }}>
                    <Text style={s.badgeRed}>🔥 Almost full</Text>
                  </Column>
                )}
              </Row>

              <Hr style={s.divider} />

              {/* Two-column: info left | map right */}
              <Row>
                <Column
                  style={{
                    width: "52%",
                    paddingRight: "20px",
                    verticalAlign: "top",
                  }}
                >
                  {/* Credits */}
                  <Row style={{ marginBottom: "18px" }}>
                    <Column style={{ width: "40px", verticalAlign: "middle" }}>
                      <Section style={s.iconBox}>
                        <Text style={s.iconEmoji}>💳</Text>
                      </Section>
                    </Column>
                    <Column style={{ verticalAlign: "middle" }}>
                      <Text style={s.infoValue}>
                        {creditsRequired} credits to respond
                      </Text>
                    </Column>
                  </Row>

                  {/* Phone */}
                  <Row style={{ marginBottom: "18px" }}>
                    <Column style={{ width: "40px", verticalAlign: "middle" }}>
                      <Section style={s.iconBox}>
                        <Text style={s.iconEmoji}>📞</Text>
                      </Section>
                    </Column>
                    <Column style={{ verticalAlign: "middle" }}>
                      <Text style={s.infoValue}>{maskedPhone}</Text>
                    </Column>
                  </Row>

                  {/* Email */}
                  <Row style={{ marginBottom: "18px" }}>
                    <Column style={{ width: "40px", verticalAlign: "middle" }}>
                      <Section style={s.iconBox}>
                        <Text style={s.iconEmoji}>✉️</Text>
                      </Section>
                    </Column>
                    <Column style={{ verticalAlign: "middle" }}>
                      <Text style={s.infoValueBlue}>{maskedEmail}</Text>
                    </Column>
                  </Row>

                  {/* Description */}
                  <Row>
                    <Column style={{ width: "40px", verticalAlign: "top" }}>
                      <Section style={s.iconBox}>
                        <Text style={s.iconEmoji}>ℹ️</Text>
                      </Section>
                    </Column>
                    <Column style={{ verticalAlign: "top" }}>
                      <Text style={s.descriptionText}>
                        &ldquo;{taskDescription}&rdquo;
                      </Text>
                    </Column>
                  </Row>
                </Column>

                {/* Right: Map + Stats */}
                <Column style={{ width: "48%", verticalAlign: "top" }}>
                  {mapImageUrl ? (
                    <Img
                      src={mapImageUrl}
                      alt={`Map of ${taskLocation}`}
                      width="100%"
                      style={s.mapImage}
                    />
                  ) : (
                    <Section style={s.mapPlaceholder}>
                      <Text style={s.mapPlaceholderEmoji}>🗺️</Text>
                      <Text style={s.mapPlaceholderText}>{taskLocation}</Text>
                    </Section>
                  )}

                  <Section style={s.statsCard}>
                    <Text style={s.statMain}>
                      {respondedCount}/{totalSlots} professionals have responded
                    </Text>
                    {lastUpdated && (
                      <Text style={s.statSub}>Last updated {lastUpdated}</Text>
                    )}
                    {/* Progress bar */}
                    <Section style={s.progressTrack}>
                      <Section
                        style={{
                          ...s.progressFill,
                          width: `${progressPercent}%`,
                          backgroundColor: isAlmostFull ? "#ef4444" : "#2563eb",
                        }}
                      />
                    </Section>
                    <Row style={{ marginTop: "6px" }}>
                      <Column>
                        <Text style={s.statSubSmall}>
                          {respondedCount} responded
                        </Text>
                      </Column>
                      <Column style={{ textAlign: "right" as const }}>
                        <Text
                          style={
                            isAlmostFull ? s.spotsLeftRed : s.spotsLeftBlue
                          }
                        >
                          {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                </Column>
              </Row>

              {/* CTA Buttons */}
              <Row style={{ marginTop: "28px" }}>
                <Column style={{ paddingRight: "12px", width: "50%" }}>
                  <Button href={taskUrl} style={s.btnPrimary}>
                    Contact {customerName}
                  </Button>
                </Column>
                <Column style={{ width: "50%" }}>
                  <Button href={taskUrl} style={s.btnOutline}>
                    View details
                  </Button>
                </Column>
              </Row>
            </Section>

            <Section style={s.securityBanner}>
              <Text style={s.securityText}>
                🔒 For security purposes, please do not forward this email
              </Text>
            </Section>
          </Section>

          {/* ── PROJECT DETAILS CARD ── */}
          {projectDetails.length > 0 && (
            <Section style={s.detailsCard}>
              <Heading style={s.detailsHeading}>Project Details</Heading>
              <Hr style={{ ...s.divider, marginTop: 0 }} />

              {projectDetails.map((item, i) => (
                <Section key={i} style={{ marginBottom: "14px" }}>
                  <Text style={s.questionText}>{item.question}</Text>
                  <Text style={s.answerText}>{item.answer}</Text>
                </Section>
              ))}

              <Section
                style={{ marginTop: "28px", textAlign: "center" as const }}
              >
                <Button href={taskUrl} style={s.btnPrimary}>
                  Respond to this lead
                </Button>
              </Section>

              <Section style={{ ...s.securityBanner, marginTop: "28px" }}>
                <Text style={s.securityText}>
                  🔒 For security purposes, please do not forward this email
                </Text>
              </Section>
            </Section>
          )}

          {/* ── UPSELL CARD ── */}
          <Section style={s.upsellCard}>
            <Section style={s.upsellHeader}>
              <Text style={s.upsellEyebrow}>💡 Don't have credits yet?</Text>
            </Section>

            <Section style={s.upsellBodySection}>
              <Heading style={s.upsellHeading}>
                Contact {customerName} with 20% off your starter pack
              </Heading>
              <Text style={s.upsellPara}>
                You'll need credits to contact customers. Our discounted starter
                pack gives enough credits for about{" "}
                <strong>10 responses</strong> and is backed by our{" "}
                <strong>Get Hired Guarantee.</strong>
              </Text>
              <Text style={s.upsellPara}>
                If you don't get hired at least once from your starter pack,
                we'll give you all your credits back.
              </Text>

              <Row style={{ margin: "20px 0" }}>
                <Column
                  style={{ textAlign: "center" as const, paddingRight: "6px" }}
                >
                  <Text style={s.trustBadge}>✅ Money-back guarantee</Text>
                </Column>
                <Column
                  style={{ textAlign: "center" as const, paddingRight: "6px" }}
                >
                  <Text style={s.trustBadge}>⚡ Instant activation</Text>
                </Column>
                <Column style={{ textAlign: "center" as const }}>
                  <Text style={s.trustBadge}>🔒 Secure payment</Text>
                </Column>
              </Row>

              <Button href={leadsUrl} style={s.btnPrimary}>
                Contact {customerName}
              </Button>
            </Section>

            <Section style={s.securityBanner}>
              <Text style={s.securityText}>
                🔒 For security purposes, please do not forward this email
              </Text>
            </Section>
          </Section>

          {/* ── FOOTER ── */}
          <Section style={s.footer}>
            <Text style={s.footerSmall}>
              Add {company} to your email contacts to ensure all our content
              goes straight to your inbox.
            </Text>
            <Text style={s.footerSmall}>
              You receive emails because you opted in via our website.{" "}
              <Link href={`${baseUrl}/preferences`} style={s.footerLink}>
                Manage preferences
              </Link>
            </Text>
            <Hr style={{ borderColor: "#e2e8f0", margin: "16px 0" }} />
            <Text style={s.footerCopy}>
              © {new Date().getFullYear()} {company}. All rights reserved.
            </Text>
            <Text style={s.footerLinks}>
              <Link href={`${baseUrl}/privacy-policy`} style={s.footerLink}>
                Privacy Policy
              </Link>
              {"  ·  "}
              <Link
                href={`${baseUrl}/terms-and-conditions`}
                style={s.footerLink}
              >
                Terms of Service
              </Link>
              {"  ·  "}
              <Link href={`${baseUrl}/unsubscribe`} style={s.footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#eef0f3",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    margin: 0,
    padding: 0,
  },
  brandBar: { backgroundColor: "#0f172a", padding: 0 },
  brandBarInner: { maxWidth: "620px", margin: "0 auto", padding: "14px 24px" },
  brandName: {
    display: "inline-block",
    verticalAlign: "middle",
    marginLeft: "10px",
    fontSize: "17px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 0 10px",
    letterSpacing: "-0.3px",
  },
  brandTagline: {
    fontSize: "12px",
    color: "#64748b",
    margin: 0,
    textAlign: "right",
  },
  alertStrip: { backgroundColor: "#1d4ed8", padding: "10px 0" },
  alertText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    margin: 0,
  },
  outerContainer: { maxWidth: "620px", margin: "0 auto" },
  heroCard: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
    marginBottom: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  urgencyBanner: {
    backgroundColor: "#fffbeb",
    borderLeft: "4px solid #f59e0b",
    padding: "10px 28px",
  },
  urgencyText: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#92400e",
    margin: 0,
  },
  heroBody: { padding: "28px 28px 24px" },
  taskTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 8px",
    lineHeight: "1.3",
    letterSpacing: "-0.4px",
  },
  locationLine: {
    fontSize: "15px",
    color: "#475569",
    margin: "0 0 16px",
    fontWeight: "500",
  },
  badgeOrange: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#92400e",
    backgroundColor: "#fef3c7",
    border: "1px solid #fcd34d",
    borderRadius: "20px",
    padding: "4px 12px",
    margin: 0,
  },
  badgeGreen: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#14532d",
    backgroundColor: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: "20px",
    padding: "4px 12px",
    margin: 0,
  },
  badgeRed: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#991b1b",
    backgroundColor: "#fee2e2",
    border: "1px solid #fca5a5",
    borderRadius: "20px",
    padding: "4px 12px",
    margin: 0,
  },
  divider: { borderColor: "#f1f5f9", margin: "20px 0" },
  iconBox: {
    width: "36px",
    height: "36px",
    backgroundColor: "#f1f5f9",
    borderRadius: "10px",
    textAlign: "center",
  },
  iconEmoji: { fontSize: "16px", margin: "8px 0 0", textAlign: "center" },
  infoValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "6px 0 0",
  },
  infoValueBlue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#2563eb",
    margin: "6px 0 0",
  },
  descriptionText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.65",
    margin: "6px 0 0",
    fontStyle: "italic",
  },
  mapImage: {
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    display: "block",
    width: "100%",
  },
  mapPlaceholder: {
    backgroundColor: "#dbeafe",
    borderRadius: "10px",
    padding: "36px 16px",
    textAlign: "center",
  },
  mapPlaceholderEmoji: {
    fontSize: "28px",
    margin: "0 0 6px",
    textAlign: "center",
  },
  mapPlaceholderText: {
    fontSize: "13px",
    color: "#1e40af",
    fontWeight: "600",
    margin: 0,
    textAlign: "center",
  },
  statsCard: {
    marginTop: "10px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
  },
  statMain: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    margin: "0 0 2px",
  },
  statSub: { fontSize: "11px", color: "#94a3b8", margin: "0 0 8px" },
  statSubSmall: { fontSize: "11px", color: "#94a3b8", margin: 0 },
  progressTrack: {
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    height: "6px",
    overflow: "hidden",
  },
  progressFill: { height: "6px", borderRadius: "4px" },
  spotsLeftBlue: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#2563eb",
    margin: 0,
    textAlign: "right",
  },
  spotsLeftRed: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#dc2626",
    margin: 0,
    textAlign: "right",
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    padding: "14px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    display: "block",
    textAlign: "center",
    letterSpacing: "-0.2px",
  },
  btnOutline: {
    backgroundColor: "#ffffff",
    color: "#2563eb",
    fontSize: "15px",
    fontWeight: "700",
    padding: "13px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    display: "block",
    textAlign: "center",
    border: "2px solid #2563eb",
    letterSpacing: "-0.2px",
  },
  securityBanner: { backgroundColor: "#0f172a", padding: "12px 24px" },
  securityText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8",
    textAlign: "center",
    margin: 0,
    letterSpacing: "0.03em",
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    padding: "28px",
    marginBottom: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  detailsHeading: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 16px",
    letterSpacing: "-0.4px",
  },
  questionText: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 3px",
  },
  answerText: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
    lineHeight: "1.5",
  },
  upsellCard: {
    backgroundColor: "#ffffff",
    marginBottom: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  upsellHeader: {
    backgroundColor: "#eff6ff",
    borderBottom: "1px solid #bfdbfe",
    padding: "10px 28px",
  },
  upsellEyebrow: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#1d4ed8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: 0,
  },
  upsellBodySection: { padding: "24px 28px" },
  upsellHeading: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 16px",
    lineHeight: "1.35",
    letterSpacing: "-0.4px",
  },
  upsellPara: {
    fontSize: "15px",
    color: "#475569",
    lineHeight: "1.7",
    margin: "0 0 10px",
  },
  trustBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#166534",
    backgroundColor: "#dcfce7",
    borderRadius: "20px",
    padding: "4px 8px",
    margin: 0,
    textAlign: "center",
  },
  footer: { padding: "24px 16px 32px", textAlign: "center" },
  footerSmall: {
    fontSize: "12px",
    color: "#94a3b8",
    textAlign: "center",
    margin: "0 0 6px",
    lineHeight: "1.7",
  },
  footerCopy: {
    fontSize: "12px",
    color: "#94a3b8",
    textAlign: "center",
    margin: "0 0 8px",
  },
  footerLinks: {
    fontSize: "12px",
    color: "#94a3b8",
    textAlign: "center",
    margin: 0,
  },
  footerLink: { color: "#2563eb", textDecoration: "underline" },
};

export default ProviderTaskEmail;
