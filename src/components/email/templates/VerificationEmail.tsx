import {
  Body,
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
import { VerificationEmailProps } from "../type";

export const VerificationEmail = ({
  company = "Taskoria",
  verifyCode,
}: VerificationEmailProps) => {
  const digits = verifyCode.toString().split("");

  return (
    <Html lang="en">
      <Head>
        <title>Verify your email — {company}</title>
      </Head>

      <Preview>
        Your {company} verification code is {verifyCode} — expires in 10 minutes.
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
            <Text style={eyebrow}>Email verification</Text>
            <Heading style={heroHeading}>
              Confirm your email address
            </Heading>
          </Section>

          <Section style={bodySection}>
            <Text style={intro}>
              Hi there! Use the verification code below to confirm your email
              address and activate your {company} account. The code expires in{" "}
              <strong style={{ color: "#1a2236" }}>10 minutes</strong>.
            </Text>

            {/* Code box */}
            <Section style={codeWrap}>
              <Text style={codeLabel}>Your verification code</Text>

              {/* Individual digit boxes */}
              <Row style={{ marginBottom: "12px" }}>
                {digits.map((digit, i) => (
                  <Column key={i} style={digitCol}>
                    <Text style={digitText}>{digit}</Text>
                  </Column>
                ))}
              </Row>

              <Text style={expiryText}>
                Expires in <strong style={{ color: "#d97706" }}>10 minutes</strong>
              </Text>
            </Section>

            {/* Security warning */}
            <Section style={warningBox}>
              <Text style={warningText}>
                🔒 Never share this code with anyone. {company} will never ask
                for your verification code via phone or email.
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={signOff}>
              If you didn&apos;t create a {company} account, you can safely
              ignore this email.
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
};

const PRIMARY        = "#2563EB";
const PRIMARY_LIGHT  = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";

const body: React.CSSProperties = {
  backgroundColor: "#eef0f3",
  fontFamily: "'DM Sans', Arial, sans-serif",
  margin: 0,
  padding: "32px 16px",
};

const container: React.CSSProperties = {
  maxWidth: "540px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #d4d8de",
};

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f1d47 0%, #162d78 55%, #1a3799 100%)",
  padding: "36px 40px 40px",
  textAlign: "center",
};

const eyebrow: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "500",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.45)",
  margin: "0 0 10px",
};

const heroHeading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#ffffff",
  margin: 0,
  lineHeight: "1.3",
};

const bodySection: React.CSSProperties = {
  padding: "32px 40px 28px",
};

const intro: React.CSSProperties = {
  fontSize: "14.5px",
  lineHeight: "1.75",
  color: "#3d4654",
  margin: "0 0 28px",
};

// Code box
const codeWrap: React.CSSProperties = {
  backgroundColor: PRIMARY_LIGHT,
  border: `1.5px dashed ${PRIMARY}`,
  borderRadius: "12px",
  padding: "24px 20px",
  textAlign: "center",
  marginBottom: "16px",
};

const codeLabel: React.CSSProperties = {
  fontSize: "11.5px",
  fontWeight: "500",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#6b7585",
  margin: "0 0 14px",
};

// Each digit cell
const digitCol: React.CSSProperties = {
  width: "44px",
  padding: "0 4px",
  textAlign: "center",
};

const digitText: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: `1.5px solid ${PRIMARY_BORDER}`,
  borderRadius: "8px",
  fontSize: "26px",
  fontWeight: "700",
  color: PRIMARY,
  fontFamily: "'Courier New', monospace",
  padding: "10px 0",
  margin: 0,
  textAlign: "center",
};

const expiryText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0",
};

const warningBox: React.CSSProperties = {
  backgroundColor: "#fffbeb",
  border: "0.5px solid #fde68a",
  borderRadius: "8px",
  padding: "12px 16px",
  marginBottom: "24px",
};

const warningText: React.CSSProperties = {
  fontSize: "12.5px",
  color: "#92400e",
  margin: 0,
  lineHeight: "1.6",
};

const divider: React.CSSProperties = {
  borderColor: "#e8eaf0",
  margin: "4px 0 20px",
};

const signOff: React.CSSProperties = {
  fontSize: "14px",
  color: "#5a6070",
  lineHeight: "1.75",
  margin: "0 0 4px",
};

const sigName: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#1a2236",
  margin: "2px 0 2px",
};

const sigRole: React.CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: 0,
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
  margin: "0 0 6px",
};

const footerLink: React.CSSProperties = {
  color: PRIMARY,
  textDecoration: "none",
};