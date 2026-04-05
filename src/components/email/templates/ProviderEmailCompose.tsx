import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Heading,
  Link,
  Img,
} from "@react-email/components";

interface ProviderEmailComposeProps {
  messageFromProvider?: string;
  company?: string;
}

export const ProviderEmailCompose = ({
  company = "Taskoria",
  messageFromProvider = "",
}: ProviderEmailComposeProps) => {
  const isHtml =
    messageFromProvider.trimStart().startsWith("<!DOCTYPE") ||
    messageFromProvider.trimStart().startsWith("<html") ||
    messageFromProvider.trimStart().startsWith("<p") ||
    messageFromProvider.trimStart().startsWith("<div");

  const formattedMessage = isHtml
    ? null
    : messageFromProvider
        .split("\n")
        .map((line, i) => <span key={i}>{line}</span>);

  return (
    <Html>
      <Head />
      <Preview>New message from a provider on {company}</Preview>

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
            borderRadius: "10px",
            padding: "32px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <Section style={{ textAlign: "center", paddingBottom: "8px" }}>
            <Img
              src="https://www.taskoria.com/images/taskoria_logo.svg"
              alt={`${company} Logo`}
              width="48"
              height="48"
              style={{ display: "block", margin: "0 auto" }}
            />
          </Section>

          <Section style={{ textAlign: "center", paddingBottom: "24px" }}>
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
                lineHeight: "1.3",
                margin: 0,
              }}
            >
              {company}
            </Text>
          </Section>

          <Section style={{ paddingBottom: "20px" }}>
            <Heading
              style={{
                margin: "10 20px 8px 0",
                padding: " 0 15px",
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              You received a new message
            </Heading>
            <Text
              style={{
                margin: "0 0 20px 0",
                fontSize: "15px",
                padding: " 0 15px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            >
              A provider has sent you a message regarding your project.
            </Text>
          </Section>

          <Section
            style={{
              margin: "24px 0",
              backgroundColor: "#f9fafb",
              padding: "22px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            {isHtml ? (
              <div
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#111827",
                  padding: "auto",
                  margin: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: messageFromProvider }}
              />
            ) : (
              <Text
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#111827",
                }}
              >
                {formattedMessage}
              </Text>
            )}
          </Section>

          {/* Footer */}
          <Section
            style={{
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#6b7280",
                lineHeight: "1.4",
                margin: "8px 0",
              }}
            >
              © {new Date().getFullYear()} {company}. All rights reserved.
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#6b7280",
                lineHeight: "1.4",
                margin: "4px 0",
              }}
            >
              <Link
                href="https://www.taskoria.com/privacy-policy"
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
