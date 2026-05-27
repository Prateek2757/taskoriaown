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
import { WelcomeEmailProps } from "../type";

const features = [
  {
    icon: "👥",
    title: "Vetted Professionals",
    desc: "Browse verified experts across every category.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "Funds released only when you approve the work.",
  },
  {
    icon: "⚡",
    title: "Fast Turnaround",
    desc: "Post a task and get proposals within hours.",
  },
  {
    icon: "⭐",
    title: "Satisfaction Guarantee",
    desc: "Not happy? We make it right, every time.",
  },
];

export const WelcomeEmail = ({
  username,
  company = "Taskoria",
}: WelcomeEmailProps) => (
  <Html lang="en">
    <Head>
      <title>Welcome to {company}</title>
    </Head>

    <Preview>
      You're in, {username ?? "there"}! Your {company} account is ready.
    </Preview>

    <Body style={body}>
      <Container style={container}>
        <Section style={hero}>
          <Img
            src="https://www.taskoria.com/images/taskoria_logo.svg"
            alt={`${company} logo`}
            width="44"
            height="44"
            style={logoStyle}
          />
          <Text style={eyebrow}>Welcome aboard</Text>
          <Heading style={heroHeading}>
            Hello, {username ?? "there"} —{"\n"}great to have you.
          </Heading>
        </Section>

        <Section style={bodySection}>
          <Text style={intro}>
            Your {company} account is all set. You now have access to a vetted
            network of skilled professionals ready to help you get things done —
            faster, smarter, and stress-free.
          </Text>

          {[features.slice(0, 2), features.slice(2, 4)].map((row, ri) => (
            <Row key={ri} style={{ marginBottom: "10px" }}>
              {row.map((f) => (
                <Column key={f.title} style={featureCol}>
                  <Section style={featureCard}>
                    <Text style={featureIcon}>{f.icon}</Text>
                    <Text style={featureTitle}>{f.title}</Text>
                    <Text style={featureDesc}>{f.desc}</Text>
                  </Section>
                </Column>
              ))}
            </Row>
          ))}

          <Section style={ctaSection}>
            <Button href="https://www.taskoria.com" style={ctaButton}>
              Post your first task →
            </Button>
            <Text style={ctaSub}>Takes less than 2 minutes</Text>
          </Section>

          <Hr style={divider} />

          <Text style={signOff}>
            If you have any questions, just reply to this email — we're always
            happy to help.
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

const PRIMARY = "#2563EB";
const PRIMARY_DARK = "#1d4ed8";
4;
const PRIMARY_LIGHT = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";

const body: React.CSSProperties = {
  backgroundColor: "#eef0f3",
  fontFamily: "'DM Sans', Arial, sans-serif",
  margin: 0,
  padding: "32px 16px",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #d4d8de",
};

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f1d47 0%, #162d78 55%, #1a3799 100%)",
  padding: "40px 40px 48px",
  textAlign: "center",
};

const logoStyle: React.CSSProperties = {
  margin: "0 auto 20px",
  display: "block",
};

const eyebrow: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "500",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  margin: "0 0 10px",
};

const heroHeading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "600",
  color: "#ffffff",
  margin: 0,
  lineHeight: "1.35",
};

const bodySection: React.CSSProperties = {
  padding: "36px 40px 28px",
};

const intro: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.75",
  color: "#3d4654",
  margin: "0 0 28px",
};

const featureCol: React.CSSProperties = {
  width: "50%",
  paddingRight: "5px",
};

const featureCard: React.CSSProperties = {
  backgroundColor: PRIMARY_LIGHT, // was #f7f9fc
  border: `1px solid ${PRIMARY_BORDER}`, // was #e2e6ed
  borderRadius: "8px",
  padding: "14px 16px",
};

const featureIcon: React.CSSProperties = {
  fontSize: "20px",
  margin: "0 0 6px",
  lineHeight: "1",
};
const featureTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#1e3a8a", // blue-900 — dark text on light blue bg
  margin: "0 0 4px",
};

const featureDesc: React.CSSProperties = {
  fontSize: "12px",
  color: "#3b5bb5", // blue-700 — muted, but on-brand
  lineHeight: "1.5",
  margin: 0,
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: PRIMARY, // was #1a56db
  color: "#ffffff",
  padding: "13px 36px",
  fontSize: "15px",
  fontWeight: "600",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};

const ctaSub: React.CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0",
};

const divider: React.CSSProperties = {
  borderColor: "#e8eaf0",
  margin: "4px 0 20px",
};

const signOff: React.CSSProperties = {
  fontSize: "14px",
  color: "#5a6070",
  lineHeight: "1.7",
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
  backgroundColor: PRIMARY_LIGHT, // was #f7f9fc
  borderTop: `1px solid ${PRIMARY_BORDER}`,
  padding: "18px 40px",
  textAlign: "center",
};

const footerLink: React.CSSProperties = {
  color: PRIMARY,
  textDecoration: "none",
};

const footerText: React.CSSProperties = {
  fontSize: "11.5px",
  color: "#9aa0aa",
  margin: "0 0 6px",
};
