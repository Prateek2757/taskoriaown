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
} from "@react-email/components";

export type EmailType =
  | "welcome"
  | "task-posted"
  | "task-posted-no-budget"
  | "provider-new-task"
  | "verification";

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
          "We’re excited to have you onboard. Find trusted professionals and get tasks faster.",
        buttonText: "Get Started",
        buttonLink: "https://taskoria.com",
      };

    case "task-posted":
      return {
        heading: "Your task has been posted 🎉",
        message: `Hi ${username ?? "there"}, your task "${
          taskTitle ?? "Untitled Task"
        }" ${taskLocation ? `in ${taskLocation}` : ""} has been successfully posted.`,
        buttonText: "View Task",
        buttonLink: "https://taskoria.com/customer/dashboard",
      };

    case "provider-new-task":
      return {
        heading: "🚨 New task available!",
        message: `Hi ${username ?? "there"},

A new task "${
          taskTitle ?? "Untitled Task"
        }" ${taskLocation ? `in ${taskLocation}` : ""} matches your service category.

Submit your quotation early to increase your chances.`,
        buttonText: "View Task",
        buttonLink: "https://taskoria.com/provider/leads",
      };

    case "task-posted-no-budget":
      return {
        heading: "⚠️ Task Posted Without Budget",
        message: `A task has been posted without specifying a budget.

Task: ${taskTitle ?? "Untitled Task"}
${taskLocation ? `Location: ${taskLocation}` : ""}

Please review it.`,
        buttonText: "Review Task",
        buttonLink: "https://taskoria.com/adminbudgetmanager",
      };

    case "verification":
      return {
        heading: "Verify your email address",
        message: "Use the code below to verify your email address.",
        buttonText: verifyCode || "Verify",
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
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 p-4 font-sans">
          <Container className="max-w-[500px] bg-white p-6 rounded-xl shadow">
            <Section className="text-center mb-6">
              <Img
                src="https://taskoria.com/taskoria-logo.png"
                width="48"
                height="48"
                alt="Taskoria Logo"
                className="mx-auto"
              />
            </Section>

            <Heading className="text-xl font-bold text-gray-900 text-center">
              {content.heading}
            </Heading>

            <Text className="text-gray-700 mt-4 whitespace-pre-line">
              {content.message}
            </Text>

            {content.buttonText && (
              <Section className="text-center mt-6">
                <Button
                  href={content.buttonLink}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  {content.buttonText}
                </Button>
              </Section>
            )}

            <Text className="text-gray-400 text-xs text-center mt-8">
              © {new Date().getFullYear()} {company}. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppEmail;