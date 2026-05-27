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
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { ProviderEstimateEmailProps } from "../type";
import {
  body, container, divider, eyebrow,
  footer, footerLink, footerText, hero,
  heroHeading, heroSub, intro,
  sigName, signOff, sigRole,
} from "../helpers/shared-style";

export const ProviderEstimateEmail = ({
  company = "Taskoria",
  username,
  taskTitle,
  price,
  unit,
  messageFromProvider,
  professional_name,
  professional_company_name,
  professional_phone,
}: ProviderEstimateEmailProps) => {
  const showCompany =
    professional_company_name &&
    professional_company_name.trim().toLowerCase() !==
      professional_name?.trim().toLowerCase();

  const hasPro = professional_name || showCompany || professional_phone;

  return (
    <Html lang="en">
      <Head>
        <title>You received a new estimate — {company}</title>
      </Head>

      <Preview>
        A professional submitted a quote for &quot;{taskTitle ?? "your task"}&quot; — review it now.
      </Preview>

      <Body style={body}>
        <Container style={container}>

          {/* ── Hero ── */}
          <Section style={hero}>
            <Img
              src="https://www.taskoria.com/images/taskoria_logo.svg"
              alt={`${company} logo`}
              width="44"
              height="44"
              style={{ display: "block", margin: "0 auto 18px" }}
            />
            <Text style={eyebrow}>New estimate received</Text>
            <Heading style={heroHeading}>
              You&apos;ve got a quote for your task.
            </Heading>
            <Text style={heroSub}>
              A professional submitted a price for &quot;
              {taskTitle ?? "your task"}&quot;.
            </Text>
          </Section>

          <Section style={outerPad}>

            <Text style={intro}>
              Hi{" "}
              <strong style={{ color: "#1a2236" }}>
                {username ?? "there"}
              </strong>
              ! A service professional has submitted an estimate for your task.
              Review the details below and reply if you&apos;d like to proceed.
            </Text>

            <Section style={priceBox}>
              <Text style={priceLabel}>Estimated price</Text>
              <Text style={priceValue}>
                A$ {price ?? "—"}
              </Text>
              {unit && <Text style={priceUnit}>{unit}</Text>}

              {messageFromProvider && (
                <>
                  <Text style={msgLabel}>Additional details</Text>
                  <Section style={msgBubble}>
                    <Text style={msgText}>{messageFromProvider}</Text>
                  </Section>
                </>
              )}
            </Section>

            {/* Spacer */}
            <Text style={spacer} />

            {/* Professional info */}
            {hasPro && (
              <Section style={proBox}>
                <Text style={proSectionLabel}>Service professional</Text>

                {professional_name && (
                  <Row style={proRow}>
                    <Column style={proKeyCol}>
                      <Text style={proKey}>Name</Text>
                    </Column>
                    <Column>
                      <Text style={proVal}>{professional_name}</Text>
                    </Column>
                  </Row>
                )}

                {showCompany && (
                  <Row style={proRow}>
                    <Column style={proKeyCol}>
                      <Text style={proKey}>Company</Text>
                    </Column>
                    <Column>
                      <Text style={proVal}>{professional_company_name}</Text>
                    </Column>
                  </Row>
                )}

                {professional_phone && (
                  <Row style={proRow}>
                    <Column style={proKeyCol}>
                      <Text style={proKey}>Phone</Text>
                    </Column>
                    <Column>
                      <Text style={proVal}>
                        <Link
                          href={`tel:${professional_phone}`}
                          style={phoneLink}
                        >
                          {professional_phone}
                        </Link>
                      </Text>
                    </Column>
                  </Row>
                )}
              </Section>
            )}

            {/* Spacer */}
            <Text style={spacer} />

            {/* CTA */}
            {/* <Section style={ctaSection}>
              <Button
                href="https://www.taskoria.com/tasks"
                style={ctaButton}
              >
                View full estimate →
              </Button>
              <Text style={ctaSub}>
                Log in to accept, decline, or ask a question
              </Text>
            </Section> */}

            <Hr style={divider} />

            <Text style={signOff}>
              If you have any questions, just reply to this email — we&apos;re
              always happy to help.
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
              <Link href="https://www.taskoria.com/privacy-policy" style={footerLink}>
                Privacy Policy
              </Link>
              {" · "}
              <Link href="https://www.taskoria.com/terms-and-conditions" style={footerLink}>
                Terms of Service
              </Link>
              {" · "}
              <Link href="https://www.taskoria.com/unsubscribe" style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

// ── Brand tokens ──────────────────────────────────────────
const PRIMARY        = "#2563EB";
const PRIMARY_LIGHT  = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";

// ── Styles ────────────────────────────────────────────────
const outerPad: React.CSSProperties = {
  padding: "32px 40px 28px",
};

// Price box — border-left accent for Outlook compatibility
const priceBox: React.CSSProperties = {
  backgroundColor: PRIMARY_LIGHT,
  borderLeft: `4px solid ${PRIMARY}`,
  borderTop: `1px solid ${PRIMARY_BORDER}`,
  borderRight: `1px solid ${PRIMARY_BORDER}`,
  borderBottom: `1px solid ${PRIMARY_BORDER}`,
  borderRadius: "0 10px 10px 0",
  padding: "22px 24px",
};

const priceLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#6b7585",
  margin: "0 0 8px",
};

const priceValue: React.CSSProperties = {
  fontSize: "38px",
  fontWeight: "bold",
  color: PRIMARY,
  margin: "0 0 4px",
  lineHeight: "1.1",
};

const priceUnit: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7585",
  margin: "0 0 16px",
};

const msgLabel: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#1a2236",
  margin: "0 0 6px",
};

// msgBubble padding lives on Section <td>
const msgBubble: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderTop: `1px solid ${PRIMARY_BORDER}`,
  borderLeft: `1px solid ${PRIMARY_BORDER}`,
  borderRight: `1px solid ${PRIMARY_BORDER}`,
  borderBottom: `1px solid ${PRIMARY_BORDER}`,
  borderRadius: "6px",
  padding: "10px 14px",
};

const msgText: React.CSSProperties = {
  fontSize: "13px",
  color: "#3d4654",
  lineHeight: "1.7",
  margin: 0,
};

// Professional info box
const proBox: React.CSSProperties = {
  backgroundColor: "#f7f9fc",
  borderTop: "1px solid #e2e6ed",
  borderLeft: "1px solid #e2e6ed",
  borderRight: "1px solid #e2e6ed",
  borderBottom: "1px solid #e2e6ed",
  borderRadius: "10px",
  padding: "18px 20px",
};

const proSectionLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#9aa0aa",
  margin: "0 0 12px",
};

const proRow: React.CSSProperties = {
  marginBottom: "8px",
};

const proKeyCol: React.CSSProperties = {
  width: "72px",
  verticalAlign: "top",
};

const proKey: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#1a2236",
  margin: 0,
};

const proVal: React.CSSProperties = {
  fontSize: "13px",
  color: "#3d4654",
  margin: 0,
};

const phoneLink: React.CSSProperties = {
  color: PRIMARY,
  textDecoration: "none",
};

// Spacer — reliable vertical gap for all clients
const spacer: React.CSSProperties = {
  margin: 0,
  padding: 0,
  lineHeight: "20px",
  fontSize: "1px",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  padding: "4px 0 0",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: PRIMARY,
  color: "#ffffff",
  padding: "13px 36px",
  fontSize: "15px",
  fontWeight: "bold",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  msoPaddingAlt: "13px 36px",
};

const ctaSub: React.CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0",
};