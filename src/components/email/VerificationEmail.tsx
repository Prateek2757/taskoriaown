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

export type EmailType = "welcome" | "task-posted" | "verification";

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
        heading: `Welcome to ${company}, ${username}!`,
        message:
          "We’re excited to have you onboard. Explore services and get things done faster with trusted local professionals.",
        buttonText: "Get Started",
        buttonLink: "https://taskoria.com",
      };

    case "task-posted":
      return {
        heading: "Your task has been posted 🎉",
        message: `Hi ${username}, your task "${taskTitle}" ${
          taskLocation ? `in ${taskLocation}` : ""
        } has been successfully posted. Professionals will start sending offers soon.`,
        buttonText: "View Task",
        buttonLink: "https://taskoria.com/provider/dashboard",
      };

    case "verification":
      return {
        heading: "Verify your email address",
        message:
          "Use the verification code below to complete your registration.",
        buttonText: verifyCode || "Verify",
        buttonLink: "#",
      };

    default:
      return {
        heading: "Taskoria Notification",
        message: "",
      };
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
          <Container className="max-w-[480px] bg-white p-6 rounded-xl shadow-md">
            <Section className="text-center mb-6">
              <Img
                src="https://taskoria.com/taskoria-logo.png"
                width="40"
                height="40"
                alt={`${company} logo`}
                className="mx-auto"
              />
            </Section>

            <Heading className="text-2xl font-bold text-gray-900 text-center">
              {content.heading}
            </Heading>

            {/* <Text className="text-gray-700 mt-4">Hi {props.username},</Text> */}

            <Text className="text-gray-700 leading-relaxed">
              {content.message}
            </Text>

            <Section className="text-center mt-6">
              <Button
                href={content.buttonLink}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold no-underline"
              >
                {content.buttonText}
              </Button>
            </Section>

            <Text className="text-gray-500 text-sm mt-6">
              Need help? Contact our support team anytime.
            </Text>

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