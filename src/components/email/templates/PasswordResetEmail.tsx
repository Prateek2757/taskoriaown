import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { PasswordResetEmailProps } from "../type";

export const PasswordResetEmail = ({
  username,
  company = "Taskoria",
  verifyCode,
}: PasswordResetEmailProps) => (
  <Html>
    <Head>
      <title>Reset Your Password</title>
    </Head>
    <Body
      style={{
        backgroundColor: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: "16px",
      }}
    >
      <Container
        style={{
          maxWidth: "600px",
          margin: "32px auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Section style={{ textAlign: "center" }}>
          <Img
            src="https://www.taskoria.com/images/taskoria_logo.svg"
            alt={`${company} Logo`}
            width="48"
            height="48"
            style={{ margin: "0 auto 24px" }}
          />
        </Section>

        <Heading
          style={{
            marginBottom: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          Reset Your Password
        </Heading>

        <Text
          style={{
            marginBottom: "24px",
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
          }}
        >
          Hi {username ?? "there"}, you requested to reset your password. Use
          the code below — it expires in 10 minutes.
        </Text>

        <Section
          style={{
            margin: "32px 0",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <Text
            style={{ marginBottom: "8px", fontSize: "14px", color: "#4b5563" }}
          >
            Your reset code:
          </Text>
          <Text
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              color: "#2563eb",
              margin: "8px 0",
            }}
          >
            {verifyCode}
          </Text>
        </Section>

        <Text style={{ marginTop: "24px", fontSize: "14px", color: "#4b5563" }}>
          If you didn't request this code, you can safely ignore this email.
          Your password will remain unchanged.
        </Text>

        <Section
          style={{
            marginTop: "32px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "24px",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              margin: "8px 0",
            }}
          >
            © {new Date().getFullYear()} {company}. All rights reserved.
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              margin: "8px 0",
            }}
          >
            <Link
              href="https://www.taskoria.com/privacy-policy"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
            {" | "}
            <Link
              href="https://taskoria.com/terms-and-conditions"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              Terms of Service
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
