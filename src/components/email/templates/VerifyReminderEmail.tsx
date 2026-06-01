import {
    Body, Button, Container, Head,
    Heading, Hr, Html, Img, Link,
    Preview, Section, Text,
  } from "@react-email/components";
  import {
    body, container, divider, eyebrow,
    footer, footerLink, footerText, hero,
    heroHeading, heroSub, intro,
    sigName, signOff, sigRole,
  } from "../helpers/shared-style";
  
  interface VerifyReminderEmailProps {
    username?: string;
    company?: string;
    verifyUrl?: string;
  }
  
  export const VerifyReminderEmail = ({
    username,
    company = "Taskoria",
    verifyUrl = "https://www.taskoria.com/provider/dashboard",
  }: VerifyReminderEmailProps) => (
    <Html lang="en">
      <Head>
        <title>Please verify your email — {company}</title>
      </Head>
  
      <Preview>
        Your {company} account is almost ready — just verify your email to activate it.
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
            <Text style={eyebrow}>Action required</Text>
            <Heading style={heroHeading}>
              Verify your email{username ? `, ${username}` : ""}.
            </Heading>
            <Text style={heroSub}>
              Your account is almost ready — one tap to activate it.
            </Text>
          </Section>
  
          {/* ── Body ── */}
          <Section style={outerPad}>
            <Text style={intro}>
              Hi{" "}
              <strong style={{ color: "#1a2236" }}>{username ?? "there"}</strong>!
              You created a {company} account but haven&apos;t verified your
              email address yet. Your account won&apos;t be fully active until
              you do.
            </Text>
  
            {/* What you're missing box */}
            <Section style={infoBox}>
              <Text style={infoTitle}>What you&apos;re missing out on:</Text>
              <Text style={infoItem}>✦ &nbsp;Posting tasks and receiving quotes</Text>
              <Text style={infoItem}>✦ &nbsp;Messaging professionals directly</Text>
              <Text style={infoItem}>✦ &nbsp;Managing your bookings and payments</Text>
            </Section>
  
            {/* Spacer */}
            <Text style={spacer} />
  
            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={verifyUrl} style={ctaButton}>
                Verify my email →
              </Button>
              <Text style={ctaSub}>
                Opens {company} — the verification prompt will appear automatically
              </Text>
            </Section>
  
            {/* Spacer */}
            <Text style={spacer} />
  
            {/* Didn't sign up */}
            <Section style={warnBox}>
              <Text style={warnText}>
                Didn&apos;t create this account? You can safely ignore this email
                and the account will be automatically removed.
              </Text>
            </Section>
  
            <Hr style={divider} />
  
            <Text style={signOff}>
              Need help? Just reply to this email — we&apos;re happy to assist.
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
            </Text>
          </Section>
  
        </Container>
      </Body>
    </Html>
  );
  
  // ── Brand tokens ──────────────────────────────────────────
  const PRIMARY        = "#2563EB";
  const PRIMARY_LIGHT  = "#eff6ff";
  const PRIMARY_BORDER = "#bfdbfe";
  
  // ── Styles ────────────────────────────────────────────────
  const outerPad: React.CSSProperties = { padding: "32px 40px 28px" };
  
  const infoBox: React.CSSProperties = {
    backgroundColor: PRIMARY_LIGHT,
    borderLeft:   `4px solid ${PRIMARY}`,
    borderTop:    `1px solid ${PRIMARY_BORDER}`,
    borderRight:  `1px solid ${PRIMARY_BORDER}`,
    borderBottom: `1px solid ${PRIMARY_BORDER}`,
    borderRadius: "0 10px 10px 0",
    padding: "18px 22px",
  };
  
  const infoTitle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#1a2236",
    margin: "0 0 10px",
  };
  
  const infoItem: React.CSSProperties = {
    fontSize: "13px",
    color: "#3d4654",
    margin: "0 0 6px",
    lineHeight: "1.6",
  };
  
  const warnBox: React.CSSProperties = {
    backgroundColor: "#f9fafb",
    borderLeft:   "4px solid #d1d5db",
    borderTop:    "1px solid #e5e7eb",
    borderRight:  "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    borderRadius: "0 8px 8px 0",
    padding: "12px 16px",
  };
  
  const warnText: React.CSSProperties = {
    fontSize: "12.5px",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.6",
  };
  
  const spacer: React.CSSProperties = {
    margin: 0, padding: 0,
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