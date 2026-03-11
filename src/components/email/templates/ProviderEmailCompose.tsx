import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Heading,
  Button,
  Link,
} from "@react-email/components";

interface ProviderEmailComposeProps {
  messageFromProvider?: string;
  company?:string;
}

export const ProviderEmailCompose = ({
  company = "Taskoria",

  messageFromProvider,
}: ProviderEmailComposeProps) => {
  const formattedMessage = messageFromProvider
    ?.split("\n")
    .map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));

  return (
    <Html>
      <Head />
      <Preview>New message from a provider on Taskoria</Preview>

      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Text style={brand}>Taskoria</Text>
          </Section>

          {/* Title */}
          <Section>
            <Heading style={title}>You received a new message</Heading>
            <Text style={subtitle}>
              A provider has sent you a message regarding your project.
            </Text>
          </Section>

          {/* Message Box */}
          <Section style={messageBox}>
            <Text style={message}>{formattedMessage}</Text>
          </Section>

          {/* <Section style={buttonContainer}>
            <Button
              style={button}
              href="https://taskoria.com/dashboard"
            >
              View Message
            </Button>
          </Section> */}

<Section
            style={{
              marginTop: "36px",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#6b7280",
                margin: "6px 0",
              }}
            >
              © {new Date().getFullYear()} {company}. All rights reserved.
            </Text>

            <Text
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#6b7280",
                margin: "6px 0",
              }}
            >
              <Link
                href="https://www.taskoria.com/privacy-policy"
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                }}
              >
                Privacy Policy
              </Link>
              {" | "}
              <Link
                href="https://taskoria.com/terms-and-conditions"
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                }}
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

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial",
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "40px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
};

const header = {
  marginBottom: "20px",
};

const brand = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#111827",
};

const title = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "10px",
};

const subtitle = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "20px",
};

const messageBox = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
};

const message = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#111827",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "30px",
};

const button = {
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "14px",
};

const footer = {
  marginTop: "40px",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#6b7280",
};