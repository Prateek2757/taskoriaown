import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Tailwind,
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
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-8 max-w-xl rounded-lg bg-white p-8 shadow-lg">
            <Section className="text-center">
              <Img
                src="https://taskoria.com/taskorialogonew.png"
                alt={`${company} Logo`}
                width="120"
                height="40"
                className="mx-auto mb-6"
              />
            </Section>

            <Heading className="mb-4 text-2xl font-bold text-gray-800">
              {content.heading}
            </Heading>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              {content.message}
            </Text>

            {(props.type === "verification" ||
              props.type === "password-reset-code") &&
              props.verifyCode && (
                <Section className="my-8 rounded-lg bg-gray-50 p-6 text-center">
                  <Text className="mb-2 text-sm text-gray-600">
                    Your verification code:
                  </Text>
                  <Text className="text-3xl font-bold tracking-wider text-blue-600">
                    {props.verifyCode}
                  </Text>
                </Section>
              )}

            {content.buttonText &&
              content.buttonLink !== "#" &&
              props.type !== "verification" &&
              props.type !== "password-reset-code" && (
                <Section className="my-8 text-center">
                  <Button
                    href={content.buttonLink}
                    className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white no-underline hover:bg-blue-700"
                  >
                    {content.buttonText}
                  </Button>
                </Section>
              )}

            {props.type === "password-reset-code" && (
              <Text className="mt-6 text-sm text-gray-600">
                If you didn't request this code, you can safely ignore this
                email. Your password will remain unchanged.
              </Text>
            )}

            <Section className="mt-8 border-t border-gray-200 pt-6">
              <Text className="text-center text-xs text-gray-500">
                © {new Date().getFullYear()} {company}. All rights reserved.
              </Text>
              <Text className="text-center text-xs text-gray-500">
                <Link
                  href="https://taskoria.com/privacy"
                  className="text-blue-600 underline"
                >
                  Privacy Policy
                </Link>{" "}
                |{" "}
                <Link
                  href="https://taskoria.com/terms"
                  className="text-blue-600 underline"
                >
                  Terms of Service
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppEmail;