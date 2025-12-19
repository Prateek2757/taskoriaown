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

interface WelcomeEmailProps {
  username?: string;
  company?: string;
}

const WelcomeEmail = ({
  username ,
  company = "Taskoria",
}: WelcomeEmailProps) => {
  const previewText = `Welcome to ${company}, ${username}!`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 m-auto font-sans">
          <Container className="mb-10 mx-auto p-6 max-w-[480px] bg-white rounded-xl shadow-lg">
            <Section className="mt-6 text-center">
              <Img
                src="https://taskoria.com/taskoria-logo.png"
                width="60"
                height="60"
                alt={`${company} Logo`}
                className="mx-auto"
              />
            </Section>

            <Heading className="text-3xl text-gray-900 font-bold text-center mt-6 mb-4">
              Welcome to <span className="text-blue-600">{company}</span>, {username}!
            </Heading>

            <Text className="text-gray-700 text-base leading-relaxed mt-4 mb-4">
              Hi {username},
            </Text>
            <Text className="text-gray-700 text-base leading-relaxed mb-6">
              We are thrilled to have you join <strong>{company}</strong>! 
              Our team is here to help you succeed and make the most of your experience. 
              Explore our platform, get familiar with the features, and don’t hesitate to reach out if you need any assistance.
            </Text>

            <Section className="text-center mt-6 mb-6">
              <Button
                className="py-3 px-6 bg-blue-600 text-white text-base font-semibold rounded-lg no-underline"
                href={`https://taskoria.com`}
              >
                Get Started
              </Button>
            </Section>

            <Text className="text-gray-700 text-base leading-relaxed mt-6">
              Cheers,
              <br />
              The <strong>{company}</strong> Team
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

export default WelcomeEmail;