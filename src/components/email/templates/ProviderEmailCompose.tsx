
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
import type { CSSProperties } from "react";

import {
  body,
  bodyCol,
  ctaButton,
  divider,
  eyebrow,
  footerCol,
  footerLink,
  footerSection,
  footerText,
  heroCol,
  heroHeading,
  heroSection,
  heroSub,
  intro,
  outerWrapperCol,
  sigName,
  signOff,
  sigRole,
} from "../helpers/shared-style";

interface ProviderEmailComposeProps {
  messageFromProvider?: string;
  company?: string;
  username?: string;
  replyUrl?: string;
}

export const ProviderEmailCompose = ({
  company = "Taskoria",
  username,
  messageFromProvider = "",
  replyUrl = "https://www.taskoria.com/messages/null",
}: ProviderEmailComposeProps) => {
  const isHtml =
    messageFromProvider.trimStart().startsWith("<!DOCTYPE") ||
    messageFromProvider.trimStart().startsWith("<html")     ||
    messageFromProvider.trimStart().startsWith("<p")        ||
    messageFromProvider.trimStart().startsWith("<div");

  return (
    <Html lang="en">
      <Head>
        <title>New message from a professional — {company}</title>
      </Head>

      <Preview>
        A professional sent you a message on {company} — tap to reply.
      </Preview>
      <Body style={body}>
        <Section style={{ backgroundColor: "#eef0f3" }}>
          <Row>
            <Column style={outerWrapperCol}>

              <Container style={{
                maxWidth: "560px",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                borderTop: "1px solid #d4d8de",
                borderRight: "1px solid #d4d8de",
                borderBottom: "1px solid #d4d8de",
                borderLeft: "1px solid #d4d8de",
              }}>

            
                <Section style={heroSection}>
                  <Row>
                    <Column style={heroCol}>
                      <Img
                        src="https://www.taskoria.com/images/taskoria_logo.svg"
                        alt={`${company} logo`}
                        width="44"
                        height="44"
                        style={{ display: "block", margin: "0 auto 18px" }}
                      />
                      <Text style={eyebrow}>New message</Text>
                      <Heading as="h1" style={heroHeading}>
                        You received a message from a professional.
                      </Heading>
                      <Text style={heroSub}>
                        They&apos;re interested in your project on {company}.
                      </Text>
                    </Column>
                  </Row>
                </Section>

            
                <Section>
                  <Row>
                    <Column style={bodyCol}>

                      <Text style={intro}>
                        Hi{" "}
                        <strong style={{ color: "#1a2236" }}>
                          {username ?? "there"}
                        </strong>
                        ! A professional has sent you a message regarding your
                        project. Log in to reply and keep the conversation going.
                      </Text>
                      <Row>
                        <Column style={msgWrap}>

                          <Text style={msgTag}>💬 Message</Text>

                          {isHtml ? (
                            <div
                              style={msgTextStyle}
                              dangerouslySetInnerHTML={{ __html: messageFromProvider }}
                            />
                          ) : (
                            <Text style={msgTextStyle}>
                              {messageFromProvider.split("\n").map((line, i) => (
                                <span key={i}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                            </Text>
                          )}

                        </Column>
                      </Row>

                  
                      <Text style={spacer}>&nbsp;</Text>

                      <Row>
                        <Column style={ctaCol}>
                          <Button href={replyUrl} style={ctaButton}>
                            Reply to this message →
                          </Button>
                          <Text style={ctaSub}>
                            Log in to view the full conversation
                          </Text>
                        </Column>
                      </Row>

                      <Hr style={divider} />

                      <Text style={signOff}>
                        If you have any questions, just reply to this email —
                        we&apos;re always happy to help.
                      </Text>
                      <Text style={signOff}>Warm regards,</Text>
                      <Text style={sigName}>The {company} Team</Text>
                      <Text style={sigRole}>contact@taskoria.com</Text>

                    </Column>
                  </Row>
                </Section>

                <Section style={footerSection}>
                  <Row>
                    <Column style={footerCol}>
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
                        {" · "}
                        <Link
                          href="https://www.taskoria.com/unsubscribe"
                          style={footerLink}
                        >
                          Unsubscribe
                        </Link>
                      </Text>
                    </Column>
                  </Row>
                </Section>

              </Container>
            </Column>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

const PRIMARY        = "#2563EB";
const PRIMARY_LIGHT  = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";

const msgWrap: CSSProperties = {
  backgroundColor: PRIMARY_LIGHT,
  borderLeft: `4px solid ${PRIMARY}`,
  borderTop: `1px solid ${PRIMARY_BORDER}`,
  borderRight: `1px solid ${PRIMARY_BORDER}`,
  borderBottom: `1px solid ${PRIMARY_BORDER}`,
  borderRadius: "0 8px 8px 0",
  padding: "20px 22px",
};

const msgTag: CSSProperties = {
  display: "inline-block",
  backgroundColor: PRIMARY,
  color: "#ffffff",
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1px",
  textTransform: "uppercase",
  padding: "3px 10px",
  borderRadius: "99px",
  margin: "0 0 14px",
};

const msgTextStyle: CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#1a2236",
  margin: 0,
};

const spacer: CSSProperties = {
  margin: 0,
  padding: 0,
  lineHeight: "24px",
  fontSize: "1px",
  color: "transparent",
};

const ctaCol: CSSProperties = {
  textAlign: "center",
  paddingTop: "4px",
};

const ctaSub: CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0",
};