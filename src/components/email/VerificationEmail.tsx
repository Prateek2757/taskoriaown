import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
  Link,
} from "@react-email/components";

export type EmailType =
  | "welcome"
  | "task-posted"
  | "task-posted-no-budget"
  | "provider-new-task"
  | "verification"
  | "password-reset-code";

interface AppEmailProps {
  type: EmailType;
  username?: string;
  company?: string;
  verifyCode?: string;
  taskTitle?: string;
  taskLocation?: string;
}

const getEmailContent = ({
  type,
  username,
  company,
  verifyCode,
  taskTitle,
  taskLocation,
}: AppEmailProps) => {
  switch (type) {
    case "welcome":
      return {
        heading: `Welcome to ${company}, ${username ?? "there"}!`,
        message:
          "We're excited to have you onboard. Find trusted professionals and get tasks done faster.",
        buttonText: "Get Started",
        buttonLink: "https://taskoria.com",
      };
    case "task-posted":
      return {
        heading: "Your task has been posted 🎉",
        message: `Hi ${username ?? "there"}, your task "${
          taskTitle ?? "Untitled Task"
        }" ${
          taskLocation ? `in ${taskLocation}` : ""
        } has been successfully posted.`,
        buttonText: "View Task",
        buttonLink: "https://taskoria.com/customer/dashboard",
      };
    case "provider-new-task":
      return {
        heading: "🚨 New task available!",
        message: `Hi ${username ?? "there"}, a new task "${
          taskTitle ?? "Untitled Task"
        }" ${
          taskLocation ? `in ${taskLocation}` : ""
        } matches your service category. Submit your quotation early to increase your chances.`,
        buttonText: "View Task",
        buttonLink: "https://taskoria.com/provider/leads",
      };
    case "task-posted-no-budget":
      return {
        heading: "⚠️ Task Posted Without Budget",
        message: `A task has been posted without specifying a budget. Task: ${
          taskTitle ?? "Untitled Task"
        } ${taskLocation ? `Location: ${taskLocation}` : ""} Please review it.`,
        buttonText: "Review Task",
        buttonLink: "https://taskoria.com/adminbudgetmanager",
      };
    case "verification":
      return {
        heading: "Verify your email address",
        message:
          "Use the code below to verify your email address and complete your registration.",
        buttonText: verifyCode || "Verify",
        buttonLink: "#",
      };
    case "password-reset-code":
      return {
        heading: "Reset Your Password",
        message: `Hi ${username ?? "there"}, you requested to reset your password. Use the code below to reset your password. This code will expire in 10 minutes.`,
        buttonText: verifyCode || "123456",
        buttonLink: "#",
      };
    default:
      return { heading: "", message: "" };
  }
};

const AppEmail = (props: AppEmailProps) => {
  const company = props.company ?? "Taskoria";
  const content = getEmailContent({ ...props, company });

  return (
    <Html>
      <Head>
        <title>{content.heading}</title>
      </Head>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: "16px" }}>
        <Container style={{ maxWidth: "600px", margin: "32px auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <Section style={{ textAlign: "center" }}>
            <Img
              src="https://taskoria.com/taskorialogonew.png"
              alt={`${company} Logo`}
              width="48"
              height="48"
              style={{ margin: "0 auto 24px" }}
            />
          </Section>

          <Heading style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
            {content.heading}
          </Heading>

          <Text style={{ marginBottom: "24px", fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
            {content.message}
          </Text>

          {(props.type === "verification" ||
            props.type === "password-reset-code") &&
            props.verifyCode && (
              <Section style={{ margin: "32px 0", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "24px", textAlign: "center" }}>
                <Text style={{ marginBottom: "8px", fontSize: "14px", color: "#4b5563" }}>
                  Your verification code:
                </Text>
                <Text style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "0.1em", color: "#2563eb", margin: "8px 0" }}>
                  {props.verifyCode}
                </Text>
              </Section>
            )}

          {content.buttonText &&
            content.buttonLink !== "#" &&
            props.type !== "verification" &&
            props.type !== "password-reset-code" && (
              <Section style={{ margin: "32px 0", textAlign: "center" }}>
                <Button
                  href={content.buttonLink}
                  style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "12px 32px", fontSize: "16px", fontWeight: "600", textDecoration: "none", borderRadius: "8px", display: "inline-block" }}
                >
                  {content.buttonText}
                </Button>
              </Section>
            )}

          {props.type === "password-reset-code" && (
            <Text style={{ marginTop: "24px", fontSize: "14px", color: "#4b5563" }}>
              If you didn't request this code, you can safely ignore this
              email. Your password will remain unchanged.
            </Text>
          )}

          <Section style={{ marginTop: "32px", borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
            <Text style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", margin: "8px 0" }}>
              © {new Date().getFullYear()} {company}. All rights reserved.
            </Text>
            <Text style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", margin: "8px 0" }}>
              <Link
                href="https://taskoria.com/privacy-policy"
                style={{ color: "#2563eb", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>{" "}
              |{" "}
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
};

export default AppEmail;