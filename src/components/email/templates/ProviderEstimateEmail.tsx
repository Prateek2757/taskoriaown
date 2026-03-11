import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { ProviderEstimateEmailProps } from "../type";

export const ProviderEstimateEmail = ({
  company = "Taskoria",
  taskTitle,
  price,
  unit,
  messageFromProvider,
  professional_name,
  professional_company_name,
  professional_phone,
}: ProviderEstimateEmailProps) => {
  const showCompany =
    professional_company_name &&
    professional_company_name.trim().toLowerCase() !==
      professional_name?.trim().toLowerCase();

  return (
    <Html>
      <Head>
        <title>You received a new estimate</title>
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
            borderRadius: "10px",
            padding: "32px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <Section style={{ textAlign: "center" }}>
            <Img
              src="https://www.taskoria.com/taskorialogonew.png"
              alt={`${company} Logo`}
              width="48"
              height="48"
              style={{ margin: "0 auto 24px" }}
            />
          </Section>

          <Heading
            style={{
              marginBottom: "12px",
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            💰 You received a new estimate
          </Heading>

          <Text
            style={{
              marginBottom: "24px",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
            }}
          >
            A service professional has submitted a quote for your task:
            <b> "{taskTitle ?? "your task"}"</b>.
          </Text>

          <Section
            style={{
              margin: "24px 0",
              backgroundColor: "#f9fafb",
              padding: "22px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: "13px",
                color: "#6b7280",
                margin: "0 0 6px 0",
              }}
            >
              ESTIMATED PRICE
            </Text>

            <Text
              style={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#2563eb",
                margin: "6px 0",
              }}
            >
              A$ {price} {unit}
            </Text>

            {messageFromProvider && (
              <Text
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  marginTop: "14px",
                  lineHeight: "1.5",
                }}
              >
                <b>Additional Details:</b> {messageFromProvider}
              </Text>
            )}
          </Section>

          {(professional_name || showCompany || professional_phone) && (
            <Section
              style={{
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "12px",
                }}
              >
                Service Professional
              </Text>

              {professional_name && (
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    margin: "4px 0",
                  }}
                >
                  <b>Name:</b> {professional_name}
                </Text>
              )}

              {showCompany && (
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    margin: "4px 0",
                  }}
                >
                  <b>Company:</b> {professional_company_name}
                </Text>
              )}

              {professional_phone && (
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    margin: "4px 0",
                  }}
                >
                  <b>Phone:</b>{" "}
                  <Link
                    href={`tel:${professional_phone}`}
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    {professional_phone}
                  </Link>
                </Text>
              )}
            </Section>
          )}

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
